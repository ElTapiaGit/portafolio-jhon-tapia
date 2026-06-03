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

/* ── Importación de Secciones ─── */
import ControlPanel from './components/ControlPanel.vue'
import SectionHero from './components/SectionHero.vue'
import SectionAbout from './components/SectionAbout.vue'
import SectionProjects from './components/SectionProjects.vue'
import SectionSkills from './components/SectionSkills.vue'
import TheFooter from './components/TheFooter.vue'

/* ── Estado del Motor de Scroll ── */
let lenisInstance = null
let rafId = null

onMounted(() => {
  /* Inicialización de Lenis — Motor de scroll suave global.
     Se configura con duración e interpolación personalizadas
     para lograr un desplazamiento fluido y cinematográfico. */
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })

  /* Bucle de animación — Conecta Lenis al ciclo de renderizado
     del navegador usando requestAnimationFrame. */
  function raf(time) {
    lenisInstance.raf(time)
    rafId = requestAnimationFrame(raf)
  }

  rafId = requestAnimationFrame(raf)
})

onUnmounted(() => {
  /* Limpieza de recursos — Cancela el bucle de animacion. */
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

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
