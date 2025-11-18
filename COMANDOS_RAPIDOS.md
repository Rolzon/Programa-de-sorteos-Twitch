# ⚡ Comandos Rápidos - Lachhh Tools

## 🖥️ Desktop (Windows)

### Instalación Inicial
```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

### Desarrollo
```bash
npm run dev              # Abrir aplicación
npm run dev:client       # Solo frontend
npm run dev:server       # Solo backend
```

### Producción
```bash
npm run build:win        # Crear instalador .exe
```

---

## 🌐 Servidor (Linux)

### Instalación Automática
```bash
# Subir archivos y ejecutar
sudo bash install-server.sh
```

### Instalación Manual
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Configurar proyecto
cd /var/www/lachhh-tools
npm install --production
npm run build:web

# Ejecutar
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Con Docker
```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reiniciar
docker-compose restart
```

---

## 🔄 Gestión con PM2

### Comandos Básicos
```bash
pm2 start ecosystem.config.cjs    # Iniciar
pm2 stop lachhh-tools             # Detener
pm2 restart lachhh-tools          # Reiniciar
pm2 delete lachhh-tools           # Eliminar
pm2 save                          # Guardar config
pm2 startup                       # Auto-inicio
```

### Monitoreo
```bash
pm2 status                        # Ver estado
pm2 logs lachhh-tools             # Ver logs
pm2 logs lachhh-tools --lines 100 # Ver últimas 100 líneas
pm2 monit                         # Monitor en tiempo real
pm2 show lachhh-tools             # Info detallada
```

### Logs
```bash
pm2 logs                          # Todos los logs
pm2 logs lachhh-tools             # Logs de la app
pm2 logs --err                    # Solo errores
pm2 flush                         # Limpiar logs
```

---

## 🐳 Docker

### Gestión de Contenedores
```bash
docker-compose up -d              # Iniciar en background
docker-compose down               # Detener y eliminar
docker-compose restart            # Reiniciar
docker-compose stop               # Detener sin eliminar
docker-compose start              # Iniciar detenidos
```

### Logs y Debug
```bash
docker-compose logs               # Ver logs
docker-compose logs -f            # Logs en tiempo real
docker-compose logs --tail=100    # Últimas 100 líneas
docker-compose exec lachhh-tools sh  # Entrar al contenedor
```

### Reconstruir
```bash
docker-compose build              # Reconstruir imagen
docker-compose up -d --build      # Reconstruir y ejecutar
docker-compose down -v            # Eliminar con volúmenes
```

---

## 🌐 Nginx

### Gestión
```bash
sudo systemctl start nginx        # Iniciar
sudo systemctl stop nginx         # Detener
sudo systemctl restart nginx      # Reiniciar
sudo systemctl reload nginx       # Recargar config
sudo systemctl status nginx       # Ver estado
```

### Configuración
```bash
sudo nginx -t                     # Probar config
sudo nano /etc/nginx/sites-available/lachhh-tools  # Editar
sudo ln -s /etc/nginx/sites-available/lachhh-tools /etc/nginx/sites-enabled/  # Activar
sudo rm /etc/nginx/sites-enabled/lachhh-tools  # Desactivar
```

### Logs
```bash
sudo tail -f /var/log/nginx/access.log   # Logs de acceso
sudo tail -f /var/log/nginx/error.log    # Logs de error
```

---

## 🔒 SSL (Let's Encrypt)

### Obtener Certificado
```bash
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

### Renovar
```bash
sudo certbot renew                # Renovar todos
sudo certbot renew --dry-run      # Probar renovación
```

### Gestión
```bash
sudo certbot certificates         # Listar certificados
sudo certbot delete               # Eliminar certificado
```

---

## 🔥 Firewall (UFW)

### Configuración Básica
```bash
sudo ufw allow ssh                # Permitir SSH
sudo ufw allow 'Nginx Full'       # Permitir HTTP/HTTPS
sudo ufw allow 3000               # Permitir puerto 3000
sudo ufw enable                   # Activar firewall
sudo ufw disable                  # Desactivar firewall
```

