<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as d3 from 'd3'

const canvasRef = ref(null)
const isMobile = ref(false)
const filtroActivo = ref(0)

const nodosData = [
  { id: 'Vue',        group: 1, label: 'Vue 3',       icono: '/asset/icons/vue.svg' },
  { id: 'Node',       group: 2, label: 'Node.js',     icono: '/asset/icons/node.svg' },
  { id: 'PHP',        group: 2, label: 'PHP',         icono: '/asset/icons/php.svg' },
  { id: 'Laravel',    group: 2, label: 'Laravel',     icono: '/asset/icons/laravel.svg' },
  { id: 'MySQL',      group: 2, label: 'MySQL',       icono: '/asset/icons/mysql.svg' },
  { id: 'PostgreSQL', group: 2, label: 'PostgreSQL',  icono: '/asset/icons/postgresql.svg' },
  { id: 'MongoDB',    group: 2, label: 'MongoDB',     icono: '/asset/icons/mongodb.svg' },
  { id: 'Flutter',    group: 3, label: 'Flutter',     icono: '/asset/icons/flutter.svg' },
  { id: 'Git',        group: 3, label: 'Git',         icono: '/asset/icons/git.svg' },
  { id: 'Postman',    group: 3, label: 'Postman',     icono: '/asset/icons/postman.svg' },
  { id: 'Figma',      group: 1, label: 'Figma',       icono: '/asset/icons/figma.svg' },
]

const linksData = [
  { source: 'Vue',     target: 'Node' },
  { source: 'Node',    target: 'MongoDB' },
  { source: 'Node',    target: 'PostgreSQL' },
  { source: 'PHP',     target: 'MySQL' },
  { source: 'Laravel', target: 'PHP' },
  { source: 'Laravel', target: 'Vue' },
  { source: 'Flutter', target: 'Node' },
  { source: 'Git',     target: 'Node' },
  { source: 'Postman', target: 'Node' },
  { source: 'Figma',   target: 'Vue' },
]

const habilidadesBlandas = [
  { etiqueta: 'Resolución de Problemas' },
  { etiqueta: 'Pensamiento Analítico' },
  { etiqueta: 'Adaptabilidad' },
  { etiqueta: 'Autodidacta' },
  { etiqueta: 'Trabajo en Equipo' },
  { etiqueta: 'Gestión del Tiempo' },
  { etiqueta: 'Atención al Detalle' },
  { etiqueta: 'Liderazgo Técnico' },
  { etiqueta: 'Comunicación Efectiva' },
  { etiqueta: 'Innovación Continua' },
]

const filtros = [
  { id: 0, etiqueta: '[ 00. TODO ]' },
  { id: 1, etiqueta: '[ 01. FRONTEND ]' },
  { id: 2, etiqueta: '[ 02. BACKEND & DB ]' },
  { id: 3, etiqueta: '[ 03. MOBILE & TOOLS ]' },
]

let simulation = null
let width = 0
let height = 0
let nodes = []
let links = []
let ctx = null
const imageCache = {}
let resizeObserver = null // escuchar cambios de tamaño
let intersectionObserver = null // observador de visibilidad para liberar CPU

function precargarIconos() {
  nodosData.forEach(d => {
    const img = new Image()
    img.src = d.icono
    img.onload = () => { imageCache[d.id] = img }
  })
}

function initCanvas() {
  if (!canvasRef.value) return
  // guardamos las dimensionamientos logicos y fisicas en variables para evitar lecturas repetidas
  const container = canvasRef.value.parentElement
  if (!container) return 

  width = container.clientWidth
  height = container.clientHeight || 480 // tamano minimo contenedor para evitar colapsos
  canvasRef.value.width = width
  canvasRef.value.height = height
  ctx = canvasRef.value.getContext('2d')

  nodes = nodosData.map(d => Object.create(d))
  links = linksData.map(d => Object.create(d))

  // pa no tener multiples simulaciones cooriendo en caso de remount
  if (simulation) simulation.stop()

  simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-120))  //repulsion entre nodos para que no se amontonen
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('collide', d3.forceCollide().radius(45).iterations(2))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .alphaTarget(0.02)  // efecto flotabilidad inicial
    .on('tick', dibujar)

  d3.select(canvasRef.value)
    .call(d3.drag()
      .container(canvasRef.value)
      .subject(objetoDrag)
      .on('start', iniciarDrag)
      .on('drag', arrastrar)
      .on('end', soltarDrag))  
}

