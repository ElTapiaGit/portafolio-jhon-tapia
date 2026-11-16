<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { obtenerClasesEstado } from '../../data/projects.js'

const props = defineProps({
  proyecto: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cerrar-caso'])

/* ── Bloqueo de Scroll en el Body al abrir modal ── */
watch(() => props.proyecto, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
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
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- Modal con Soporte Dual Limpio -->
  <Transition name="modal-fade">
    <div
      v-if="proyecto"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop"
      @click.self="emit('cerrar-caso')"
    >
      <div
        class="modal-card relative w-[94%] sm:w-full max-w-2xl max-h-[88vh] flex flex-col rounded-md border border-dark-400 shadow-2xl overflow-hidden modal-dialog"
        role="dialog"
        aria-modal="true"
      >
        <!-- Imagen de Cabecera 100% Nítida (Sin degradados ni veladuras) -->
        <div
          v-if="proyecto.imagen"
          class="relative w-full aspect-[21/9] sm:aspect-[2.4/1] overflow-hidden border-b border-dark-400 bg-dark-900 shrink-0"
        >
          <img
            :src="proyecto.imagen"
            :alt="proyecto.titulo"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Cabecera -->
        <div class="modal-header p-4 sm:p-5 border-b border-dark-400 shrink-0 flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span
                class="text-xs font-mono px-2 py-0.5 rounded border font-semibold"
                :class="obtenerClasesEstado(proyecto.tipoEstado)"
              >
                {{ proyecto.estado }}
              </span>
              <span
                v-if="proyecto.categoria"
                class="modal-pill text-xs font-mono px-2 py-0.5 rounded border"
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
            <h3 class="modal-title text-lg sm:text-xl font-bold leading-tight">
              {{ proyecto.titulo }}
            </h3>
            <p class="modal-subtitle text-xs font-mono mt-1">
              {{ proyecto.rol }} · {{ proyecto.arquitectura }}
            </p>
          </div>
          <button 
            type="button"
            @click="emit('cerrar-caso')" 
            aria-label="Cerrar modal"
            class="modal-close-btn p-2 rounded border border-dark-400 transition-colors cursor-pointer shrink-0 ml-3 sm:ml-4"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cuerpo -->
        <div class="modal-body p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 modal-scroll">
          <!-- Reto de Negocio -->
          <div>
            <h4 class="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-1.5 font-bold">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              El Reto de Negocio
            </h4>
            <p class="modal-text text-xs sm:text-sm leading-relaxed">
              {{ proyecto.problem }}
            </p>
          </div>

          <!-- Arquitectura -->
          <div class="modal-box rounded-md p-3.5 sm:p-4 border border-dark-400">
            <h4 class="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-1 font-bold">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Arquitectura de Solución
            </h4>
            <p class="modal-title text-xs sm:text-sm font-semibold">
              {{ proyecto.architecture }}
            </p>
          </div>

          <!-- Desafíos Técnicos Resueltos -->
          <div>
            <h4 class="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-2 font-bold">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Desafíos Técnicos Resueltos
            </h4>
            <ul class="space-y-1.5 sm:space-y-2">
              <li
                v-for="(highlight, i) in proyecto.keyHighlights"
                :key="i"
                class="modal-text flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed"
              >
                <svg class="w-4 h-4 text-primary mt-0.5 select-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ highlight }}</span>
              </li>
            </ul>
          </div>

          <!-- Stack Tecnológico -->
          <div>
            <h4 class="modal-subtitle text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
              Stack Tecnológico
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tech in proyecto.stack"
                :key="tech"
                class="modal-pill px-2.5 py-1 text-xs font-mono rounded border"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pie -->
        <div class="modal-footer p-3.5 sm:p-4 px-4 sm:px-6 border-t border-dark-400 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 flex-wrap">
            <a
              v-if="proyecto.repo || proyecto.links?.github"
              :href="proyecto.repo || proyecto.links?.github"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
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
              class="modal-secondary-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded border text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
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
              class="modal-secondary-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded border text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
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

/* ── Modal adaptativo ── */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
}
:global(.light) .modal-backdrop {
  background-color: rgba(15, 23, 42, 0.5);
}

.modal-card {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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

/* ── Modo Claro: Nitidez y Contraste Absoluto ── */
:global(.light) .modal-card {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
}
:global(.light) .modal-header,
:global(.light) .modal-footer {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
}
:global(.light) .modal-body {
  background-color: #FFFFFF;
}
:global(.light) .modal-title {
  color: #0F172A;
}
:global(.light) .modal-subtitle {
  color: #64748B;
}
:global(.light) .modal-text {
  color: #334155;
}
:global(.light) .modal-box,
:global(.light) .modal-pill {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #1E293B;
}
:global(.light) .modal-close-btn,
:global(.light) .modal-secondary-btn {
  background-color: #F1F5F9;
  border-color: #CBD5E1;
  color: #334155;
}
:global(.light) .modal-close-btn:hover,
:global(.light) .modal-secondary-btn:hover {
  background-color: #E2E8F0;
  color: #0F172A;
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
:global(.light) .modal-scroll::-webkit-scrollbar-thumb {
  background: #CBD5E1;
}

/* ── Badges de Estado (Alto Contraste) ── */
.badge-estado-terminado {
  background-color: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34D399;
}
.badge-estado-prueba {
  background-color: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60A5FA;
}
.badge-estado-desarrollo {
  background-color: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #FBBF24;
}
.badge-estado-default {
  background-color: rgba(100, 116, 139, 0.18);
  border: 1px solid rgba(100, 116, 139, 0.4);
  color: var(--text-base);
}

:global(.light) .badge-estado-terminado {
  background-color: #ECFDF5;
  border-color: #A7F3D0;
  color: #047857;
}
:global(.light) .badge-estado-prueba {
  background-color: #EFF6FF;
  border-color: #BFDBFE;
  color: #1D4ED8;
}
:global(.light) .badge-estado-desarrollo {
  background-color: #FFFBEB;
  border-color: #FDE68A;
  color: #B45309;
}
:global(.light) .badge-estado-default {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #475569;
}
</style>
