<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

/* ── Estado Reactivo ── */
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
const estado = ref('IDLE') // IDLE, ENVIANDO, ENVIADO, ERROR

/* ── Envío del Formulario a EmailJS ── */
async function enviarFormulario() {
  if (estado.value === 'ENVIANDO') return

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
    
    formulario.value.cuerpo = { nombre: '', email: '', mensaje: '' }
    
    setTimeout(() => { 
      estado.value = 'IDLE'
      logTerminal.value = [] 
    }, 4000)
  } catch (error) {
    estado.value = 'ERROR'
    logTerminal.value.push({ tipo: 'error', msg: '> 500 ERROR: Fallo en la infraestructura de transporte.' })
    console.error(error)
  }
}

function etiquetaBoton() {
  if (estado.value === 'ENVIANDO') return 'STATUS: ENVIANDO...'
  if (estado.value === 'ERROR') return 'Reintentar Envío'
  if (estado.value === 'ENVIADO') return 'Mensaje Enviado [OK]'
  return 'Enviar Mensaje'
}
</script>

<template>
  <footer
    id="contacto"
    class="relative w-full border-t border-dark-400 bg-dark transition-colors scroll-mt-4 md:scroll-mt-6 pt-10 md:pt-16"
    aria-label="Sección — Contacto y Pie de Página"
  >
    <!-- Contenedor Alineado con Hero, About y Proyectos -->
    <div class="relative z-10 w-full max-w-6xl md:max-w-7xl mx-auto pl-10 pr-5 sm:px-8 lg:px-8 pb-12 md:pb-16">

      <!-- Encabezado de Sección -->
      <div class="mb-10 w-full">
        <span class="status-badge mb-3">Contacto</span>
        <h2 class="text-3xl lg:text-4xl font-bold mt-3 text-text-bright">Iniciar Proyecto</h2>
        <p class="mt-2 text-sm text-text-muted">Completa el formulario y recibirás respuesta en menos de 24 horas</p>
      </div>

      <!-- Layout de Dos Paneles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

        <!-- PANEL IZQUIERDO: Formulario Gateway -->
        <div class="flex flex-col gap-5">

          <!-- Método y Endpoint -->
          <div class="flex items-center gap-3 font-mono text-sm pb-3 border-b border-dark-400">
            <span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              {{ formulario.metodo }}
            </span>
            <span class="text-text-muted font-medium">{{ formulario.endpoint }}</span>
          </div>

          <!-- Campo: Nombre -->
          <div class="flex flex-col gap-1.5">
            <label for="nombreInput" class="text-xs font-mono tracking-widest font-bold text-text-base">"nombre"</label>
            <input
              id="nombreInput"
              v-model="formulario.cuerpo.nombre"
              type="text"
              placeholder="Tu nombre completo..."
              class="w-full bg-transparent border-b border-dark-400 text-sm pb-2 outline-none text-text-bright placeholder:text-text-muted/50 focus:border-primary transition-colors"
            />
          </div>

          <!-- Campo: Email -->
          <div class="flex flex-col gap-1.5">
            <label for="emailInput" class="text-xs font-mono tracking-widest font-bold text-text-base">"email"</label>
            <input
              id="emailInput"
              v-model="formulario.cuerpo.email"
              type="email"
              placeholder="tu@correo.com"
              class="w-full bg-transparent border-b border-dark-400 text-sm pb-2 outline-none text-text-bright placeholder:text-text-muted/50 focus:border-primary transition-colors"
            />
          </div>

          <!-- Campo: Mensaje -->
          <div class="flex flex-col gap-1.5">
            <label for="mensajeInput" class="text-xs font-mono tracking-widest font-bold text-text-base">"mensaje"</label>
            <textarea
              id="mensajeInput"
              v-model="formulario.cuerpo.mensaje"
              rows="4"
              placeholder="Describe tu proyecto o consulta..."
              class="w-full bg-transparent border-b border-dark-400 text-sm pb-2 outline-none text-text-bright placeholder:text-text-muted/50 focus:border-primary resize-none transition-colors"
            ></textarea>
          </div>

          <!-- Botón de Envío -->
          <button
            type="button"
            @click="enviarFormulario"
            :disabled="estado === 'ENVIANDO'"
            class="btn-primary w-fit self-start mt-2 px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ etiquetaBoton() }}
          </button>

          <!-- Banner de respuesta en celular (Oculto en desktop por CSS) -->
          <div
            v-if="logTerminal.length > 0"
            class="block md:hidden mt-2 p-3 rounded-lg border font-mono text-xs bg-dark-800"
            :class="estado === 'ENVIADO' ? 'border-emerald-500' : estado === 'ERROR' ? 'border-red-500' : 'border-dark-400'"
          >
            <div
              v-for="(log, i) in logTerminal"
              :key="i"
              :class="log.tipo === 'error' ? 'text-red-500' : log.tipo === 'exito' ? 'text-emerald-500' : 'text-text-muted'"
            >
              {{ log.msg }}
            </div>
          </div>

        </div>

        <!-- PANEL DERECHO: Consola JSON y Logs (Oculto en celular por CSS sin CLS) -->
        <div class="hidden md:flex flex-col gap-4">

          <!-- Barra de Título del IDE -->
          <div class="flex items-center gap-2 pb-2.5 border-b border-dark-400">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="ml-2 text-xs font-mono text-text-muted">REQUEST_PAYLOAD.json</span>
          </div>

          <!-- Visor JSON -->
          <pre class="rounded-xl p-4 text-xs leading-relaxed font-mono overflow-x-auto border border-dark-400 bg-dark-800 text-text-base flex-grow"><span class="text-accent">{</span>
    <span class="text-primary font-semibold">"endpoint"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.endpoint }}"</span>,
    <span class="text-primary font-semibold">"metodo"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.metodo }}"</span>,
    <span class="text-primary font-semibold">"cuerpo"</span>: <span class="text-accent">{</span>
      <span class="text-primary font-semibold">"nombre"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.cuerpo.nombre }}"</span>,
      <span class="text-primary font-semibold">"email"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.cuerpo.email }}"</span>,
      <span class="text-primary font-semibold">"mensaje"</span>: <span class="text-emerald-500 font-medium">"{{ formulario.cuerpo.mensaje.replace(/\n/g, '\\n') }}"</span>
    <span class="text-accent">}</span>
