<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const isOpen = ref(false)
const { isDark, toggleTheme } = useTheme()

const navItems = [
  { id: 'hero', num: '00', label: 'Inicio', href: '#hero' },
  { id: 'sobre-mi', num: '01', label: 'Sobre Mí', href: '#sobre-mi' },
  { id: 'proyectos', num: '02', label: 'Proyectos', href: '#proyectos' },
  { id: 'habilidades', num: '03', label: 'Habilidades', href: '#habilidades' },
  { id: 'contacto', num: '04', label: 'Contacto', href: '#contacto' }
]

const activeSection = ref('hero')

/* ── Detección de Sección Activa en Viewport ── */
const updateActiveSection = () => {
  if (typeof window === 'undefined') return
  const scrollPos = window.scrollY + window.innerHeight * 0.35

  for (let i = navItems.length - 1; i >= 0; i--) {
    const el = document.getElementById(navItems[i].id)
    if (el && el.offsetTop <= scrollPos) {
      activeSection.value = navItems[i].id
      break
    }
  }
}

/* ── Navegación Suave ── */
const scrollToSection = (hash) => {
  const id = hash.replace('#', '')
  const element = document.getElementById(id)
  
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isOpen.value = false
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('keydown', onKeydown)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Backdrop con desenfoque suave al abrir el Drawer -->
  <Transition name="backdrop-fade">
    <div 
      v-if="isOpen" 
      @click="isOpen = false" 
      class="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm cursor-pointer"
      aria-hidden="true"
    ></div>
  </Transition>

  <!-- Gatillo Lateral Brutalista (Trigger Button) -->
  <button
    type="button"
    @click="isOpen = !isOpen"
    class="fixed left-0 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center border-y border-r rounded-r-md w-7 sm:w-8 h-20 hover:w-10 group shadow-lg transition-all cursor-pointer trigger-btn"
    :class="[
      isOpen ? '-translate-x-full opacity-0 pointer-events-none duration-200' : 'translate-x-0 opacity-100 delay-150 duration-300',
      isDark ? 'is-dark' : 'is-light'
    ]"
    aria-label="Abrir Menú de Navegación"
  >
    <div class="flex flex-col items-center gap-1.5 pointer-events-none">
      <span class="w-1 h-3.5 rounded-sm bg-primary group-hover:h-5 transition-all"></span>
      <span class="w-1 h-3.5 rounded-sm bg-primary/40 group-hover:bg-primary transition-all"></span>
    </div>
  </button>

  <!-- Drawer Lateral Arquitectónico -->
  <nav
    class="fixed top-0 left-0 h-full w-72 sm:w-80 z-[100] border-r flex flex-col justify-between p-6 sm:p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl drawer-nav"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isDark ? 'is-dark' : 'is-light'
    ]"
    role="dialog"
    aria-label="Menú Principal"
  >
    <div>
      <!-- Cabecera del Menú -->
      <div class="flex items-center justify-between pb-6 border-b border-dark-400">
        <div class="flex items-center gap-3">
          <img 
            src="/asset/images/logo-sf.png" 
            alt="Tapia Tech Logo" 
            class="w-10 h-10 object-contain shrink-0 transition-transform hover:scale-105"
          />
          <h2 class="font-sans font-black text-base tracking-tight text-text-bright leading-none">
            TAPIA TECH
          </h2>
        </div>

        <!-- Botón Cerrar -->
        <button 
          type="button"
          @click="isOpen = false" 
          class="w-9 h-9 rounded-md border flex items-center justify-center cursor-pointer transition-colors close-btn shrink-0"
          aria-label="Cerrar Menú"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Lista de Navegación con Sección Activa -->
      <ul class="flex flex-col gap-4 mt-8">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="item.href"
            @click.prevent="scrollToSection(item.href)"
            class="group flex items-center gap-3 py-1.5 transition-all cursor-pointer"
          >
            <!-- Línea de Estado Activo -->
            <span
              class="w-1 h-5 rounded-sm transition-all"
              :class="activeSection === item.id ? 'bg-primary scale-y-100' : 'bg-transparent scale-y-50 group-hover:bg-primary/40 group-hover:scale-y-100'"
            ></span>
            
            <span class="font-mono text-xs font-bold text-primary">
              {{ item.num }}
            </span>
            <span
              class="font-sans text-lg font-extrabold uppercase tracking-tight transition-colors"
              :class="activeSection === item.id ? 'text-primary' : 'text-text-bright group-hover:text-primary'"
            >
              {{ item.label }}
            </span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Pie del Menú (Selector de Tema) -->
    <div class="pt-6 border-t border-dark-400 mt-auto">
      <!-- Selector de Tema Limpio -->
      <button 
        type="button"
        @click="toggleTheme"
        class="w-full p-3 rounded-md border flex items-center justify-center gap-2.5 cursor-pointer transition-all theme-btn"
        :aria-label="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
      >
        <svg v-if="isDark" class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span class="font-sans font-bold text-xs uppercase tracking-wider">
          {{ isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro' }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* ── Transición suave del backdrop ── */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* ── Gatillo Lateral Brutalista ── */
.is-dark.trigger-btn {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
}
.is-light.trigger-btn {
  background-color: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: 2px 4px 16px rgba(15, 23, 42, 0.12);
}

/* ── Panel Lateral Drawer ── */
.is-dark.drawer-nav {
  background-color: rgba(14, 17, 24, 0.96);
  border-color: var(--color-dark-400);
  backdrop-filter: blur(16px);
}
.is-light.drawer-nav {
  background-color: rgba(255, 255, 255, 0.98);
  border-color: #CBD5E1;
  box-shadow: 20px 0 50px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(16px);
}

/* ── Botón Cerrar ── */
.is-dark .close-btn {
  border-color: var(--color-dark-400);
  color: var(--text-muted);
}
.is-dark .close-btn:hover {
  border-color: #EF4444;
  color: #EF4444;
}
.is-light .close-btn {
  border-color: #CBD5E1;
  color: #64748B;
  background-color: #F8FAFC;
}
.is-light .close-btn:hover {
  border-color: #EF4444;
  color: #EF4444;
}

/* ── Botón de Cambio de Tema ── */
.is-dark .theme-btn {
  background-color: var(--color-dark-800);
  border-color: var(--color-dark-400);
  color: var(--text-bright);
}
.is-dark .theme-btn:hover {
  border-color: var(--color-primary);
}
.is-light .theme-btn {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  color: #0F172A;
}
.is-light .theme-btn:hover {
  border-color: var(--color-primary);
  background-color: #EFF6FF;
}
</style>
