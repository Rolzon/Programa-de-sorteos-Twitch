# 🎮 Instrucciones de Instalación - Twitch Giveaway Tool

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior ([Descargar aquí](https://nodejs.org/))
- Un navegador web moderno (Chrome, Firefox, Edge)
- Una cuenta de Twitch

## 🔧 Paso 1: Configurar la Aplicación de Twitch

1. Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Haz clic en **"Register Your Application"**
3. Completa el formulario:
   - **Name**: Twitch Giveaway Tool (o el nombre que prefieras)
   - **OAuth Redirect URLs**: `http://localhost:3000/auth/callback`
   - **Category**: Application Integration
4. Haz clic en **"Create"**
5. Una vez creada, haz clic en **"Manage"**
6. Copia el **Client ID**
7. Haz clic en **"New Secret"** y copia el **Client Secret** (guárdalo en un lugar seguro)

## 📝 Paso 2: Configurar Variables de Entorno

1. En la carpeta del proyecto, copia el archivo `.env.example` y renómbralo a `.env`:
   ```bash
   copy .env.example .env
   ```

2. Abre el archivo `.env` con un editor de texto y completa tus credenciales:
   ```env
   TWITCH_CLIENT_ID=tu_client_id_aqui
   TWITCH_CLIENT_SECRET=tu_client_secret_aqui
   TWITCH_REDIRECT_URI=http://localhost:3000/auth/callback
   PORT=3000
   NODE_ENV=development
   ```

## 📦 Paso 3: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Este proceso puede tardar unos minutos. Espera a que termine completamente.

## 🚀 Paso 4: Iniciar la Aplicación

Una vez instaladas las dependencias, ejecuta:

```bash
npm run dev
```

Esto iniciará dos servidores:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🌐 Paso 5: Acceder a la Aplicación

1. Abre tu navegador y ve a: **http://localhost:5173**
2. Haz clic en **"Conectar con Twitch"**
3. Autoriza la aplicación en la página de Twitch
4. Serás redirigido al panel de control

## 🎨 Paso 6: Configurar Widgets en OBS

### Widget de Sorteo

1. En OBS, añade una nueva fuente → **"Navegador"**
2. Configura:
   - **URL**: `http://localhost:5173/widget/giveaway`
   - **Ancho**: 1920
   - **Alto**: 1080
   - ✅ Actualizar cuando la escena se vuelve activa
   - ✅ Controlar audio mediante OBS

### Widget de Notificaciones

1. Añade otra fuente → **"Navegador"**
2. Configura:
   - **URL**: `http://localhost:5173/widget/notifications`
   - **Ancho**: 1920
   - **Alto**: 1080
   - ✅ Actualizar cuando la escena se vuelve activa

### Widget de Contador Regresivo

1. Añade otra fuente → **"Navegador"**
2. Configura:
   - **URL**: `http://localhost:5173/widget/countdown`
   - **Ancho**: 1920
   - **Alto**: 1080
   - ✅ Actualizar cuando la escena se vuelve activa

## 🎯 Cómo Usar

### Crear un Sorteo

1. En el panel de control, completa el formulario:
   - **Título**: Nombre del sorteo
   - **Descripción**: Detalles opcionales
   - **Duración**: Tiempo en segundos
   - **Número de ganadores**: Cuántos ganadores quieres
   - **Tipo**: Cómo participan los usuarios
   - **Palabra clave**: (opcional) Si eliges tipo "Palabra clave"

2. Haz clic en **"Crear Sorteo"**

### Iniciar el Sorteo

1. Una vez creado, haz clic en **"Iniciar Sorteo"**
2. El widget en OBS mostrará el sorteo activo
3. Los participantes aparecerán en tiempo real

### Seleccionar Ganador

1. Cuando termine el tiempo o cuando quieras, haz clic en **"Seleccionar Ganador"**
2. El sistema elegirá aleatoriamente al/los ganador(es)
3. Se mostrará una animación en el widget de OBS

## ⚠️ Solución de Problemas

### Error: "Cannot find module"
```bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install
```

### Error: "Port 3000 is already in use"
```bash
# Cambia el puerto en el archivo .env
PORT=3001
```

### No se conecta a Twitch
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la URL de redirección en Twitch Developer Console sea exactamente: `http://localhost:3000/auth/callback`

### Los widgets no se muestran en OBS
- Verifica que la aplicación esté corriendo (`npm run dev`)
- Asegúrate de que las URLs de los widgets sean correctas
- Intenta actualizar la fuente del navegador en OBS

## 🔒 Seguridad

- **NUNCA** compartas tu archivo `.env` o tus credenciales
- **NO** subas el archivo `.env` a repositorios públicos
- Para producción, usa HTTPS y un dominio propio

## 📞 Soporte

Si tienes problemas:
1. Revisa que Node.js esté instalado correctamente: `node --version`
2. Verifica que todas las dependencias se instalaron: `npm list`
3. Revisa la consola del navegador (F12) para ver errores
4. Revisa la terminal donde corre el servidor para ver logs

## 🎉 ¡Listo!

Ahora tienes una herramienta profesional de sorteos para tu stream de Twitch. ¡Disfruta!
