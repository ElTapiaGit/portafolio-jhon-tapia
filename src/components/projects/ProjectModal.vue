<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { obtenerClasesEstado } from '../../data/projects.js'
import { useTheme } from '../../composables/useTheme.js'
import { useLenis } from '../../composables/useLenis.js'

const { isDark } = useTheme()
const { stopLenis, startLenis } = useLenis()

const props = defineProps({
  proyecto: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cerrar-caso'])

/* ── Bloqueo de Scroll Inercial con Lenis ── */
watch(() => props.proyecto, (val) => {
  if (val) {
    stopLenis()
  } else {
    startLenis()
  }
}, { immediate: true })

function onKeydown(e) {
  if (e.key === 'Escape' && props.proyecto) {
    emit('cerrar-caso')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  startLenis()
})
</script>

<template>
  <!-- Modal con Soporte Dual Limpio e Inmersivo -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="proyecto"
        class="fixed inset-0 z-[200] overflow-y-auto overscroll-contain p-4 sm:p-6 md:py-12 modal-backdrop"
        :class="isDark ? 'is-dark' : 'is-light'"
        data-lenis-prevent
        @click.self="emit('cerrar-caso')"
      >
      <div
        class="modal-card relative w-[96%] sm:w-full max-w-3xl mx-auto h-fit min-h-min flex flex-col rounded-md border shadow-2xl modal-dialog"
        role="dialog"
        aria-modal="true"
      >
        <!-- Imagen de Cabecera 100% Nítida (Sin degradados ni veladuras) -->
        <div
          v-if="proyecto.imagen"
          class="relative w-full aspect-[21/9] sm:aspect-[2.4/1] overflow-hidden rounded-t-md border-b border-dark-400 bg-dark-900 shrink-0"
        >
          <img
            :src="proyecto.imagen"
            :alt="proyecto.titulo"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Cabecera -->
        <div 
          class="modal-header p-5 sm:p-6 border-b shrink-0 flex items-start justify-between"
          :class="proyecto.imagen ? '' : 'rounded-t-md'"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-xs font-mono px-2 py-0.5 rounded border font-semibold"
                :class="obtenerClasesEstado(proyecto.tipoEstado)"
              >
                {{ proyecto.estado }}
              </span>
              <span
                v-if="proyecto.categoria"
                class="tech-chip text-xs font-mono px-2.5 py-0.5 rounded border font-medium"
              >
                {{ proyecto.categoria }}
              </span>
              <span
                v-if="proyecto.links?.playstore"
                class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold"
              >
                Google Play Store
              </span>
            </div>
            <h3 class="modal-title font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none text-text-bright">
              {{ proyecto.titulo }}
            </h3>
            <p class="modal-subtitle text-xs font-mono">
              {{ proyecto.rol }} · {{ proyecto.arquitectura }}
            </p>
          </div>
          <button 
            type="button"
            @click="emit('cerrar-caso')" 
            aria-label="Cerrar modal"
            class="modal-close-btn p-2 rounded border transition-colors cursor-pointer shrink-0 ml-3 sm:ml-4"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cuerpo del Modal (Flujo libre sin cajas anidadas) -->
        <div class="modal-body p-6 sm:p-8 space-y-7">
          <!-- El Reto de Negocio -->
          <div>
            <h4 class="font-mono text-[11px] font-bold uppercase tracking-[0.14em] modal-subtitle mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>El Reto de Negocio</span>
            </h4>
            <p class="font-sans text-sm sm:text-base leading-relaxed modal-text">
              {{ proyecto.problem }}
            </p>
          </div>

          <!-- Arquitectura de Solución -->
          <div>
            <h4 class="font-mono text-[11px] font-bold uppercase tracking-[0.14em] modal-subtitle mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Arquitectura de Solución</span>
            </h4>
            <p class="font-sans text-sm sm:text-base leading-relaxed modal-text">
              {{ proyecto.architecture }}
            </p>
          </div>

          <!-- Desafíos Técnicos Resueltos -->
          <div>
            <h4 class="font-mono text-[11px] font-bold uppercase tracking-[0.14em] modal-subtitle mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Desafíos Técnicos Resueltos</span>
            </h4>
            <ul class="space-y-2 sm:space-y-2.5">
              <li
                v-for="(highlight, i) in proyecto.keyHighlights"
                :key="i"
                class="flex items-start gap-3 font-sans text-sm sm:text-base leading-relaxed"
              >
                <span class="text-primary font-bold select-none shrink-0 mt-0.5">✓</span>
                <span class="modal-text">{{ highlight }}</span>
              </li>
            </ul>
          </div>

          <!-- Stack Tecnológico -->
          <div>
            <h4 class="font-mono text-[11px] font-bold uppercase tracking-[0.14em] modal-subtitle mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Stack Tecnológico</span>
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in proyecto.stack"
                :key="tech"
                class="tech-chip font-sans font-semibold text-xs px-3 py-1.5 rounded-md border"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pie del Modal -->
        <div class="modal-footer p-4 sm:p-5 px-5 sm:px-7 border-t rounded-b-md shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 flex-wrap">
            <a
              v-if="proyecto.repo || proyecto.links?.github"
              :href="proyecto.repo || proyecto.links?.github"
              target="_blank"
              rel="noopener"
              class="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono uppercase tracking-wider text-xs font-semibold"
            >
              <span>Ver Repositorio</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              v-if="proyecto.links?.playstore"
              :href="proyecto.links.playstore"
              target="_blank"
              rel="noopener"
              class="modal-secondary-btn inline-flex items-center gap-2 px-4 py-2 rounded-md border text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
            >
              <span>Google Play</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              v-if="proyecto.links?.live"
              :href="proyecto.links.live"
              target="_blank"
              rel="noopener"
              class="modal-secondary-btn inline-flex items-center gap-2 px-4 py-2 rounded-md border text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
            >
              <span>Demo en Vivo</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <button
            type="button"
            @click="emit('cerrar-caso')"
            class="modal-subtitle hover:text-primary text-xs font-mono uppercase tracking-wider px-2.5 py-1.5 rounded transition-colors ml-auto sm:ml-0 cursor-pointer"
          >
            Cerrar [ESC]
          </button>
        </div>
      </div>
    </div>
  </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Transición del Modal ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-dialog {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  opacity: 0;
  transform: scale(0.97) translateY(12px);
}

/* ══════════════════════════════════════════════════════════════
   MODO OSCURO (.is-dark) — ALTO CONTRASTE
   ══════════════════════════════════════════════════════════════ */
.is-dark.modal-backdrop {
  background-color: rgba(5, 7, 12, 0.85);
  backdrop-filter: blur(12px);
}
.is-dark .modal-card {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
}
.is-dark .modal-header,
.is-dark .modal-footer {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
}
.is-dark .modal-body {
  background-color: var(--color-dark-800);
}
.is-dark .modal-title {
  color: var(--text-bright);
}
.is-dark .modal-subtitle {
  color: var(--text-muted);
}
.is-dark .modal-text {
  color: var(--text-base);
}
.is-dark .tech-chip {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-bright);
}
.is-dark .modal-close-btn {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-muted);
}
.is-dark .modal-close-btn:hover {
  border-color: #EF4444;
  color: #EF4444;
}
.is-dark .modal-secondary-btn {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-bright);
}
.is-dark .modal-secondary-btn:hover {
  background-color: var(--color-dark-600);
  border-color: var(--color-primary);
  color: #FFFFFF;
}

