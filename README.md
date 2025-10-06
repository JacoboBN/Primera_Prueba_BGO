# Electron Answers App

Aplicación de escritorio con Electron que permite responder 3 preguntas simples y guardarlas de forma persistente usando IndexedDB. Incluye actualizaciones automáticas.

## 🚀 Características

- ✅ Formulario con 3 preguntas (nombre, edad, color favorito)
- ✅ Persistencia local con IndexedDB
- ✅ Actualizaciones automáticas (auto-updater)
- ✅ Context isolation y comunicación segura IPC
- ✅ TypeScript + React + Vite
- ✅ Empaquetado para Windows con electron-builder

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Windows (para compilar el instalador .exe)

## 🛠️ Instalación

\`\`\`bash
# Clonar el repositorio
git clone <your-repo-url>
cd electron-answers-app

# Instalar dependencias
npm install
\`\`\`

## 💻 Desarrollo

\`\`\`bash
# Ejecutar en modo desarrollo (con hot reload)
npm run dev
\`\`\`

Esto iniciará Vite en el puerto 5173 y abrirá la aplicación Electron.

## 📦 Build y Distribución

\`\`\`bash
# Build completo (renderer + main)
npm run build

# Generar instalador para Windows
npm run dist
\`\`\`

El instalador se generará en la carpeta `release/`.

## 🚀 Publicar Actualizaciones (GitHub Releases)

1. Configura tu repositorio en `electron-builder.yml`:
   \`\`\`yaml
   publish:
     provider: github
     owner: TU_USUARIO_GITHUB
     repo: TU_REPOSITORIO
   \`\`\`

2. Crea un Personal Access Token en GitHub con permisos `repo`

3. Configura la variable de entorno:
   \`\`\`bash
   export GH_TOKEN=tu_token_de_github
   \`\`\`

4. Publica una nueva versión:
   \`\`\`bash
   # Actualiza la versión en package.json primero
   npm version patch  # o minor, o major
   
   # Publica a GitHub Releases
   npm run release
   \`\`\`

La app instalada detectará automáticamente las nuevas versiones y ofrecerá actualizarse.

## 🔒 Firma de Código (Code Signing)

Para actualizaciones silenciosas en Windows, es recomendable firmar el código. Descomenta y configura en `electron-builder.yml`:

\`\`\`yaml
win:
  certificateFile: path/to/certificate.pfx
  certificatePassword: ${env.CERTIFICATE_PASSWORD}
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
project-root/
├─ src/
│  ├─ main/          # Proceso principal de Electron
│  ├─ preload/       # Script preload (IPC seguro)
│  └─ renderer/      # UI React + Vite
├─ dist/             # Build output
├─ release/          # Instaladores generados
├─ package.json
├─ electron-builder.yml
└─ vite.config.ts
\`\`\`

## 🧪 Uso de la Aplicación

1. Completa el formulario con tus respuestas
2. Haz clic en "Guardar" para persistir los datos
3. Cierra y reabre la app
4. Haz clic en "Cargar últimas respuestas" para recuperar los datos
5. El footer muestra la versión actual y el estado de actualizaciones

## 📝 Licencia

MIT
