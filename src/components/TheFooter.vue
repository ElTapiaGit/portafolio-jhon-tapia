<script setup>
import { ref, onMounted } from 'vue'
import emailjs from '@emailjs/browser'

/* ── Estado Reactivo ─── */
const isMobile = ref(false)
const anioActual = ref(new Date().getFullYear())

const formulario = ref({
  endpoint: '/api/v1/contacto',
  metodo: 'POST',
  cuerpo: {
    nombre: '',
    email: '',
    mensaje: ''
  }
})

const logTerminal = ref([])
const estado = ref('IDLE')  // IDLE, ENVIANDO, ENVIADO, ERROR

/* ── Manejador de Envio del Formulario a emailjs ─── */
async function enviarFormulario() {
  if (estado.value === 'ENVIANDO') return // Prevenir doble clic

  const { nombre, email, mensaje } = formulario.value.cuerpo

  if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
    estado.value = 'ERROR'
    logTerminal.value = [{ tipo: 'error', msg: '> 422 ERROR: Campos incompletos o vacíos' }]
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    estado.value = 'ERROR'
    logTerminal.value = [{ tipo: 'error', msg: '> 422 ERROR: Estructura de email inválida.' }]
    return
  }

  // inicio de transmision
  estado.value = 'ENVIANDO'
  anioActual.value = new Date().getFullYear()
  logTerminal.value = [{ tipo: 'info', msg: '> Inicializando handshake con API...' }]

  try {
    await emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      { nombre: nombre, correo: email, mensaje: mensaje },
      import.meta.env.VITE_TEMPLATE_PARAMS
    )

    estado.value = 'ENVIADO'
    logTerminal.value.push({ tipo: 'exito', msg: '> 200 OK: Payload entregado correctamente.' })
    
    // Limpiar formulario
    formulario.value.cuerpo = { nombre: '', email: '', mensaje: '' }
    
    setTimeout(() => { estado.value = 'IDLE'; logTerminal.value = [] }, 4000)
  } catch (error) {
    estado.value = 'ERROR'
    logTerminal.value.push({ tipo: 'error', msg: '> 500 ERROR: Fallo en la infraestructura de transporte.' })
    console.error(error)
  }
}

/* ── Etiqueta del Boton segun Estado ── */
function etiquetaBoton() {
  if (estado.value === 'ENVIANDO') return 'STATUS: ENVIANDO...'
  if (estado.value === 'ERROR') return 'Reintentar'
  if (estado.value === 'ENVIADO') return 'Mensaje Enviado ✓'
  return 'Enviar Mensaje'
}

/* ── Deteccion de Dispositivo ── */
onMounted(() => {
  const media = window.matchMedia('(max-width: 767px)')
  isMobile.value = media.matches
  media.addEventListener('change', (e) => { isMobile.value = e.matches })
})
</script>

