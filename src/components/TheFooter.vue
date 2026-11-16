<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '../composables/useTheme.js'

gsap.registerPlugin(ScrollTrigger)

const { isDark } = useTheme()

/* ── Referencias del DOM ── */
const footerRef = ref(null)
const kickerRef = ref(null)
const lineRef = ref(null)
const titleRef = ref(null)
const leftColRef = ref(null)
const rightColRef = ref(null)

/* ── Estado Reactivo del Formulario ── */
const anioActual = ref(new Date().getFullYear())
const nombre = ref('')
const email = ref('')
const mensaje = ref('')
const estado = ref('IDLE') // IDLE, ENVIANDO, ENVIADO, ERROR
const mensajeFeedback = ref('')
const feedbackTipo = ref('') // 'error', 'exito', 'info'

let gsapCtx = null

/* ── Envío del Formulario a EmailJS ── */
async function enviarFormulario() {
  if (estado.value === 'ENVIANDO') return

  if (!nombre.value.trim() || !email.value.trim() || !mensaje.value.trim()) {
    estado.value = 'ERROR'
    feedbackTipo.value = 'error'
    mensajeFeedback.value = 'Por favor completa todos los campos requeridos.'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    estado.value = 'ERROR'
    feedbackTipo.value = 'error'
    mensajeFeedback.value = 'Ingresa un correo electrónico válido.'
    return
  }

  estado.value = 'ENVIANDO'
  feedbackTipo.value = 'info'
  mensajeFeedback.value = 'Transmitiendo mensaje...'

  try {
    await emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      { nombre: nombre.value, correo: email.value, mensaje: mensaje.value },
      import.meta.env.VITE_TEMPLATE_PARAMS
    )

    estado.value = 'ENVIADO'
    feedbackTipo.value = 'exito'
    mensajeFeedback.value = 'Mensaje enviado correctamente. Me pondré en contacto contigo pronto.'

    nombre.value = ''
    email.value = ''
    mensaje.value = ''

    setTimeout(() => {
      estado.value = 'IDLE'
      mensajeFeedback.value = ''
    }, 5000)
  } catch (error) {
    estado.value = 'ERROR'
    feedbackTipo.value = 'error'
    mensajeFeedback.value = 'Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo o escríbeme por WhatsApp.'
    console.error(error)
  }
}

function etiquetaBoton() {
  if (estado.value === 'ENVIANDO') return 'Enviando...'
  if (estado.value === 'ERROR') return 'Reintentar Envío'
  if (estado.value === 'ENVIADO') return 'Mensaje Enviado'
  return 'Enviar Mensaje'
}