function dibujar() {
  if (!ctx || isMobile.value) return
  ctx.clearRect(0, 0, width, height)

  // dibujar conexiones (links)
  links.forEach(d => {
    const activo = filtroActivo.value === 0 || d.source.group === filtroActivo.value || d.target.group === filtroActivo.value
    ctx.beginPath()
    ctx.moveTo(d.source.x, d.source.y)
    ctx.lineTo(d.target.x, d.target.y)
    ctx.strokeStyle = activo ? 'rgba(37,99,235,0.3)' : 'rgba(100,116,139,0.05)' // ajustado el contraste
    ctx.lineWidth = activo ? 1.5 : 1
    ctx.stroke()
  })

  // dibujar nodos (circulos + iconos + etiquetas)
  nodes.forEach(d => {
    const activo = filtroActivo.value === 0 || d.group === filtroActivo.value
    const radio = 36
    const opacidad = activo ? 1 : 0.15

    ctx.save()
    ctx.globalAlpha = opacidad
    //circulo base del nodo
    ctx.beginPath()
    ctx.arc(d.x, d.y, radio, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(22, 27, 42, 0.95)'
    ctx.fill()
    ctx.strokeStyle = activo ? 'rgba(37,99,235,0.5)' : 'rgba(100,116,139,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
    // icono del nodo SVG
    const img = imageCache[d.id]
    const iconSize = 28  // tamaño del icono dentro del nodo

    if (img) {
      ctx.drawImage(img, d.x - iconSize / 2, d.y - iconSize / 2 - 6, iconSize, iconSize)
    }

    // texto etiqueta del nodo
    ctx.fillStyle = activo ? '#94A3B8' : '#3D4663'  // Blanco Titanio / Gris Acero
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(d.label, d.x, d.y + 18)

    ctx.restore()
  })
}

function objetoDrag(event) {
  const radio = 40
  let sujeto = null
  let distanciaMin = Infinity
  for (const nodo of nodes) {
    const dx = event.x - nodo.x
    const dy = event.y - nodo.y
    const d2 = dx * dx + dy * dy
    if (d2 < radio * radio && d2 < distanciaMin) {
      sujeto = nodo
      distanciaMin = d2
    }
  }
  return sujeto
}

function iniciarDrag(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart()
  event.subject.fx = event.subject.x
  event.subject.fy = event.subject.y
}

function arrastrar(event) {
  event.subject.fx = event.x
  event.subject.fy = event.y
}

function soltarDrag(event) {
  if (!event.active) simulation.alphaTarget(0.02)
  event.subject.fx = null
  event.subject.fy = null
}

function aplicarFiltro(grupo) {
  filtroActivo.value = grupo
  if (isMobile.value || !simulation) return

  // fisica de filtrado suavemente
  simulation.force('center', null) // quitamos el centro estricto

  if (grupo === 0) {
    // Si seleccionan TODO, volvemos a centrar todos los nodos
    simulation.force('x', d3.forceX(width / 2).strength(0.05))
    simulation.force('y', d3.forceY(height / 2).strength(0.05))
  } else {
    // Si seleccionan un grupo, agrupamos los activos al centro y empujamos suavemente el resto a la periferia
    simulation.force('x', d3.forceX()
      .strength(d => d.group === grupo ? 0.1 : 0.02)
      .x(d => d.group === grupo ? width / 2 : (d.x < width / 2 ? 80 : width - 80))
    )
    simulation.force('y', d3.forceY()
      .strength(d => d.group === grupo ? 0.1 : 0.02)
      .y(d => d.group === grupo ? height / 2 : (d.y < height / 2 ? 80 : height - 80))
    )
  }
  
  // Le damos un "empujón" de energía para que se reacomoden fluidamente
  simulation.alpha(0.6).restart()
}

const mobileQuery = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)')
  : null

function handleMediaChange(e) { 
  isMobile.value = e.matches 
  if (!e.matches) {
     nextTick(() => { initCanvas() }) // Si cambia de móvil a escritorio, iniciamos canvas
  } else {
    if (simulation) simulation.stop() // Si cambia de escritorio a móvil, ahorramos CPU
  }
}

onMounted(() => {
  if (mobileQuery) {
    isMobile.value = mobileQuery.matches
    mobileQuery.addEventListener('change', handleMediaChange)
  }

  precargarIconos()

  if (!isMobile.value) {
    initCanvas()

    // manejo de rendimiento con desvinculacion geometrica
    if (canvasRef.value && canvasRef.value.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        // Debounce simple para no saturar el resize
        requestAnimationFrame(() => {
           if (!isMobile.value) initCanvas()
        })
      })
      resizeObserver.observe(canvasRef.value.parentElement)
    }

    //intersection observer, detiene el d3 cuando sale de la pantalla para ahorrar CPU
    if (canvasRef.value) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (simulation) {
            if (entry.isIntersecting) {
              // devuelve la energia a los nodos al entrar
              simulation.alphaTarget(0.02).restart()
            } else {
              // congela por completo los calculos matematicos al salir de pantalla para ahorrar CPU
              simulation.stop()
            }
          }
        })
      }, {threshold: 0.1}) //se activa cuando almenos el 10% del canvas es visible
      intersectionObserver.observe(canvasRef.value)
    }
  }
})

