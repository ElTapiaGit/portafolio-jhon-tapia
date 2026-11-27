<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { forceSimulation, forceManyBody, forceLink, forceCollide, forceCenter, forceX, forceY } from 'd3-force'
import { drag } from 'd3-drag'
import { select } from 'd3-selection'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nodosData, linksData, filtros } from '../data/skills.js'
import { useTheme } from '../composables/useTheme.js'

gsap.registerPlugin(ScrollTrigger)

const { isDark } = useTheme()

/* ── Referencias del DOM ── */
const sectionRef = ref(null)
const kickerRef = ref(null)
const lineRef = ref(null)
const titleRef = ref(null)
const filtersRef = ref(null)
const contentGridRef = ref(null)
const canvasRef = ref(null)

/* ── Estado Reactivo ── */
const filtroActivo = ref(0)
const nodoSeleccionado = ref(nodosData.find(n => n.id === 'Flutter') || nodosData[0])

const nodosFiltrados = computed(() => {
  if (filtroActivo.value === 0) return nodosData
  return nodosData.filter(n => n.group === filtroActivo.value)
})

/* ── Nodos Vecinos Directamente Conectados ── */
const nodosConectados = computed(() => {
  if (!nodoSeleccionado.value) return []
  const id = nodoSeleccionado.value.id
  const ids = new Set()
  linksData.forEach(l => {
    if (l.source === id) ids.add(l.target)
    if (l.target === id) ids.add(l.source)
  })
  return nodosData.filter(n => ids.has(n.id))
})

function seleccionarNodoPorId(id) {
  const target = nodosData.find(n => n.id === id)
  if (target) {
    nodoSeleccionado.value = target
    if (simulation && typeof window !== 'undefined' && window.innerWidth >= 768) {
      simulation.alpha(0.25).restart()
    }
  }
}

function conteoPorFiltro(grupo) {
  if (grupo === 0) return nodosData.length
  return nodosData.filter(n => n.group === grupo).length
}

/* ── Variables del Canvas y D3 ── */
let simulation = null
let width = 0
let height = 0
let nodes = []
let links = []
let ctx = null
const imageCache = {}
let resizeObserver = null
let gsapCtx = null

watch(isDark, () => {
  if (ctx && typeof window !== 'undefined' && window.innerWidth >= 768) {
    dibujar()
  }
})

function precargarIconos() {
  nodosData.forEach(d => {
    const img = new Image()
    img.src = d.icono
    img.onload = () => {
      imageCache[d.id] = img
      if (ctx && typeof window !== 'undefined' && window.innerWidth >= 768) {
        requestAnimationFrame(dibujar)
      }
    }
  })
}

/* ── Helper unificado de detección de proximidad a nodos ── */
function getNodeAt(x, y, radius = 40) {
  const r2 = radius * radius
  let closest = null
  let minDist = Infinity
  for (const nodo of nodes) {
    const dx = x - nodo.x
    const dy = y - nodo.y
    const d2 = dx * dx + dy * dy
    if (d2 <= r2 && d2 < minDist) {
      closest = nodo
      minDist = d2
    }
  }
  return closest
}

function initCanvas() {
  if (!canvasRef.value) return
  const container = canvasRef.value.parentElement
  if (!container) return
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    if (simulation) simulation.stop()
    return
  }

  const dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2)
  width = container.clientWidth || 600
  height = 432

  canvasRef.value.width = width * dpr
  canvasRef.value.height = height * dpr
  canvasRef.value.style.width = `${width}px`
  canvasRef.value.style.height = `${height}px`

  ctx = canvasRef.value.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  nodes = nodosData.map(d => Object.create(d))
  links = linksData.map(d => Object.create(d))

  if (simulation) simulation.stop()

  simulation = forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-200))
    .force('link', forceLink(links).id(d => d.id).distance(115))
    .force('collide', forceCollide().radius(48).iterations(2))
    .force('center', forceCenter(width / 2, height / 2))
    .on('tick', dibujar)

  select(canvasRef.value)
    .call(drag()
      .container(canvasRef.value)
      .subject(objetoDrag)
      .on('start', iniciarDrag)
      .on('drag', arrastrar)
      .on('end', soltarDrag))
}