### Gestión
```bash
sudo ufw status                   # Ver estado
sudo ufw status numbered          # Ver reglas numeradas
sudo ufw delete 2                 # Eliminar regla #2
sudo ufw reset                    # Reset completo
```

---

## 📦 NPM

### Dependencias
```bash
npm install                       # Instalar todas
npm install --production          # Solo producción
npm update                        # Actualizar todas
npm outdated                      # Ver desactualizadas
npm audit                         # Revisar seguridad
npm audit fix                     # Arreglar vulnerabilidades
```

### Limpieza
```bash
npm cache clean --force           # Limpiar caché
rm -rf node_modules               # Eliminar módulos
npm install                       # Reinstalar
```

---

## 🔍 Diagnóstico

### Verificar Puertos
```bash
sudo netstat -tlnp | grep 3000    # Ver qué usa el puerto 3000
sudo lsof -i :3000                # Procesos en puerto 3000
sudo kill -9 PID                  # Matar proceso
```

### Verificar Procesos
```bash
ps aux | grep node                # Procesos Node.js
ps aux | grep nginx               # Procesos Nginx
top                               # Monitor de recursos
htop                              # Monitor mejorado
```

### Verificar Disco
```bash
df -h                             # Espacio en disco
du -sh /var/www/lachhh-tools      # Tamaño del proyecto
```

### Verificar Memoria
```bash
free -h                           # Memoria disponible
```

---

## 🔄 Actualizar Aplicación

### Desktop
```bash
# Obtener nuevos archivos
git pull  # o descargar manualmente

# Reinstalar dependencias
npm install

# Reiniciar
npm run dev
```

### Servidor con PM2
```bash
cd /var/www/lachhh-tools
pm2 stop lachhh-tools
git pull  # o subir archivos nuevos
npm install --production
npm run build:web
pm2 restart lachhh-tools
```

### Servidor con Docker
```bash
cd /var/www/lachhh-tools
docker-compose down
git pull  # o subir archivos nuevos
docker-compose up -d --build
```

---

## 🧹 Limpieza

### Desktop
```bash
rm -rf node_modules dist
npm install
```

### Servidor
```bash
pm2 delete lachhh-tools
rm -rf node_modules dist logs
npm install --production
npm run build:web
pm2 start ecosystem.config.cjs
```

### Docker
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📊 URLs Útiles

### Local (Desktop)
```
http://localhost:5173                              # Frontend dev
http://localhost:3000                              # Backend
http://localhost:5173/widget/giveaway-animation    # Widget sorteo
http://localhost:5173/widget/countdown-winner      # Widget countdown
http://localhost:5173/widget/notifications         # Widget notificaciones
```

### Servidor
```
https://tudominio.com                              # App principal
https://tudominio.com/widget/giveaway-animation    # Widget sorteo
https://tudominio.com/widget/countdown-winner      # Widget countdown
https://tudominio.com/widget/notifications         # Widget notificaciones
https://tudominio.com/api/health                   # Health check
```

---

## 🆘 Solución Rápida de Problemas

### App no inicia
```bash
pm2 logs lachhh-tools --lines 50
cat .env
sudo netstat -tlnp | grep 3000
```

### Error de WebSocket
```bash
sudo nginx -t
sudo systemctl restart nginx
pm2 restart lachhh-tools
```

### Error 502
```bash
pm2 status
pm2 restart lachhh-tools
sudo systemctl restart nginx
```

### Sin espacio en disco
```bash
df -h
docker system prune -a
pm2 flush
sudo apt autoremove
```

---

## 💡 Tips Rápidos

```bash
# Ver todo el estado del sistema
pm2 status && sudo systemctl status nginx && df -h

# Reiniciar todo
pm2 restart all && sudo systemctl restart nginx

# Ver todos los logs
pm2 logs --lines 50 && sudo tail -n 50 /var/log/nginx/error.log

# Backup rápido
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/lachhh-tools

# Restaurar backup
tar -xzf backup-20231117.tar.gz -C /var/www/
```

---

**¡Guarda este archivo para referencia rápida!** 📌
