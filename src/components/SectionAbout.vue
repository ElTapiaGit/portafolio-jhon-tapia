<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

/* ── Estado ─── */
const pestanaActiva = ref('ingenieria')
const contenidoRef = ref(null)

/* ── Datos Profesionales ── */
const dbData = {
  consulta: 'SELECT * FROM educacion WHERE estado = activo',
  resultado: {
    institucion: 'Universidad Latinoamericana',
    titulo: 'Ingeniería de Sistemas',
    estado: 'Egresado',
    ubicacion: 'Cochabamba, BO',
    enfoque: 'Desarrollo Full Stack',
  },
}

const filosofias = [
  'Arquitectura Limpia como pilar de diseño de sistemas',
  'Rendimiento sobre complejidad innecesaria',
  'Código mantenible y escalable por defecto',
  'Desarrollo orientado al producto y al usuario final',
  'Integración continua y entrega iterativa de valor',
]

const pestanas = [
  { id: 'ingenieria',  etiqueta: '01. Ingeniería' },
  { id: 'formacion',   etiqueta: '02. Formación Académica' },
  { id: 'filosofia',   etiqueta: '03. Filosofía' },
]

/* ── Cambio de Pestaña con Fade GSAP ── */
function cambiarPestana(id) {
  if (pestanaActiva.value === id) return
  gsap.to(contenidoRef.value, {
    opacity: 0,
    y: 6,
    duration: 0.15,
    ease: 'power2.in',
    onComplete: () => {
      pestanaActiva.value = id
      gsap.fromTo(contenidoRef.value,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
      )
    }
  })
}
</script>

<template>
  <section id="sobre-mi" class="relative w-full bg-dark overflow-hidden transition-colors" aria-label="Sección — Sobre Mí">
    <div class="absolute inset-0 bg-grid pointer-events-none opacity-20" />

    <div class="section-container relative z-10">

      <div class="mb-12 md:mb-16">
        <span class="status-badge mb-4">Perfil Profesional</span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4" style="color: var(--text-bright);">
          Sobre Mí
        </h2>
        <p class="mt-3 font-mono text-sm max-w-xl" style="color: var(--text-muted);">
          Ingeniería de sistemas aplicada a soluciones digitales de impacto real
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[35fr_65fr] lg:grid-cols-[40fr_60fr] gap-12 lg:gap-16 items-start w-full">

        <div class="flex flex-col gap-8">
          <div>
            <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">DESARROLLADOR</div>
            <h3 class="text-2xl font-bold leading-tight" style="color: var(--text-bright);">Jhon Eligio Tapia Vargas</h3>
            <p class="mt-2 text-sm font-mono" style="color: var(--color-primary);">Ingeniero de Sistemas</p>
            <p class="mt-6 text-sm leading-relaxed" style="color: var(--text-base);">
              Especializado en la construcción de infraestructura digital sólida y aplicaciones de alto rendimiento. Fundo mi trabajo en principios de arquitectura de software para transformar lógica compleja en productos escalables y mantenibles.
            </p>
          </div>
        </div>

        <div class="border border-dark-400 rounded-xl overflow-hidden bg-dark-800 min-w-0 w-full">
          <div class="flex overflow-x-auto border-b border-slate-400 bg-dark-700 no-scrollbar">
            <button
              v-for="p in pestanas"
              :key="p.id"
              @click="cambiarPestana(p.id)"
              class="px-4 py-3 text-xs font-mono tracking-wide transition-all border-b-2 -mb-px shrink-0"
              :style="{
                color: pestanaActiva === p.id ? 'var(--color-primary)' : 'var(--text-muted)',
                borderBottomColor: pestanaActiva === p.id ? 'var(--color-primary)' : 'transparent',
                background: pestanaActiva === p.id ? 'var(--color-primary-dim)' : 'transparent',
              }"
            >
              {{ p.etiqueta }}
            </button>
          </div>

          <div ref="contenidoRef" class="p-6 min-h-[260px]">

            <div v-if="pestanaActiva === 'ingenieria'" class="flex flex-col gap-4">
              <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">CAPACIDADES TÉCNICAS</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="cap in ['Desarrollo Full Stack', 'Apps Móviles Flutter', 'APIs RESTful', 'Sistemas POS', 'Arquitectura Limpia', 'Bases de Datos SQL/NoSQL']" :key="cap"
                     class="flex items-center gap-2 p-3 rounded-lg border border-dark-400 text-sm" style="color: var(--text-base);">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: var(--color-primary);"></span>
                  {{ cap }}
                </div>
              </div>
              <div class="mt-2 p-4 rounded-lg border border-dark-400 font-mono text-xs bg-dark-700/50" style="color: var(--text-muted);">
                <span class="font-bold" style="color: var(--color-primary);">stack</span> = [ Flutter, Vue 3, Node.js, Express, PostgreSQL, MongoDB, PHP, Laravel ]
              </div>
            </div>

            <div v-if="pestanaActiva === 'formacion'" class="flex flex-col gap-3">
              <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">{{ dbData.consulta }}</div>
              <pre class="rounded-lg p-4 text-xs md:text-sm leading-relaxed font-mono overflow-x-auto border border-dark-400 bg-dark-800"
                   style="background: var(--color-dark-800); color: var(--text-base);">
  <span style="color: var(--color-accent);">{</span>
      <span class="text-primary font-semibold">"institucion"</span>: <span class="font-medium" style="color: var(--text-bright);">"{{ dbData.resultado.institucion }}"</span>,
      <span class="text-primary font-semibold">"titulo"</span>: <span class="font-medium" style="color: var(--text-bright);">"{{ dbData.resultado.titulo }}"</span>,
      <span class="text-primary font-semibold">"estado"</span>: <span class="font-semibold text-emerald-500">"{{ dbData.resultado.estado }}"</span>,
      <span class="text-primary font-semibold">"ubicacion"</span>: <span class="font-medium" style="color: var(--text-bright);">"{{ dbData.resultado.ubicacion }}"</span>,
      <span class="text-primary font-semibold">"enfoque"</span>: <span class="font-medium" style="color: var(--text-bright);">"{{ dbData.resultado.enfoque }}"</span>
  <span style="color: var(--color-accent);">}</span>
              </pre>
            </div>

            <div v-if="pestanaActiva === 'filosofia'" class="flex flex-col gap-3">
              <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">FUNDAMENTOS DE DESARROLLO</div>
              <ul class="flex flex-col gap-3">
                <li
                  v-for="(f, i) in filosofias"
                  :key="i"
                  class="flex items-start gap-3 text-sm leading-relaxed p-3 rounded-lg border border-dark-400 bg-dark-700/30"
                  style="color: var(--text-base);"
                >
                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style="background: var(--color-primary);"></span>
                  {{ f }}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>