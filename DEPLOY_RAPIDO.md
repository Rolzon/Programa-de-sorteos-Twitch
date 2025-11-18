# ⚡ Despliegue Rápido en Servidor

## 🎯 Opción 1: Script Automático (Más Fácil)

### 1. Subir archivos al servidor

```bash
# Desde tu PC, comprimir el proyecto
cd "C:\Users\crist\OneDrive\Documentos\Programa de sorteos Twitch"
# Crear un zip con todos los archivos

# Subir al servidor con SCP
scp lachhh-tools.zip usuario@tu-servidor:/tmp/
```

### 2. Conectar al servidor y ejecutar script

```bash
# Conectar por SSH
ssh usuario@tu-servidor

# Ir a directorio temporal
cd /tmp

# Descomprimir
unzip lachhh-tools.zip -d /var/www/lachhh-tools

# Ir al directorio
cd /var/www/lachhh-tools

# Dar permisos de ejecución al script
chmod +x install-server.sh

# Ejecutar script de instalación
sudo bash install-server.sh
```

El script te preguntará:
- ✅ Client ID de Twitch
- ✅ Client Secret de Twitch
- ✅ Tu dominio
- ✅ Si quieres instalar Nginx
- ✅ Si quieres instalar SSL

**¡Y listo!** La aplicación estará corriendo automáticamente.

---

## 🐳 Opción 2: Con Docker (Recomendado)

### 1. Instalar Docker

```bash
# Conectar al servidor
ssh usuario@tu-servidor

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y
```

### 2. Subir archivos

```bash
# Desde tu PC
scp -r "C:\Users\crist\OneDrive\Documentos\Programa de sorteos Twitch" usuario@servidor:/var/www/lachhh-tools
```

### 3. Configurar y ejecutar

```bash
# En el servidor
cd /var/www/lachhh-tools

# Crear archivo .env
nano .env
# Pegar:
TWITCH_CLIENT_ID=tu_client_id
TWITCH_CLIENT_SECRET=tu_client_secret
TWITCH_REDIRECT_URI=https://tu-dominio.com/auth/callback
NODE_ENV=production

# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f
```

**¡Listo!** La aplicación está corriendo en el puerto 3000.

---

## 🌐 Opción 3: Manual (Control Total)

### Paso 1: Preparar servidor

```bash
# Conectar
ssh usuario@tu-servidor

# Actualizar
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2
```

### Paso 2: Subir código

```bash
# Desde tu PC
cd "C:\Users\crist\OneDrive\Documentos\Programa de sorteos Twitch"
scp -r * usuario@servidor:/var/www/lachhh-tools/
```

### Paso 3: Configurar

```bash
# En el servidor
cd /var/www/lachhh-tools

# Crear .env
nano .env
# Añadir credenciales

# Instalar dependencias
npm install --production

# Compilar frontend
npm run build:web
```

### Paso 4: Ejecutar con PM2

```bash
# Iniciar
pm2 start ecosystem.config.cjs

# Guardar configuración
pm2 save

# Auto-inicio en reinicio
pm2 startup
```

---

## 🔧 Configurar Nginx (Proxy)

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/lachhh-tools
```

Pegar:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/lachhh-tools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Instalar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Seguir las instrucciones
```

---

## ✅ Verificar Instalación

```bash
# Ver estado de PM2
pm2 status

# Ver logs
pm2 logs lachhh-tools

# Probar endpoint
curl http://localhost:3000/api/health

# Debería responder:
# {"status":"ok","timestamp":"..."}
```

---

## 🎨 URLs para OBS

Después de instalar, usa estas URLs en OBS:

```
https://tu-dominio.com/widget/giveaway-animation
https://tu-dominio.com/widget/countdown-winner
https://tu-dominio.com/widget/notifications
```

---

## 🔄 Actualizar la Aplicación

```bash
# Detener
pm2 stop lachhh-tools

# Subir nuevos archivos o hacer git pull
# ...

# Reinstalar dependencias si es necesario
npm install --production

# Recompilar
npm run build:web

# Reiniciar
pm2 restart lachhh-tools
```

---

## 📊 Comandos Útiles

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs lachhh-tools

# Reiniciar
pm2 restart lachhh-tools

# Detener
pm2 stop lachhh-tools

# Monitoreo
pm2 monit

# Ver uso de recursos
pm2 show lachhh-tools
```

---

## ❓ Solución de Problemas

### La aplicación no inicia
```bash
# Ver logs
pm2 logs lachhh-tools --lines 100

# Verificar .env
cat .env

# Verificar puerto
sudo netstat -tlnp | grep 3000
```

### Error de WebSocket
```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Error 502 Bad Gateway
```bash
# Verificar que la app esté corriendo
pm2 status

# Reiniciar aplicación
pm2 restart lachhh-tools

# Verificar logs
pm2 logs lachhh-tools
```

---

## 🎯 Checklist de Despliegue

- [ ] Servidor con Ubuntu/Debian
- [ ] Node.js 18+ instalado
- [ ] Archivos subidos al servidor
- [ ] Archivo .env configurado
- [ ] Dependencias instaladas
- [ ] Frontend compilado
- [ ] PM2 corriendo la aplicación
- [ ] Nginx configurado (opcional)
- [ ] SSL instalado (opcional)
- [ ] Firewall configurado
- [ ] URL de Twitch actualizada
- [ ] Widgets probados en OBS

---

## 🚀 Resumen de Comandos

```bash
# Instalación completa en una línea (con script)
sudo bash install-server.sh

# O con Docker
docker-compose up -d

# O manual
npm install --production && npm run build:web && pm2 start ecosystem.config.cjs
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `pm2 logs lachhh-tools`
2. Verifica el estado: `pm2 status`
3. Comprueba el archivo .env
4. Verifica que el puerto 3000 esté libre
5. Revisa la configuración de Nginx

---

**¡Tu aplicación estará disponible en tu dominio!** 🎉