<span class="text-accent">}</span></pre>

          <!-- Terminal de Logs -->
          <div class="rounded-xl border border-dark-400 overflow-hidden bg-dark-800">
            <div class="px-3.5 py-2 border-b border-dark-400 flex items-center justify-between">
              <span class="text-[11px] font-mono text-text-muted">SYSTEM_LOGS</span>
              <span
                class="w-2 h-2 rounded-full transition-colors"
                :class="estado === 'ENVIADO' ? 'bg-emerald-500' : estado === 'ERROR' ? 'bg-red-500' : 'bg-primary'"
              ></span>
            </div>
            <div class="p-3.5 min-h-[60px] flex flex-col justify-end gap-1">
              <p v-if="logTerminal.length === 0" class="font-mono text-xs text-text-muted animate-pulse">
                > Esperando transmisión...
              </p>
              <p
                v-for="(log, i) in logTerminal"
                :key="i"
                class="font-mono text-xs"
                :class="log.tipo === 'error' ? 'text-red-500' : log.tipo === 'exito' ? 'text-emerald-500' : 'text-text-muted'"
              >
                {{ log.msg }}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- PIE DE PÁGINA (Alineado con el mismo contenedor) -->
    <div class="border-t border-dark-400 py-6 bg-dark-800">
      <div class="w-full max-w-6xl md:max-w-7xl mx-auto pl-10 pr-5 sm:px-8 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs font-mono text-text-muted text-center sm:text-left">
          &copy; {{ anioActual }} <span class="text-primary font-medium">Tapia Tech</span>. Todos los derechos reservados.
        </p>
        <div class="flex items-center gap-4 text-xs font-mono text-text-muted">
          <a href="https://github.com/ElTapiaGit" target="_blank" rel="noopener" class="transition-colors hover:text-primary">
            GitHub
          </a>
          <span class="text-dark-400">·</span>
          <a href="https://linkedin.com/in/jhon-e-tapia-vargas-068b6a3ba" target="_blank" rel="noopener" class="transition-colors hover:text-primary">
            LinkedIn
          </a>
          <span class="text-dark-400">·</span>
          <a href="mailto:tapiajhon111@gmail.com" class="transition-colors hover:text-primary">
            Correo
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>