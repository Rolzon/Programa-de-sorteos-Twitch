# 🌐 Instalación en Servidor

## 📋 Requisitos del Servidor

- **Sistema Operativo**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **Node.js**: v18 o superior
- **RAM**: Mínimo 1GB (recomendado 2GB)
- **Disco**: Mínimo 500MB
- **Puertos**: 80 (HTTP) y/o 443 (HTTPS)
- **Dominio**: Opcional pero recomendado

---

## 🚀 Instalación Paso a Paso

### 1. Conectar al Servidor

```bash
ssh usuario@tu-servidor.com
```

### 2. Instalar Node.js

```bash
# Actualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 3. Instalar Git

```bash
sudo apt install git -y
```

### 4. Clonar o Subir el Proyecto

**Opción A: Desde Git**
```bash
cd /var/www
sudo git clone tu-repositorio.git lachhh-tools
cd lachhh-tools
```

**Opción B: Subir archivos manualmente**
```bash
# En tu PC local, comprimir el proyecto
# Luego en el servidor:
cd /var/www
sudo mkdir lachhh-tools
cd lachhh-tools

# Subir archivos con SCP o FTP
# Desde tu PC:
scp -r "C:\Users\crist\OneDrive\Documentos\Programa de sorteos Twitch\*" usuario@servidor:/var/www/lachhh-tools/
```

### 5. Configurar Variables de Entorno

```bash
cd /var/www/lachhh-tools
sudo nano .env
```

Añade:
```env
TWITCH_CLIENT_ID=tu_client_id
TWITCH_CLIENT_SECRET=tu_client_secret
TWITCH_REDIRECT_URI=https://tu-dominio.com/auth/callback
PORT=3000
NODE_ENV=production
```

**IMPORTANTE**: Actualiza la URL de redirección en Twitch Developer Console:
- Ve a https://dev.twitch.tv/console/apps
- Edita tu aplicación
- Añade: `https://tu-dominio.com/auth/callback`

### 6. Instalar Dependencias

```bash
sudo npm install --production
```

### 7. Compilar el Frontend

```bash
sudo npm run build
```

---

## 🔧 Configuración para Servidor (Sin Electron)

### Modificar package.json

Edita el archivo `package.json` y cambia los scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "node --watch server/index.js",
    "dev:client": "vite",
    "build": "vite build",
    "start": "NODE_ENV=production node server/index.js",
    "preview": "vite preview"
  }
}
```

### Servir archivos estáticos desde Express

Edita `server/index.js` y añade al final (antes de `app.listen`):

```javascript
// Servir archivos estáticos del build en producción
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}
```

---

## 🔄 Ejecutar la Aplicación

### Opción A: Ejecución Simple (para pruebas)

```bash
cd /var/www/lachhh-tools
sudo npm start
```

### Opción B: Con PM2 (Recomendado - Producción)

PM2 mantiene la aplicación corriendo incluso si se cierra la terminal o se reinicia el servidor.

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicación
cd /var/www/lachhh-tools
pm2 start server/index.js --name "lachhh-tools"

# Guardar configuración para auto-inicio
pm2 save
pm2 startup

# Comandos útiles
pm2 status              # Ver estado
pm2 logs lachhh-tools   # Ver logs
pm2 restart lachhh-tools # Reiniciar
pm2 stop lachhh-tools   # Detener
```

---

## 🌐 Configurar Nginx (Proxy Inverso)

### 1. Instalar Nginx

```bash
sudo apt install nginx -y
```

### 2. Crear Configuración

```bash
sudo nano /etc/nginx/sites-available/lachhh-tools
```

Añade:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Activar Configuración

```bash
sudo ln -s /etc/nginx/sites-available/lachhh-tools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Configurar SSL (HTTPS) con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática (ya viene configurada)
sudo certbot renew --dry-run
```

---

## 🔥 Configurar Firewall

```bash
# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 'Nginx Full'

# Activar firewall
sudo ufw enable
```

---

## 📊 Monitoreo y Logs

### Ver logs de la aplicación
```bash
pm2 logs lachhh-tools
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitoreo con PM2
```bash
pm2 monit
```

---

## 🔄 Actualizar la Aplicación

```bash
cd /var/www/lachhh-tools

# Detener aplicación
pm2 stop lachhh-tools

# Actualizar código (si usas Git)
sudo git pull

# O subir nuevos archivos con SCP

# Reinstalar dependencias si es necesario
sudo npm install --production

# Recompilar frontend
sudo npm run build

# Reiniciar aplicación
pm2 restart lachhh-tools
```

---

## 🐳 Opción Alternativa: Docker

### Crear Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "server/index.js"]
```

### Crear docker-compose.yml

```yaml
version: '3.8'

services:
  lachhh-tools:
    build: .
    ports:
      - "3000:3000"
    environment:
      - TWITCH_CLIENT_ID=${TWITCH_CLIENT_ID}
      - TWITCH_CLIENT_SECRET=${TWITCH_CLIENT_SECRET}
      - TWITCH_REDIRECT_URI=${TWITCH_REDIRECT_URI}
      - NODE_ENV=production
    restart: unless-stopped
```

### Ejecutar con Docker

```bash
# Construir imagen
docker-compose build

# Iniciar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## ⚡ Optimizaciones para Producción

### 1. Comprimir respuestas

Edita `server/index.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

Instala:
```bash
npm install compression
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests
});

app.use('/api/', limiter);
```

Instala:
```bash
npm install express-rate-limit
```

### 3. Helmet (Seguridad)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

Instala:
```bash
npm install helmet
```

---

## 🔍 Verificar Instalación

1. **Accede a tu dominio**: `https://tu-dominio.com`
2. **Verifica widgets**: `https://tu-dominio.com/widget/giveaway-animation`
3. **Prueba autenticación**: Inicia sesión con Twitch
4. **Verifica WebSocket**: Abre consola del navegador, debe conectar

---

## 📱 URLs para OBS (Servidor)

Actualiza las URLs en OBS:

- **Animación de Sorteo**: `https://tu-dominio.com/widget/giveaway-animation`
- **Countdown del Ganador**: `https://tu-dominio.com/widget/countdown-winner`
- **Notificaciones**: `https://tu-dominio.com/widget/notifications`

---

## ❓ Solución de Problemas

### Error: Cannot connect to server
```bash
# Verificar que la app esté corriendo
pm2 status

# Ver logs
pm2 logs lachhh-tools
```

### Error: WebSocket connection failed
```bash
# Verificar configuración de Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Error: 502 Bad Gateway
```bash
# Verificar que el puerto 3000 esté libre
sudo netstat -tlnp | grep 3000

# Reiniciar aplicación
pm2 restart lachhh-tools
```

### Error: Permission denied
```bash
# Dar permisos correctos
sudo chown -R $USER:$USER /var/www/lachhh-tools
```

---

## 🎯 Checklist Final

- [ ] Node.js instalado
- [ ] Proyecto subido al servidor
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas
- [ ] Frontend compilado (`npm run build`)
- [ ] PM2 configurado y corriendo
- [ ] Nginx configurado como proxy
- [ ] SSL/HTTPS configurado
- [ ] Firewall configurado
- [ ] URL de redirección actualizada en Twitch
- [ ] Widgets probados en OBS

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `pm2 logs lachhh-tools`
2. Verifica Nginx: `sudo nginx -t`
3. Comprueba el firewall: `sudo ufw status`
4. Verifica las variables de entorno en `.env`
