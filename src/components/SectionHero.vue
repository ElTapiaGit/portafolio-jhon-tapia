<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

/* ── Referencias del DOM ── */
const heroRef = ref(null)
const glowRef = ref(null)
const nameWrapRef = ref(null)
const nameLinesRef = ref([])
const photoParallaxRef = ref(null)
const photoRef = ref(null)
const infoRef = ref(null)
const cvBtnRef = ref(null)
const projectBtnRef = ref(null)

/* ── Datos ── */
const NAME_LINES = ['JHON ELIGIO', 'TAPIA VARGAS']
const ROLE_TEXT = 'Ingeniero de Sistemas & Desarrollador Full Stack'
const DESCRIPTION = 'Arquitectura de software, aplicaciones móviles y sistemas web de alto rendimiento.'
const IMAGE_SRC = '/asset/images/perfil-2.webp'

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/ElTapiaGit',
    path: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jhon-e-tapia-vargas-068b6a3ba',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/59174303370',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'
  }
]

/* ── Contexto y controladores GSAP ── */
let ctx
let glowX, glowY, nameX, nameY, photoX, photoY
const magnetic = new Map()

const isDesktop = () => window.innerWidth >= 768

/* Parallax 3D con el cursor (solo desktop) */
const handleMouseMove = (e) => {
  if (!isDesktop() || !heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const relY = e.clientY - rect.top
  const normX = relX / rect.width - 0.5
  const normY = relY / rect.height - 0.5

  glowX?.(relX)
  glowY?.(relY)
  nameX?.(normX * -30)
  nameY?.(normY * -15)
  photoX?.(normX * 22)
  photoY?.(normY * 10)
}

const handleMouseLeave = () => {
  nameX?.(0); nameY?.(0)
  photoX?.(0); photoY?.(0)
}

/* Efecto magnético suave en CTAs */
const onMagnetMove = (e, el) => {
  if (!isDesktop() || !el) return
  const m = magnetic.get(el)
  if (!m) return
  const r = el.getBoundingClientRect()
  m.x((e.clientX - (r.left + r.width / 2)) * 0.3)
  m.y((e.clientY - (r.top + r.height / 2)) * 0.3)
}

const onMagnetLeave = (el) => {
  const m = magnetic.get(el)
  if (m) {
    m.x(0)
    m.y(0)
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    const qt = (el, prop, duration = 0.8) =>
      gsap.quickTo(el, prop, { duration, ease: 'power3.out' })

    glowX = qt(glowRef.value, 'x', 1.1)
    glowY = qt(glowRef.value, 'y', 1.1)
    nameX = qt(nameWrapRef.value, 'x')
    nameY = qt(nameWrapRef.value, 'y')
    photoX = qt(photoParallaxRef.value, 'x')
    photoY = qt(photoParallaxRef.value, 'y')

    ;[cvBtnRef.value, projectBtnRef.value].forEach((el) => {
      if (el) magnetic.set(el, { x: qt(el, 'x', 0.5), y: qt(el, 'y', 0.5) })
    })

    // Posición inicial del resplandor
    gsap.set(glowRef.value, {
      x: heroRef.value.clientWidth * 0.6,
      y: heroRef.value.clientHeight * 0.45
    })

    // Coreografía de entrada
    const tl = gsap.timeline({ delay: 0.05 })

    tl.fromTo(nameLinesRef.value,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
      0
    )
    .fromTo(photoRef.value,
      { y: 40, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      0.2
    )
    .fromTo(infoRef.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.45
    )
  }, heroRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  magnetic.clear()
})
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="relative h-screen min-h-[680px] w-full overflow-hidden bg-dark select-none flex flex-col justify-between"
    aria-label="Sección principal — Presentación"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- CAPA 0 — Luz ambiental -->
    <div
      ref="glowRef"
      class="hero-glow absolute top-0 left-0 -ml-[260px] -mt-[260px] w-[520px] h-[520px] rounded-full pointer-events-none blur-[90px] z-0 will-change-transform"
      aria-hidden="true"
    ></div>

    <!-- CAPA 1 — Tipografía monumental (fondo) -->
    <div
      class="relative z-10 w-full pt-8 sm:pt-12 md:pt-10 px-4 sm:px-8 md:px-12 flex flex-col items-center justify-start pointer-events-none"
    >
      <div ref="nameWrapRef" class="flex flex-col items-center will-change-transform">
        <div
          v-for="(line, i) in NAME_LINES"
          :key="line"
          class="overflow-hidden"
        >
          <span
            :ref="(el) => { if (el) nameLinesRef[i] = el }"
            class="block font-sans font-black uppercase tracking-[-0.04em] leading-[0.88] py-1 text-center whitespace-nowrap text-[13.5vw] sm:text-[13vw] md:text-[11.8vw] lg:text-[11.2vw] text-text-bright"
            :aria-hidden="i > 0 ? 'true' : undefined"
          >
            {{ line }}
          </span>
        </div>
      </div>
      <h1 class="sr-only">Jhon Eligio Tapia Vargas — {{ ROLE_TEXT }}</h1>
    </div>

    <!-- CAPA 2 — Fotografía recortada en primer plano -->
    <div
      class="absolute top-[11%] sm:top-[13%] md:top-auto md:bottom-0 left-1/2 -translate-x-1/2 md:left-[60%] lg:left-[62%] md:-translate-x-1/2 z-20 pointer-events-none flex items-end justify-center w-full md:w-auto"
    >
      <div ref="photoParallaxRef" class="will-change-transform">
        <img
          ref="photoRef"
          :src="IMAGE_SRC"
          alt="Jhon Eligio Tapia Vargas"
          class="hero-photo block h-[58vh] sm:h-[62vh] md:h-[78vh] lg:h-[85vh] max-h-[860px] w-auto max-w-none object-contain object-bottom opacity-0"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>
    </div>

    <!-- CAPA 3 — Información y CTAs (zócalo sólido en móvil) -->
    <div
      class="relative z-30 mt-auto w-full max-w-7xl mx-auto pl-10 pr-5 sm:px-8 md:px-12 lg:px-16 pt-5 md:pt-0 pb-7 sm:pb-10 md:pb-24 lg:pb-28 xl:pb-32 bg-dark/95 backdrop-blur-md border-t border-dark-400/60 md:bg-transparent md:backdrop-blur-none md:border-none"
    >
      <div ref="infoRef" class="md:max-w-xl text-left opacity-0">
        <div class="w-12 h-[2px] bg-primary mb-3.5"></div>

        <p class="text-sm sm:text-base md:text-xl font-mono font-semibold text-primary tracking-wide">
          {{ ROLE_TEXT }}
        </p>

        <p class="mt-2 text-xs sm:text-sm md:text-base text-text-base max-w-md leading-relaxed">
          {{ DESCRIPTION }}
        </p>

        <div class="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            ref="cvBtnRef"
            href="/asset/docs/cv-Jhon-Tapia.pdf"
            target="_blank"
            rel="noopener"
            class="btn-primary text-xs sm:text-sm whitespace-nowrap will-change-transform"
            @mousemove="onMagnetMove($event, cvBtnRef)"
            @mouseleave="onMagnetLeave(cvBtnRef)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar CV
          </a>

          <a
            ref="projectBtnRef"
            href="#contacto"
            class="hero-btn-secondary btn-secondary text-xs sm:text-sm whitespace-nowrap will-change-transform"
            @mousemove="onMagnetMove($event, projectBtnRef)"
            @mouseleave="onMagnetLeave(projectBtnRef)"
          >
            Iniciar Proyecto
          </a>

          <div class="flex items-center gap-2 sm:gap-3">
            <a
              v-for="s in SOCIALS"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener"
              :aria-label="s.label"
              class="hero-social p-2.5 rounded-lg border border-dark-400 bg-dark-800/80 backdrop-blur-sm text-text-base hover:text-primary hover:border-primary transition-colors shrink-0"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path :d="s.path" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Resplandor ambiental */
.hero-glow {
  background: radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 70%);
}

:global(.light) .hero-glow {
  background: radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.06) 45%, transparent 70%);
}

/* Sombra y máscara de la fotografía */
.hero-photo {
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.5));
}

:global(.light) .hero-photo {
  filter: drop-shadow(0 15px 35px rgba(15, 23, 42, 0.18));
}

/* Móvil: solo suaviza el último 6% del borde inferior (brazos y camiseta 100% sólidos) */
@media (max-width: 767px) {
  .hero-photo {
    -webkit-mask-image: linear-gradient(to bottom, #000 94%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 94%, transparent 100%);
  }
}

/* ── Modo claro: contraste en botones e iconos ── */
:global(.light) .hero-social,
:global(.light) .hero-btn-secondary {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
  backdrop-filter: none;
}

:global(.light) .hero-btn-secondary {
  color: var(--text-bright);
}
</style>