function volverArriba() {
  const hero = document.getElementById('hero')
  if (hero) {
    hero.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  gsapCtx = gsap.context(() => {
    gsap.set(kickerRef.value, { opacity: 0, x: -16 })
    gsap.set(lineRef.value, { scaleX: 0 })
    gsap.set(titleRef.value, { yPercent: 110 })
    gsap.set([leftColRef.value, rightColRef.value], { opacity: 0, y: 32 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.to(kickerRef.value, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, 0)
      .to(lineRef.value, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }, 0.05)
      .to(titleRef.value, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0.1)
      .to([leftColRef.value, rightColRef.value], {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform'
      }, 0.28)
  }, footerRef.value)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<template>
  <footer
    id="contacto"
    ref="footerRef"
    class="relative w-full border-t border-dark-400 footer-section overflow-hidden transition-colors scroll-mt-0"
    :class="isDark ? 'is-dark' : 'is-light'"
    aria-label="Sección — Contacto y Pie de Página"
  >
    <!-- Marca de Agua Estructural (04) -->
    <span
      aria-hidden="true"
      class="footer-watermark absolute -top-6 right-4 md:right-12 font-sans font-black text-[9rem] sm:text-[13rem] md:text-[17rem] leading-none tracking-tighter select-none pointer-events-none z-0"
    >
      04
    </span>

    <!-- Contenedor Maestro -->
    <div class="relative z-10 w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16 pt-16 md:pt-24 lg:pt-28 pb-16 md:pb-20">

      <!-- Encabezado Brutalista -->
      <div class="mb-10 md:mb-14">
        <div class="flex items-center gap-4 mb-3">
          <span ref="kickerRef" class="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            04 — Contacto &amp; Disponibilidad
          </span>
          <div ref="lineRef" class="h-px flex-1 bg-dark-400 origin-left"></div>
        </div>
        <div class="overflow-hidden py-1">
          <h2 ref="titleRef" class="font-sans font-black uppercase tracking-[-0.03em] text-3xl sm:text-5xl lg:text-6xl leading-[0.95] text-text-bright">
            INICIAR PROYECTO
          </h2>
        </div>
      </div>

      <!-- Grid Editorial de 2 Columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

        <!-- COLUMNA IZQUIERDA: Propuesta de Valor y Canales Directos -->
        <div ref="leftColRef" class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 class="font-sans font-bold text-xl sm:text-2xl lg:text-[1.65rem] leading-[1.25] tracking-tight text-text-bright">
              ¿Tienes un proyecto en mente o necesitas escalar un sistema existente?
            </h3>
            <p class="font-sans text-sm sm:text-base leading-relaxed text-text-base mt-3">
              Escríbeme directamente por cualquiera de estos canales o envíame los detalles a través del formulario.
            </p>

            <!-- Tarjetas de Contacto Directo -->
            <div class="mt-8 flex flex-col gap-3.5">
              <!-- Tarjeta 1: WhatsApp Directo -->
              <a
                href="https://wa.me/59174303370"
                target="_blank"
                rel="noopener"
                class="contact-card group flex items-center justify-between p-4 rounded-md border transition-all"
              >
                <div>
                  <span class="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary block mb-0.5">
                    RESPUESTA INMEDIATA · WHATSAPP
                  </span>
                  <span class="font-sans font-bold text-sm sm:text-base text-text-bright group-hover:text-primary transition-colors">
                    Iniciar conversación en WhatsApp
                  </span>
                </div>
                <div class="p-2 rounded border border-dark-400 text-text-muted group-hover:text-primary group-hover:border-primary transition-colors">
                  <svg class="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>

              <!-- Tarjeta 2: Correo Electrónico -->
              <a
                href="mailto:tapiajhon111@gmail.com"
                class="contact-card group flex items-center justify-between p-4 rounded-md border transition-all"
              >
                <div>
                  <span class="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary block mb-0.5">
                    CORREO ELECTRÓNICO DIRECTO
                  </span>
                  <span class="font-sans font-bold text-sm sm:text-base text-text-bright group-hover:text-primary transition-colors">
                    tapiajhon111@gmail.com
                  </span>
                </div>
                <div class="p-2 rounded border border-dark-400 text-text-muted group-hover:text-primary group-hover:border-primary transition-colors">
                  <svg class="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </a>
            </div>

            <!-- Enlaces Limpios de Redes -->
            <div class="mt-6 pt-5 border-t border-dark-400 flex items-center gap-5 font-mono text-xs">
              <a
                href="https://github.com/ElTapiaGit"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
              >
                <span>GitHub</span>
                <span class="text-[10px]">↗</span>
              </a>
              <a
                href="https://linkedin.com/in/jhon-e-tapia-vargas-068b6a3ba"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
              >
                <span>LinkedIn</span>
                <span class="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: Panel de Formulario Ejecutivo -->
        <div ref="rightColRef" class="lg:col-span-7">
          <div class="contact-panel rounded-md border p-6 sm:p-8">
            <form @submit.prevent="enviarFormulario" class="space-y-4">
              <!-- Campo: Nombre -->
              <div>
                <label for="nombreInput" class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-2 block text-text-bright">
                  Nombre Completo
                </label>
                <input
                  id="nombreInput"
                  v-model="nombre"
                  type="text"
                  placeholder="Ej. Alex Turner"
                  class="w-full rounded-md border px-4 py-3 font-sans text-sm outline-none transition-colors contact-input"
                  required
                />
              </div>

              <!-- Campo: Email -->
              <div>
                <label for="emailInput" class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-2 block text-text-bright">
                  Correo Electrónico
                </label>
                <input
                  id="emailInput"
                  v-model="email"
                  type="email"
                  placeholder="alex@ejemplo.com"
                  class="w-full rounded-md border px-4 py-3 font-sans text-sm outline-none transition-colors contact-input"
                  required
                />
              </div>

              <!-- Campo: Mensaje -->
              <div>
                <label for="mensajeInput" class="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-2 block text-text-bright">
                  Detalles del Proyecto
                </label>
                <textarea
                  id="mensajeInput"
                  v-model="mensaje"
                  rows="4"
                  placeholder="Describe brevemente tus requerimientos técnicos, metas o plazos estimados..."
                  class="w-full rounded-md border px-4 py-3 font-sans text-sm outline-none transition-colors contact-input resize-none"
                  required
                ></textarea>
              </div>

              <!-- Banner de Feedback Profesional -->
              <div
                v-if="mensajeFeedback"
                class="rounded-md px-4 py-3 text-xs font-sans font-medium border flex items-center gap-2"
                :class="{
                  'bg-emerald-500/10 border-emerald-500/30 text-emerald-500': feedbackTipo === 'exito',
                  'bg-red-500/10 border-red-500/30 text-red-500': feedbackTipo === 'error',
                  'bg-blue-500/10 border-blue-500/30 text-blue-400': feedbackTipo === 'info'
                }"
              >
                <span v-if="feedbackTipo === 'exito'">✓</span>
                <span v-else-if="feedbackTipo === 'error'">⚠</span>
                <span v-else>ℹ</span>
                <span>{{ mensajeFeedback }}</span>
              </div>

              <!-- Botón de Envío -->
              <div class="pt-2">
                <button
                  type="submit"
                  :disabled="estado === 'ENVIANDO'"
                  class="btn-primary inline-flex items-center justify-center gap-2 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  <span>{{ etiquetaBoton() }}</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>

    <!-- Franja Final de Pie de Página (Bottom Bar) -->
    <div class="footer-bottom-bar border-t py-6 transition-colors">
      <div class="w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Copyright -->
        <p class="text-xs font-mono text-text-muted text-center sm:text-left">
          &copy; {{ anioActual }} Jhon Eligio Tapia Vargas
        </p>

        <!-- Botón Volver Arriba -->
        <button
          type="button"
          @click="volverArriba"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <span>Volver arriba ↑</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── Superficie de la Sección ── */
.footer-section.is-dark {
  background-color: var(--color-dark);
}
.footer-section.is-light {
  background-color: #F8FAFC;
}

/* ── Marca de Agua Estructural ── */
.is-dark .footer-watermark {
  color: rgba(248, 250, 252, 0.035);
}
.is-light .footer-watermark {
  color: rgba(15, 23, 42, 0.055);
}

/* ── Tarjetas de Contacto Directo ── */
.is-dark .contact-card {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
}
.is-dark .contact-card:hover {
  border-color: var(--color-primary);
}

.is-light .contact-card {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.04);
}
.is-light .contact-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.12);
}

/* ── Panel de Formulario ── */
.is-dark .contact-panel {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
}
.is-light .contact-panel {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.07);
}

/* ── Inputs y Textareas ── */
.is-dark .contact-input {
  background-color: var(--color-dark-700);
  border-color: var(--color-dark-400);
  color: var(--text-bright);
}
.is-dark .contact-input:focus {
  border-color: var(--color-primary);
  background-color: var(--color-dark-800);
}
.is-dark .contact-input::placeholder {
  color: rgba(148, 163, 184, 0.4);
}

.is-light .contact-input {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #0F172A;
}
.is-light .contact-input:focus {
  border-color: var(--color-primary);
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.is-light .contact-input::placeholder {
  color: #94A3B8;
}

/* ── Franja Inferior (Bottom Bar) ── */
.is-dark .footer-bottom-bar {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
}
.is-light .footer-bottom-bar {
  background-color: #FFFFFF;
  border-color: #E2E8F0;
}
</style>
