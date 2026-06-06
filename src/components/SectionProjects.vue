<script setup>
import { ref, computed } from 'vue'

/* ── Estado Reactivo ── */
const mostrarTodos = ref(false)

const proyectos = [
  {
    titulo: 'Sistema Inventario Institucional - ULAT',
    descripcion: 'Plataforma web certificada para la gestión integral de activos, infraestructura multisede, bitácoras de mantenimiento y control estricto de roles.',
    estado: 'Implementado y Certificado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Full Stack',
    stack: ['Laravel', 'MySQL', 'Bootstrap', 'Blade'],
    repo: '#',
    arquitectura: 'MVC / RBAC Security',
    imagen: '/asset/images/banner-ulat.webp' 
  },
  {
    titulo: 'CosechApp - Control Agrónomo',
    descripcion: 'Plataforma multiplataforma offline-first para gestión de cosechas. Implementa sincronización híbrida (Supabase/Hive), reportes estadísticos dinámicos y generación de Excel en dispositivo.',
    estado: 'Finalizado',
    tipoEstado: 'terminado',
    rol: 'Arquitecto y Desarrollador Flutter',
    stack: ['Flutter', 'Supabase', 'Hive', 'GoRouter'],
    repo: '#', 
    arquitectura: 'MVVM / Clean Architecture',
    imagen: '/asset/images/banner-cosechapp.webp'
  },
  {
    titulo: 'Finance Local - Finanzas Personales',
    descripcion: 'App offline-first para control financiero personal con privacidad total. Sin servidores externos, datos 100% locales.',
    estado: 'Google Play Store',
    tipoEstado: 'terminado',
    rol: 'Full Stack Mobile',
    stack: ['Flutter', 'Dart', 'Hive'],
    repo: 'https://github.com/ElTapiaGit/finance-local-app.git',
    arquitectura: 'Clean Architecture / Hive',
    imagen: '/asset/images/proyect-finance.webp'
  },
  {
    titulo: 'Wire Flow VE - Instaladores',
    descripcion: 'App móvil para técnicos de estaciones de carga EV. Gestión de instalaciones, seguimiento de estados y registro de trabajos en campo.',
    estado: 'En prueba cerrada',
    tipoEstado: 'prueba',
    rol: 'Desarrollador Móvil',
    stack: ['Flutter', 'Dart', 'SQLite'],
    repo: '#',
    arquitectura: 'Clean Architecture / SQLite',
    imagen: '/asset/images/banner-wireflowve.webp'
  },
  {
    titulo: 'Plataforma de Chat para Introvertidos',
    descripcion: 'Chat en tiempo real gamificado con desafíos de interacción social diseñados para personas introvertidas.',
    estado: 'En desarrollo',
    tipoEstado: 'desarrollo',
    rol: 'Desarrollador Web',
    stack: ['HTML', 'Node.js', 'PostgreSQL', 'WebSockets'],
    repo: 'https://github.com/ElTapiaGit/RetoChat.git',
    arquitectura: 'Event-Driven / WebSockets',
    imagen: '/asset/images/proyect-chat.webp'
  }
]

/* ── Lógica Progresiva ─── */
const proyectosVisibles = computed(() => {
  // Muestra 4 proyectos por defecto. Si 'mostrarTodos' es true, muestra el arreglo completo.
  return mostrarTodos.value ? proyectos : proyectos.slice(0, 4)
})

function toggleProyectos() {
  mostrarTodos.value = !mostrarTodos.value
}

/* ── Funciones color de estados ─── */
function obtenerClasesEstado(tipo) {
  switch (tipo) {
    case 'terminado':
      return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
    case 'prueba':
      return 'bg-blue-500/15 text-blue-600 border-blue-500/30'
    case 'desarrollo':
      return 'bg-amber-500/15 text-amber-600 border-amber-500/30'
    default:
      return 'bg-slate-500/15 text-slate-600 border-slate-500/30'
  }
}
</script>

<template>
  <section id="proyectos"
    class="relative bg-dark text-white py-16 md:py-20 w-full"
    aria-label="Sección — Proyectos"
  >
    <div class="absolute inset-0 bg-grid pointer-events-none opacity-15" />

    <div class="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-8">

      <div class="mb-12 w-full">
        <span class="status-badge mb-3">Portafolio</span>
        <h2 class="text-3xl lg:text-4xl font-bold mt-3" style="color: var(--text-bright);">Proyectos</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
        
        <div
          v-for="(proyecto, idx) in proyectosVisibles"
          :key="idx"
          class="proyecto-card group relative w-full h-[480px] md:h-[520px] bg-dark-800 border border-dark-400 rounded-xl overflow-hidden shadow-xl"
        >
          <img
            :src="proyecto.imagen"
            :alt="proyecto.titulo"
            class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />

          <div
            class="absolute inset-0 flex flex-col justify-end p-6 md:translate-y-[calc(100%-180px)] md:group-hover:translate-y-0 transition-transform duration-500 ease-out"
            style="background: linear-gradient(to top, var(--color-dark) 0%, color-mix(in srgb, var(--color-dark) 90%, transparent) 50%, transparent 100%);"
          >
            <!-- revisar los colores de estado del proyecto dinamico -->
            <div class="flex items-center gap-2 mb-3">
              <span
                class="text-xs font-mono px-2 py-0.5 rounded border transition-colors"
                :class="obtenerClasesEstado(proyecto.tipoEstado)"
              >
                {{ proyecto.estado }}
              </span>
            </div>

            <h3 class="text-lg font-bold leading-snug mb-1" style="color: var(--text-bright);">
              {{ proyecto.titulo }}
            </h3>
            <p class="text-xs leading-relaxed mb-3 line-clamp-2" style="color: var(--text-base);">
              {{ proyecto.descripcion }}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              <!--agregar efectos a los stack tecnoligicos del proyectos -->
              <span
                v-for="tech in proyecto.stack"
                :key="tech"
                class="px-2 py-0.5 text-xs font-mono rounded border border-dark-400 bg-dark-700/80"
                style="color: var(--text-base);"
              >
                {{ tech }}
              </span>
            </div>

            <div class="flex flex-col gap-2 border-t border-dark-400/80 pt-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div class="text-xs font-mono tracking-widest mb-0.5" style="color: var(--text-muted);">ARQUITECTURA</div>
                  <div class="text-xs font-semibold truncate" style="color: var(--color-primary);">{{ proyecto.arquitectura }}</div>
                </div>
                <div>
                  <div class="text-xs font-mono tracking-widest mb-0.5" style="color: var(--text-muted);">ROL</div>
                  <div class="text-xs font-semibold" style="color: var(--text-bright);">{{ proyecto.rol }}</div>
                </div>
              </div>
              <a
                :href="proyecto.repo"
                target="_blank"
                class="relative z-40 inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-dark-400 hover:border-primary hover:text-primary transition-colors w-fit mt-1"
                style="color: var(--text-base);"
              >
                Ver Repositorio
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>

      <div v-if="proyectos.length > 4" class="mt-14 w-full flex justify-center">
        <button 
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
  </section>
</template>

<style scoped>
/* Las clases de ocultar el scrollbar ya no son necesarias aquí porque usamos Grid */
</style>