function dibujar() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  const isLight = !isDark.value

  // Matriz sutil de micropuntos de ingeniería
  const dotSpacing = 28
  ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.07)' : 'rgba(148, 163, 184, 0.08)'
  for (let x = dotSpacing; x < width; x += dotSpacing) {
    for (let y = dotSpacing; y < height; y += dotSpacing) {
      ctx.fillRect(x, y, 1, 1)
    }
  }

  const selId = nodoSeleccionado.value?.id
  const vecinosIds = new Set()
  if (selId) {
    links.forEach(l => {
      const sId = l.source.id || l.source
      const tId = l.target.id || l.target
      if (sId === selId) vecinosIds.add(tId)
      if (tId === selId) vecinosIds.add(sId)
    })
  }

  // 1. Dibujar Enlaces
  links.forEach(d => {
    const sId = d.source.id || d.source
    const tId = d.target.id || d.target
    const conectado = selId && (sId === selId || tId === selId)
    const activo = filtroActivo.value === 0 || d.source.group === filtroActivo.value || d.target.group === filtroActivo.value

    ctx.beginPath()
    ctx.moveTo(d.source.x, d.source.y)
    ctx.lineTo(d.target.x, d.target.y)

    if (conectado) {
      ctx.strokeStyle = isLight ? 'rgba(37, 99, 235, 0.85)' : 'rgba(59, 130, 246, 0.75)'
      ctx.lineWidth = 2
    } else {
      ctx.strokeStyle = activo
        ? (isLight ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.22)')
        : (isLight ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.08)')
      ctx.lineWidth = activo ? 1.5 : 1
    }
    ctx.stroke()
  })

  // 2. Dibujar Nodos con Delimitación de Bordes (Bounding Box)
  nodes.forEach(d => {
    // Restricción dentro de márgenes seguros para que ningún nodo se corte
    const pad = 48
    d.x = Math.max(pad, Math.min(width - pad, d.x))
    d.y = Math.max(pad, Math.min(height - pad, d.y))

    const activo = filtroActivo.value === 0 || d.group === filtroActivo.value
    const seleccionado = selId && d.id === selId
    const esVecino = vecinosIds.has(d.id)
    const radio = 36
    const opacidad = activo || seleccionado || esVecino ? 1 : (isLight ? 0.25 : 0.15)

    ctx.save()
    ctx.globalAlpha = opacidad

    // Anillos decorativos de selección / vecindad
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
    } else if (esVecino) {
      ctx.beginPath()
      ctx.arc(d.x, d.y, radio + 4, 0, 2 * Math.PI)
      ctx.strokeStyle = isLight ? 'rgba(37, 99, 235, 0.35)' : 'rgba(59, 130, 246, 0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Sombra suave en modo claro para dar relieve arquitectónico
    if (isLight) {
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetY = 4
    }

    ctx.beginPath()
    ctx.arc(d.x, d.y, radio, 0, 2 * Math.PI)
    if (isLight) {
      ctx.fillStyle = seleccionado ? '#EFF6FF' : '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = seleccionado ? '#2563EB' : (esVecino ? '#93C5FD' : (activo ? '#CBD5E1' : '#E2E8F0'))
    } else {
      ctx.fillStyle = seleccionado ? 'rgba(30, 41, 68, 0.98)' : 'rgba(22, 27, 42, 0.95)'
      ctx.fill()
      ctx.strokeStyle = seleccionado ? '#3B82F6' : (esVecino ? 'rgba(59, 130, 246, 0.6)' : (activo ? 'rgba(37, 99, 235, 0.5)' : 'rgba(100, 116, 139, 0.2)'))
    }
    ctx.lineWidth = seleccionado ? 2 : (esVecino ? 1.5 : 1)
    ctx.stroke()

    // Limpiar sombra para dibujar icono y textos nítidos
    if (isLight) {
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
    }

    const img = imageCache[d.id]
    const iconSize = 28
    if (img) {
      ctx.drawImage(img, d.x - iconSize / 2, d.y - iconSize / 2 - 6, iconSize, iconSize)
    }

    // Tipografía Plus Jakarta Sans / Sans-serif optimizada para legibilidad
    if (isLight) {
      ctx.fillStyle = seleccionado ? '#1D4ED8' : (esVecino ? '#1E293B' : (activo ? '#334155' : '#94A3B8'))
      ctx.font = seleccionado || esVecino ? '700 11px "Plus Jakarta Sans", sans-serif' : '600 11px "Plus Jakarta Sans", sans-serif'
    } else {
      ctx.fillStyle = seleccionado ? '#FFFFFF' : (esVecino ? '#E2E8F0' : (activo ? '#94A3B8' : '#3D4663'))
      ctx.font = seleccionado || esVecino ? '700 11px "Plus Jakarta Sans", sans-serif' : '600 11px "Plus Jakarta Sans", sans-serif'
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(d.label, d.x, d.y + 18)

    ctx.restore()
  })
}

