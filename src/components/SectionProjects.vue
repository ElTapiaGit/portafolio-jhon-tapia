<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { categorias, proyectos } from '../data/projects.js'
import ProjectCard from './projects/ProjectCard.vue'
import ProjectModal from './projects/ProjectModal.vue'
import { useTheme } from '../composables/useTheme.js'

gsap.registerPlugin(ScrollTrigger)

const { isDark } = useTheme()

/* ── Referencias del DOM ── */
const sectionRef = ref(null)
const kickerRef = ref(null)
const lineRef = ref(null)
const titleRef = ref(null)
const filtersRef = ref(null)
const cardsContainer = ref(null)

/* ── Estado Reactivo ── */
const mostrarTodos = ref(false)
const categoriaActiva = ref('Todos')
const proyectoSeleccionado = ref(null)

/* ── Contexto GSAP ── */
let ctx = null

/* ── Filtrado Reactivo ── */
const proyectosFiltrados = computed(() => {
  const lista = categoriaActiva.value === 'Todos'
    ? proyectos
    : proyectos.filter(p => p.categoria === categoriaActiva.value)

  if (categoriaActiva.value === 'Todos' && !mostrarTodos.value) {
    return lista.slice(0, 4)
  }
  return lista
})

function toggleProyectos() {
  mostrarTodos.value = !mostrarTodos.value
  nextTick(() => {
    if (mostrarTodos.value && cardsContainer.value) {
      const cards = Array.from(cardsContainer.value.querySelectorAll('.proyecto-card'))
      const nuevasCards = cards.slice(4)
      if (nuevasCards.length) {
        gsap.fromTo(nuevasCards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' }
        )
      }
    }
    ScrollTrigger.refresh()
  })
}

function conteoPorCategoria(cat) {
  if (cat === 'Todos') return proyectos.length
  return proyectos.filter(p => p.categoria === cat).length
}

function cambiarCategoria(cat) {
  if (categoriaActiva.value === cat) return
  categoriaActiva.value = cat
  nextTick(() => {
    animarTarjetas()
    ScrollTrigger.refresh()
  })
}

/* ── Re-animación Suave de Tarjetas (Filtro) ── */
function animarTarjetas() {
  if (!cardsContainer.value) return
  const cards = cardsContainer.value.querySelectorAll('.proyecto-card')
  if (!cards.length) return
  gsap.fromTo(cards,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.28, stagger: 0.04, ease: 'power2.out', clearProps: 'transform', overwrite: 'auto' }
  )
}

function abrirCasoEstudio(proyecto) {
  proyectoSeleccionado.value = proyecto
}

function cerrarCasoEstudio() {
  proyectoSeleccionado.value = null
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Estados iniciales ocultos
    gsap.set(kickerRef.value, { opacity: 0, x: -16 })
    gsap.set(lineRef.value, { scaleX: 0 })
    gsap.set(titleRef.value, { yPercent: 110 })
    gsap.set(filtersRef.value, { opacity: 0, y: 20 })

    const cards = cardsContainer.value?.querySelectorAll('.proyecto-card')
    if (cards && cards.length) {
      gsap.set(cards, { opacity: 0, y: 36 })
    }

    // 2. Timeline sincronizada con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 62%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.to(kickerRef.value, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, 0)
      .to(lineRef.value, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }, 0.05)
      .to(titleRef.value, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0.1)
      .to(filtersRef.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.25)

    if (cards && cards.length) {
      tl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform'
      }, 0.32)
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="proyectos"
    ref="sectionRef"
    class="relative w-full projects-section border-b border-dark-400 overflow-hidden transition-colors scroll-mt-0 py-16 md:py-24 lg:py-28"
    :class="isDark ? 'is-dark' : 'is-light'"
    aria-label="Sección — Proyectos"
  >
    <!-- Marca de Agua Estructural (02) -->
    <span
      aria-hidden="true"
      class="projects-watermark absolute -top-6 right-4 md:right-12 font-sans font-black text-[9rem] sm:text-[13rem] md:text-[17rem] leading-none tracking-tighter select-none pointer-events-none z-0"
    >
      02
    </span>

    <!-- Contenedor Principal -->
    <div class="relative z-10 w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16">

      <!-- Encabezado Brutalista -->
      <div class="mb-8 md:mb-10">
        <div class="flex items-center gap-4 mb-3">
          <span ref="kickerRef" class="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            02 — Casos de Estudio &amp; Producción
          </span>
          <div ref="lineRef" class="h-px flex-1 bg-dark-400 origin-left"></div>
        </div>
        <div class="overflow-hidden py-1">
          <h2 ref="titleRef" class="font-sans font-black uppercase tracking-[-0.03em] text-3xl sm:text-5xl lg:text-6xl leading-[0.95] text-text-bright">
            PROYECTOS DESTACADOS
          </h2>
        </div>
      </div>

      <!-- Barra de Filtros Editorial -->
      <div ref="filtersRef" class="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 md:mb-10 no-scrollbar">
        <button
          v-for="cat in categorias"
          :key="cat"
          type="button"
          @click="cambiarCategoria(cat)"
          class="filter-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all duration-200 border cursor-pointer shrink-0"
          :class="categoriaActiva === cat ? 'filter-btn-active' : 'filter-btn-inactive'"
        >
          <span>{{ cat }}</span>
          <span
            class="filter-counter text-[10px] px-1.5 py-0.5 rounded font-mono leading-none"
            :class="categoriaActiva === cat ? 'filter-counter-active' : 'filter-counter-inactive'"
          >
            {{ conteoPorCategoria(cat) }}
          </span>
        </button>
      </div>

      <!-- Grilla de Tarjetas -->
      <div
        ref="cardsContainer"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full"
      >
        <ProjectCard
          v-for="(proyecto, idx) in proyectosFiltrados"
          :key="proyecto.id || idx"
          :proyecto="proyecto"
          @abrir-caso="abrirCasoEstudio"
        />
      </div>

      <!-- Botón Cargar Más Proyectos -->
      <div v-if="categoriaActiva === 'Todos' && proyectos.length > 4" class="mt-12 md:mt-16 w-full flex justify-center">
        <button 
          type="button"
          @click="toggleProyectos"
          class="load-more-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-md text-xs font-mono uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer"
        >
          <span>{{ mostrarTodos ? 'Mostrar menos proyectos' : 'Cargar más proyectos' }}</span>
          <svg 
            class="w-4 h-4 transition-transform duration-300" 
            :class="{'rotate-180': mostrarTodos}" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Modal con Soporte Dual Limpio -->
    <ProjectModal
      :proyecto="proyectoSeleccionado"
      @cerrar-caso="cerrarCasoEstudio"
    />
  </section>
</template>

<style scoped>
/* ── Plano de Superficie Base ── */
.projects-section.is-dark {
  background-color: var(--color-dark);
}

.projects-section.is-light {
  background-color: #F8FAFC;
}

/* ── Marca de Agua Estructural ── */
.is-dark .projects-watermark {
  color: rgba(248, 250, 252, 0.035);
}

.is-light .projects-watermark {
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

/* ── Filtros por Categoría ── */
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

/* ── Botón Cargar Más ── */
.is-dark .load-more-btn {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
  color: var(--text-bright);
}
.is-dark .load-more-btn:hover {
  background-color: var(--color-dark-700);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.is-light .load-more-btn {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  color: #0F172A;
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
}
.is-light .load-more-btn:hover {
  background-color: #F8FAFC;
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
