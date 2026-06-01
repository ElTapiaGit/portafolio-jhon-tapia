<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

/* ── Estado ─── */
const isMobile = ref(false)
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

/* ── Deteccion de Dispositivo ─── */
const mobileQuery = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)')
  : null

function handleMediaChange(e) { isMobile.value = e.matches }

onMounted(() => {
  if (mobileQuery) {
    isMobile.value = mobileQuery.matches
    mobileQuery.addEventListener('change', handleMediaChange)
  }
})

onUnmounted(() => {
  if (mobileQuery) mobileQuery.removeEventListener('change', handleMediaChange)
})
</script>

<template>
  <section id="sobre-mi" class="relative w-full bg-dark overflow-hidden" aria-label="Sección — Sobre Mí">
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

      <div v-if="!isMobile" class="grid grid-cols-[35%_65%] lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start">

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

        <div class="border border-slate-800 rounded-xl overflow-hidden bg-dark-800">
          <div class="flex border-b border-slate-800 bg-dark-700">
            <button
              v-for="p in pestanas"
              :key="p.id"
              @click="cambiarPestana(p.id)"
              class="px-4 py-3 text-xs font-mono tracking-wide transition-colors border-b-2 -mb-px"
              :style="{
                color: pestanaActiva === p.id ? 'var(--color-primary)' : 'var(--text-muted)',
                borderBottomColor: pestanaActiva === p.id ? 'var(--color-primary)' : 'transparent',
                background: pestanaActiva === p.id ? 'rgba(37,99,235,0.06)' : 'transparent',
              }"
            >
              {{ p.etiqueta }}
            </button>
          </div>

          <div ref="contenidoRef" class="p-6 min-h-[260px]">

            <div v-if="pestanaActiva === 'ingenieria'" class="flex flex-col gap-4">
              <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">CAPACIDADES TÉCNICAS</div>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="cap in ['Desarrollo Full Stack', 'Apps Móviles Flutter', 'APIs RESTful', 'Sistemas POS', 'Arquitectura Limpia', 'Bases de Datos SQL/NoSQL']" :key="cap"
                     class="flex items-center gap-2 p-3 rounded-lg border border-slate-800 text-sm" style="color: var(--text-base);">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: var(--color-primary);"></span>
                  {{ cap }}
                </div>
              </div>
              <div class="mt-2 p-4 rounded-lg border border-slate-800 font-mono text-xs" style="color: var(--text-muted);">
                <span style="color: var(--color-primary);">stack</span> = [ Flutter, Vue 3, Node.js, Express, PostgreSQL, MongoDB, PHP, Laravel ]
              </div>
            </div>

            <div v-if="pestanaActiva === 'formacion'" class="flex flex-col gap-3">
              <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">{{ dbData.consulta }}</div>
              <pre class="rounded-lg p-4 text-xs leading-relaxed font-mono overflow-x-auto border border-slate-800"
                   style="background: var(--color-dark-800); color: var(--text-base);">
  <span style="color: var(--color-accent);">{</span>
      <span style="color: #93C5FD;">"institucion"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.institucion }}"</span>,
      <span style="color: #93C5FD;">"titulo"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.titulo }}"</span>,
      <span style="color: #93C5FD;">"estado"</span>: <span style="color: #86EFAC;">"{{ dbData.resultado.estado }}"</span>,
      <span style="color: #93C5FD;">"ubicacion"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.ubicacion }}"</span>,
      <span style="color: #93C5FD;">"enfoque"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.enfoque }}"</span>
  <span style="color: var(--color-accent);">}</span>
              </pre>
            </div>

            <div v-if="pestanaActiva === 'filosofia'" class="flex flex-col gap-3">
              <div class="text-xs font-mono tracking-widest mb-2" style="color: var(--text-muted);">FUNDAMENTOS DE DESARROLLO</div>
              <ul class="flex flex-col gap-3">
                <li
                  v-for="(f, i) in filosofias"
                  :key="i"
                  class="flex items-start gap-3 text-sm leading-relaxed p-3 rounded-lg border border-slate-800/50 bg-[#161B2A]/50"
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

      <div v-if="isMobile" class="flex flex-col gap-6">

        <div class="border border-slate-800 rounded-xl p-5 flex flex-col gap-1 bg-dark-800">
          <div class="text-xs font-mono tracking-widest mb-1" style="color: var(--text-muted);">DESARROLLADOR</div>
          <h3 class="text-xl font-bold" style="color: var(--text-bright);">Jhon Eligio Tapia Vargas</h3>
          <p class="text-sm font-mono mt-1" style="color: var(--color-primary);">Ingeniero de Sistemas</p>
          <p class="mt-3 text-sm leading-relaxed" style="color: var(--text-base);">
            Construcción de infraestructura digital sólida y aplicaciones de alto rendimiento, aplicando principios de arquitectura limpia.
          </p>
        </div>

        <div class="border border-slate-800 rounded-xl p-5 bg-dark-800">
          <div class="text-xs font-mono tracking-widest mb-3" style="color: var(--text-muted);">CAPACIDADES TÉCNICAS</div>
          <div class="flex flex-wrap gap-2">
             <span v-for="cap in ['Full Stack', 'Flutter', 'APIs RESTful', 'SQL/NoSQL']" :key="cap" 
                   class="px-3 py-1.5 rounded-md border border-slate-700 text-xs" style="color: var(--text-base);">
               {{ cap }}
             </span>
          </div>
        </div>

        <div class="border border-slate-800 rounded-xl p-5 bg-dark-800">
          <div class="text-xs font-mono tracking-widest mb-4" style="color: var(--text-muted);">FILOSOFÍA DE INGENIERÍA</div>
          <ul class="flex flex-col gap-3">
            <li v-for="(f, i) in filosofias" :key="i" class="flex items-start gap-2 text-sm" style="color: var(--text-base);">
              <span class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style="background: var(--color-primary);"></span>
              {{ f }}
            </li>
          </ul>
        </div>

        <div class="border border-slate-800 rounded-xl p-5 bg-dark-800">
          <div class="text-xs font-mono tracking-widest mb-3" style="color: var(--text-muted);">FORMACIÓN ACADÉMICA</div>
          <pre class="rounded-lg p-4 text-xs leading-relaxed font-mono overflow-x-auto border border-slate-800"
               style="background: var(--color-dark-700); color: var(--text-base);">
<span style="color: var(--color-accent);">{</span>
  <span style="color: #93C5FD;">"institucion"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.institucion }}"</span>,
  <span style="color: #93C5FD;">"titulo"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.titulo }}"</span>,
  <span style="color: #93C5FD;">"estado"</span>: <span style="color: #86EFAC;">"{{ dbData.resultado.estado }}"</span>,
  <span style="color: #93C5FD;">"ubicacion"</span>: <span style="color: var(--text-bright);">"{{ dbData.resultado.ubicacion }}"</span>
<span style="color: var(--color-accent);">}</span></pre>
        </div>

      </div>
    </div>
  </section>
</template>