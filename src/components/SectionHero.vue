<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

/* ── Referencias del DOM ── */
const nameEl = ref(null)
const roleEl = ref(null)
const brandEl = ref(null)
const statusEl = ref(null)
const lineEl = ref(null)
const ctasEl = ref(null)
const fotoEl = ref(null)
const curtainTopEl = ref(null)
const curtainBottomEl = ref(null)

/* ── Datos del Desarrollador ── */
const FULL_NAME = 'Jhon Eligio Tapia Vargas'
const ROLE_TEXT = 'Ingeniero de Sistemas — Desarrollador Full Stack'
const BRAND_TEXT = 'Tapia Tech · Software Development & Solutions'
const IMAGE_SRC = '/asset/images/perfil-remove.webp'

/* ── Contexto de Animación GSAP ── */
let ctx

/* ── Animación Inicial Coordinada ── */
onMounted(() => {
  ctx = gsap.context(() => {
    const masterTl = gsap.timeline({ delay: 0.1 })

    // 1. Entrada del contenedor de la foto
    masterTl.fromTo(fotoEl.value,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
      0
    )

    // 2. Apertura simétrica de cortinas desde el centro
    masterTl.fromTo([curtainTopEl.value, curtainBottomEl.value],
      { scaleY: 1 },
      { scaleY: 0, duration: 0.85, ease: 'power2.inOut' },
      0.15
    )
    .to('.hero-scan-bar', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out'
    }, '-=0.15')

    // 3. Entrada secuencial del texto
    masterTl.fromTo(statusEl.value,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      0.05
    )
    .fromTo(nameEl.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      0.15
    )
    .fromTo(lineEl.value,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.35, ease: 'power3.out' },
      0.25
    )
    .fromTo(roleEl.value,
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 10 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' },
      0.3
    )
    .fromTo(brandEl.value,
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 10 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' },
      0.38
    )
    .fromTo(ctasEl.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
      0.45
    )
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="hero"
    class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-dark scroll-mt-0"
    aria-label="Sección principal — Presentación"
  >
    <!-- Contenedor Principal (Alineación exacta compartida con todo el portafolio) -->
    <div class="relative z-10 w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16 py-8 md:py-12">

      <!-- COLUMNA IZQUIERDA — Texto -->
      <div class="w-full md:w-3/5 lg:w-7/12 flex flex-col justify-center order-2 md:order-1 text-left">

        <div ref="statusEl" class="mb-2 sm:mb-4 opacity-0">
          <span class="status-badge text-[11px] sm:text-xs">Disponible para proyectos</span>
        </div>

        <h1
          ref="nameEl"
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight opacity-0"
          style="color: var(--text-bright);"
        >
          {{ FULL_NAME }}
        </h1>

        <div
          ref="lineEl"
          class="mt-2.5 mb-2.5 sm:mt-4 sm:mb-5 h-px w-full max-w-[200px] sm:max-w-[260px] origin-left scale-x-0 opacity-0"
          style="background: var(--color-primary);"
        />

        <p
          ref="roleEl"
          class="font-mono text-xs sm:text-sm md:text-base tracking-wide opacity-0"
          style="color: var(--text-base); clip-path: inset(100% 0% 0%);"
        >
          {{ ROLE_TEXT }}
        </p>

        <p
          ref="brandEl"
          class="mt-1 font-mono text-[11px] sm:text-xs md:text-sm tracking-wider uppercase opacity-0"
          style="color: var(--text-muted); clip-path: inset(100% 0% 0%);"
        >
          {{ BRAND_TEXT }}
        </p>

        <div ref="ctasEl" class="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 opacity-0">
          <a href="/asset/docs/cv-Jhon-Tapia.pdf" target="_blank" class="btn-primary text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 whitespace-nowrap">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar CV
          </a>
          <a href="#contacto" class="btn-secondary text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 whitespace-nowrap">Iniciar Proyecto</a>

          <div class="flex items-center gap-2 sm:gap-3 ml-1">
            <a href="https://github.com/ElTapiaGit" target="_blank" rel="noopener"
              class="p-2 rounded-lg border border-dark-400 text-muted transition-colors hover:text-text-bright hover:border-text-bright shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/jhon-e-tapia-vargas-068b6a3ba" target="_blank" rel="noopener"
              class="p-2 rounded-lg border border-dark-400 text-muted transition-colors hover:text-[#0A66C2] hover:border-[#0A66C2] shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://wa.me/59174303370" target="_blank" rel="noopener"
              class="p-2 rounded-lg border border-dark-400 text-muted transition-colors hover:text-[#25D366] hover:border-[#25D366] shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA — Fotografía con Cortinas -->
      <div class="w-full md:w-2/5 lg:w-5/12 flex justify-center md:justify-end order-1 md:order-2">
        <div 
          ref="fotoEl" 
          class="relative w-[190px] sm:w-[230px] md:w-[320px] lg:w-[380px] xl:w-[420px] aspect-[4/5] flex items-center justify-center opacity-0"
        >
          <div class="hero-glow absolute -inset-3 rounded-3xl blur-2xl pointer-events-none -z-10"></div>

          <div class="hero-frame relative w-full aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl select-none">
            <img
              :src="IMAGE_SRC"
              alt="Jhon Eligio Tapia Vargas"
              class="w-full h-full object-cover object-top block hero-img filter contrast-[1.02]"
              loading="eager"
              fetchpriority="high"
              decoding="sync"
              width="420"
              height="525"
            />
            
            <div class="hero-card-fade absolute inset-0 pointer-events-none z-10"></div>

            <!-- Cortina Superior -->
            <div 
              ref="curtainTopEl"
              class="hero-curtain absolute top-0 left-0 right-0 h-1/2 z-20 origin-top flex flex-col justify-end pointer-events-none"
            >
              <div class="hero-scan-bar w-full h-[2px]"></div>
            </div>

            <!-- Cortina Inferior -->
            <div 
              ref="curtainBottomEl"
              class="hero-curtain absolute bottom-0 left-0 right-0 h-1/2 z-20 origin-bottom flex flex-col justify-start pointer-events-none"
            >
              <div class="hero-scan-bar w-full h-[2px]"></div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Cortinas y Marco unificados usando tokens globales de style.css */
.hero-frame,
.hero-curtain {
  background-color: var(--color-dark);
}
.hero-frame {
  border: 1px solid var(--color-dark-400);
}

:root.light .hero-frame,
:root.light .hero-curtain {
  background-color: var(--color-dark-800);
}
:root.light .hero-frame {
  border-color: var(--color-dark-600);
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
}

/* Barra láser del escáner (Exclusiva del Hero) */
.hero-scan-bar {
  background: linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%);
  box-shadow: 0 0 10px var(--color-primary), 0 0 3px #FFFFFF;
}

/* Glow ambiental suave */
.hero-glow {
  background: radial-gradient(circle, var(--color-primary-dim) 0%, transparent 70%);
}

/* Fundido inferior de la fotografía */
.hero-card-fade {
  background: linear-gradient(to top, rgba(14, 17, 24, 0.75) 0%, transparent 22%);
}
:root.light .hero-card-fade {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, transparent 22%);
}
</style>