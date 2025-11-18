#!/bin/bash

# Script de instalación automatizada para servidor Linux
# Uso: bash install-server.sh

set -e

echo "🚀 Instalando Lachhh Tools en el servidor..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si se está ejecutando como root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Por favor ejecuta este script como root o con sudo${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Ejecutando como root${NC}"

# 1. Actualizar sistema
echo -e "\n${YELLOW}[1/8] Actualizando sistema...${NC}"
apt update && apt upgrade -y

# 2. Instalar Node.js
echo -e "\n${YELLOW}[2/8] Instalando Node.js 18.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    echo -e "${GREEN}✓ Node.js instalado: $(node --version)${NC}"
else
    echo -e "${GREEN}✓ Node.js ya está instalado: $(node --version)${NC}"
fi

# 3. Instalar PM2
echo -e "\n${YELLOW}[3/8] Instalando PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✓ PM2 instalado${NC}"
else
    echo -e "${GREEN}✓ PM2 ya está instalado${NC}"
fi

# 4. Crear directorio de aplicación
echo -e "\n${YELLOW}[4/8] Creando directorio de aplicación...${NC}"
mkdir -p /var/www/lachhh-tools
cd /var/www/lachhh-tools

# 5. Copiar archivos (asumiendo que ya están en el directorio actual)
echo -e "\n${YELLOW}[5/8] Copiando archivos...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ Archivos encontrados${NC}"
else
    echo -e "${RED}✗ No se encontró package.json. Asegúrate de estar en el directorio correcto.${NC}"
    exit 1
fi

# 6. Configurar variables de entorno
echo -e "\n${YELLOW}[6/8] Configurando variables de entorno...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creando archivo .env...${NC}"
    read -p "Ingresa tu TWITCH_CLIENT_ID: " client_id
    read -p "Ingresa tu TWITCH_CLIENT_SECRET: " client_secret
    read -p "Ingresa tu dominio (ej: https://tudominio.com): " domain
    
    cat > .env << EOF
TWITCH_CLIENT_ID=$client_id
TWITCH_CLIENT_SECRET=$client_secret
TWITCH_REDIRECT_URI=$domain/auth/callback
PORT=3000
NODE_ENV=production
EOF
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
fi

# 7. Instalar dependencias y compilar
echo -e "\n${YELLOW}[7/8] Instalando dependencias...${NC}"
npm install --production
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

echo -e "\n${YELLOW}Compilando frontend...${NC}"
npm run build:web
echo -e "${GREEN}✓ Frontend compilado${NC}"

# 8. Configurar PM2
echo -e "\n${YELLOW}[8/8] Configurando PM2...${NC}"
pm2 delete lachhh-tools 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

echo -e "\n${GREEN}✓ PM2 configurado${NC}"

# Instalar Nginx (opcional)
read -p "¿Deseas instalar y configurar Nginx? (s/n): " install_nginx
if [ "$install_nginx" = "s" ] || [ "$install_nginx" = "S" ]; then
    echo -e "\n${YELLOW}Instalando Nginx...${NC}"
    apt install -y nginx
    
    read -p "Ingresa tu dominio (ej: tudominio.com): " domain_name
    
    cat > /etc/nginx/sites-available/lachhh-tools << EOF
server {
    listen 80;
    server_name $domain_name www.$domain_name;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
    
    ln -sf /etc/nginx/sites-available/lachhh-tools /etc/nginx/sites-enabled/
    nginx -t && systemctl restart nginx
    echo -e "${GREEN}✓ Nginx configurado${NC}"
    
    # Instalar SSL con Certbot
    read -p "¿Deseas instalar SSL con Let's Encrypt? (s/n): " install_ssl
    if [ "$install_ssl" = "s" ] || [ "$install_ssl" = "S" ]; then
        apt install -y certbot python3-certbot-nginx
        certbot --nginx -d $domain_name -d www.$domain_name
        echo -e "${GREEN}✓ SSL configurado${NC}"
    fi
fi

# Configurar firewall
read -p "¿Deseas configurar el firewall UFW? (s/n): " setup_firewall
if [ "$setup_firewall" = "s" ] || [ "$setup_firewall" = "S" ]; then
    echo -e "\n${YELLOW}Configurando firewall...${NC}"
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw --force enable
    echo -e "${GREEN}✓ Firewall configurado${NC}"
fi

# Resumen final
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Instalación completada exitosamente!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "\n${YELLOW}Información:${NC}"
echo -e "  📁 Directorio: /var/www/lachhh-tools"
echo -e "  🌐 Puerto: 3000"
echo -e "  📊 Estado: pm2 status"
echo -e "  📋 Logs: pm2 logs lachhh-tools"
echo -e "\n${YELLOW}Comandos útiles:${NC}"
echo -e "  pm2 restart lachhh-tools  - Reiniciar aplicación"
echo -e "  pm2 stop lachhh-tools     - Detener aplicación"
echo -e "  pm2 logs lachhh-tools     - Ver logs"
echo -e "  pm2 monit                 - Monitoreo en tiempo real"
echo -e "\n${YELLOW}URLs de widgets para OBS:${NC}"
if [ -n "$domain_name" ]; then
    echo -e "  https://$domain_name/widget/giveaway-animation"
    echo -e "  https://$domain_name/widget/countdown-winner"
    echo -e "  https://$domain_name/widget/notifications"
else
    echo -e "  http://tu-ip:3000/widget/giveaway-animation"
    echo -e "  http://tu-ip:3000/widget/countdown-winner"
    echo -e "  http://tu-ip:3000/widget/notifications"
fi
echo -e "\n${GREEN}¡Listo para usar!${NC}\n"
