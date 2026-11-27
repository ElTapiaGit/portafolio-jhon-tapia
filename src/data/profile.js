/* ═══════════════════════════════════════════════════════════
   profile.js — Datos Profesionales, Formación y Filosofías
   Capa de datos para SectionAbout.vue
   ═══════════════════════════════════════════════════════════ */

export const dbData = {
  resultado: {
    institucion: 'Universidad Latinoamericana',
    titulo: 'Ingeniería de Sistemas',
    estado: 'Egresado',
    ubicacion: 'Cochabamba, BO',
    enfoque: 'Desarrollo Full Stack & Mobile',
  },
}

export const filosofias = [
  'Arquitectura Limpia como pilar innegociable de diseño de sistemas.',
  'Rendimiento, auditabilidad y robustez sobre complejidad innecesaria.',
  'Código tipado, testeable, mantenible y escalable por defecto.',
  'Desarrollo centrado en resolver lógica de negocio y experiencia del usuario.',
  'Entrega continua, despliegues reproducibles y monitoreo constante.',
]

export const pestanas = [
  { id: 'ingenieria', etiqueta: '01. Ingeniería' },
  { id: 'formacion',  etiqueta: '02. Formación Académica' },
  { id: 'filosofia',  etiqueta: '03. Filosofía' },
]

export const capacidades = [
  'Desarrollo Full Stack Web',
  'Apps Móviles Flutter',
  'APIs RESTful & Microservicios',
  'Sistemas de Gestión & Pagos QR',
  'Arquitectura Limpia & SOLID',
  'Bases de Datos SQL & NoSQL',
]

export const ecosistema = [
  'Flutter',
  'Vue 3',
  'Node.js',
  'TypeScript',
  'Laravel',
  'PostgreSQL',
  'MongoDB',
  'Tailwind CSS',
]
