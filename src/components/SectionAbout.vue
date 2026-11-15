<script setup>
import { ref } from 'vue'
import { dbData, filosofias, pestanas, capacidades } from '../data/profile.js'

/* ── Estado ── */
const pestanaActiva = ref('ingenieria')
</script>

<template>
  <section
    id="sobre-mi"
    class="relative w-full bg-dark overflow-hidden transition-colors scroll-mt-4 md:scroll-mt-6 py-10 md:py-16"
    aria-label="Sección — Sobre Mí"
  >
    <!-- Contenedor con alineación exacta -->
    <div class="relative z-10 w-full max-w-6xl md:max-w-7xl mx-auto pl-10 pr-5 sm:px-8 lg:px-8">

      <!-- Encabezado de Sección -->
      <div class="mb-12 md:mb-16">
        <span class="status-badge mb-4">Perfil Profesional</span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-text-bright">
          Sobre Mí
        </h2>
        <p class="mt-3 font-mono text-sm max-w-xl text-text-muted">
          Ingeniería de sistemas aplicada a soluciones digitales de impacto real
        </p>
      </div>

      <!-- Grid Principal -->
      <div class="grid grid-cols-1 md:grid-cols-[35fr_65fr] lg:grid-cols-[40fr_60fr] gap-12 lg:gap-16 items-start w-full">

        <!-- Columna 1: Perfil y Rol -->
        <div class="flex flex-col gap-8">
          <div>
            <div class="text-xs font-mono tracking-widest mb-2 text-text-muted">DESARROLLADOR</div>
            <h3 class="text-2xl font-bold leading-tight text-text-bright">Jhon Eligio Tapia Vargas</h3>
            <p class="mt-2 text-sm font-mono text-primary">Ingeniero de Sistemas</p>
            <p class="mt-6 text-sm leading-relaxed text-text-base">
              Especializado en la construcción de infraestructura digital sólida y aplicaciones de alto rendimiento. Fundo mi trabajo en principios de arquitectura de software para transformar lógica compleja en productos escalables y mantenibles.
            </p>
          </div>
        </div>

        <!-- Columna 2: Ficha Técnica -->
        <div class="border border-dark-400 rounded-xl overflow-hidden bg-dark-800 min-w-0 w-full">
          
          <!-- Pestañas (con overflow-y-hidden y no-scrollbar corregido) -->
          <div class="flex overflow-x-auto overflow-y-hidden border-b border-dark-400 bg-dark-700 no-scrollbar">
            <button
              v-for="p in pestanas"
              :key="p.id"
              type="button"
              @click="pestanaActiva = p.id"
              class="tab-btn px-4 py-3 text-xs font-mono tracking-wide transition-all border-b-2 -mb-px shrink-0 cursor-pointer"
              :class="pestanaActiva === p.id ? 'tab-btn-active' : 'tab-btn-inactive'"
            >
              {{ p.etiqueta }}
            </button>
          </div>

          <!-- Contenido con Transición Nativa de Vue -->
          <div class="p-6 min-h-[260px]">
            <Transition name="tab-fade" mode="out-in">
              
              <!-- 01. Ingeniería -->
              <div v-if="pestanaActiva === 'ingenieria'" key="ingenieria" class="flex flex-col gap-4">
                <div class="text-xs font-mono tracking-widest mb-2 text-text-muted">CAPACIDADES TÉCNICAS</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="cap in capacidades"
                    :key="cap"
                    class="flex items-center gap-2 p-3 rounded-lg border border-dark-400 text-sm text-text-base"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-primary"></span>
                    {{ cap }}
                  </div>
                </div>
                <div class="mt-2 p-4 rounded-lg border border-dark-400 font-mono text-xs bg-dark-700/50 text-text-muted">
                  <span class="font-bold text-primary">stack</span> = [ Flutter, Vue 3, Node.js, Express, PostgreSQL, MongoDB, PHP, Laravel ]
                </div>
              </div>

              <!-- 02. Formación Académica -->
              <div v-else-if="pestanaActiva === 'formacion'" key="formacion" class="flex flex-col gap-3">
                <div class="text-xs font-mono tracking-widest mb-2 text-text-muted">{{ dbData.consulta }}</div>
                <pre class="rounded-lg p-4 text-xs md:text-sm leading-relaxed font-mono overflow-x-auto border border-dark-400 bg-dark-800 text-text-base"><span class="text-accent">{</span>
    <span class="text-primary font-semibold">"institucion"</span>: <span class="font-medium text-text-bright">"{{ dbData.resultado.institucion }}"</span>,
    <span class="text-primary font-semibold">"titulo"</span>: <span class="font-medium text-text-bright">"{{ dbData.resultado.titulo }}"</span>,
    <span class="text-primary font-semibold">"estado"</span>: <span class="font-semibold text-emerald-500">"{{ dbData.resultado.estado }}"</span>,
    <span class="text-primary font-semibold">"ubicacion"</span>: <span class="font-medium text-text-bright">"{{ dbData.resultado.ubicacion }}"</span>,
    <span class="text-primary font-semibold">"enfoque"</span>: <span class="font-medium text-text-bright">"{{ dbData.resultado.enfoque }}"</span>
<span class="text-accent">}</span></pre>
              </div>

              <!-- 03. Filosofía -->
              <div v-else-if="pestanaActiva === 'filosofia'" key="filosofia" class="flex flex-col gap-3">
                <div class="text-xs font-mono tracking-widest mb-2 text-text-muted">FUNDAMENTOS DE DESARROLLO</div>
                <ul class="flex flex-col gap-3">
                  <li
                    v-for="(f, i) in filosofias"
                    :key="i"
                    class="flex items-start gap-3 text-sm leading-relaxed p-3 rounded-lg border border-dark-400 bg-dark-700/30 text-text-base"
                  >
                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-primary"></span>
                    {{ f }}
                  </li>
                </ul>
              </div>

            </Transition>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* Ocultar scrollbar preservando funcionalidad táctil */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transición de cambio de pestaña */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Estilos de botones de pestañas usando tokens globales */
.tab-btn-inactive {
  color: var(--text-muted);
  border-bottom-color: transparent;
  background-color: transparent;
}
.tab-btn-inactive:hover {
  color: var(--text-bright);
}
.tab-btn-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background-color: var(--color-primary-dim);
  font-weight: 600;
}
</style>