function objetoDrag(event) {
  return getNodeAt(event.x, event.y, 42)
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
  if (!event.active) simulation.alphaTarget(0)
  event.subject.fx = null
  event.subject.fy = null
}

function handleMouseMove(event) {
  if (!canvasRef.value || (typeof window !== 'undefined' && window.innerWidth < 768)) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const hovered = getNodeAt(x, y, 40)
  canvasRef.value.style.cursor = hovered ? 'pointer' : 'grab'
  if (hovered) {
    const original = nodosData.find(n => n.id === hovered.id)
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

  const clicked = getNodeAt(x, y, 42)
  if (clicked) {
    const original = nodosData.find(n => n.id === clicked.id)
    if (original) {
      nodoSeleccionado.value = original
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
    simulation.force('x', forceX(width / 2).strength(0.05))
    simulation.force('y', forceY(height / 2).strength(0.05))
  } else {
    simulation.force('x', forceX()
      .strength(d => d.group === grupo ? 0.12 : 0.03)
      .x(d => d.group === grupo ? width / 2 : (d.x < width / 2 ? 70 : width - 70))
    )
    simulation.force('y', forceY()
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

  /* ── Coreografía Cinemática de Entrada con GSAP ScrollTrigger ── */
  gsapCtx = gsap.context(() => {
    gsap.set(kickerRef.value, { opacity: 0, x: -16 })
    gsap.set(lineRef.value, { scaleX: 0 })
    gsap.set(titleRef.value, { yPercent: 110 })
    gsap.set(filtersRef.value, { opacity: 0, y: 20 })
    gsap.set(contentGridRef.value, { opacity: 0, y: 36 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 62%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          if (simulation && typeof window !== 'undefined' && window.innerWidth >= 768) {
            simulation.alpha(0.45).restart()
          }
        }
      }
    })

    tl.to(kickerRef.value, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, 0)
      .to(lineRef.value, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }, 0.05)
      .to(titleRef.value, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0.1)
      .to(filtersRef.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.25)
      .to(contentGridRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform'
      }, 0.32)

    // Detener la simulación cuando la sección sale completamente de la pantalla para 0% uso de CPU
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => { simulation?.stop() },
      onLeaveBack: () => { simulation?.stop() },
      onEnter: () => {
        if (simulation && typeof window !== 'undefined' && window.innerWidth >= 768) {
          simulation.alpha(0.2).restart()
        }
      },
      onEnterBack: () => {
        if (simulation && typeof window !== 'undefined' && window.innerWidth >= 768) {
          simulation.alpha(0.2).restart()
        }
      }
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  if (simulation) simulation.stop()
  if (resizeObserver) resizeObserver.disconnect()
  gsapCtx?.revert()
})
</script>

<template>
  <section
    id="habilidades"
    ref="sectionRef"
    class="relative w-full skills-section border-b border-dark-400 overflow-hidden transition-colors scroll-mt-0 py-16 md:py-24 lg:py-28"
    :class="isDark ? 'is-dark' : 'is-light'"
    aria-label="Sección — Habilidades Técnicas"
  >
    <!-- Marca de Agua Estructural (03) -->
    <span
      aria-hidden="true"
      class="skills-watermark absolute -top-6 right-4 md:right-12 font-sans font-black text-[9rem] sm:text-[13rem] md:text-[17rem] leading-none tracking-tighter select-none pointer-events-none z-0"
    >
      03
    </span>

    <!-- Contenedor Principal -->
    <div class="relative z-10 w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16">

      <!-- Encabezado Brutalista -->
      <div class="mb-8 md:mb-10">
        <div class="flex items-center gap-4 mb-3">
          <span ref="kickerRef" class="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            03 — Ecosistema &amp; Arquitectura Técnica
          </span>
          <div ref="lineRef" class="h-px flex-1 bg-dark-400 origin-left"></div>
        </div>
        <div class="overflow-hidden py-1">
          <h2 ref="titleRef" class="font-sans font-black uppercase tracking-[-0.03em] text-3xl sm:text-5xl lg:text-6xl leading-[0.95] text-text-bright">
            STACK TECNOLÓGICO
          </h2>
        </div>
      </div>

      <!-- Barra de Filtros Editorial con Contadores -->
      <div ref="filtersRef" class="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 md:mb-10 no-scrollbar">
        <button
          v-for="f in filtros"
          :key="f.id"
          @click="aplicarFiltro(f.id)"
          type="button"
          class="filter-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all duration-200 border cursor-pointer shrink-0"
          :class="filtroActivo === f.id ? 'filter-btn-active' : 'filter-btn-inactive'"
        >
          <span>{{ f.etiqueta }}</span>
          <span
            class="filter-counter text-[10px] px-1.5 py-0.5 rounded font-mono leading-none"
            :class="filtroActivo === f.id ? 'filter-counter-active' : 'filter-counter-inactive'"
          >
            {{ conteoPorFiltro(f.id) }}
          </span>
        </button>
      </div>

      <!-- Contenedor Maestro de Contenido -->
      <div ref="contentGridRef">
        
        <!-- Vista Móvil (< 768px): Panel HUD Arriba + Grilla Táctil Abajo -->
        <div class="block md:hidden space-y-6">
          <!-- Panel de Inspección Móvil (Arriba para visualización instantánea) -->
          <div v-if="nodoSeleccionado" class="skill-hud-panel p-5 rounded-md border">
            <Transition name="node-fade" mode="out-in">
              <div :key="nodoSeleccionado.id">
                <div class="flex items-center gap-3 pb-3 border-b border-dark-400">
                  <div class="skill-icon-box w-10 h-10 rounded-md flex items-center justify-center p-1.5 shrink-0 border">
                    <img :src="nodoSeleccionado.icono" :alt="nodoSeleccionado.label" class="w-full h-full object-contain" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary truncate">
                        {{ nodoSeleccionado.tipo }}
                      </span>
                      <span class="font-mono text-[11px] font-medium px-2 py-0.5 rounded border skill-badge-conns">
                        {{ nodosConectados.length }} {{ nodosConectados.length === 1 ? 'conexión' : 'conexiones' }}
                      </span>
                    </div>
                    <h3 class="font-sans text-xl sm:text-2xl font-black tracking-tight text-text-bright leading-none mt-1 truncate">
                      {{ nodoSeleccionado.label }}
                    </h3>
                  </div>
                </div>

                <div class="mt-4 space-y-4">
                  <!-- Bloque 1: Capacidades & Rol -->
                  <div>
                    <div class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] skill-section-label mb-2">
                      Capacidades &amp; Rol en Arquitectura
                    </div>
                    <p class="font-sans text-sm leading-relaxed skill-desc-text">
                      {{ nodoSeleccionado.descripcion }}
                    </p>
                  </div>

                  <!-- Bloque 2: Integración Directa -->
                  <div>
                    <div class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] skill-section-label mb-2">
                      Integración Directa
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="vecino in nodosConectados"
                        :key="vecino.id"
                        type="button"
                        @click="seleccionarNodoPorId(vecino.id)"
                        class="skill-connect-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-md border font-sans font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <img :src="vecino.icono" :alt="vecino.label" class="w-3.5 h-3.5 object-contain" />
                        <span>{{ vecino.label }}</span>
                      </button>
                      <span v-if="!nodosConectados.length" class="text-xs font-mono text-text-muted">
                        Nodo terminal
                      </span>
                    </div>
                  </div>

                  <!-- Bloque 3: Proyectos donde se implementó -->
                  <div>
                    <div class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] skill-section-label mb-2">
                      Proyectos donde se implementó
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <span
                        v-for="proy in nodoSeleccionado.proyectos"
                        :key="proy"
                        class="skill-proy-chip px-3 py-1.5 rounded-md border font-sans font-semibold text-xs"
                      >
                        {{ proy }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Grilla Táctil de Botones de Tecnologías (Abajo para tocar con el pulgar) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              v-for="tech in nodosFiltrados"
              :key="tech.id"
              @click="nodoSeleccionado = tech"
              type="button"
              class="skill-grid-card flex items-center gap-2.5 p-3 rounded-md transition-all duration-200 cursor-pointer active:scale-95 text-left border"
              :class="nodoSeleccionado?.id === tech.id ? 'skill-grid-card-active' : ''"
            >
              <div class="skill-icon-box w-8 h-8 rounded flex items-center justify-center p-1.5 shrink-0 border">
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
        </div>

        <!-- Vista Escritorio (>= 768px): Canvas D3 + HUD Editorial -->
        <div class="hidden md:grid md:grid-cols-12 gap-8 items-stretch">
          
          <!-- Lienzo D3 en Alta Definición con Barra de Estado Integrada -->
          <div class="skill-canvas-box md:col-span-7 rounded-md border flex flex-col justify-between overflow-hidden h-[480px] p-0">
            <!-- Área de Dibujo del Canvas -->
            <div class="flex-1 w-full relative overflow-hidden flex items-center justify-center">
              <canvas
                ref="canvasRef"
                @click="handleCanvasClick"
                @mousemove="handleMouseMove"
                class="w-full h-full cursor-grab active:cursor-grabbing"
              ></canvas>
            </div>
            
            <!-- Barra de Estado Inferior Fuera del Área de Dibujo -->
            <div class="w-full px-4 py-2.5 border-t flex items-center justify-between text-[11px] font-mono uppercase tracking-wider canvas-footer">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Grafo Interactivo · Arrastra o selecciona cualquier nodo</span>
              </div>
              <span class="font-semibold">{{ nodosFiltrados.length }} tecnologías activas</span>
            </div>
          </div>

          <!-- Panel de Inspección Editorial (HUD) -->
          <div class="skill-hud-panel md:col-span-5 rounded-md border p-6 flex flex-col justify-between h-[480px] overflow-y-auto no-scrollbar">
            <Transition name="node-fade" mode="out-in">
              <div v-if="nodoSeleccionado" :key="nodoSeleccionado.id" class="flex flex-col justify-between flex-1">
                <div>
                  <!-- Cabecera del Nodo -->
                  <div class="flex items-center gap-3.5 pb-4 border-b border-dark-400">
                    <div class="skill-icon-box w-12 h-12 rounded-md flex items-center justify-center p-2 shrink-0 border">
                      <img :src="nodoSeleccionado.icono" :alt="nodoSeleccionado.label" class="w-full h-full object-contain" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                          {{ nodoSeleccionado.tipo }}
                        </span>
                        <span class="font-mono text-[11px] font-medium px-2.5 py-0.5 rounded border skill-badge-conns">
                          {{ nodosConectados.length }} {{ nodosConectados.length === 1 ? 'conexión' : 'conexiones' }}
                        </span>
                      </div>
                      <h3 class="font-sans text-2xl sm:text-[1.65rem] font-black tracking-tight text-text-bright leading-none mt-1 truncate">
                        {{ nodoSeleccionado.label }}
                      </h3>
                    </div>
                  </div>

                  <!-- Cuerpo de la Ficha Técnica -->
                  <div class="mt-5 space-y-5">
                    <!-- Bloque 1: Capacidades & Rol -->
                    <div>
                      <div class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] skill-section-label mb-2">
                        Capacidades &amp; Rol en Arquitectura
                      </div>
                      <p class="font-sans text-sm sm:text-[15px] leading-relaxed skill-desc-text">
                        {{ nodoSeleccionado.descripcion }}
                      </p>
                    </div>

                    <!-- Bloque 2: Integración Directa (Nodos Conectados) -->
                    <div>
                      <div class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] skill-section-label mb-2">
                        Integración Directa (Grafo)
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <button
                          v-for="vecino in nodosConectados"
                          :key="vecino.id"
                          type="button"
                          @click="seleccionarNodoPorId(vecino.id)"
                          class="skill-connect-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-md border font-sans font-semibold text-xs transition-colors cursor-pointer"
                          :title="`Inspeccionar ${vecino.label}`"
                        >
                          <img :src="vecino.icono" :alt="vecino.label" class="w-3.5 h-3.5 object-contain" />
                          <span>{{ vecino.label }}</span>
                        </button>
                        <span v-if="!nodosConectados.length" class="text-xs font-mono text-text-muted">
                          Nodo terminal sin dependencias directas
                        </span>
                      </div>
                    </div>

                    <!-- Bloque 3: Proyectos donde se implementó -->
                    <div>
                      <div class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] skill-section-label mb-2">
                        Proyectos donde se implementó
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-for="proy in nodoSeleccionado.proyectos"
                          :key="proy"
                          class="skill-proy-chip px-3 py-1.5 rounded-md border font-sans font-semibold text-xs"
                        >
                          {{ proy }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pie del Panel -->
                <div class="pt-5 border-t border-dark-400 mt-6 flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>Ecosistema Interconectado</span>
                  <span class="flex items-center gap-1.5 text-text-bright font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Ecosistema activo
                  </span>
                </div>
              </div>
            </Transition>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Superficie Secundaria con Gradiente Radial ── */
.skills-section.is-dark {
  background-color: var(--color-dark-800);
  background-image: radial-gradient(circle at 85% 0%, var(--color-primary-dim) 0%, transparent 55%);
}

.skills-section.is-light {
  background-color: #F1F5F9;
  background-image: none;
}

/* ── Marca de Agua Estructural ── */
.is-dark .skills-watermark {
  color: rgba(248, 250, 252, 0.035);
}

.is-light .skills-watermark {
  color: rgba(15, 23, 42, 0.055);
}

/* ── Scrollbars ── */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ── Filtros de Categoría ── */
.filter-btn-active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #FFFFFF !important;
  font-weight: 600;
}
.filter-counter-active {
  background-color: rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
}

