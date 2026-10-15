<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

/* ── Referencias del DOM ── */
const sectionRef = ref(null)
const cardsContainer = ref(null)

/* ── Estado Reactivo ── */
const mostrarTodos = ref(false)
const categoriaActiva = ref('Todos')
const proyectoSeleccionado = ref(null)

/* ── Bloqueo de Scroll en el Body al abrir modal ── */
watch(proyectoSeleccionado, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

/* ── Categorías ── */
const categorias = ['Todos', 'Móvil', 'Web', 'Backend / IA']

/* ── Lista de Proyectos ── */
const proyectos = [
  {
    id: 'ulat-inventory',
    titulo: 'Sistema Inventario Institucional - ULAT',
    descripcion: 'Plataforma web para la gestión integral de activos, infraestructura multisede, bitácoras de mantenimiento y control de roles.',
    estado: 'Implementado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Full Stack',
    stack: ['Laravel', 'MySQL', 'Bootstrap', 'Blade'],
    repo: 'https://github.com/ElTapiaGit/inventorySedes.git',
    arquitectura: 'MVC / RBAC',
    imagen: '/asset/images/banner-ulat.webp',
    categoria: 'Web',
    problem: 'Pérdida de trazabilidad de activos físicos y dificultades en auditorías entre sedes universitarias debido a registros manuales.',
    architecture: 'Arquitectura MVC en Laravel con control de acceso basado en roles (RBAC) y registro de auditoría de transacciones.',
    keyHighlights: [
      'Control de accesos multi-rol con validaciones en middleware para operaciones sensibles.',
      'Módulo de transferencias inter-sedes con confirmación de recepción y trazabilidad de custodia.',
      'Generación y exportación de reportes de inventario valorado en PDF y Excel.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/inventorySedes.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'cosechapp',
    titulo: 'CosechApp - Control Agrónomo',
    descripcion: 'Aplicación móvil offline-first para gestión de cosechas, registro de pesajes en campo y generación de planillas Excel en el dispositivo.',
    estado: 'Finalizado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Flutter',
    stack: ['Flutter', 'Supabase', 'Hive', 'GoRouter'],
    repo: 'https://github.com/ElTapiaGit/cosechapp-web-mobile.git',
    arquitectura: 'MVVM / Clean Architecture',
    imagen: '/asset/images/banner-cosechapp.webp',
    categoria: 'Móvil',
    problem: 'Falta de conectividad celular en zonas agrícolas remotas, lo que impedía el registro directo de pesajes y lotes cosechados.',
    architecture: 'Patrón MVVM en Flutter con almacenamiento local en Hive y sincronización asíncrona hacia Supabase al detectar red.',
    keyHighlights: [
      'Persistencia local-first para operar sin conexión durante toda la jornada de campo.',
      'Exportación de planillas Excel y reportes consolidados directamente desde el dispositivo.',
      'Sincronización automática de datos pendientes al restablecerse la conexión a internet.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/cosechapp-web-mobile.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'finance-local',
    titulo: 'Finance Local - Finanzas Personales',
    descripcion: 'Aplicación móvil offline-first para control financiero personal con almacenamiento 100% local, sin servidores externos ni cuentas obligatorias.',
    estado: 'Publicado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Flutter',
    stack: ['Flutter', 'Dart', 'Hive'],
    repo: 'https://github.com/ElTapiaGit/finance-local-app.git',
    arquitectura: 'Clean Architecture / Hive',
    imagen: '/asset/images/proyect-finance.webp',
    categoria: 'Móvil',
    problem: 'Preocupación de los usuarios por la privacidad de sus datos financieros al usar servicios en la nube con cobros recurrentes.',
    architecture: 'Clean Architecture en Flutter con base de datos NoSQL embebida (Hive) para lectura y escritura instantánea.',
    keyHighlights: [
      'Persistencia 100% local en el dispositivo para garantizar privacidad absoluta.',
      'Cálculo reactivo de balances, presupuestos y resúmenes mensuales.',
      'Automatización de pruebas y publicación en la tienda de Google Play Store.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/finance-local-app.git',
      playstore: 'https://play.google.com/store/apps/details?id=com.eltapiadev.finances&pcampaignid=web_share',
      live: null
    }
  },
  {
    id: 'enterprise-rag',
    titulo: 'Enterprise RAG Core - Local AI',
    descripcion: 'Motor de búsqueda semántica y recuperación aumentada (RAG) sobre documentación técnica local, ejecutado mediante Docker, pgvector y Ollama.',
    estado: 'Finalizado',
    tipoEstado: 'terminado',
    rol: 'Backend & AI Integration',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Ollama'],
    repo: 'https://github.com/ElTapiaGit/RAG-Empresarial-Local.git',
    arquitectura: 'Vector Search / RAG Pipeline',
    imagen: '/asset/images/software_infrastructure.webp',
    categoria: 'Backend / IA',
    problem: 'Dificultad para consultar documentación técnica extensa y riesgos de privacidad al enviar información confidencial a APIs en la nube.',
    architecture: 'Pipeline en Node.js con base vectorial pgvector en PostgreSQL y LLM local servido mediante Ollama en contenedores Docker.',
    keyHighlights: [
      'Particionado y limpieza de documentos técnicos para generación de fragmentos contextuales.',
      'Indexación semántica y búsqueda por similitud vectorial con pgvector en PostgreSQL.',
      'Generación de respuestas con contexto recuperado ejecutando modelos locales sin conexión externa.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/RAG-Empresarial-Local.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'wireflow-ve',
    titulo: 'Wire Flow VE - Instaladores',
    descripcion: 'Aplicación móvil para técnicos de estaciones de carga eléctrica. Permite registrar revisiones, checklists de seguridad y avances de obra en campo.',
    estado: 'En prueba',
    tipoEstado: 'prueba',
    rol: 'Desarrollador Móvil',
    stack: ['Flutter', 'Dart', 'SQLite'],
    repo: 'https://github.com/ElTapiaGit/Wire-Flow-VE-electrolineras.git',
    arquitectura: 'Clean Architecture / SQLite',
    imagen: '/asset/images/banner-wireflowve.webp',
    categoria: 'Móvil',
    problem: 'Dificultad de los instaladores para documentar checklists técnicos, mediciones y protocolos de seguridad de forma estandarizada en terreno.',
    architecture: 'Clean Architecture con persistencia relacional local en SQLite para trabajar sin dependencia de señal continua.',
    keyHighlights: [
      'Flujo secuencial de validación técnica paso a paso antes de autorizar la energización.',
      'Registro fotográfico de evidencias técnicas vinculado a cada orden de trabajo.',
      'Guardado transaccional por etapas para prevenir pérdida de reportes en campo.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/Wire-Flow-VE-electrolineras.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'reto-chat',
    titulo: 'Plataforma de Chat para Introvertidos',
    descripcion: 'Aplicación web de mensajería en tiempo real con dinámicas de conversación estructuradas para facilitar la interacción paso a paso.',
    estado: 'En desarrollo',
    tipoEstado: 'desarrollo',
    rol: 'Desarrollador Web',
    stack: ['HTML', 'Node.js', 'PostgreSQL', 'WebSockets'],
    repo: 'https://github.com/ElTapiaGit/RetoChat.git',
    arquitectura: 'Event-Driven / WebSockets',
    imagen: '/asset/images/proyect-chat.webp',
    categoria: 'Web',
    problem: 'Abandono frecuente en salas de chat abiertas debido a la dificultad para iniciar o mantener conversaciones sin disparadores guiados.',
    architecture: 'Servidor en Node.js con comunicación bidireccional vía WebSockets y base de datos relacional PostgreSQL.',
    keyHighlights: [
      'Comunicación en tiempo real con WebSockets para mensajería instantánea y presencia.',
      'Salas con dinámicas de conversación estructuradas y temporizadores de interacción.',
      'Persistencia de sesiones, perfiles y registros de actividad en PostgreSQL.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/RetoChat.git',
      playstore: null,
      live: null
    }
  }
]

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

/* ── Clases de Estado Adaptables ── */
function obtenerClasesEstado(tipo) {
  switch (tipo) {
    case 'terminado': return 'badge-estado-terminado'
    case 'prueba': return 'badge-estado-prueba'
    case 'desarrollo': return 'badge-estado-desarrollo'
    default: return 'badge-estado-default'
  }
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

function onKeydown(e) {
  if (e.key === 'Escape' && proyectoSeleccionado.value) {
    cerrarCasoEstudio()
  }
}

let observer = null

onMounted(() => {
  window.addEventListener('keydown', onKeydown)

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
  window.removeEventListener('keydown', onKeydown)
  if (observer) observer.disconnect()
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
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
        <div
          v-for="(proyecto, idx) in proyectosFiltrados"
          :key="proyecto.id || idx"
          class="proyecto-card group relative w-full h-[480px] md:h-[520px] bg-dark-800 border border-dark-400 rounded-xl overflow-hidden"
        >
          <img
            :src="proyecto.imagen"
            :alt="proyecto.titulo"
            loading="lazy"
            decoding="async"
            width="600"
            height="400"
            class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />

          <!-- Panel de Información -->
          <div
            class="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:translate-y-[calc(100%-180px)] md:group-hover:translate-y-0 transition-transform duration-500 ease-out"
            style="background: linear-gradient(to top, var(--color-dark) 0%, color-mix(in srgb, var(--color-dark) 92%, transparent) 55%, transparent 100%);"
          >
            <div class="flex items-center justify-between gap-2 mb-2 sm:mb-3">
              <span
                class="text-xs font-mono px-2 py-0.5 rounded border transition-colors"
                :class="obtenerClasesEstado(proyecto.tipoEstado)"
              >
                {{ proyecto.estado }}
              </span>
              <span
                v-if="proyecto.categoria"
                class="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-700 border border-dark-400 text-text-base"
              >
                {{ proyecto.categoria }}
              </span>
            </div>

            <h3 class="text-lg font-bold leading-snug mb-1 text-text-bright">
              {{ proyecto.titulo }}
            </h3>
            <p class="text-xs leading-relaxed mb-3 line-clamp-2 text-text-base">
              {{ proyecto.descripcion }}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
              <span
                v-for="tech in proyecto.stack"
                :key="tech"
                class="px-2 py-0.5 text-xs font-mono rounded border border-dark-400 bg-dark-700 text-text-base"
              >
                {{ tech }}
              </span>
            </div>

            <div class="flex flex-col gap-2 border-t border-dark-400 pt-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div class="text-xs font-mono tracking-widest mb-0.5 text-text-muted">ARQUITECTURA</div>
                  <div class="text-xs font-semibold truncate text-primary">{{ proyecto.arquitectura }}</div>
                </div>
                <div>
                  <div class="text-xs font-mono tracking-widest mb-0.5 text-text-muted">ROL</div>
                  <div class="text-xs font-semibold text-text-bright">{{ proyecto.rol }}</div>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <button
                  type="button"
                  @click="abrirCasoEstudio(proyecto)"
                  class="btn-card-study relative z-40 inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded transition-all cursor-pointer font-medium"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.164 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Caso de Estudio
                </button>

                <a
                  :href="proyecto.repo"
                  target="_blank"
                  rel="noopener"
                  class="btn-card-repo relative z-40 inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded transition-all w-fit font-medium"
                >
                  Repositorio
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
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
    <Transition name="modal-fade">
      <div
        v-if="proyectoSeleccionado"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop"
        @click.self="cerrarCasoEstudio"
      >
        <div
          class="modal-card relative w-[92%] sm:w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden modal-dialog"
          role="dialog"
          aria-modal="true"
        >
          <!-- Cabecera -->
          <div class="modal-header p-4 sm:p-5 border-b shrink-0 flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="text-xs font-mono px-2 py-0.5 rounded border" :class="obtenerClasesEstado(proyectoSeleccionado.tipoEstado)">
                  {{ proyectoSeleccionado.estado }}
                </span>
                <span class="modal-pill text-xs font-mono px-2 py-0.5 rounded border">
                  {{ proyectoSeleccionado.categoria }}
                </span>
                <span v-if="proyectoSeleccionado.links?.playstore" class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold">
                  Google Play Store
                </span>
              </div>
              <h3 class="modal-title text-lg sm:text-xl font-bold leading-tight">
                {{ proyectoSeleccionado.titulo }}
              </h3>
              <p class="modal-subtitle text-xs font-mono mt-1">
                {{ proyectoSeleccionado.rol }} · {{ proyectoSeleccionado.arquitectura }}
              </p>
            </div>
            <button 
              type="button"
              @click="cerrarCasoEstudio" 
              aria-label="Cerrar modal"
              class="modal-close-btn p-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-3 sm:ml-4"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Cuerpo -->
          <div class="modal-body p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 modal-scroll">
            <div>
              <h4 class="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-1.5 font-bold">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                El Reto de Negocio
              </h4>
              <p class="modal-text text-xs sm:text-sm leading-relaxed">
                {{ proyectoSeleccionado.problem }}
              </p>
            </div>

            <div class="modal-box rounded-xl p-3.5 sm:p-4 border">
              <h4 class="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-1 font-bold">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Arquitectura
              </h4>
              <p class="modal-title text-xs sm:text-sm font-semibold">
                {{ proyectoSeleccionado.architecture }}
              </p>
            </div>

            <div>
              <h4 class="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-2 font-bold">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Desafíos Técnicos Resueltos
              </h4>
              <ul class="space-y-1.5 sm:space-y-2">
                <li
                  v-for="(highlight, i) in proyectoSeleccionado.keyHighlights"
                  :key="i"
                  class="modal-text flex items-start gap-2 text-xs sm:text-sm leading-relaxed"
                >
                  <svg class="w-3.5 h-3.5 text-primary mt-0.5 select-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ highlight }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="modal-subtitle text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
                Stack Tecnológico
              </h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in proyectoSeleccionado.stack"
                  :key="tech"
                  class="modal-pill px-2.5 py-1 text-xs font-mono rounded-md border"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>

          <!-- Pie -->
          <div class="modal-footer p-3 sm:p-4 px-4 sm:px-6 border-t shrink-0 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <a v-if="proyectoSeleccionado.repo" :href="proyectoSeleccionado.repo" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors">
                Ver Repositorio
              </a>
              <a v-if="proyectoSeleccionado.links?.playstore" :href="proyectoSeleccionado.links.playstore" target="_blank" rel="noopener" class="modal-secondary-btn inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors">
                Google Play
              </a>
            </div>
            <button type="button" @click="cerrarCasoEstudio" class="modal-subtitle hover:text-primary text-xs font-mono px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors ml-auto sm:ml-0">
              Cerrar [ESC]
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* ── Transición del Modal ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-dialog {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  opacity: 0;
  transform: scale(0.97) translateY(8px);
}

/* ── Modal adaptativo usando tokens de style.css ── */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
}
:root.light .modal-backdrop {
  background-color: rgba(15, 23, 42, 0.45);
}

.modal-card {
  background-color: var(--color-dark-800);
  border: 1px solid var(--color-dark-400);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
}
.modal-header,
.modal-footer {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
}
.modal-body {
  background-color: var(--color-dark-800);
}
.modal-title {
  color: var(--text-bright);
}
.modal-subtitle {
  color: var(--text-muted);
}
.modal-text {
  color: var(--text-base);
}
.modal-box,
.modal-pill {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-base);
}
.modal-close-btn,
.modal-secondary-btn {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-muted);
}
.modal-close-btn:hover,
.modal-secondary-btn:hover {
  background-color: var(--color-dark-600);
  color: var(--text-bright);
}

/* ── Scrollbars ── */
.modal-scroll::-webkit-scrollbar {
  width: 6px;
}
.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.modal-scroll::-webkit-scrollbar-thumb {
  background: var(--color-dark-400);
  border-radius: 4px;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ── Tarjetas de Proyectos ── */
.proyecto-card {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.proyecto-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  border-color: var(--color-primary);
}
:root.light .proyecto-card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
}
:root.light .proyecto-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

/* ── Botones de la Tarjeta ── */
.btn-card-study {
  background-color: var(--color-primary-dim);
  border: 1px solid rgba(37, 99, 235, 0.35);
  color: var(--color-primary);
}
.btn-card-study:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #FFFFFF !important;
}

.btn-card-repo {
  background-color: var(--color-dark-700);
  border: 1px solid var(--color-dark-400);
  color: var(--text-muted);
}
.btn-card-repo:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #FFFFFF !important;
}

/* ── Badges de Estado (WCAG AAA Mate) ── */
.badge-estado-terminado {
  background-color: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
}
.badge-estado-prueba {
  background-color: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3B82F6;
}
.badge-estado-desarrollo {
  background-color: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #F59E0B;
}
.badge-estado-default {
  background-color: rgba(100, 116, 139, 0.12);
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: var(--text-muted);
}
</style>