/* ══════════════════════════════════════════════════════════════
   MODO CLARO (.is-light) — NITIDEZ Y CONTRASTE ABSOLUTO
   ══════════════════════════════════════════════════════════════ */
.is-light.modal-backdrop {
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(14px);
}
.is-light .modal-card {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.25);
}
.is-light .modal-header,
.is-light .modal-footer {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
}
.is-light .modal-body {
  background-color: #FFFFFF;
}
.is-light .modal-title {
  color: #0F172A;
}
.is-light .modal-subtitle {
  color: #64748B;
}
.is-light .modal-text {
  color: #334155;
}
.is-light .tech-chip {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #0F172A;
}
.is-light .modal-close-btn {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  color: #64748B;
}
.is-light .modal-close-btn:hover {
  border-color: #EF4444;
  color: #EF4444;
}
.is-light .modal-secondary-btn {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  color: #0F172A;
}
.is-light .modal-secondary-btn:hover {
  background-color: #F8FAFC;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* ── Badges de Estado (Alto Contraste) ── */
.is-dark .badge-estado-terminado {
  background-color: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34D399;
}
.is-dark .badge-estado-prueba {
  background-color: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60A5FA;
}
.is-dark .badge-estado-desarrollo {
  background-color: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #FBBF24;
}
.is-dark .badge-estado-default {
  background-color: rgba(100, 116, 139, 0.18);
  border: 1px solid rgba(100, 116, 139, 0.4);
  color: var(--text-base);
}

.is-light .badge-estado-terminado {
  background-color: #ECFDF5;
  border: 1px solid #A7F3D0;
  color: #047857;
}
.is-light .badge-estado-prueba {
  background-color: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #1D4ED8;
}
.is-light .badge-estado-desarrollo {
  background-color: #FFFBEB;
  border: 1px solid #FDE68A;
  color: #B45309;
}
.is-light .badge-estado-default {
  background-color: #F8FAFC;
  border: 1px solid #CBD5E1;
  color: #475569;
}
</style>