.is-dark .filter-btn-inactive {
  border-color: var(--color-dark-400);
  background-color: var(--color-dark-800);
  color: var(--text-muted);
}
.is-dark .filter-btn-inactive:hover {
  border-color: var(--color-primary);
  color: var(--text-bright);
}
.is-dark .filter-counter-inactive {
  background-color: var(--color-dark-700);
  color: var(--text-muted);
}

.is-light .filter-btn-inactive {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  color: #475569;
}
.is-light .filter-btn-inactive:hover {
  border-color: var(--color-primary);
  color: #0F172A;
}
.is-light .filter-counter-inactive {
  background-color: #F1F5F9;
  color: #64748B;
}

/* ── Contenedor Canvas & HUD ── */
.is-dark .skill-canvas-box {
  background-color: var(--color-dark);
  border-color: var(--color-dark-400);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
}
.is-light .skill-canvas-box {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.06);
}

.is-dark .skill-hud-panel {
  background-color: var(--color-dark);
  border-color: var(--color-dark-400);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
}
.is-light .skill-hud-panel {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.06);
}

/* ── Barra de Estado del Canvas (Footer) ── */
.is-dark .canvas-footer {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
  color: var(--text-muted);
}
.is-light .canvas-footer {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  color: #475569;
}

/* ── Tipografía y Badges ── */
.skill-node-title {
  color: var(--text-bright);
}

