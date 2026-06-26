<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const isDark = ref(true) // estado del tema

const navItems = [
  { id: 'hero', label: '00. INICIO', href: '#hero' },
  { id: 'about', label: '01. SOBRE MÍ', href: '#sobre-mi' },
  { id: 'projects', label: '02. PROYECTOS', href: '#proyectos' },
  { id: 'skills', label: '03. HABILIDADES', href: '#habilidades' },
  { id: 'contact', label: '04. CONTACTO', href: '#contacto' }
]

/* ── Lógica de Navegación Limpia ── */
const scrollToSection = (hash) => {
  const id = hash.replace('#', '')
  const element = document.getElementById(id)
  
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isOpen.value = false
}

/* ── Lógica de Tema (Claro/Oscuro) ── */
onMounted(() => {
  // Verificamos si el usuario ya había elegido un tema antes
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
  <div  v-if="isOpen" 
    @click="isOpen = false" 
    class="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
  ></div>

  <!-- pestaña flotante -->
  <button
    @click="isOpen = !isOpen"
    class="fixed left-0 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center bg-dark-800 border-y border-r border-dark-400 rounded-r-xl w-6 h-24 transition-all duration-500 hover:w-10 group shadow-lg"
    :class="isOpen ? 'translate-x-[256px] md:translate-x-[288px] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'"
    aria-label="Abrir Menú"
  >
    <div class="absolute left-0 top-0 h-full w-[2px] bg-transparent group-hover:bg-primary transition-colors"></div>
    <div class="w-1 h-8 rounded-full bg-primary group-hover:bg-green-400 transition-colors"></div>
  </button>

  <!-- panel glassmorphism -->
  <nav
    class="fixed top-0 left-0 h-full w-64 md:w-72 nav-backdrop z-[100] border-r border-dark-400 flex flex-col p-6 md:p-8 transition-transform duration-500 shadow-2xl glass-panel"
    style="transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <button 
      @click="isOpen = false"
      class="absolute top-6 right-6 transition-colors close-btn"
      aria-label="Cerrar"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="mb-10 flex flex-col gap-4 mt-8">
      <img 
        src="/asset/images/logo-sf.png" 
        alt="Tapia Tech Logo" 
        class="w-12 h-12 md:w-14 md:h-14 object-contain self-start transition-transform hover:scale-105 logo-shadow"
      >
      <div class="text-xs font-mono tracking-widest uppercase mt-2" style="color: var(--text-muted);">
        <span style="color: var(--color-primary);"> TAPIA_TECH</span>
      </div>
    </div>
  
    <!-- lista de navegacion -->
    <ul class="flex flex-col gap-6 flex-1">
      <li v-for="item in navItems" :key="item.id">
        <a
          href="#"
          @click.prevent="scrollToSection(item.href)"
          class="nav-link text-sm md:text-base font-mono font-bold tracking-wide block"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>

    <!-- control de sistema (Theme Switcher) -->
    <div class="mt-auto pt-6 border-t border-dark-400 transition-colors">
      <button 
        @click="toggleTheme"
        class="theme-btn flex items-center gap-3 text-xs font-mono tracking-widest transition-colors w-full"
      >
        <!-- icono luna -->
        <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <!-- icono sol -->
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {{ isDark ? 'ACTIVA MODO CLARO' : 'ACTIVA MODO OSCURO' }}
      </button>
    </div>
  </nav>
</template>
<style scoped>
/* 1. Glassmorphism real dinamico */
.glass-panel {
  background: color-mix(in srgb, var(--color-dark-800) 85%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* 2. Sombra dinámica para el logo */
.logo-shadow {
  filter: drop-shadow(0 0 12px color-mix(in srgb, var(--color-primary) 30%, transparent));
}

/* 3. Estilos limpios para los enlaces de navegación */
.nav-link {
  color: var(--text-bright);
  transition: all 0.3s ease;
}
.nav-link:hover {
  color: var(--color-primary);
  transform: translateX(8px);
}

/* 4. Estilos limpios para botones de control */
.close-btn {
  color: var(--text-muted);
}
.close-btn:hover {
  color: #F87171; 
}

.theme-btn {
  color: var(--text-muted);
  transition: color 0.3s ease;
}
.theme-btn:hover {
  color: var(--color-primary);
}
</style>