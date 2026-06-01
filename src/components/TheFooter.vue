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
    logTerminal.value = [{ tipo: 'error', msg: '> 422 ERROR: ERROR: Campos incompletos o vacíos' }]
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
    class="relative w-full border-t border-slate-800"
    style="background: #0E1118;"
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
          <div class="flex items-center gap-3 font-mono text-sm pb-4 border-b border-slate-800">
            <span class="px-2 py-0.5 rounded text-xs font-bold bg-green-900/40 text-green-400 border border-green-900">
              {{ formulario.metodo }}
            </span>
            <span style="color: var(--text-muted);">{{ formulario.endpoint }}</span>
          </div>

          <!-- Campo: Nombre -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-mono tracking-widest font-bold" style="color: var(--text-base);">"nombre"</label>
            <input
              v-model="formulario.cuerpo.nombre"
              type="text"
              placeholder="Tu nombre completo..."
              class="w-full bg-transparent border-b text-sm pb-2 outline-none placeholder-slate-700 transition-colors duration-300 focus:border-blue-600"
              style="border-color: #2E3650; color: var(--text-bright);"
            />
          </div>

          <!-- Campo: Email -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-mono tracking-widest font-bold" style="color: var(--text-base);">"email"</label>
            <input
              v-model="formulario.cuerpo.email"
              type="email"
              placeholder="tu@correo.com"
              class="w-full bg-transparent border-b text-sm pb-2 outline-none placeholder-slate-700 transition-colors duration-300 focus:border-blue-600"
              style="border-color: #2E3650; color: var(--text-bright);"
            />
          </div>

          <!-- Campo: Mensaje -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-mono tracking-widest font-bold" style="color: var(--text-base);">"mensaje"</label>
            <textarea
              v-model="formulario.cuerpo.mensaje"
              rows="4"
              placeholder="Describe tu proyecto o consulta..."
              class="w-full bg-transparent border-b text-sm pb-2 outline-none placeholder-slate-700 transition-colors duration-300 focus:border-blue-600 resize-none"
              style="border-color: #2E3650; color: var(--text-bright);"
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
            class="mt-2 p-3 rounded-lg border font-mono text-xs"
            :style="{
              background: '#0E1118',
              borderColor: estado === 'ENVIADO' ? '#166534' : '#7F1D1D',
            }"
          >
            <div
              v-for="(log, i) in logTerminal"
              :key="i"
              :style="{ color: log.tipo === 'error' ? '#F87171' : log.tipo === 'exito' ? '#4ADE80' : 'var(--text-muted)' }"
            >
              {{ log.msg }}
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO — Consola JSON (Solo Escritorio) -->
        <div v-if="!isMobile" class="flex flex-col gap-4">

          <!-- Barra de título del IDE -->
          <div class="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
            <span class="ml-3 text-xs font-mono" style="color: var(--text-muted);">REQUEST_PAYLOAD.json</span>
          </div>

          <!-- Visor JSON en tiempo real -->
          <pre class="rounded-xl p-5 text-xs leading-relaxed font-mono overflow-x-auto border border-slate-800 flex-grow"
            style="background: #111520; min-height: 200px;"><span style="color: #F59E0B;">{</span>
  <span style="color: #93C5FD;">"endpoint"</span>: <span style="color: #86EFAC;">"{{ formulario.endpoint }}"</span>,
  <span style="color: #93C5FD;">"metodo"</span>: <span style="color: #86EFAC;">"{{ formulario.metodo }}"</span>,
  <span style="color: #93C5FD;">"cuerpo"</span>: <span style="color: #F59E0B;">{</span>
    <span style="color: #93C5FD;">"nombre"</span>: <span style="color: #86EFAC;">"{{ formulario.cuerpo.nombre }}"</span>,
    <span style="color: #93C5FD;">"email"</span>: <span style="color: #86EFAC;">"{{ formulario.cuerpo.email }}"</span>,
    <span style="color: #93C5FD;">"mensaje"</span>: <span style="color: #86EFAC;">"{{ formulario.cuerpo.mensaje.replace(/\n/g, '\\n') }}"</span>
  <span style="color: #F59E0B;">}</span>
<span style="color: #F59E0B;">}</span>
          </pre>

          <!-- Terminal de Logs del Sistema -->
          <div class="rounded-xl border border-slate-800 overflow-hidden" style="background: #0A0D14;">
            <div class="px-4 py-2 border-b border-slate-800 flex items-center gap-2">
              <span class="text-xs font-mono" style="color: var(--text-muted);">SYSTEM_LOGS</span>
              <span class="ml-auto w-2 h-2 rounded-full" :style="{ background: estado === 'ENVIADO' ? '#22C55E' : estado === 'ERROR' ? '#EF4444' : '#2563EB' }"></span>
            </div>
            <div class="p-4 min-h-[80px] flex flex-col justify-end gap-1">
              <p v-if="logTerminal.length === 0" class="font-mono text-xs animate-pulse" style="color: var(--text-muted);">> Esperando transmisión...</p>
              <p
                v-for="(log, i) in logTerminal"
                :key="i"
                class="font-mono text-xs"
                :style="{ color: log.tipo === 'error' ? '#F87171' : log.tipo === 'exito' ? '#4ADE80' : 'var(--text-muted)' }"
              >
                {{ log.msg }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PIE DE PAGINA -->
    <div class="border-t border-slate-800 py-6 px-6" style="background: #0A0D14;">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs font-mono" style="color: var(--text-muted);">
          &copy; {{ anioActual }} <span style="color: var(--color-primary);">Tapia Tech</span>. Todos los derechos reservados.
        </p>
        <div class="flex items-center gap-4">
          <a href="https://github.com/ElTapiaGit" target="_blank" class="text-xs font-mono transition-colors" style="color: var(--text-muted);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">GitHub</a>
          <span style="color: #2E3650;">·</span>
          <a href="https://linkedin.com/in/jhon-tapia" target="_blank" class="text-xs font-mono transition-colors" style="color: var(--text-muted);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">LinkedIn</a>
          <span style="color: #2E3650;">·</span>
          <a href="mailto:jhon@tapiatech.dev" class="text-xs font-mono transition-colors" style="color: var(--text-muted);" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">Correo</a>
        </div>
      </div>
    </div>
  </footer>
</template>
