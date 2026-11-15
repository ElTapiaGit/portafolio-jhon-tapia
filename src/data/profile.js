/* ═══════════════════════════════════════════════════════════
   profile.js — Datos Profesionales, Formación y Filosofías
   Capa de datos para SectionAbout.vue
   ═══════════════════════════════════════════════════════════ */

export const dbData = {
  consulta: 'SELECT * FROM educacion WHERE estado = activo',
  resultado: {
    institucion: 'Universidad Latinoamericana',
    titulo: 'Ingeniería de Sistemas',
    estado: 'Egresado',
    ubicacion: 'Cochabamba, BO',
    enfoque: 'Desarrollo Full Stack',
  },
}

export const filosofias = [
  'Arquitectura Limpia como pilar de diseño de sistemas',
  'Rendimiento sobre complejidad innecesaria',
  'Código mantenible y escalable por defecto',
  'Desarrollo orientado al producto y al usuario final',
  'Integración continua y entrega iterativa de valor',
]

export const pestanas = [
  { id: 'ingenieria', etiqueta: '01. Ingeniería' },
  { id: 'formacion',  etiqueta: '02. Formación Académica' },
  { id: 'filosofia',  etiqueta: '03. Filosofía' },
]

export const capacidades = [
  'Desarrollo Full Stack',
  'Apps Móviles Flutter',
  'APIs RESTful',
  'Sistemas POS',
  'Arquitectura Limpia',
  'Bases de Datos SQL/NoSQL'
]
