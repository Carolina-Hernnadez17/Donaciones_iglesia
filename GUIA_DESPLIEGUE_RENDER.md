# 🚀 GUÍA DE DESPLIEGUE EN RENDER

Este documento describe cómo desplegar la aplicación de Donaciones en **Render.com** de forma segura y profesional.

## 📋 REQUISITOS

- Cuenta en [render.com](https://render.com)
- Acceso a MongoDB Atlas
- Git configurado en tu máquina

## 🔒 PASO 1: Configurar Variables de Entorno

### En tu máquina local:

Crea un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.sfa9z.mongodb.net/<base-datos>?retryWrites=true&w=majority
PORT=3005
```

**IMPORTANTE**: Nunca commits el archivo `.env` a Git. Usa `.env.example` como referencia.

### En Render:

1. Ve a tu aplicación en Render
2. Haz clic en **"Environment"**
3. Agrega las variables de entorno como en el ejemplo anterior

## 📦 PASO 2: Preparar el Proyecto

### Verifica package.json:

```json
{
  "name": "donaciones-app",
  "version": "1.0.0",
  "description": "Sistema de Gestión de Donaciones",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1"
  }
}
```

## 🔗 PASO 3: Crear Servicio en Render

1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio GitHub

### Configuración:

| Campo | Valor |
|-------|-------|
| **Name** | donaciones-iglesia |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Region** | Miami (us-east-1) |
| **Plan** | Free (o Starter si necesitas uptime 99.9%) |

## 🌐 PASO 4: Verificar Despliegue

Una vez desplegado:

1. Ve a **"Deployments"** en tu servicio
2. Espera a que el estado cambie a **✅ Live**
3. Haz clic en la URL para verificar que funciona

```
https://donaciones-iglesia.onrender.com
```

## 🧪 PRUEBAS POST-DESPLIEGUE

Verifica estas funcionalidades:

- ✅ **Registrar donación**: Ve a `/` y crea una donación
- ✅ **Ver reportes**: Ve a `/reports.html`
- ✅ **Departamento personalizado**: Selecciona "Otro" en el formulario
- ✅ **Filtro por año**: En reportes, selecciona un año

## 📱 ACCESO DESDE DISPOSITIVOS

Desde cualquier dispositivo, usa:

```
https://donaciones-iglesia.onrender.com
```

**Nota**: El primer acceso después de inactividad puede tomar 30 segundos (Plan Free).

## ⚠️ MANTENIMIENTO

### Logs en Render:

1. Ve a tu servicio en Render
2. Haz clic en **"Logs"** para ver errores en tiempo real

### Reiniciar servicio:

1. Ve a tu servicio
2. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**

---

**¿Preguntas?** Verifica las logs en Render para diagnosticar problemas.
