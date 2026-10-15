<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const canvasRef = ref(null)
const filtroActivo = ref(0)

const nodosData = [
  { 
    id: 'Vue', group: 1, label: 'Vue 3', icono: '/asset/icons/vue.svg',
    tipo: 'Frontend Core',
    descripcion: 'Desarrollo de interfaces reactivas con Composition API, Pinia y Single Page Applications.',
    proyectos: ['Portafolio Tapia Tech', 'Reservas Kordya']
  },
  { 
    id: 'Flutter', group: 3, label: 'Flutter', icono: '/asset/icons/flutter.svg',
    tipo: 'Mobile Architecture',
    descripcion: 'Clean Architecture, manejo de estado con Provider, persistencia offline-first con Hive y SQLite.',
    proyectos: ['CosechApp', 'Finance Local', 'Wire Flow VE']
  },
  { 
    id: 'Node', group: 2, label: 'Node.js', icono: '/asset/icons/node.svg',
    tipo: 'Backend & APIs',
    descripcion: 'Servicios RESTful, WebSockets asíncronos y orquestación de pipelines RAG locales.',
    proyectos: ['Enterprise RAG Core', 'RetoChat']
  },
  { 
    id: 'Laravel', group: 2, label: 'Laravel', icono: '/asset/icons/laravel.svg',
    tipo: 'Backend Enterprise',
    descripcion: 'Patrón MVC modular, middleware de autorización RBAC y generación de reportes transaccionales.',
    proyectos: ['Sistema Inventario ULAT']
  },
  { 
    id: 'PostgreSQL', group: 2, label: 'PostgreSQL', icono: '/asset/icons/postgresql.svg',
    tipo: 'Database & Vector Search',
    descripcion: 'Almacenamiento relacional normalizado y búsqueda semántica de alta velocidad con pgvector.',
    proyectos: ['Enterprise RAG Core', 'RetoChat']
  },
  { 
    id: 'MySQL', group: 2, label: 'MySQL', icono: '/asset/icons/mysql.svg',
    tipo: 'Relational Database',
    descripcion: 'Modelado relacional con llaves foráneas e índices compuestos para auditoría de activos.',
    proyectos: ['Sistema Inventario ULAT']
  },
  { 
    id: 'MongoDB', group: 2, label: 'MongoDB', icono: '/asset/icons/mongodb.svg',
    tipo: 'NoSQL Document Store',
    descripcion: 'Almacenamiento de documentos JSON flexible para esquemas no relacionales y telemetría.',
    proyectos: ['Supermarket Backend API']
  },
  { 
    id: 'PHP', group: 2, label: 'PHP', icono: '/asset/icons/php.svg',
    tipo: 'Backend Language',
    descripcion: 'Desarrollo backend robusto con tipado estricto y controladores orientados a objetos.',
    proyectos: ['Sistema Inventario ULAT']
  },
  { 
    id: 'Git', group: 3, label: 'Git & GitHub', icono: '/asset/icons/git.svg',
    tipo: 'Version Control & CI/CD',
    descripcion: 'Flujos GitFlow, control de versiones atómico y despliegue de releases en tiendas y web.',
    proyectos: ['Todos los repositorios']
  },
  { 
    id: 'Postman', group: 3, label: 'Postman', icono: '/asset/icons/postman.svg',
    tipo: 'API Testing & Contracts',
    descripcion: 'Documentación de colecciones de endpoints, pruebas de carga y validación de contratos JSON.',
    proyectos: ['APIs RESTful de backend']
  },
  { 
    id: 'Figma', group: 1, label: 'Figma', icono: '/asset/icons/figma.svg',
    tipo: 'UI/UX Prototyping',
    descripcion: 'Diseño de wireframes de alta fidelidad, design systems y preparación de assets SVG.',
    proyectos: ['Diseño de UI Portafolio', 'Finance Local']
  }
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
  { source: 'Figma',   target: 'Vue' },
]

