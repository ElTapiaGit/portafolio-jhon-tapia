<script setup>
import { obtenerClasesEstado } from '../../data/projects.js'

defineProps({
  proyecto: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['abrir-caso'])
</script>

<template>
  <div
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
            @click="emit('abrir-caso', proyecto)"
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
</template>

<style scoped>
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
