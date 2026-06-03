<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

/* ── Referencias del DOM ── */
const nameEl = ref(null)
const roleEl = ref(null)
const brandEl = ref(null)
const statusEl = ref(null)
const lineEl = ref(null)
const ctasEl = ref(null)
const fotoEl = ref(null)

/* ── Estado reactivo ─── */
const isMobile = ref(false)
const gyro = reactive({ x: 0, y: 0 })

/* ── Transformacion de paralaje para movil (giroscopio) ── */
const mobileParallaxStyle = computed(() => ({
  transform: `translate3d(${gyro.x}px, ${gyro.y}px, 0)`,
  transition: 'transform 0.15s ease-out',
}))

/* ── Datos del Desarrollador ─── */
const FULL_NAME = 'Jhon Eligio Tapia Vargas'
const ROLE_TEXT = 'Ingeniero de Sistemas — Desarrollador Full Stack'
const BRAND_TEXT = 'Tapia Tech · Software Development & Solutions'
const IMAGE_SRC = '/asset/images/perfil-remove.webp'

/* ── Motor de Descifrado criptografico ─── */
const CIPHER_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01アイウエオカキ'
const SCRAMBLE_DURATION = 280

function scrambleReveal(element, finalText) {
  return new Promise((resolve) => {
    const length = finalText.length
    const startTime = performance.now()

    function update() {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1)
      let result = ''

      for (let i = 0; i < length; i++) {
        const charThreshold = i / length
        if (progress >= charThreshold + 0.3 || progress === 1) {
          result += finalText[i]
        } else if (finalText[i] === ' ') {
          result += ' '
        } else {
          result += CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
        }
      }

      element.textContent = result
      if (progress < 1) { requestAnimationFrame(update) } else { element.textContent = finalText; resolve() }
    }

    requestAnimationFrame(update)
  })
}

/* ── Manejadores de eventos ── */
function onDeviceOrientation(e) {
  const maxShift = 15
  gyro.x = ((e.gamma || 0) / 45) * maxShift
  gyro.y = ((e.beta || 0) / 45) * maxShift
}

/* ── Deteccion de dispositivo ─── */
const mobileQuery = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)')
  : null

function handleMediaChange(e) {
  isMobile.value = e.matches
  if (e.matches) {
    window.addEventListener('deviceorientation', onDeviceOrientation)
  } else {
    window.removeEventListener('deviceorientation', onDeviceOrientation)
    gyro.x = 0
    gyro.y = 0
  }
}

/* ── Ciclo de Vida ── */
onMounted(async () => {
  if (mobileQuery) {
    isMobile.value = mobileQuery.matches
    mobileQuery.addEventListener('change', handleMediaChange)
  }

  if (isMobile.value) {
    window.addEventListener('deviceorientation', onDeviceOrientation)
  }

  /* Revelado criptografico del nombre */
  await scrambleReveal(nameEl.value, FULL_NAME)

  /* Línea separadora azul cobalto */
  gsap.fromTo(lineEl.value,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }
  )

  /* Subtítulos con clip-path ascendente */
  const tl = gsap.timeline({ delay: 0.08 })

  tl.fromTo(roleEl.value,
    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 10 },
    { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' }
  )
  .fromTo(brandEl.value,
    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 10 },
    { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' },
    '-=0.16'
  )
  .fromTo(statusEl.value,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
    '-=0.1'
  )
  .fromTo(ctasEl.value,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
    '-=0.1'
  )

  /* Foto de perfil — fade-in con desplazamiento ascendente */
  gsap.fromTo(fotoEl.value,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.2 }
  )
})

onUnmounted(() => {
  window.removeEventListener('deviceorientation', onDeviceOrientation)
  if (mobileQuery) mobileQuery.removeEventListener('change', handleMediaChange)
})
</script>

