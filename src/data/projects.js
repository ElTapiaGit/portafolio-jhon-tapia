/* ═══════════════════════════════════════════════════════════
   projects.js — Catálogo de Proyectos y Categorías
   Capa de datos para SectionProjects.vue
   ═══════════════════════════════════════════════════════════ */

export const categorias = ['Todos', 'Móvil', 'Web', 'Backend / IA']

export function obtenerClasesEstado(tipo) {
  switch (tipo) {
    case 'terminado': return 'badge-estado-terminado'
    case 'prueba': return 'badge-estado-prueba'
    case 'desarrollo': return 'badge-estado-desarrollo'
    default: return 'badge-estado-default'
  }
}

export const proyectos = [
  {
    id: 'ulat-inventory',
    titulo: 'Sistema Inventario Institucional - ULAT',
    descripcion: 'Plataforma web para la gestión integral de activos, infraestructura multisede, bitácoras de mantenimiento y control de roles.',
    estado: 'Implementado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Full Stack',
    stack: ['Laravel', 'MySQL', 'Bootstrap', 'Blade'],
    repo: 'https://github.com/ElTapiaGit/inventorySedes.git',
    arquitectura: 'MVC / RBAC',
    imagen: '/asset/images/banner-ulat.webp',
    categoria: 'Web',
    problem: 'Pérdida de trazabilidad de activos físicos y dificultades en auditorías entre sedes universitarias debido a registros manuales.',
    architecture: 'Arquitectura MVC en Laravel con control de acceso basado en roles (RBAC) y registro de auditoría de transacciones.',
    keyHighlights: [
      'Control de accesos multi-rol con validaciones en middleware para operaciones sensibles.',
      'Módulo de transferencias inter-sedes con confirmación de recepción y trazabilidad de custodia.',
      'Generación y exportación de reportes de inventario valorado en PDF y Excel.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/inventorySedes.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'cosechapp',
    titulo: 'CosechApp - Control Agrónomo',
    descripcion: 'Aplicación móvil offline-first para gestión de cosechas, registro de pesajes en campo y generación de planillas Excel en el dispositivo.',
    estado: 'Finalizado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Flutter',
    stack: ['Flutter', 'Supabase', 'Hive', 'GoRouter'],
    repo: 'https://github.com/ElTapiaGit/cosechapp-web-mobile.git',
    arquitectura: 'MVVM / Clean Architecture',
    imagen: '/asset/images/banner-cosechapp.webp',
    categoria: 'Móvil',
    problem: 'Falta de conectividad celular en zonas agrícolas remotas, lo que impedía el registro directo de pesajes y lotes cosechados.',
    architecture: 'Patrón MVVM en Flutter con almacenamiento local en Hive y sincronización asíncrona hacia Supabase al detectar red.',
    keyHighlights: [
      'Persistencia local-first para operar sin conexión durante toda la jornada de campo.',
      'Exportación de planillas Excel y reportes consolidados directamente desde el dispositivo.',
      'Sincronización automática de datos pendientes al restablecerse la conexión a internet.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/cosechapp-web-mobile.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'finance-local',
    titulo: 'Finance Local - Finanzas Personales',
    descripcion: 'Aplicación móvil offline-first para control financiero personal con almacenamiento 100% local, sin servidores externos ni cuentas obligatorias.',
    estado: 'Publicado',
    tipoEstado: 'terminado',
    rol: 'Desarrollador Flutter',
    stack: ['Flutter', 'Dart', 'Hive'],
    repo: 'https://github.com/ElTapiaGit/finance-local-app.git',
    arquitectura: 'Clean Architecture / Hive',
    imagen: '/asset/images/proyect-finance.webp',
    categoria: 'Móvil',
    problem: 'Preocupación de los usuarios por la privacidad de sus datos financieros al usar servicios en la nube con cobros recurrentes.',
    architecture: 'Clean Architecture en Flutter con base de datos NoSQL embebida (Hive) para lectura y escritura instantánea.',
    keyHighlights: [
      'Persistencia 100% local en el dispositivo para garantizar privacidad absoluta.',
      'Cálculo reactivo de balances, presupuestos y resúmenes mensuales.',
      'Automatización de pruebas y publicación en la tienda de Google Play Store.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/finance-local-app.git',
      playstore: 'https://play.google.com/store/apps/details?id=com.eltapiadev.finances&pcampaignid=web_share',
      live: null
    }
  },
  {
    id: 'enterprise-rag',
    titulo: 'Enterprise RAG Core - Local AI',
    descripcion: 'Motor de búsqueda semántica y recuperación aumentada (RAG) sobre documentación técnica local, ejecutado mediante Docker, pgvector y Ollama.',
    estado: 'Finalizado',
    tipoEstado: 'terminado',
    rol: 'Backend & AI Integration',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Ollama'],
    repo: 'https://github.com/ElTapiaGit/RAG-Empresarial-Local.git',
    arquitectura: 'Vector Search / RAG Pipeline',
    imagen: '/asset/images/software_infrastructure.webp',
    categoria: 'Backend / IA',
    problem: 'Dificultad para consultar documentación técnica extensa y riesgos de privacidad al enviar información confidencial a APIs en la nube.',
    architecture: 'Pipeline en Node.js con base vectorial pgvector en PostgreSQL y LLM local servido mediante Ollama en contenedores Docker.',
    keyHighlights: [
      'Particionado y limpieza de documentos técnicos para generación de fragmentos contextuales.',
      'Indexación semántica y búsqueda por similitud vectorial con pgvector en PostgreSQL.',
      'Generación de respuestas con contexto recuperado ejecutando modelos locales sin conexión externa.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/RAG-Empresarial-Local.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'wireflow-ve',
    titulo: 'Wire Flow VE - Instaladores',
    descripcion: 'Aplicación móvil para técnicos de estaciones de carga eléctrica. Permite registrar revisiones, checklists de seguridad y avances de obra en campo.',
    estado: 'En prueba',
    tipoEstado: 'prueba',
    rol: 'Desarrollador Móvil',
    stack: ['Flutter', 'Dart', 'SQLite'],
    repo: 'https://github.com/ElTapiaGit/Wire-Flow-VE-electrolineras.git',
    arquitectura: 'Clean Architecture / SQLite',
    imagen: '/asset/images/banner-wireflowve.webp',
    categoria: 'Móvil',
    problem: 'Dificultad de los instaladores para documentar checklists técnicos, mediciones y protocolos de seguridad de forma estandarizada en terreno.',
    architecture: 'Clean Architecture con persistencia relacional local en SQLite para trabajar sin dependencia de señal continua.',
    keyHighlights: [
      'Flujo secuencial de validación técnica paso a paso antes de autorizar la energización.',
      'Registro fotográfico de evidencias técnicas vinculado a cada orden de trabajo.',
      'Guardado transaccional por etapas para prevenir pérdida de reportes en campo.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/Wire-Flow-VE-electrolineras.git',
      playstore: null,
      live: null
    }
  },
  {
    id: 'reto-chat',
    titulo: 'Plataforma de Chat para Introvertidos',
    descripcion: 'Aplicación web de mensajería en tiempo real con dinámicas de conversación estructuradas para facilitar la interacción paso a paso.',
    estado: 'En desarrollo',
    tipoEstado: 'desarrollo',
    rol: 'Desarrollador Web',
    stack: ['HTML', 'Node.js', 'PostgreSQL', 'WebSockets'],
    repo: 'https://github.com/ElTapiaGit/RetoChat.git',
    arquitectura: 'Event-Driven / WebSockets',
    imagen: '/asset/images/proyect-chat.webp',
    categoria: 'Web',
    problem: 'Abandono frecuente en salas de chat abiertas debido a la dificultad para iniciar o mantener conversaciones sin disparadores guiados.',
    architecture: 'Servidor en Node.js con comunicación bidireccional vía WebSockets y base de datos relacional PostgreSQL.',
    keyHighlights: [
      'Comunicación en tiempo real con WebSockets para mensajería instantánea y presencia.',
      'Salas con dinámicas de conversación estructuradas y temporizadores de interacción.',
      'Persistencia de sesiones, perfiles y registros de actividad en PostgreSQL.'
    ],
    links: {
      github: 'https://github.com/ElTapiaGit/RetoChat.git',
      playstore: null,
      live: null
    }
  }
]