.is-dark .skill-badge-conns {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-muted);
}
.is-light .skill-badge-conns {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #64748B;
}

.is-dark .skill-section-label {
  color: #94A3B8;
}
.is-light .skill-section-label {
  color: #64748B;
}

.is-dark .skill-desc-text {
  color: #CBD5E1;
}
.is-light .skill-desc-text {
  color: #334155;
}

/* ── Cajas de Icono y Chips ── */
.is-dark .skill-icon-box {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
}
.is-light .skill-icon-box {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
}

.is-dark .skill-proy-chip {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: #CBD5E1;
}
.is-light .skill-proy-chip {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  color: #334155;
}

/* ── Chips de Conexión Interactivos ── */
.is-dark .skill-connect-chip {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: #F8FAFC;
}
.is-dark .skill-connect-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.is-light .skill-connect-chip {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #0F172A;
}
.is-light .skill-connect-chip:hover {
  border-color: var(--color-primary);
  background-color: #EFF6FF;
  color: var(--color-primary);
}

/* ── Tarjetas Grilla Móvil ── */
.is-dark .skill-grid-card {
  background-color: var(--color-dark);
  border-color: var(--color-dark-400);
}
.is-light .skill-grid-card {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
}

.is-dark .skill-grid-card-active {
  background-color: var(--color-primary-dim) !important;
  border-color: var(--color-primary) !important;
}
.is-light .skill-grid-card-active {
  background-color: #EFF6FF !important;
  border-color: var(--color-primary) !important;
}

/* ── Transición Dinámica de Nodo ── */
.node-fade-enter-active,
.node-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.node-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.node-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