<template>
  <section id="hero"
    class="relative min-h-screen w-full overflow-hidden bg-dark"
    aria-label="Sección principal — Presentación"
  >
    <div class="absolute inset-0 bg-grid pointer-events-none opacity-30" />

    <div class="relative z-10 section-container flex flex-col md:flex-row items-center min-h-screen gap-12 md:gap-8">

      <!-- COLUMNA IZQUIERDA — Texto (60%) -->
      <div class="w-full md:w-3/5 flex flex-col justify-center order-2 md:order-1">

        <!-- Badge de disponibilidad -->
        <div ref="statusEl" class="mb-6 opacity-0">
          <span class="status-badge">Disponible para proyectos</span>
        </div>

        <!-- Nombre con revelado criptográfico -->
        <h1
          ref="nameEl"
          class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-none"
          style="color: var(--text-bright);"
        >
          {{ FULL_NAME }}
        </h1>

        <!-- Línea separadora azul cobalto -->
        <div
          ref="lineEl"
          class="mt-5 mb-5 h-px w-full max-w-[260px] origin-left scale-x-0 opacity-0"
          style="background: var(--color-primary);"
        />

        <!-- Rol profesional -->
        <p
          ref="roleEl"
          class="font-mono text-base sm:text-lg tracking-wide opacity-0"
          style="color: var(--text-base); clip-path: inset(100% 0% 0% 0%);"
        >
          {{ ROLE_TEXT }}
        </p>

        <!-- Marca personal -->
        <p
          ref="brandEl"
          class="mt-2 font-mono text-sm tracking-wider uppercase opacity-0"
          style="color: var(--text-muted); clip-path: inset(100% 0% 0% 0%);"
        >
          {{ BRAND_TEXT }}
        </p>

        <!-- CTAs + Redes Sociales -->
        <div ref="ctasEl" class="mt-8 flex flex-wrap items-center gap-4 opacity-0">
          <a href="/asset/docs/cv-Jhon-Tapia.pdf" target="_blank" class="btn-primary">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar CV
          </a>
          <a href="#contacto" class="btn-secondary">Iniciar Proyecto</a>

          <!-- Iconos de Redes Sociales -->
          <div class="flex items-center gap-3 ml-1">
            <!-- GitHub -->
            <a href="https://github.com/ElTapiaGit" target="_blank" rel="noopener"
              class="p-2 rounded-lg border border-dark-400 text-muted transition-colors hover:text-text-bright hover:border-text-bright">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <!-- LinkedIn -->
            <a href="https://linkedin.com/in/www.linkedin.com/in/jhon-e-tapia-vargas-068b6a3ba" target="_blank" rel="noopener"
              class="p-2 rounded-lg border border-dark-400 text-muted transition-colors hover:text-[#0A66C2] hover:border-[#0A66C2]">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <!-- WhatsApp -->
            <a href="https://wa.me/59174303370" target="_blank" rel="noopener"
              class="p-2 rounded-lg border border-dark-400 text-muted transition-colors hover:text-[#25D366] hover:border-[#25D366]">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!--  COLUMNA DERECHA — Foto de Perfil (40%) -->
      <div class="relative w-full md:w-2/5 flex justify-center order-1 md:order-2">
        <div
          ref="fotoEl"
          class="relative opacity-0"
          :style="isMobile ? mobileParallaxStyle : {}"
        >
          <div class="w-[260px] md:w-[320px] lg:w-[380px] rounded-2xl overflow-hidden border border-dark-400 bg-dark-800 shadow-2xl">
            <img
              :src="IMAGE_SRC"
              alt="Jhon Eligio Tapia Vargas — Foto de perfil"
              class="w-full h-auto object-cover object-top"
              fetchpriority="high"
              decoding="sync"
            />
          </div>
          <!-- decorador geometrico de fondo -->
          <div class="absolute -inset-4 rounded-2xl border border-primary/20 -z-10"></div>
        </div>
      </div>

    </div>
  </section>
</template>
