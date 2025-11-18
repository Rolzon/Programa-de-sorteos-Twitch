# 📦 Resumen de Instalación - Lachhh Tools

## 🎯 Dos Formas de Usar la Aplicación

### 1️⃣ Aplicación de Escritorio (Windows)
✅ Instalable como programa .exe  
✅ No requiere servidor  
✅ Ideal para uso personal  
✅ Fácil de instalar  

### 2️⃣ Aplicación Web (Servidor)
✅ Accesible desde cualquier lugar  
✅ Múltiples usuarios  
✅ Siempre disponible  
✅ Ideal para equipos  

---

## 💻 Instalación Desktop (Windows)

### Requisitos:
- Windows 10/11
- Node.js 18+

### Pasos:
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env con credenciales de Twitch
# (copiar .env.example a .env)

# 3. Ejecutar
npm run dev

# 4. Crear instalador (opcional)
npm run build:win
```

📖 **Guía completa**: `INICIO_RAPIDO.md`

---

## 🌐 Instalación en Servidor

### Opción A: Script Automático ⚡ (MÁS FÁCIL)

```bash
# 1. Subir archivos al servidor
scp -r * usuario@servidor:/var/www/lachhh-tools/

# 2. Conectar y ejecutar
ssh usuario@servidor
cd /var/www/lachhh-tools
chmod +x install-server.sh
sudo bash install-server.sh
```

El script instalará:
- ✅ Node.js
- ✅ PM2
- ✅ Nginx (opcional)
- ✅ SSL (opcional)
- ✅ Firewall (opcional)

### Opción B: Docker 🐳 (RECOMENDADO)

```bash
# 1. Instalar Docker en el servidor
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Subir archivos
scp -r * usuario@servidor:/var/www/lachhh-tools/

# 3. Configurar .env y ejecutar
cd /var/www/lachhh-tools
nano .env  # Añadir credenciales
docker-compose up -d
```

### Opción C: Manual 🔧 (CONTROL TOTAL)

```bash
# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Instalar PM2
sudo npm install -g pm2

# 3. Subir archivos y configurar
cd /var/www/lachhh-tools
npm install --production
npm run build:web

# 4. Ejecutar
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

📖 **Guías completas**: 
- `DEPLOY_RAPIDO.md` - Guía rápida
- `INSTALACION_SERVIDOR.md` - Guía detallada

---

## 🔑 Configuración de Twitch

**Importante para ambas versiones:**

1. Ve a https://dev.twitch.tv/console/apps
2. Crea una aplicación
3. Configura URL de redirección:
   - **Desktop**: `http://localhost:3000/auth/callback`
   - **Servidor**: `https://tu-dominio.com/auth/callback`
4. Copia Client ID y Client Secret
5. Pégalos en el archivo `.env`

---

## 🎨 Configurar Widgets en OBS

### Para Desktop:
```
http://localhost:5173/widget/giveaway-animation
http://localhost:5173/widget/countdown-winner
http://localhost:5173/widget/notifications
```

### Para Servidor:
```
https://tu-dominio.com/widget/giveaway-animation
https://tu-dominio.com/widget/countdown-winner
https://tu-dominio.com/widget/notifications
```

**Configuración en OBS:**
- Fuente → Navegador
- Ancho: 1920px
- Alto: 1080px
- ✅ Actualizar cuando la escena se vuelve activa

---

## 📁 Archivos de Documentación

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Información general del proyecto |
| `INICIO_RAPIDO.md` | Guía rápida para Desktop |
| `DEPLOY_RAPIDO.md` | Guía rápida para Servidor |
| `INSTALACION_SERVIDOR.md` | Guía detallada para Servidor |
| `INSTRUCCIONES_DESKTOP.md` | Guía completa Desktop |
| `RESUMEN_INSTALACION.md` | Este archivo |

---

## 🚀 Scripts Disponibles

### Desktop:
```bash
npm run dev              # Ejecutar en modo desarrollo
npm run build:win        # Crear instalador .exe
```

### Servidor:
```bash
npm run dev:web          # Desarrollo (frontend + backend)
npm run build:web        # Compilar frontend
npm run start:server     # Ejecutar en producción
```

### Ambos:
```bash
npm install              # Instalar dependencias
npm run dev:server       # Solo backend
npm run dev:client       # Solo frontend
```

---

## 🔧 Tecnologías Utilizadas

- **Desktop**: Electron
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **WebSocket**: Para tiempo real
- **API**: Twitch Helix API
- **Deployment**: PM2, Docker, Nginx

---

## 📊 Comparación Desktop vs Servidor

| Característica | Desktop | Servidor |
|----------------|---------|----------|
| Instalación | Muy fácil | Media |
| Acceso remoto | ❌ | ✅ |
| Múltiples usuarios | ❌ | ✅ |
| Siempre disponible | ❌ | ✅ |
| Costo | Gratis | Requiere servidor |
| Mantenimiento | Bajo | Medio |
| Actualizaciones | Manual | Automático |
| Ideal para | Uso personal | Equipos/Producción |

---

## ✅ Checklist de Instalación

### Desktop:
- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado
- [ ] App de Twitch creada
- [ ] URL de redirección configurada
- [ ] Aplicación ejecutándose (`npm run dev`)
- [ ] Widgets probados en OBS

### Servidor:
- [ ] Servidor Linux disponible
- [ ] Node.js instalado en servidor
- [ ] Archivos subidos al servidor
- [ ] Archivo `.env` configurado
- [ ] Dependencias instaladas
- [ ] Frontend compilado
- [ ] PM2/Docker configurado
- [ ] Nginx configurado (opcional)
- [ ] SSL instalado (opcional)
- [ ] Dominio apuntando al servidor
- [ ] URL de Twitch actualizada
- [ ] Widgets probados en OBS

---

## ❓ ¿Cuál Elegir?

### Elige Desktop si:
- ✅ Solo tú usarás la aplicación
- ✅ Quieres algo simple y rápido
- ✅ No tienes servidor
- ✅ Streameas desde una sola PC

### Elige Servidor si:
- ✅ Múltiples personas usarán la app
- ✅ Quieres acceso desde cualquier lugar
- ✅ Tienes un servidor o VPS
- ✅ Quieres que esté siempre disponible
- ✅ Trabajas en equipo

---

## 🆘 Soporte Rápido

### Desktop:
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install

# Ver logs
npm run dev
```

### Servidor:
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs lachhh-tools

# Reiniciar
pm2 restart lachhh-tools
```

---

## 🎉 Próximos Pasos

1. **Instala** siguiendo la guía correspondiente
2. **Configura** tus credenciales de Twitch
3. **Prueba** la aplicación localmente
4. **Añade** los widgets a OBS
5. **Haz** tu primer sorteo
6. **Personaliza** las animaciones y textos

---

## 📞 Recursos Adicionales

- **Twitch Developer**: https://dev.twitch.tv/
- **OBS Studio**: https://obsproject.com/
- **Node.js**: https://nodejs.org/
- **Docker**: https://www.docker.com/

---

**¡Listo para empezar!** 🚀

Elige tu método de instalación y sigue la guía correspondiente.
