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
  <article
    class="proyecto-card group flex flex-col w-full rounded-md border border-dark-400 overflow-hidden transition-[border-color,box-shadow] duration-300"
  >
    <!-- ZONA SUPERIOR — Ventana de Imagen 100% Limpia (Sin degradados ni neblina) -->
    <div class="relative w-full aspect-[16/10] overflow-hidden border-b border-dark-400 bg-dark-900 shrink-0">
      <img
        :src="proyecto.imagen"
        :alt="proyecto.titulo"
        loading="eager"
        decoding="async"
        width="600"
        height="375"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      <!-- Etiquetas Flotantes de Alto Contraste -->
      <!-- Esquina Superior Izquierda: Categoría -->
      <div class="absolute top-3 left-3 z-10 pointer-events-none">
        <span
          v-if="proyecto.categoria"
          class="card-badge-category font-mono text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded border shadow-sm"
        >
          {{ proyecto.categoria }}
        </span>
      </div>

      <!-- Esquina Superior Derecha: Estado -->
      <div class="absolute top-3 right-3 z-10 pointer-events-none">
        <span
          class="font-mono text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded border shadow-sm"
          :class="obtenerClasesEstado(proyecto.tipoEstado)"
        >
          {{ proyecto.estado }}
        </span>
      </div>
    </div>

    <!-- ZONA INFERIOR — Ficha Técnica Siempre Visible -->
    <div class="card-technical-sheet p-5 sm:p-6 flex flex-col justify-between flex-1">
      <div>
        <!-- 1. Metadato: Rol & Arquitectura -->
        <div class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary font-semibold mb-2">
          <span>{{ proyecto.rol }}</span>
          <span class="text-dark-400">·</span>
          <span class="truncate">{{ proyecto.arquitectura }}</span>
        </div>

        <!-- 2. Título del Proyecto -->
        <h3 class="text-xl sm:text-2xl font-sans font-bold text-text-bright transition-colors duration-200 group-hover:text-primary leading-tight">
          {{ proyecto.titulo }}
        </h3>

        <!-- 3. Resumen / Descripción -->
        <p class="mt-3 text-sm leading-relaxed text-text-base line-clamp-2 sm:line-clamp-3">
          {{ proyecto.descripcion }}
        </p>

        <!-- 4. Stack Tecnológico -->
        <div class="flex flex-wrap gap-1.5 mt-4">
          <span
            v-for="tech in proyecto.stack"
            :key="tech"
            class="card-tech-chip px-2.5 py-1 text-xs font-mono rounded border border-dark-400 text-text-base"
          >
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- 5. Pie de Acción de la Tarjeta -->
      <div class="mt-6 pt-4 border-t border-dark-400 flex items-center justify-between gap-3">
        <!-- Botón Caso de Estudio -->
        <button
          type="button"
          @click="emit('abrir-caso', proyecto)"
          class="group/btn inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer py-1"
        >
          <span>Caso de Estudio</span>
          <svg
            class="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <!-- Enlaces Externos -->
        <div class="flex items-center gap-2">
          <a
            v-if="proyecto.repo || proyecto.links?.github"
            :href="proyecto.repo || proyecto.links?.github"
            target="_blank"
            rel="noopener"
            aria-label="Ver código fuente en GitHub"
            title="Ver código fuente en GitHub"
            class="card-action-icon p-2 rounded border border-dark-400 text-text-muted hover:text-text-bright hover:border-primary transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <a
            v-if="proyecto.links?.playstore"
            :href="proyecto.links.playstore"
            target="_blank"
            rel="noopener"
            aria-label="Ver en Google Play Store"
            title="Ver en Google Play Store"
            class="card-action-icon p-2 rounded border border-dark-400 text-text-muted hover:text-emerald-500 hover:border-emerald-500 transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a1.95 1.95 0 01-.61-.95V2.764c0-.36.195-.71.609-.95zm11.23 11.233l2.25 2.25-11.455 6.55 9.205-8.8zm0-2.094l-9.205-8.8 11.455 6.55-2.25 2.25zm1.488 1.047l3.65 2.086c.92.525.92 1.385 0 1.91l-3.65 2.086-2.585-2.586 2.585-2.586z"/>
            </svg>
          </a>

          <a
            v-if="proyecto.links?.live"
            :href="proyecto.links.live"
            target="_blank"
            rel="noopener"
            aria-label="Ver demo en vivo"
            title="Ver demo en vivo"
            class="card-action-icon p-2 rounded border border-dark-400 text-text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ── Tarjetas de Proyectos ── */
.proyecto-card {
  background-color: var(--color-dark-800);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
}
.proyecto-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.6);
}

:global(.light) .proyecto-card {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.07);
}
:global(.light) .proyecto-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 20px 35px -10px rgba(37, 99, 235, 0.12);
}

/* ── Ficha Técnica ── */
.card-technical-sheet {
  background-color: var(--color-dark-800);
}
:global(.light) .card-technical-sheet {
  background-color: #FFFFFF;
}

/* ── Chips Tecnológicos ── */
.card-tech-chip {
  background-color: var(--color-dark-700);
}
:global(.light) .card-tech-chip {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  color: #334155;
}

/* ── Iconos de Acción ── */
.card-action-icon {
  background-color: var(--color-dark-700);
}
:global(.light) .card-action-icon {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #64748B;
}

/* ── Badge de Categoría ── */
.card-badge-category {
  background-color: var(--color-dark);
  border-color: var(--color-dark-400);
  color: var(--text-bright);
}
:global(.light) .card-badge-category {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  color: #0F172A;
}

/* ── Badges de Estado (Alto Contraste y Nitidez) ── */
.badge-estado-terminado {
  background-color: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.45);
  color: #34D399;
}
.badge-estado-prueba {
  background-color: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.45);
  color: #60A5FA;
}
.badge-estado-desarrollo {
  background-color: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #FBBF24;
}
.badge-estado-default {
  background-color: rgba(100, 116, 139, 0.2);
  border: 1px solid rgba(100, 116, 139, 0.45);
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
