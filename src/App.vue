<script setup>
/* ═══════════════════════════════════════════════════════════
   App.vue — Componente Raíz del Portafolio
   "The Living Architecture"

   Responsabilidades:
   - Inicializar y destruir la instancia de Lenis (scroll suave global).
   - Montar el esqueleto de las 5 secciones principales del portafolio.
   - Gestionar el ciclo de vida del motor de scroll.
   ═══════════════════════════════════════════════════════════ */

import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Importación de Secciones ─── */
import ControlPanel from './components/ControlPanel.vue'
import SectionHero from './components/SectionHero.vue'
import SectionAbout from './components/SectionAbout.vue'
import SectionProjects from './components/SectionProjects.vue'
import SectionSkills from './components/SectionSkills.vue'
import TheFooter from './components/TheFooter.vue'

/* ── Estado del Motor de Scroll ── */
let lenisInstance = null

const updateLenis = (time) => {
  lenisInstance?.raf(time * 1000)
}

onMounted(() => {
  /* Inicialización de Lenis — Motor de scroll suave global sincronizado con GSAP ScrollTrigger. */
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })

  // Sincronizar Lenis con GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update)

  // Conectar Lenis al ticker global de GSAP
  gsap.ticker.add(updateLenis)
  gsap.ticker.lagSmoothing(0)
})

onUnmounted(() => {
  // Limpieza del ticker y motor de scroll
  gsap.ticker.remove(updateLenis)

  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
})
</script>

<template>
  <!-- Contenedor principal del portafolio -->
  <main class="relative min-h-screen w-full bg-dark">
    <ControlPanel />

    <!-- Hero — Presentación principal -->
    <SectionHero />

    <!-- Sobre Mí — Plano de arquitectura de software -->
    <SectionAbout />

    <!-- Proyectos — Contenedores de infraestructura -->
    <SectionProjects />

    <!-- Habilidades — Grafo de dependencias D3 -->
    <SectionSkills />

    <!-- Contacto — Interfaz REST / Pie de página -->
    <TheFooter />

  </main>
</template>

<style scoped>
/* Los estilos globales se gestionan desde src/style.css. */
</style>
