<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { categorias, proyectos } from '../data/projects.js'
import ProjectCard from './projects/ProjectCard.vue'
import ProjectModal from './projects/ProjectModal.vue'

/* ── Referencias del DOM ── */
const sectionRef = ref(null)
const cardsContainer = ref(null)

/* ── Estado Reactivo ── */
const mostrarTodos = ref(false)
const categoriaActiva = ref('Todos')
const proyectoSeleccionado = ref(null)

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
  nextTick(() => animarTarjetas())
}

function conteoPorCategoria(cat) {
  if (cat === 'Todos') return proyectos.length
  return proyectos.filter(p => p.categoria === cat).length
}

function cambiarCategoria(cat) {
  if (categoriaActiva.value === cat) return
  categoriaActiva.value = cat
  nextTick(() => animarTarjetas())
}

/* ── Animación GSAP de Tarjetas ── */
function animarTarjetas() {
  if (!cardsContainer.value) return
  const cards = cardsContainer.value.querySelectorAll('.proyecto-card')
  if (!cards.length) return
  gsap.fromTo(cards,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out', clearProps: 'transform' }
  )
}

function abrirCasoEstudio(proyecto) {
  proyectoSeleccionado.value = proyecto
}

function cerrarCasoEstudio() {
  proyectoSeleccionado.value = null
}

let observer = null

onMounted(() => {
  if ('IntersectionObserver' in window && sectionRef.value) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animarTarjetas()
          observer?.disconnect()
        }
      })
    }, { threshold: 0.1 })
    observer.observe(sectionRef.value)
  } else {
    animarTarjetas()
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <section
    id="proyectos"
    ref="sectionRef"
    class="relative bg-dark text-white py-10 md:py-16 w-full scroll-mt-4 md:scroll-mt-6"
    aria-label="Sección — Proyectos"
  >
    <div class="relative z-10 w-full max-w-6xl md:max-w-7xl mx-auto pl-10 pr-5 sm:px-8 lg:px-8">

      <!-- Encabezado de la Sección -->
      <div class="mb-8 w-full">
        <span class="status-badge mb-3">Portafolio</span>
        <h2 class="text-3xl lg:text-4xl font-bold mt-3 text-text-bright">Proyectos</h2>
      </div>

      <!-- Filtro por Categorías -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        <button
          v-for="cat in categorias"
          :key="cat"
          type="button"
          @click="cambiarCategoria(cat)"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 border cursor-pointer"
          :class="categoriaActiva === cat ? 'filter-chip-active shadow-sm' : 'filter-chip-inactive'"
        >
          <span>{{ cat }}</span>
          <span
            class="filter-counter text-[10px] px-1.5 py-0.5 rounded-full font-sans leading-none"
            :class="categoriaActiva === cat ? 'filter-counter-active' : 'filter-counter-inactive'"
          >
            {{ conteoPorCategoria(cat) }}
          </span>
        </button>
      </div>

      <!-- Grilla de Tarjetas -->
      <div
        ref="cardsContainer"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full"
      >
        <ProjectCard
          v-for="(proyecto, idx) in proyectosFiltrados"
          :key="proyecto.id || idx"
          :proyecto="proyecto"
          @abrir-caso="abrirCasoEstudio"
        />
      </div>

      <!-- Botón Cargar Más Proyectos -->
      <div v-if="categoriaActiva === 'Todos' && proyectos.length > 4" class="mt-14 w-full flex justify-center">
        <button 
          type="button"
          @click="toggleProyectos"
          class="btn-secondary transition-all duration-300"
        >
          {{ mostrarTodos ? 'Ocultar proyectos' : 'Cargar más proyectos' }}
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
/* ── Scrollbars ── */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ── Filtros por Categoría ── */
.filter-chip-active {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: #FFFFFF !important;
  font-weight: 600;
}
.filter-counter-active {
  background-color: rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
}

.filter-chip-inactive {
  border: 1px solid var(--color-dark-400);
  background-color: var(--color-dark-800);
  color: var(--text-muted);
}
.filter-chip-inactive:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.filter-counter-inactive {
  background-color: var(--color-dark-700);
  color: var(--text-muted);
}
</style>