const filtros = [
  { id: 0, etiqueta: 'Todos' },
  { id: 1, etiqueta: 'Frontend' },
  { id: 2, etiqueta: 'Backend & DB' },
  { id: 3, etiqueta: 'Mobile & Tools' },
]

const nodoSeleccionado = ref(nodosData.find(n => n.id === 'Flutter') || nodosData[0])

const nodosFiltrados = computed(() => {
  if (filtroActivo.value === 0) return nodosData
  return nodosData.filter(n => n.group === filtroActivo.value)
})

let simulation = null
let width = 0
let height = 0
let nodes = []
let links = []
let ctx = null
const imageCache = {}
let resizeObserver = null
let intersectionObserver = null
let themeObserver = null

function precargarIconos() {
  nodosData.forEach(d => {
    const img = new Image()
    img.src = d.icono
    img.onload = () => { imageCache[d.id] = img }
  })
}

function initCanvas() {
  if (!canvasRef.value) return
  const container = canvasRef.value.parentElement
  if (!container) return 
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    if (simulation) simulation.stop()
    return
  }

  width = container.clientWidth
  height = 440
  canvasRef.value.width = width
  canvasRef.value.height = height
  ctx = canvasRef.value.getContext('2d')

  nodes = nodosData.map(d => Object.create(d))
  links = linksData.map(d => Object.create(d))

  if (simulation) simulation.stop()

  simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-190))
    .force('link', d3.forceLink(links).id(d => d.id).distance(110))
    .force('collide', d3.forceCollide().radius(46).iterations(2))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .alphaTarget(0.02)
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
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light')

  links.forEach(d => {
    const activo = filtroActivo.value === 0 || d.source.group === filtroActivo.value || d.target.group === filtroActivo.value
    const conectado = nodoSeleccionado.value && (d.source.id === nodoSeleccionado.value.id || d.target.id === nodoSeleccionado.value.id)

    ctx.beginPath()
    ctx.moveTo(d.source.x, d.source.y)
    ctx.lineTo(d.target.x, d.target.y)
    
    if (conectado) {
      ctx.strokeStyle = isLight ? 'rgba(37, 99, 235, 0.85)' : 'rgba(59, 130, 246, 0.7)'
      ctx.lineWidth = 2
    } else {
      ctx.strokeStyle = activo 
        ? (isLight ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.25)') 
        : (isLight ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.08)')
      ctx.lineWidth = activo ? 1.5 : 1
    }
    ctx.stroke()
  })

  nodes.forEach(d => {
    const activo = filtroActivo.value === 0 || d.group === filtroActivo.value
    const seleccionado = nodoSeleccionado.value && nodoSeleccionado.value.id === d.id
    const radio = 36
    const opacidad = activo ? 1 : (isLight ? 0.3 : 0.15)

    ctx.save()
    ctx.globalAlpha = opacidad

    if (seleccionado) {
      ctx.beginPath()
      ctx.arc(d.x, d.y, radio + 6, 0, 2 * Math.PI)
      ctx.strokeStyle = '#2563EB'
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(d.x, d.y, radio + 10, 0, 2 * Math.PI)
      ctx.strokeStyle = isLight ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.35)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(d.x, d.y, radio, 0, 2 * Math.PI)
    if (isLight) {
      ctx.fillStyle = seleccionado ? '#EFF6FF' : '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = seleccionado ? '#2563EB' : (activo ? '#CBD5E1' : '#E2E8F0')
    } else {
      ctx.fillStyle = seleccionado ? 'rgba(30, 41, 68, 0.98)' : 'rgba(22, 27, 42, 0.95)'
      ctx.fill()
      ctx.strokeStyle = seleccionado ? '#3B82F6' : (activo ? 'rgba(37, 99, 235, 0.5)' : 'rgba(100, 116, 139, 0.2)')
    }
    ctx.lineWidth = seleccionado ? 2 : 1
    ctx.stroke()

    const img = imageCache[d.id]
    const iconSize = 28

    if (img) {
      ctx.drawImage(img, d.x - iconSize / 2, d.y - iconSize / 2 - 6, iconSize, iconSize)
    }

    if (isLight) {
      ctx.fillStyle = seleccionado ? '#1D4ED8' : (activo ? '#334155' : '#94A3B8')
      ctx.font = seleccionado ? '600 11px JetBrains Mono, monospace' : '11px JetBrains Mono, monospace'
    } else {
      ctx.fillStyle = seleccionado ? '#FFFFFF' : (activo ? '#94A3B8' : '#3D4663')
      ctx.font = seleccionado ? 'bold 11px JetBrains Mono, monospace' : '11px JetBrains Mono, monospace'
    }
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

  const original = nodosData.find(n => n.id === event.subject.id)
  if (original) {
    nodoSeleccionado.value = original
  }
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

function handleMouseMove(event) {
  if (!canvasRef.value || (typeof window !== 'undefined' && window.innerWidth < 768)) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const radio = 38
  let hoveredNode = null
  for (const nodo of nodes) {
    const dx = x - nodo.x
    const dy = y - nodo.y
    if (dx * dx + dy * dy <= radio * radio) {
      hoveredNode = nodo
      break
    }
  }
  canvasRef.value.style.cursor = hoveredNode ? 'pointer' : 'grab'
  if (hoveredNode) {
    const original = nodosData.find(n => n.id === hoveredNode.id)
    if (original && nodoSeleccionado.value?.id !== original.id) {
      nodoSeleccionado.value = original
    }
  }
}

function handleCanvasClick(event) {
  if (!canvasRef.value || (typeof window !== 'undefined' && window.innerWidth < 768)) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const radio = 40
  for (const nodo of nodes) {
    const dx = x - nodo.x
    const dy = y - nodo.y
    if (dx * dx + dy * dy <= radio * radio) {
      const original = nodosData.find(n => n.id === nodo.id)
      if (original) {
        nodoSeleccionado.value = original
      }
      return
    }
  }
}

function aplicarFiltro(grupo) {
  filtroActivo.value = grupo

  if (nodoSeleccionado.value && grupo !== 0 && nodoSeleccionado.value.group !== grupo) {
    const primero = nodosData.find(n => n.group === grupo)
    if (primero) nodoSeleccionado.value = primero
  }

  if (!simulation || (typeof window !== 'undefined' && window.innerWidth < 768)) return

  simulation.force('center', null)

  if (grupo === 0) {
    simulation.force('x', d3.forceX(width / 2).strength(0.05))
    simulation.force('y', d3.forceY(height / 2).strength(0.05))
  } else {
    simulation.force('x', d3.forceX()
      .strength(d => d.group === grupo ? 0.12 : 0.03)
      .x(d => d.group === grupo ? width / 2 : (d.x < width / 2 ? 70 : width - 70))
    )
    simulation.force('y', d3.forceY()
      .strength(d => d.group === grupo ? 0.12 : 0.03)
      .y(d => d.group === grupo ? height / 2 : (d.y < height / 2 ? 70 : height - 70))
    )
  }
  
  simulation.alpha(0.6).restart()
}

onMounted(() => {
  precargarIconos()
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    initCanvas()
  }

  if (canvasRef.value && canvasRef.value.parentElement) {
    resizeObserver = new ResizeObserver(() => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 768) {
          requestAnimationFrame(() => {
            initCanvas()
          })
        } else if (simulation) {
          simulation.stop()
        }
      }
    })
    resizeObserver.observe(canvasRef.value.parentElement)
  }

  if (canvasRef.value) {
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (simulation && typeof window !== 'undefined' && window.innerWidth >= 768) {
          if (entry.isIntersecting) {
            simulation.alphaTarget(0.02).restart()
          } else {
            simulation.stop()
          }
        }
      })
    }, { threshold: 0.1 })
    intersectionObserver.observe(canvasRef.value)
  }
  if (typeof document !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      if (ctx && typeof window !== 'undefined' && window.innerWidth >= 768) {
        dibujar()
      }
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }
})

