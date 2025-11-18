# 🎮 Lachhh Tools - Aplicación de Escritorio

## 📋 Requisitos Previos

- **Node.js** versión 18 o superior ([Descargar aquí](https://nodejs.org/))
- Windows 10/11
- Una cuenta de Twitch

## 🔧 Configuración Inicial

### Paso 1: Crear Aplicación en Twitch

1. Ve a [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Crea una nueva aplicación
3. Configura la URL de redirección OAuth: `http://localhost:3000/auth/callback`
4. Copia el **Client ID** y **Client Secret**

### Paso 2: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`
2. Edita `.env` y añade tus credenciales:

```env
TWITCH_CLIENT_ID=tu_client_id_aqui
TWITCH_CLIENT_SECRET=tu_client_secret_aqui
TWITCH_REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
NODE_ENV=development
```

### Paso 3: Instalar Dependencias

Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:

```bash
npm install
```

## 🚀 Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

Esto abrirá la aplicación de escritorio automáticamente.

### Compilar para Distribución

Para crear un instalador .exe:

```bash
npm run build:win
```

El instalador se generará en la carpeta `dist-electron/`

## 🎯 Uso de la Aplicación

### Panel Principal

La interfaz está dividida en 3 secciones:

#### 1. GIVEAWAY ANIMATION (Izquierda)

**Añadir Participantes:**
- **Add Viewers**: Añade todos los viewers actuales del chat
- **Add Manually**: Añade un usuario manualmente
- **Add Subs**: Añade todos los suscriptores
- **Add Mods**: Añade todos los moderadores
- **Remove non-subs**: Elimina no suscriptores
- **Remove non-mod**: Elimina no moderadores
- **CLEAR**: Limpia todos los participantes

**Chat Auto-Add:**
- Activa esta opción para añadir automáticamente usuarios que escriban en el chat
- **Cmd**: Comando específico (ej: `!sorteo`) o déjalo vacío para cualquier mensaje

**Animation Settings:**
- **Line 1**: Primera línea del texto de animación
- **Line 2**: Segunda línea del texto de animación
- **Currently using**: Animación seleccionada
- **Select Animation**: Elige una animación personalizada
- **SFX**: Volumen de efectos de sonido

**Iniciar Sorteo:**
- Haz clic en **START ANIMATION** para comenzar
- La animación se mostrará en el widget de OBS
- Los nombres de participantes se mostrarán rodando
- Al final se revelará el ganador

#### 2. COUNTDOWN ANIMATION (Arriba Derecha)

**Configuración:**
- **Target's Name**: Nombre del ganador
- **Quick Message**: Mensaje urgente para el ganador
- **Countdown**: Tiempo en segundos para que responda
- **Chat Auto-Claim**: Detecta automáticamente cuando el ganador responde

**Uso:**
1. Después de seleccionar un ganador, configura el countdown
2. Haz clic en **Start**
3. El widget mostrará el countdown con el nombre del ganador
4. Si el ganador no responde a tiempo, puedes seleccionar otro

#### 3. EXPORT WINNER IMAGE (Abajo Derecha)

**Configuración:**
- **Winner's Name**: Nombre del ganador
- **Text 1**: Primer texto (ej: "has won the giveaway!")
- **Text 2**: Segundo texto (ej: "Come over for a chance to win!")
- **Text 3**: Tercer texto (ej: "twitch.tv/TuCanal")

**Uso:**
1. Configura los textos
2. Haz clic en **Export PNG**
3. Se generará una imagen para compartir en redes sociales

## 🎨 Widgets para OBS

### Widget de Animación de Sorteo

1. En OBS, añade una fuente → **"Navegador"**
2. URL: `http://localhost:5173/widget/giveaway-animation`
3. Ancho: **1920**, Alto: **1080**
4. ✅ Actualizar cuando la escena se vuelve activa

**Muestra:**
- Animación de introducción con texto personalizado
- Nombres rodando durante el sorteo
- Revelación del ganador con efectos

### Widget de Countdown del Ganador

1. Añade otra fuente → **"Navegador"**
2. URL: `http://localhost:5173/widget/countdown-winner`
3. Ancho: **1920**, Alto: **1080**
4. ✅ Actualizar cuando la escena se vuelve activa

**Muestra:**
- Nombre del ganador colgando con efecto de cuerda
- Contador regresivo grande
- Mensaje urgente
- Efectos visuales de alerta

### Widget de Notificaciones

1. Añade otra fuente → **"Navegador"**
2. URL: `http://localhost:5173/widget/notifications`
3. Ancho: **1920**, Alto: **1080**

**Muestra notificaciones de:**
- Nuevos seguidores
- Suscripciones
- Donaciones
- Hosts

## 🎬 Flujo de Trabajo Completo

1. **Preparación:**
   - Abre la aplicación
   - Añade participantes (viewers, subs, etc.)
   - Configura los textos de animación

2. **Iniciar Sorteo:**
   - Haz clic en "START ANIMATION"
   - La animación se muestra en OBS
   - Se selecciona un ganador automáticamente

3. **Countdown para Ganador:**
   - El ganador aparece en pantalla
   - Inicia el countdown
   - Espera a que el ganador responda en el chat

4. **Exportar Resultado:**
   - Genera una imagen del ganador
   - Compártela en redes sociales

## ⚙️ Características Avanzadas

### Animaciones Personalizadas

Puedes crear tus propias animaciones:
1. Crea un archivo `.swf` o `.mp4` con tu animación
2. Colócalo en la carpeta `CustomAnimationExamples/`
3. Selecciónalo desde el botón "Select Animation"

### Filtros de Participantes

- **Solo Suscriptores**: Usa "Remove non-subs"
- **Solo Moderadores**: Usa "Remove non-mod"
- **Combinado**: Añade subs y luego añade mods

### Chat Auto-Add

- **Sin comando**: Cualquiera que escriba participa
- **Con comando**: Solo quienes escriban el comando (ej: `!sorteo`)

## 🔧 Solución de Problemas

### La aplicación no abre
```bash
# Reinstala dependencias
rm -rf node_modules
npm install
```

### Los widgets no se ven en OBS
- Verifica que la aplicación esté corriendo
- Actualiza la fuente del navegador en OBS (clic derecho → Actualizar)
- Verifica que las URLs sean correctas

### Error de autenticación con Twitch
- Verifica las credenciales en `.env`
- Asegúrate de que la URL de redirección en Twitch sea exacta

### Los participantes no se añaden automáticamente
- Verifica que "Chat Auto-Add" esté activado
- Asegúrate de estar conectado a Twitch
- Revisa que el comando sea correcto (o vacío para cualquier mensaje)

## 📦 Crear Instalador

Para distribuir la aplicación:

```bash
npm run build:win
```

Esto creará:
- `Lachhh Tools Setup.exe` - Instalador completo
- Archivos en `dist-electron/`

El instalador incluye:
- La aplicación completa
- Servidor backend integrado
- Acceso directo en el escritorio
- Entrada en el menú inicio

## 🎉 ¡Listo!

Ahora tienes una réplica completa de LachhhTools como aplicación de escritorio instalable.

### Diferencias con la versión original:
- ✅ Aplicación de escritorio (no requiere navegador)
- ✅ Instalador .exe para Windows
- ✅ Servidor integrado (no requiere configuración)
- ✅ Interfaz idéntica a LachhhTools
- ✅ Todas las animaciones y efectos
- ✅ Compatible con OBS

### Ventajas adicionales:
- 🚀 Más rápido (no depende de Flash)
- 🔒 Más seguro (tecnología moderna)
- 🎨 Personalizable (código abierto)
- 🔄 Actualizaciones automáticas posibles
