# EXÉGESIS - Iglesia Gracia & Verdad

Aplicación web responsiva para la iglesia Gracia y Verdad. Incluye secciones públicas de sermones, actividades, asistencia/ayuda, testimonios y panel de administración.

---

## 🚀 Requisitos Previos

1. **Node.js**: Versión 18.x o superior (recomendado Node v20+).
   - Descargar desde: [nodejs.org](https://nodejs.org/)
2. **pnpm**: Gestor de paquetes rápido y eficiente.
   - Si no tienes `pnpm` instalado, puedes instalarlo ejecutando en tu terminal:
     ```bash
     npm install -g pnpm
     ```
     O activando Corepack con Node.js:
     ```bash
     corepack enable
     ```

---

## 🛠️ Instalación y Configuración Local

1. **Clonar o descargar el proyecto** en tu computadora.

2. **Abrir una terminal** en la carpeta raíz del proyecto.

3. **Configurar las variables de entorno**:
   Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   *Nota (Windows PowerShell):*
   ```powershell
   Copy-Item .env.example .env
   ```

4. **Instalar las dependencias con `pnpm`**:
   ```bash
   pnpm install
   ```

---

## 💻 Ejecutar la Aplicación en tu PC

### Modo Desarrollo
Inicia el servidor local de desarrollo:
```bash
pnpm dev
```

Abre tu navegador e ingresa a:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo en la dirección `http://localhost:3000` |
| `pnpm build` | Compila el proyecto para producción en la carpeta `dist/` |
| `pnpm preview` | Sirve la versión de producción localmente para pruebas |
| `pnpm lint` | Valida los tipos de TypeScript (`tsc --noEmit`) |

---

## 🔑 Variables de Entorno (`.env`)

En el archivo `.env` puedes configurar tus credenciales opcionales:

- `VITE_SUPABASE_URL`: URL de tu proyecto en Supabase.
- `VITE_SUPABASE_ANON_KEY`: Llave pública anónima de Supabase.
- `GEMINI_API_KEY`: Clave API para funciones de inteligencia artificial con Gemini.

---

## 🛠️ Estructura del Proyecto

- `/src/App.tsx`: Componente principal y enrutado de pestañas.
- `/src/views/`: Vistas principales (Inicio, Sermones, Actividades, Ayuda, Líderes, Ubicación, Administración).
- `/src/components/`: Componentes reutilizables (Navegación, Modales, Reproductores, Toast).
- `/src/lib/`: Configuración de Supabase e integraciones.
