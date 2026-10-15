<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const isDark = ref(true)

const navItems = [
  { id: 'hero', label: '00. INICIO', href: '#hero' },
  { id: 'about', label: '01. SOBRE MÍ', href: '#sobre-mi' },
  { id: 'projects', label: '02. PROYECTOS', href: '#proyectos' },
  { id: 'skills', label: '03. HABILIDADES', href: '#habilidades' },
  { id: 'contact', label: '04. CONTACTO', href: '#contacto' }
]

/* ── Navegación Suave ── */
const scrollToSection = (hash) => {
  const id = hash.replace('#', '')
  const element = document.getElementById(id)
  
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isOpen.value = false
}

/* ── Lógica de Tema ── */
onMounted(() => {
  const savedTheme = localStorage.getItem('tapia-theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  
  if (isDark.value) {
    document.documentElement.classList.remove('light')
    localStorage.setItem('tapia-theme', 'dark')
  } else {
    document.documentElement.classList.add('light')
    localStorage.setItem('tapia-theme', 'light')
  }
}
</script>

<template>
  <!-- Backdrop oscuro en móvil con desvanecimiento suave -->
  <Transition name="backdrop-fade">
    <div 
      v-if="isOpen" 
      @click="isOpen = false" 
      class="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm md:hidden cursor-pointer"
    ></div>
  </Transition>

  <!-- Pestaña Flotante: emerge de su borde natural sin cruzar la pantalla -->
  <button
    type="button"
    @click="isOpen = !isOpen"
    class="fixed left-0 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center bg-dark-800 border-y border-r border-dark-400 rounded-r-xl w-6 h-24 hover:w-10 group shadow-lg transition-all cursor-pointer"
    :class="isOpen 
      ? '-translate-x-full opacity-0 pointer-events-none duration-200' 
      : 'translate-x-0 opacity-100 delay-150 duration-300'"
    aria-label="Abrir Menú de Navegación"
  >
    <div class="absolute left-0 top-0 h-full w-[2px] bg-transparent group-hover:bg-primary transition-colors"></div>
    <div class="w-1 h-8 rounded-full bg-primary group-hover:bg-primary-hover transition-colors"></div>
  </button>

  <!-- Panel Lateral Drawer (Consume tokens globales de style.css) -->
  <nav
    class="fixed top-0 left-0 h-full w-64 md:w-72 nav-backdrop z-[100] border-r border-dark-400 flex flex-col p-6 md:p-8 transition-transform duration-500 shadow-2xl"
    style="transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    aria-label="Menú Principal"
  >
    <!-- Botón Cerrar -->
    <button 
      type="button"
      @click="isOpen = false" 
      class="absolute top-6 right-6 text-text-muted hover:text-red-400 transition-colors cursor-pointer p-1"
      aria-label="Cerrar Menú"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Marca y Logo -->
    <div class="mb-10 flex flex-col gap-3 mt-6">
      <img 
        src="/asset/images/logo-sf.png" 
        alt="Tapia Tech Logo" 
        class="w-12 h-12 md:w-14 md:h-14 object-contain self-start transition-transform hover:scale-105 logo-shadow"
      >
      <div class="text-xs font-mono tracking-widest uppercase text-text-muted">
        <span class="text-primary font-semibold">TAPIA_TECH</span>
      </div>
    </div>
  
    <!-- Lista de Navegación -->
    <ul class="flex flex-col gap-6 flex-1">
      <li v-for="item in navItems" :key="item.id">
        <a
          href="#"
          @click.prevent="scrollToSection(item.href)"
          class="text-sm md:text-base font-mono font-bold tracking-wide block text-text-bright hover:text-primary hover:translate-x-2 transition-all duration-300"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>

    <!-- Control de Tema (Theme Switcher) -->
    <div class="mt-auto pt-6 border-t border-dark-400">
      <button 
        type="button"
        @click="toggleTheme"
        class="flex items-center gap-3 text-xs font-mono tracking-widest text-text-muted hover:text-primary transition-colors w-full cursor-pointer"
      >
        <svg v-if="isDark" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <svg v-else class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>{{ isDark ? 'ACTIVA MODO CLARO' : 'ACTIVA MODO OSCURO' }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Transición suave del telón de fondo en móvil */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* Sombra cobalto suave para el logo */
.logo-shadow {
  filter: drop-shadow(0 0 12px var(--color-primary-dim));
}
</style>