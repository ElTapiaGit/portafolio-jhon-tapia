import { ref } from 'vue'

/* ═══════════════════════════════════════════════════════════
   useTheme.js — Composable de Estado Global de Tema (Dark/Light)
   Arquitectura Reactiva Centralizada (Single Source of Truth)
   ═══════════════════════════════════════════════════════════ */

// Estado global singleton (compartido entre todas las instancias del composable)
const isDark = ref(true)
let isInitialized = false

const initTheme = () => {
  if (isInitialized || typeof window === 'undefined') return
  isInitialized = true

  const savedTheme = localStorage.getItem('tapia-theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light')
  } else {
    isDark.value = true
    document.documentElement.classList.remove('light')
  }
}

// Inicialización automática en entorno de navegador
initTheme()

export function useTheme() {
  initTheme()

  const toggleTheme = () => {
    isDark.value = !isDark.value

    if (typeof document !== 'undefined') {
      if (isDark.value) {
        document.documentElement.classList.remove('light')
        localStorage.setItem('tapia-theme', 'dark')
      } else {
        document.documentElement.classList.add('light')
        localStorage.setItem('tapia-theme', 'light')
      }
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