onUnmounted(() => {
  if (simulation) simulation.stop()
  if (mobileQuery) mobileQuery.removeEventListener('change', handleMediaChange)
  if (resizeObserver) resizeObserver.disconnect()
  if (intersectionObserver) intersectionObserver.disconnect()
})
</script>

<template>
  <section id="habilidades"
    class="relative w-full bg-dark overflow-hidden"
    aria-label="Sección — Habilidades Técnicas"
  >
    <div class="absolute inset-0 bg-grid pointer-events-none opacity-20" />

    <div class="section-container relative z-10 flex flex-col" style="min-height: 100vh;">

      <!-- Encabezado -->
      <div class="mb-8">
        <span class="status-badge mb-3">Stack Tecnológico</span>
        <h2 class="text-3xl sm:text-4xl font-bold mt-3" style="color: var(--text-bright);">Habilidades</h2>
      </div>

      <!-- Filtros de Categoria -->
      <div class="flex flex-wrap gap-3 mb-6">
        <button
          v-for="f in filtros"
          :key="f.id"
          @click="aplicarFiltro(f.id)"
          class="px-4 py-2 text-xs font-mono tracking-wide border rounded transition-colors"
          :style="{
            background: filtroActivo === f.id ? 'var(--color-primary-dim)' : 'transparent',
            borderColor: filtroActivo === f.id ? 'var(--color-primary)' : 'var(--color-dark-400)',
            color: filtroActivo === f.id ? 'var(--color-primary)' : 'var(--text-muted)',
          }"
        >
          {{ f.etiqueta }}
        </button>
      </div>

      <!-- Canvas D3 (Escritorio) -->
      <div v-if="!isMobile" class="flex-grow relative w-full" style="min-height: 480px;">
        <canvas
          ref="canvasRef"
          class="w-full h-8 cursor-grab active:cursor-grabbing"
          style="min-height: 480px;"
        ></canvas>
      </div>

      <!-- Cuadricula Estatica Movil -->
      <div v-if="isMobile" class="grid grid-cols-3 gap-3 pt-4">
        <div
          v-for="nodo in nodosData"
          :key="nodo.id"
          class="flex flex-col items-center justify-center gap-2 p-3 border rounded-lg transition-opacity duration-200"
          :style="{
            opacity: filtroActivo === 0 || filtroActivo === nodo.group ? '1' : '0.18',
            borderColor: filtroActivo === 0 || filtroActivo === nodo.group ? 'var(--color-primary)' : 'var(--color-dark-400)',
            background: filtroActivo === 0 || filtroActivo === nodo.group ? 'var(--color-primary-dim)' : 'var(--color-dark-700)',
          }"
        >
          <img :src="nodo.icono" :alt="nodo.label" class="w-8 h-8 object-contain" />
          <span class="text-xs font-mono text-center" style="color: var(--text-base);">{{ nodo.label }}</span>
        </div>
      </div>

      <!-- Habilidades Blandas — Matriz Estatica -->
      <div class="mt-10 pt-6 border-t border-dark-400">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <div class="text-xs font-mono tracking-widest uppercase" style="color: var(--text-muted);">
            Habilidades Blandas
          </div>
        </div>

        <div class="relative w-full overflow-hidden fade-edges py-2">
          <div class="flex w-max animate-ticker items-center">
            <template v-for="n in 2" :key="'loop-'+n">
              <div
                v-for="(habilidad, i) in habilidadesBlandas"
                :key="`${n}-${i}`"
                class="flex items-center"
              >
                <span class="text-xs font-mono tracking-wider uppercase whitespace-nowrap px-6" style="color: var(--text-base);">
                  {{ habilidad.etiqueta }}
                </span>
                <span style="color: var(--color-dark-400);">/</span>
              </div>
            </template>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
<style scoped>
/* Animación infinita suave para el Data Stream */
.animate-ticker {
  animation: ticker 40s linear infinite;
}

/* Pausar la animación si el usuario pasa el mouse por encima (opcional pero elegante) */
.animate-ticker:hover {
  animation-play-state: paused;
}

@keyframes ticker {
  0% { transform: translateX(0); }
  /* Se mueve exactamente el 50% porque duplicamos la lista */
  100% { transform: translateX(-50%); } 
}

/* Efecto de niebla en los bordes para que los textos no se corten feo */
.fade-edges {
  mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
}
</style>