onUnmounted(() => {
  if (simulation) simulation.stop()
  if (resizeObserver) resizeObserver.disconnect()
  if (intersectionObserver) intersectionObserver.disconnect()
  if (themeObserver) themeObserver.disconnect()
})
</script>

<template>
  <section id="habilidades"
    class="relative w-full bg-dark overflow-hidden scroll-mt-4 md:scroll-mt-6 py-10 md:py-16"
    aria-label="Sección — Habilidades Técnicas"
  >
    <!-- Contenedor Alineado -->
    <div class="relative z-10 w-full max-w-6xl md:max-w-7xl mx-auto pl-10 pr-5 sm:px-8 lg:px-8">

      <!-- Encabezado -->
      <div class="mb-6 w-full">
        <span class="status-badge mb-3">Stack Tecnológico</span>
        <h2 class="text-3xl sm:text-4xl font-bold mt-3 text-text-bright">
          Habilidades &amp; Ecosistema
        </h2>
      </div>

      <!-- Filtros de Categoría -->
      <div class="flex flex-wrap gap-2.5 mb-6">
        <button
          v-for="f in filtros"
          :key="f.id"
          @click="aplicarFiltro(f.id)"
          type="button"
          class="skill-filter-chip px-3.5 py-1.5 text-xs font-mono tracking-wide rounded-lg transition-all cursor-pointer"
          :class="filtroActivo === f.id ? 'skill-filter-chip-active' : 'skill-filter-chip-inactive'"
        >
          {{ f.etiqueta }}
        </button>
      </div>

      <!-- Modo Móvil (< 768px): Grilla táctil + Detalle -->
      <div class="block md:hidden space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button
            v-for="tech in nodosFiltrados"
            :key="tech.id"
            @click="nodoSeleccionado = tech"
            type="button"
            class="skill-grid-card flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 text-left"
            :class="nodoSeleccionado?.id === tech.id ? 'skill-grid-card-active' : ''"
          >
            <div class="skill-icon-box w-8 h-8 rounded-lg flex items-center justify-center p-1.5 shrink-0">
              <img :src="tech.icono" :alt="tech.label" class="w-full h-full object-contain" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="skill-node-title text-xs font-semibold truncate">
                {{ tech.label }}
              </div>
              <div class="text-[10px] font-mono text-text-muted truncate">
                {{ tech.tipo }}
              </div>
            </div>
          </button>
        </div>

        <div v-if="nodoSeleccionado" class="skill-hud-panel p-4 rounded-xl transition-all duration-200">
          <div class="flex items-center gap-3 pb-3 border-b skill-divider">
            <div class="skill-icon-box w-10 h-10 rounded-lg flex items-center justify-center p-1.5 shrink-0">
              <img :src="nodoSeleccionado.icono" :alt="nodoSeleccionado.label" class="w-full h-full object-contain" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="skill-tipo-badge text-[10px] font-mono font-semibold uppercase tracking-wider block truncate">
                {{ nodoSeleccionado.tipo }}
              </span>
              <h3 class="skill-node-title text-base font-bold truncate">
                {{ nodoSeleccionado.label }}
              </h3>
            </div>
          </div>

          <div class="mt-3 space-y-3">
            <div>
              <div class="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Capacidades &amp; Rol</div>
              <p class="skill-desc-text text-xs leading-relaxed">
                {{ nodoSeleccionado.descripcion }}
              </p>
            </div>

            <div>
              <div class="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">Proyectos implementados</div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="proy in nodoSeleccionado.proyectos"
                  :key="proy"
                  class="skill-proy-chip px-2.5 py-1 text-xs font-mono rounded"
                >
                  {{ proy }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modo Escritorio (>= 768px): Canvas D3 + HUD -->
      <div class="hidden md:grid md:grid-cols-12 gap-6 items-stretch">
        <div class="skill-canvas-box md:col-span-7 rounded-2xl relative overflow-hidden h-[440px] flex items-center justify-center p-2">
          <canvas
            ref="canvasRef"
            @click="handleCanvasClick"
            @mousemove="handleMouseMove"
            class="w-full h-full cursor-grab active:cursor-grabbing"
          ></canvas>
          <div class="absolute bottom-3 left-4 text-[10px] font-mono uppercase tracking-wider text-text-muted bg-dark-800/90 border border-dark-400 px-3 py-1 rounded pointer-events-none select-none">
            [ NAVEGACIÓN ] Arrastre los nodos o seleccione para inspeccionar
          </div>
        </div>

        <div class="skill-hud-panel md:col-span-5 rounded-2xl p-6 flex flex-col justify-between">
          <div v-if="nodoSeleccionado">
            <div class="flex items-center gap-3 pb-4 border-b skill-divider">
              <div class="skill-icon-box w-12 h-12 rounded-xl flex items-center justify-center p-2 shrink-0">
                <img :src="nodoSeleccionado.icono" :alt="nodoSeleccionado.label" class="w-full h-full object-contain" />
              </div>
              <div>
                <div class="skill-tipo-badge text-[11px] font-mono font-semibold uppercase tracking-wider">
                  {{ nodoSeleccionado.tipo }}
                </div>
                <h3 class="skill-node-title text-xl font-bold leading-tight">
                  {{ nodoSeleccionado.label }}
                </h3>
              </div>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <div class="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Capacidades &amp; Rol</div>
                <p class="skill-desc-text text-xs sm:text-sm leading-relaxed">
                  {{ nodoSeleccionado.descripcion }}
                </p>
              </div>

              <div>
                <div class="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Proyectos donde se implementó</div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="proy in nodoSeleccionado.proyectos"
                    :key="proy"
                    class="skill-proy-chip px-2.5 py-1 text-xs font-mono rounded"
                  >
                    {{ proy }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t skill-divider mt-6 text-[11px] font-mono text-text-muted">
            Ecosistema Interconectado · Tapia Tech Architecture
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Canvas Box & HUD Panel ── */
.skill-canvas-box {
  background-color: var(--color-dark-700);
  border: 1px solid var(--color-dark-400);
}

.skill-hud-panel {
  background-color: var(--color-dark-800);
  border: 1px solid var(--color-dark-400);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}
:root.light .skill-hud-panel {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

/* ── Tipografía y Badges ── */
.skill-node-title {
  color: var(--text-bright);
}
.skill-desc-text {
  color: var(--text-base);
}
.skill-tipo-badge {
  color: var(--color-primary);
}

/* ── Chips y Cajas de Icono ── */
.skill-icon-box,
.skill-proy-chip {
  background-color: var(--color-dark-700);
  border: 1px solid var(--color-dark-400);
  color: var(--text-base);
}

/* ── Tarjetas de la Grilla Móvil ── */
.skill-grid-card {
  background-color: var(--color-dark-800);
  border: 1px solid var(--color-dark-400);
  color: var(--text-base);
}
.skill-grid-card:hover {
  border-color: var(--color-primary);
}
.skill-grid-card-active {
  background-color: var(--color-primary-dim);
  border: 1px solid var(--color-primary);
  color: var(--text-bright);
}
:root.light .skill-grid-card-active {
  color: var(--color-primary);
}

/* ── Filtros de Categoría ── */
.skill-filter-chip-active {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: #FFFFFF !important;
  font-weight: 600;
}
.skill-filter-chip-inactive {
  background-color: var(--color-dark-800);
  border: 1px solid var(--color-dark-400);
  color: var(--text-muted);
}
.skill-filter-chip-inactive:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* ── Separadores ── */
.skill-divider {
  border-color: var(--color-dark-400);
}
</style>