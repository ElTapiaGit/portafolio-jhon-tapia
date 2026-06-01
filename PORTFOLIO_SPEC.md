# Portfolio Specification Blueprint: "The Living Architecture"

## 1. Core Technical Stack & Constraints
- **Framework:** Vue 3 (Pure JavaScript, STRICTOR RULE: NO TypeScript).
- **Architecture:** Composition API using `<script setup>` syntax.
- **Styling:** Tailwind CSS v3 (To be installed and configured by the agent).
- **Animation & Kinetics:** GSAP (GreenSock) + ScrollTrigger.
- **Scroll Engine:** Lenis Scroll (Smooth scroll management).
- **Data Physics Engine:** D3.js (Specifically `d3-force` for the skills canvas).
- **Design Philosophy:** Dark industrial high-performance UI (`#0B0F19`), system telemetry emulation, zero generic components.

## 2. Professional Context & Data
- **Developer:** Jhon Eligio Tapia Vargas
- **Role:** Ingeniero de Sistemas - Desarrollador Full Stack
- **Origin:** Cochabamba, Bolivia
- **Education:** Egresado de la Universidad Latinoamericana
- **Brand:** Tapia Tech (Independent Software Development & Solutions)
- **Key Projects:**
  1. *Wire Flow VE - Instaladores:* Mobile app for EV charging station technicians. Built with Flutter, Dart, SQLite. Status: "En prueba cerrada".
  2. *Finance Local - Finanzas Personales:* Offline-first app, total privacy. Built with Flutter, Dart, Hive (NoSQL), Clean Architecture. Status: "Google Play Store".
  3. *App Móvil de Gestión de Entrenamientos:* Gym app for routines and planning. Built with Flutter, Node.js, MongoDB. Status: "En desarrollo".
  4. *Plataforma de Chat para Introvertidos:* Gamified real-time chat with interaction challenges. Built with HTML, CSS, JS, Node.js, PostgreSQL, WebSockets. Status: "En desarrollo".
  5. *Backend Supermercado (POS):* RESTful API, stock control, role-based JWT auth. Built with Node.js, Express, PostgreSQL. Status: "Pruebas Finales".
  6. *Frontend Supermercado (POS):* UI for the POS system. Built with Vue.js, TailwindCSS, Pinia. Status: "En desarrollo".

---

## 3. Detailed Component Architecture

### Section 1: Hero (`SectionHero.vue`)
- **Layout (Desktop):** Asymmetric grid (60% Left text / 40% Right Canvas). Background `#0B0F19`.
- **Left Content:** Instant cryptographic decoding/glitch reveal effect for "Jhon Eligio Tapia Vargas" using GSAP ScrambleText plugin or highly optimized custom microsecond JS text scrambler (Execution time < 300ms. NO slow typewriter effects). Subtitles enter with a bottom-to-top clip-path reveal in under 400ms.
- **Right Content (Particle Canvas):** Loads `/asset/imagenes/perfil-remove.webp` (Half-body shot, facing front, light blue shirt, tie, transparent background). A JS script maps the pixels onto an HTML5 `<canvas>`.
- **Interactions:** 
  - *Mouse Proximity:* Computes distance between cursor and pixel particles. Hovering over the chest area (light blue shirt) applies mathematical repulsion to simulate a "digital tear/shattering effect". Hovering over the tie applies a wave/elastic deformation algorithm.
  - *Lerp Return:* Moving the cursor away triggers a Linear Interpolation (Lerp) function to snap particles back to their original buffer coordinates with an elastic damping effect.
- **Mobile Adaptation:** Uses a `ResizeObserver` or `window.matchMedia` to destroy the particle canvas context on mobile devices (< 768px) to protect battery and maintain 60 FPS. Replaces it with the static `.webp` image using a geometric CSS `clip-path`. Applies a parallax effect using the device gyroscope (`transform: translate3d`) mapped to phone tilt.

