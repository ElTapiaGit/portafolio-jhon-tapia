/* ═══════════════════════════════════════════════════════════
   skills.js — Nodos, Conexiones y Filtros del Grafo Técnico
   Capa de datos para SectionSkills.vue
   ═══════════════════════════════════════════════════════════ */

export const nodosData = [
  { 
    id: 'Vue', group: 1, label: 'Vue 3', icono: '/asset/icons/vue.svg',
    tipo: 'Frontend Core',
    descripcion: 'Desarrollo de interfaces reactivas con Composition API, Pinia y Single Page Applications.',
    proyectos: ['Portafolio Tapia Tech', 'Reservas Kordya']
  },
  { 
    id: 'Flutter', group: 3, label: 'Flutter', icono: '/asset/icons/flutter.svg',
    tipo: 'Mobile Architecture',
    descripcion: 'Clean Architecture, manejo de estado con Provider, persistencia offline-first con Hive y SQLite.',
    proyectos: ['CosechApp', 'Finance Local', 'Wire Flow VE']
  },
  { 
    id: 'Node', group: 2, label: 'Node.js', icono: '/asset/icons/node.svg',
    tipo: 'Backend & APIs',
    descripcion: 'Servicios RESTful, WebSockets asíncronos y orquestación de pipelines RAG locales.',
    proyectos: ['Enterprise RAG Core', 'RetoChat']
  },
  { 
    id: 'Laravel', group: 2, label: 'Laravel', icono: '/asset/icons/laravel.svg',
    tipo: 'Backend Enterprise',
    descripcion: 'Patrón MVC modular, middleware de autorización RBAC y generación de reportes transaccionales.',
    proyectos: ['Sistema Inventario ULAT']
  },
  { 
    id: 'PostgreSQL', group: 2, label: 'PostgreSQL', icono: '/asset/icons/postgresql.svg',
    tipo: 'Database & Vector Search',
    descripcion: 'Almacenamiento relacional normalizado y búsqueda semántica de alta velocidad con pgvector.',
    proyectos: ['Enterprise RAG Core', 'RetoChat']
  },
  { 
    id: 'MySQL', group: 2, label: 'MySQL', icono: '/asset/icons/mysql.svg',
    tipo: 'Relational Database',
    descripcion: 'Modelado relacional con llaves foráneas e índices compuestos para auditoría de activos.',
    proyectos: ['Sistema Inventario ULAT']
  },
  { 
    id: 'MongoDB', group: 2, label: 'MongoDB', icono: '/asset/icons/mongodb.svg',
    tipo: 'NoSQL Document Store',
    descripcion: 'Almacenamiento de documentos JSON flexible para esquemas no relacionales y telemetría.',
    proyectos: ['Supermarket Backend API']
  },
  { 
    id: 'PHP', group: 2, label: 'PHP', icono: '/asset/icons/php.svg',
    tipo: 'Backend Language',
    descripcion: 'Desarrollo backend robusto con tipado estricto y controladores orientados a objetos.',
    proyectos: ['Sistema Inventario ULAT']
  },
  { 
    id: 'Git', group: 3, label: 'Git & GitHub', icono: '/asset/icons/git.svg',
    tipo: 'Version Control & CI/CD',
    descripcion: 'Flujos GitFlow, control de versiones atómico y despliegue de releases en tiendas y web.',
    proyectos: ['Todos los repositorios']
  },
  { 
    id: 'Postman', group: 3, label: 'Postman', icono: '/asset/icons/postman.svg',
    tipo: 'API Testing & Contracts',
    descripcion: 'Documentación de colecciones de endpoints, pruebas de carga y validación de contratos JSON.',
    proyectos: ['APIs RESTful de backend']
  },
  { 
    id: 'Figma', group: 1, label: 'Figma', icono: '/asset/icons/figma.svg',
    tipo: 'UI/UX Prototyping',
    descripcion: 'Diseño de wireframes de alta fidelidad, design systems y preparación de assets SVG.',
    proyectos: ['Diseño de UI Portafolio', 'Finance Local']
  }
]

export const linksData = [
  { source: 'Vue',     target: 'Node' },
  { source: 'Node',    target: 'MongoDB' },
  { source: 'Node',    target: 'PostgreSQL' },
  { source: 'PHP',     target: 'MySQL' },
  { source: 'Laravel', target: 'PHP' },
  { source: 'Laravel', target: 'Vue' },
  { source: 'Flutter', target: 'Node' },
  { source: 'Git',     target: 'Node' },
  { source: 'Figma',   target: 'Vue' },
]

export const filtros = [
  { id: 0, etiqueta: 'Todos' },
  { id: 1, etiqueta: 'Frontend' },
  { id: 2, etiqueta: 'Backend & DB' },
  { id: 3, etiqueta: 'Mobile & Tools' },
]
