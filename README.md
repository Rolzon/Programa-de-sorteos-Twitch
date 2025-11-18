# Lachhh Tools - Twitch Giveaway Tool

Recreación moderna de LachhhTools como **aplicación de escritorio instalable** para realizar sorteos en Twitch con animaciones profesionales y widgets para OBS.

## 🚀 Características

- 💻 **Aplicación de Escritorio** - Instalable como programa .exe en Windows
- 🎬 **Animaciones Profesionales** - Idénticas a LachhhTools original
- ⏱️ **Sistema de Countdown** - Temporizador para que el ganador responda
- 🎯 **Integración con Twitch API** - OAuth seguro y datos en tiempo real
- 🎨 **Widgets para OBS** - Overlays con animaciones de sorteo y countdown
- 📊 **Interfaz Completa** - Panel de control estilo LachhhTools
- 🎭 **Exportar Imágenes** - Genera imágenes del ganador para redes sociales
- ⚡ **Sin Flash** - Tecnología moderna (Electron + React)

## 📋 Requisitos previos

### Para uso local (Desktop):
- Node.js 18 o superior
- Windows 10/11
- Cuenta de desarrollador de Twitch

### Para servidor web:
- Servidor Linux (Ubuntu 20.04+ / Debian 11+)
- Node.js 18 o superior
- Dominio (opcional pero recomendado)
- 1GB RAM mínimo

## 🔧 Configuración

### 1. Crear aplicación en Twitch

1. Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Crea una nueva aplicación
3. Configura la URL de redirección OAuth: `http://localhost:3000/auth/callback`
4. Copia el Client ID y Client Secret

### 2. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y añade tus credenciales de Twitch
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar la aplicación

**Para Desktop (Windows):**
```bash
# Modo desarrollo (abre la aplicación de escritorio)
npm run dev

# Compilar instalador para Windows
npm run build:win
```

**Para Servidor Web:**
```bash
# Modo desarrollo
npm run dev:web

# Compilar y ejecutar en producción
npm run build:web
npm run start:server
```

Ver guías detalladas:
- 📱 **Desktop**: `INICIO_RAPIDO.md`
- 🌐 **Servidor**: `DEPLOY_RAPIDO.md` o `INSTALACION_SERVIDOR.md`

## 📖 Uso

### Panel de Control

La aplicación tiene 3 secciones principales:

**1. GIVEAWAY ANIMATION** (Izquierda)
- Añade participantes (viewers, manual, subs, mods)
- Configura chat auto-add con comando personalizado
- Personaliza textos de animación
- Inicia el sorteo con "START ANIMATION"

**2. COUNTDOWN ANIMATION** (Arriba Derecha)
- Configura el nombre del ganador
- Establece mensaje urgente
- Define tiempo de countdown
- Inicia el temporizador para que el ganador responda

**3. EXPORT WINNER IMAGE** (Abajo Derecha)
- Configura textos personalizados
- Genera imagen PNG del ganador
- Comparte en redes sociales

### Widgets para OBS

Añade fuentes de navegador en OBS con estas URLs:

- **Animación de Sorteo**: `http://localhost:5173/widget/giveaway-animation`
  - Muestra la animación completa del sorteo con efectos
  - Revela el ganador con animación profesional
  
- **Countdown del Ganador**: `http://localhost:5173/widget/countdown-winner`
  - Muestra el nombre del ganador colgando
  - Countdown con efectos visuales
  - Mensaje urgente para que responda

- **Widget de Notificaciones**: `http://localhost:5173/widget/notifications`
  - Alertas de follows, subs, donations, hosts

Configura todas las fuentes como:
- Ancho: **1920px**
- Alto: **1080px**
- ✅ Actualizar cuando la escena se vuelve activa

## 🎯 Tipos de sorteos

- **Chat**: Participan usuarios que escriben en el chat
- **Keyword**: Solo usuarios que escriben una palabra clave específica
- **Followers**: Solo seguidores del canal
- **Subscribers**: Solo suscriptores
- **VIP**: Solo VIPs y moderadores
- **Custom**: Combinación de múltiples criterios

## 🛠️ Tecnologías utilizadas

- **Desktop**: Electron (aplicación de escritorio)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express (integrado)
- **API**: Twitch Helix API
- **WebSockets**: Para actualizaciones en tiempo real
- **OAuth**: Autenticación segura con Twitch
- **Build**: electron-builder (para crear instaladores)

## 📝 Licencia

Este proyecto es una recreación moderna de LachhhTools.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## ⚠️ Notas importantes

- Mantén tus credenciales de Twitch seguras (nunca las compartas)
- El archivo `.env` no debe subirse a repositorios públicos
- Para uso en producción, configura HTTPS y un dominio propio
