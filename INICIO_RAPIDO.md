# 🚀 Inicio Rápido - Lachhh Tools

## ⚡ Instalación en 5 Pasos

### 1️⃣ Instalar Node.js
Descarga e instala desde: https://nodejs.org/ (versión 18 o superior)

### 2️⃣ Configurar Twitch
1. Ve a https://dev.twitch.tv/console/apps
2. Crea una aplicación nueva
3. URL de redirección: `http://localhost:3000/auth/callback`
4. Copia el **Client ID** y **Client Secret**

### 3️⃣ Configurar el archivo .env
1. Copia `.env.example` a `.env`
2. Pega tus credenciales:
```env
TWITCH_CLIENT_ID=tu_client_id
TWITCH_CLIENT_SECRET=tu_client_secret
TWITCH_REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
```

### 4️⃣ Instalar dependencias
Abre PowerShell en la carpeta del proyecto:
```bash
npm install
```
(Espera 2-3 minutos)

### 5️⃣ Iniciar la aplicación
```bash
npm run dev
```
¡La aplicación se abrirá automáticamente!

---

## 🎮 Uso Básico

### Crear un Sorteo

1. **Añadir Participantes**
   - Haz clic en "Add Manually" para añadir usuarios
   - O activa "Chat Auto-Add" para que participen automáticamente

2. **Configurar Animación**
   - Line 1: "IT'S SUPER AWESOME"
   - Line 2: "GIVEAWAY TIME!"

3. **Iniciar**
   - Haz clic en "START ANIMATION"
   - La animación se mostrará en el widget de OBS

### Countdown del Ganador

1. Después de seleccionar ganador, ve a la sección "COUNTDOWN ANIMATION"
2. Configura:
   - Target's Name: (se llena automáticamente)
   - Quick Message: "QUICK! Show yourself! Talk in the chat!"
   - Countdown: 30 segundos
3. Haz clic en "Start"

### Exportar Imagen

1. Ve a "EXPORT WINNER IMAGE"
2. Configura los textos
3. Haz clic en "Export PNG"

---

## 🎨 Configurar Widgets en OBS

### Widget 1: Animación de Sorteo
1. OBS → Fuentes → Añadir → Navegador
2. URL: `http://localhost:5173/widget/giveaway-animation`
3. Ancho: 1920, Alto: 1080
4. ✅ Actualizar cuando la escena se vuelve activa

### Widget 2: Countdown del Ganador
1. OBS → Fuentes → Añadir → Navegador
2. URL: `http://localhost:5173/widget/countdown-winner`
3. Ancho: 1920, Alto: 1080
4. ✅ Actualizar cuando la escena se vuelve activa

### Widget 3: Notificaciones
1. OBS → Fuentes → Añadir → Navegador
2. URL: `http://localhost:5173/widget/notifications`
3. Ancho: 1920, Alto: 1080

---

## 🔧 Compilar Instalador

Para crear un archivo .exe instalable:

```bash
npm run build:win
```

El instalador estará en: `dist-electron/Lachhh Tools Setup.exe`

---

## ❓ Problemas Comunes

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### "Port already in use"
Cambia el puerto en `.env`:
```env
PORT=3001
```

### Los widgets no se ven
1. Verifica que la aplicación esté corriendo
2. Actualiza la fuente en OBS (clic derecho → Actualizar)
3. Verifica las URLs

### No se conecta a Twitch
1. Verifica las credenciales en `.env`
2. Asegúrate de que la URL de redirección sea exacta en Twitch Developer Console

---

## 📚 Documentación Completa

- **README.md** - Información general
- **INSTRUCCIONES_DESKTOP.md** - Guía detallada de la aplicación de escritorio
- **INSTRUCCIONES.md** - Guía original (versión web)

---

## 🎉 ¡Listo!

Tu aplicación de sorteos estilo LachhhTools está lista para usar.

### Características principales:
✅ Interfaz idéntica a LachhhTools
✅ Animaciones profesionales
✅ Sistema de countdown
✅ Exportar imágenes
✅ Aplicación de escritorio instalable
✅ Sin Flash, tecnología moderna

### Próximos pasos:
1. Personaliza las animaciones
2. Configura los comandos del chat
3. Prueba los widgets en OBS
4. ¡Haz tu primer sorteo!

---

**¿Necesitas ayuda?** Revisa la documentación completa en los archivos README.
