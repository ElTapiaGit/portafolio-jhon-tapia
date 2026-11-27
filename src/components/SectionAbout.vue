<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dbData, filosofias, pestanas, capacidades, ecosistema } from '../data/profile.js'
import { useTheme } from '../composables/useTheme.js'

gsap.registerPlugin(ScrollTrigger)

const { isDark } = useTheme()

/* ── Estado ── */
const pestanaActiva = ref('ingenieria')

/* ── Referencias del DOM para Animación Cinematográfica ── */
const sectionRef = ref(null)
const kickerRef = ref(null)
const lineRef = ref(null)
const titleRef = ref(null)
const leadRef = ref(null)
const bodyRef = ref(null)
const metaRef = ref(null)
const rightColRef = ref(null)

/* ── Contexto GSAP ── */
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Estados iniciales ocultos
    gsap.set(kickerRef.value, { opacity: 0, x: -16 })
    gsap.set(lineRef.value, { scaleX: 0 })
    gsap.set(titleRef.value, { yPercent: 110 })
    gsap.set([leadRef.value, bodyRef.value, metaRef.value], { opacity: 0, y: 28 })
    gsap.set(rightColRef.value, { opacity: 0, y: 36 })

    // 2. Timeline sincronizada con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 62%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.to(kickerRef.value, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, 0)
      .to(lineRef.value, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }, 0.05)
      .to(titleRef.value, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0.1)
      .to([leadRef.value, bodyRef.value, metaRef.value], {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out'
      }, 0.28)
      .to(rightColRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out'
      }, 0.34)
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="sobre-mi"
    ref="sectionRef"
    class="relative w-full about-section border-y border-dark-400 overflow-hidden transition-colors scroll-mt-0 py-16 md:py-24 lg:py-28"
    :class="isDark ? 'is-dark' : 'is-light'"
    aria-label="Sección — Sobre Mí"
  >
    <!-- Marca de Agua Estructural (01) -->
    <span
      aria-hidden="true"
      class="about-watermark absolute -top-6 right-4 md:right-12 font-sans font-black text-[9rem] sm:text-[13rem] md:text-[17rem] leading-none tracking-tighter select-none pointer-events-none z-0"
    >
      01
    </span>

    <!-- Contenedor Principal -->
    <div class="relative z-10 w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16">

      <!-- Encabezado Brutalista -->
      <div class="mb-10 md:mb-14">
        <div class="flex items-center gap-4 mb-3">
          <span ref="kickerRef" class="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            01 — Perfil &amp; Arquitectura
          </span>
          <div ref="lineRef" class="h-px flex-1 bg-dark-400 origin-left"></div>
        </div>
        <div class="overflow-hidden py-1">
          <h2 ref="titleRef" class="font-sans font-black uppercase tracking-[-0.03em] text-3xl sm:text-5xl lg:text-6xl leading-[0.95] text-text-bright">
            INGENIERÍA DE SOFTWARE
          </h2>
        </div>
      </div>

      <!-- Grid Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mt-10 md:mt-14">

        <!-- Columna Izquierda: Manifiesto Técnico y Meta -->
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <p ref="leadRef" class="text-xl sm:text-2xl lg:text-[1.7rem] font-sans font-bold leading-[1.22] tracking-tight text-text-bright">
              Transformo lógica de negocio compleja en sistemas web, aplicaciones móviles offline-first e infraestructura lista para producción.
            </p>
            <p ref="bodyRef" class="mt-4 text-sm sm:text-base leading-relaxed text-text-base">
              Ingeniería de software enfocada en arquitectura limpia, alto rendimiento y soluciones escalables desde el diseño hasta el despliegue.
            </p>
          </div>
          <div ref="metaRef" class="mt-8 pt-5 border-t border-dark-400 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-text-muted">
            <span>Arquitectura &amp; Desarrollo</span>
            <span class="text-dark-400">·</span>
            <span>Full Stack &amp; Mobile</span>
            <span class="text-dark-400">·</span>
            <span>Cochabamba, BO</span>
          </div>
        </div>

        <!-- Columna Derecha: Panel Editorial Interactivo -->
        <div ref="rightColRef" class="lg:col-span-7 about-panel border border-dark-400 rounded-md overflow-hidden w-full">
          
          <!-- Barra de Pestañas -->
          <div class="flex overflow-x-auto overflow-y-hidden border-b border-dark-400 about-tabs-bar no-scrollbar">
            <button
              v-for="p in pestanas"
              :key="p.id"
              type="button"
              @click="pestanaActiva = p.id"
              class="px-5 py-3.5 text-xs font-mono uppercase tracking-wider transition-all border-b-2 -mb-px shrink-0 cursor-pointer"
              :class="pestanaActiva === p.id ? 'tab-btn-active' : 'tab-btn-inactive'"
            >
              {{ p.etiqueta }}
            </button>
          </div>

          <!-- Contenido de las Pestañas -->
          <div class="p-6 sm:p-8 min-h-[310px] flex flex-col justify-between">
            <Transition name="tab-fade" mode="out-in">
              
              <!-- 01. Ingeniería -->
              <div v-if="pestanaActiva === 'ingenieria'" key="ingenieria" class="flex flex-col justify-between gap-6 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(cap, index) in capacidades"
                    :key="cap"
                    class="about-subcard group flex items-center gap-3 p-3.5 rounded border border-dark-400 transition-colors hover:border-primary"
                  >
                    <span class="font-mono text-xs font-bold text-primary">0{{ index + 1 }}</span>
                    <span class="text-sm font-medium text-text-bright">{{ cap }}</span>
                  </div>
                </div>

                <div>
                  <div class="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-2">
                    ECOSISTEMA PRINCIPAL
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tech in ecosistema"
                      :key="tech"
                      class="px-2.5 py-1 text-xs font-mono rounded border border-dark-400 about-subcard text-text-base"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 02. Formación Académica (Credencial Ejecutiva) -->
              <div v-else-if="pestanaActiva === 'formacion'" key="formacion" class="flex flex-col justify-between gap-6 flex-1">
                <div>
                  <div class="flex items-center justify-between gap-4 mb-2">
                    <span class="font-mono text-[11px] uppercase tracking-widest text-primary font-semibold">
                      GRADO ACADÉMICO UNIVERSITARIO
                    </span>
                    <span class="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      {{ dbData.resultado.estado }}
                    </span>
                  </div>
                  <h3 class="text-xl sm:text-2xl font-sans font-bold text-text-bright mt-1">
                    {{ dbData.resultado.titulo }}
                  </h3>
                  <p class="text-sm sm:text-base font-medium text-text-base mt-1">
                    {{ dbData.resultado.institucion }}
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-dark-400">
                  <div class="about-subcard p-3.5 rounded border border-dark-400">
                    <span class="font-mono text-[10px] uppercase tracking-wider text-text-muted block">
                      UBICACIÓN
                    </span>
                    <p class="text-sm font-semibold text-text-bright mt-1">
                      {{ dbData.resultado.ubicacion }}
                    </p>
                  </div>
                  <div class="about-subcard p-3.5 rounded border border-dark-400">
                    <span class="font-mono text-[10px] uppercase tracking-wider text-text-muted block">
                      ESPECIALIZACIÓN
                    </span>
                    <p class="text-sm font-semibold text-text-bright mt-1">
                      {{ dbData.resultado.enfoque }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 03. Filosofía -->
              <div v-else-if="pestanaActiva === 'filosofia'" key="filosofia" class="flex flex-col justify-between gap-6 flex-1">
                <div class="flex flex-col gap-3">
                  <div
                    v-for="(f, i) in filosofias"
                    :key="i"
                    class="about-subcard flex items-start gap-4 p-4 rounded border border-dark-400"
                  >
                    <span class="font-mono text-xs font-bold text-primary mt-0.5 shrink-0">0{{ i + 1 }}</span>
                    <p class="text-sm leading-relaxed text-text-base">{{ f }}</p>
                  </div>
                </div>
              </div>

            </Transition>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* Fondo de superficie secundaria con gradiente radial */
.about-section.is-dark {
  background-color: var(--color-dark-800);
  background-image: radial-gradient(circle at 15% 0%, var(--color-primary-dim) 0%, transparent 55%);
}

.about-section.is-light {
  background-color: #F1F5F9;
  background-image: none;
}

/* Marca de Agua Estructural */
.is-dark .about-watermark {
  color: rgba(248, 250, 252, 0.035);
}

.is-light .about-watermark {
  color: rgba(15, 23, 42, 0.055);
}

/* Panel Editorial */
.is-dark .about-panel {
  background-color: var(--color-dark);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
}

.is-light .about-panel {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.07);
}

/* Subtarjetas internas */
.is-dark .about-subcard {
  background-color: var(--color-dark-800);
}

.is-dark .about-tabs-bar {
  background-color: var(--color-dark-800);
}

.is-light .about-subcard {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
}

.is-light .about-tabs-bar {
  background-color: #F8FAFC;
}

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

/* Botones de Pestañas */
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