<template>
  <footer id="contacto"
    class="relative w-full border-t border-dark-400 bg-dark"
    aria-label="Sección — Contacto y Pie de Página"
  >
    <div class="absolute inset-0 bg-grid pointer-events-none opacity-10" />

    <div class="relative z-10 section-container">

      <!-- Encabezado de Seccion -->
      <div class="mb-12">
        <span class="status-badge mb-3">Contacto</span>
        <h2 class="text-3xl lg:text-4xl font-bold mt-3" style="color: var(--text-bright);">Iniciar Proyecto</h2>
        <p class="mt-2 text-sm" style="color: var(--text-muted);">Completa el formulario y recibirás respuesta en menos de 24 horas</p>
      </div>

      <!-- Layout de dos paneles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">

        <!-- PANEL IZQUIERDO — Formulario Gateway -->
        <div class="flex flex-col gap-6">

          <!-- Linea de metodo y endpoint -->
          <div class="flex items-center gap-3 font-mono text-sm pb-4 border-b border-dark-400">
            <span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              {{ formulario.metodo }}
            </span>
            <span style="color: var(--text-muted);">{{ formulario.endpoint }}</span>
          </div>

          <!-- Campo: Nombre -->
          <div class="flex flex-col gap-1.5">
            <label for="nombreInput" class="text-sm font-mono tracking-widest font-bold" style="color: var(--text-base);">"nombre"</label>
            <input
              id="nombreInput"
              v-model="formulario.cuerpo.nombre"
              type="text"
              placeholder="Tu nombre completo..."
              class="w-full bg-transparent border-b border-dark-400 text-sm pb-2 outline-none placeholder-slate-700 focus:border-primary"
              style="color: var(--text-bright);"
            />
          </div>

          <!-- Campo: Email -->
          <div class="flex flex-col gap-1.5">
            <label for="emailInput" class="text-sm font-mono tracking-widest font-bold" style="color: var(--text-base);">"email"</label>
            <input
              id="emailInput"
              v-model="formulario.cuerpo.email"
              type="email"
              placeholder="tu@correo.com"
              class="w-full bg-transparent border-b border-dark-400 text-sm pb-2 outline-none placeholder-slate-700 focus:border-primary"
              style="color: var(--text-bright);"
            />
          </div>

          <!-- Campo: Mensaje -->
          <div class="flex flex-col gap-1.5">
            <label for="mensajeInput" class="text-sm font-mono tracking-widest font-bold" style="color: var(--text-base);">"mensaje"</label>
            <textarea
              id="mensajeInput"
              v-model="formulario.cuerpo.mensaje"
              rows="4"
              placeholder="Describe tu proyecto o consulta..."
              class="w-full bg-transparent border-b border-dark-400 text-sm pb-2 outline-none placeholder-slate-700  focus:border-primary resize-none"
              style="color: var(--text-bright);"
            ></textarea>
          </div>

          <!-- Boton de Envio -->
          <button
            @click="enviarFormulario"
            :disabled="estado === 'ENVIANDO'"
            class="w-fit self-start px-8 py-2.5 btn-primary text-white rounded-md font-bold text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ etiquetaBoton() }}
          </button>

          <!-- Banner de respuesta en movil -->
          <div
            v-if="isMobile && logTerminal.length > 0"
            class="mt-2 p-2 rounded-lg border border-dark-400 font-mono text-xs bg-dark-800"
            :style="{
              borderColor: estado === 'ENVIADO' ? '#10B981' : estado === 'ERROR' ? '#EF4444' : 'var(--color-dark-400)',
            }"
          >
            <div
              v-for="(log, i) in logTerminal"
              :key="i"
              :class="log.tipo === 'error' ? 'text-red-500' : log.tipo === 'exito' ? 'text-emerald-500' : 'text-muted'"
            >
              {{ log.msg }}
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO — Consola JSON (Solo Escritorio) -->
        <div v-if="!isMobile" class="flex flex-col gap-4">

          <!-- Barra de título del IDE -->
          <div class="flex items-center gap-2 pb-3 border-b border-dark-400">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="ml-3 text-xs font-mono" style="color: var(--text-muted);">REQUEST_PAYLOAD.json</span>
          </div>

          <!-- Visor JSON en tiempo real -->
          <pre class="rounded-xl p-5 text-xs leading-relaxed font-mono overflow-x-auto border border-dark-400 flex-grow bg-dark-800"
            style="min-height: 200px;"><span style="color: var(--color-accent);">{</span>
    <span class="text-primary font-semibold">"endpoint"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.endpoint }}"</span>,
    <span class="text-primary font-semibold">"metodo"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.metodo }}"</span>,
    <span class="text-primary font-semibold">"cuerpo"</span>: <span style="color: var(--color-accent);">{</span>
      <span class="text-primary font-semibold">"nombre"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.cuerpo.nombre }}"</span>,
      <span class="text-primary font-semibold">"email"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.cuerpo.email }}"</span>,
      <span class="text-primary font-semibold">"mensaje"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.cuerpo.mensaje.replace(/\n/g, '\\n') }}"</span>
    <span style="color: var(--color-accent);">}</span>
<span style="color: var(--color-accent);">}</span>
          </pre>

          <!-- Terminal de Logs del Sistema -->
          <div class="rounded-xl border border-dark-400 overflow-hidden bg-dark-700 shadow-inner">
            <div class="px-4 py-2 border-b border-dark-400 flex items-center gap-2">
              <span class="text-xs font-mono" style="color: var(--text-muted);">SYSTEM_LOGS</span>
              <span class="ml-auto w-2 h-2 rounded-full" 
                    :style="{ background: estado === 'ENVIADO' ? 'bg-emerald-500' : estado === 'ERROR' ? 'bg-red-500' : 'bg-primary' }"></span>
            </div>
            <div class="p-4 min-h-[60px] flex flex-col justify-end gap-1">
              <p v-if="logTerminal.length === 0" class="font-mono text-xs animate-pulse" style="color: var(--text-muted);">> Esperando transmisión...</p>
              <p
                v-for="(log, i) in logTerminal"
                :key="i"
                class="font-mono text-xs"
                :class="log.tipo === 'error' ? 'text-red-500' : log.tipo === 'exito' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
              >
                {{ log.msg }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PIE DE PAGINA -->
    <div class="border-t border-dark-400 py-6 px-6 bg-dark-800">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs font-mono" style="color: var(--text-muted);">
          &copy; {{ anioActual }} <span style="color: var(--color-primary);">Tapia Tech</span>. Todos los derechos reservados.
        </p>
        <div class="flex items-center gap-4">
          <a href="https://github.com/ElTapiaGit" target="_blank" class="text-xs font-mono transition-colors hover:text-primary" style="color: var(--text-muted);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">GitHub</a>
          <span style="color: var(--color-dark-400);">·</span>
          <a href="https://linkedin.com/in/jhon-e-tapia-vargas-068b6a3ba" target="_blank" class="text-xs font-mono transition-colors hover:text-primary" style="color: var(--text-muted);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">LinkedIn</a>
          <span style="color: var(--color-dark-400);">·</span>
          <a href="mailto:tapiajhon111@gmail.com" class="text-xs font-mono transition-colors hover:text-primary" style="color: var(--text-muted);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">Correo</a>
        </div>
      </div>
    </div>
  </footer>
</template>