### Section 2: About Me (`SectionAbout.vue`)
- **Layout:** High-end Software Architecture Blueprint rendered via dynamic inline SVG. Nodes connect Jhon Tapia (Core Engine) to education (DB Node: Universidad Latinoamericana) and brand (Environment Node: Tapia Tech).
- **Interactions:** 
  - Lines use SVG `stroke-dasharray` animated with GSAP `stroke-dashoffset` to create infinite pulsing laser paths (Emerald Green and Cyan Blue).
  - Hovering over `[Core Engine]` displays a sleek glassmorphism card detailing engineering philosophies.
  - Hovering over `[DB Node]` blinks twice (database query simulation) and renders a monospace clean JSON object containing graduation and location metadata (Cochabamba, BO).
  - Hovering over `[Environment]` spits out vertical terminal-like compilation logs of current active roll.
- **Mobile Adaptation:** Collapses the horizontal SVG into a single clean vertical pipeline trace via CSS Grid. Connection lines become strictly vertical. "Hover" states are replaced by tap triggers that expand nodes vertically with an elastic GSAP layout push.

### Section 3: Projects (`SectionProjects.vue`)
- **Layout (Desktop):** Triggers `ScrollTrigger.create({ pin: true })`. Locks vertical scroll. Mouse wheel navigation moves a horizontal pipeline row from right to left. Each project is styled as an isolated industrial infrastructure deployment container.
- **Interactions (X-Ray Technical Scanner):** Center of the viewport acts as a technical scanner zone. When a project card passes the center, a diagonal CSS/GSAP clip-path overlay slides across the project UI image, seamlessly revealing the underlying technical schema: its architecture diagram (Clean Architecture) and database infrastructure icons (Hive/SQLite). Telemetry monitors display metadata (Role, GitHub repo links, Play Store badges).
- **Mobile Adaptation:** Completely deactivates the pinned horizontal scroll. Reconfigures the section into a vertical **Stacked Cards Effect**. Scrolling up scales down the active card (`scale(0.95)`) and reduces opacity as it recedes into the background, allowing the next project card to slide over it naturally.

### Section 4: Skills (`SectionSkills.vue`)
- **Infrastructure:** HTML5 `<canvas>` powered by `d3-force` physics model wired into Vue's `onMounted` hook.
- **Visuals:** Skills are translucent nodes containing the technical icon and label, linked together dynamically like a dependency graph tree.
- **Friction/Forces Configuration:** `d3.forceManyBody().strength(-150)` for particle repulsion, `d3.forceCollide().radius(40)` for rigid bounding impacts, and `d3.forceCenter()`.
- **Interactions:**
  - *Console Filtering:* Clicking category tags (`[01. Frontend]`, `[02. Backend & DB]`, `[03. Mobile & Tools]`) programmatically injects localized gravitational center points to the D3 simulation. Selected nodes forcefully cluster and collide in the center while unselected elements disperse outwards and fade to 20% opacity.
  - *Drag Dynamics:* Full drag-and-drop mechanics. Users can grab a node (e.g., PostgreSQL), stretching the elastic vector connections in real-time, with natural physical deceleration on release.
  - *Soft Skills Marquee:* Infinite horizontal text loop ticker using GSAP at the bottom. Hovering scales time down to 10% smoothly for high-legibility.
- **Mobile Adaptation:** D3 simulation shuts down immediately after first layout computation to secure CPU cycles. Layout freezes into an optimized, static 3-column mobile touch grid. Filters act as standard instantaneous CSS opacity toggles.

### Section 5: Contact (`TheFooter.vue`)
- **Layout (Desktop):** Split layout resembling an HTTP REST Client interface (Left: Input Gateway form / Right: Dark theme output console block).
- **Interactions:**
  - *Live JSON Parsing:* Vue v-models dynamically interpolate form text fields directly into an on-screen JSON payload view on the right console block, complete with tokenized code syntax highlighting (Yellow keys, Green string values).
  - *Liquid Borders:* Inputs feature hidden SVG bottom path lines. Focus triggers a high-speed cian neon laser running left-to-right via GSAP.
  - *Server-Response State:* Submission switches button state to `"STATUS: SENDING..."`. Validation failure blocks the EmailJS promise and renders a mock system log error error code: `HTTP/1.1 422 Unprocessable Entity - ERROR: Invalid email structure`. Successful transmission scales down the JSON string data and prints a successful log: `HTTP/1.1 200 OK - Message deployed successfully`.
- **Mobile Adaptation:** Collapses the dual-panel view into a clean, singular input form column optimized for touch keyboards (`py-4`). The real-time JSON console is hidden, and its output log is embedded directly underneath the submit button as a micro-terminal banner confirming `200 OK` on transmission.