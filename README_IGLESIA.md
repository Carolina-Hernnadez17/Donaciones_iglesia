# 💒 Sistema de Gestión de Donaciones - Iglesia

**Aplicación web profesional para registrar, administrar y generar reportes de donaciones.**

## 🎯 Funcionalidades Principales

### 1. Registrar Donaciones
- Captura datos del donante (nombre, descripción, monto, fecha)
- Selecciona departamento de la lista predefinida
- **Opción "Otro"**: Permite agregar un departamento personalizado
- Validación de datos antes de guardar

### 2. Ver Reportes
- Lista de donaciones ordenadas por fecha
- Filtro por año calendario (enero - diciembre)
- Totales por período seleccionado
- Exportación de datos

### 3. Generar Certificados
- Certificado personalizado por año
- Verificación de datos antes de generar
- Formato profesional para presentar

### 4. Gestión de Departamentos
- Vista de todos los departamentos
- Totales acumulados por departamento
- Búsqueda y filtrado

## 🚀 Cómo Iniciar

### Instalación Local

```bash
# 1. Clona el repositorio
git clone https://github.com/Carolina-Hernnadez17/Donaciones_iglesia.git
cd Donaciones_iglesia

# 2. Instala dependencias
npm install

# 3. Configura variables de entorno
# Copia .env.example a .env y actualiza los valores
cp .env.example .env

# 4. Inicia el servidor
npm run dev
```

Accede a: **http://localhost:3005**

## 📁 Estructura del Proyecto

```
Donaciones_iglesia/
├── public/                    # Archivos del cliente (HTML, CSS)
│   ├── index.html            # Formulario de registro
│   ├── reports.html          # Reportes
│   ├── generatereports.html  # Generador de reportes avanzado
│   ├── donationhistory.html  # Historial
│   └── css/                  # Estilos
├── models/                    # Esquemas de datos (MongoDB)
│   └── Donation.js           # Modelo de donación
├── server.js                 # Servidor principal
├── .env.example              # Variables de entorno (plantilla)
└── package.json              # Dependencias

```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Base de datos
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/basedatos

# Servidor
NODE_ENV=development
PORT=3005
```

### Departamentos Predefinidos

Los departamentos se cargan automáticamente de la base de datos. Para agregar uno nuevo:

1. Ve a **"Registrar Donación"**
2. Selecciona **"Otro"** en el desplegable
3. Ingresa el nombre del departamento personalizado
4. El nuevo departamento se guarda automáticamente

## 📊 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/departments` | Lista de departamentos |
| GET | `/api/years` | Años con donaciones |
| POST | `/api/donaciones` | Crear donación |
| GET | `/api/reports/by-department` | Reportes por departamento |
| GET | `/api/donor-summary-preview` | Resumen de donante |

## 🌐 Despliegue en Render

Para desplegar en producción, sigue la **[GUIA_DESPLIEGUE_RENDER.md](./GUIA_DESPLIEGUE_RENDER.md)**

```bash
# URL en producción (ejemplo)
https://donaciones-iglesia.onrender.com
```

## 📝 Notas de Uso

- Las fechas se registran automáticamente con la fecha actual
- Los filtros por año cubren enero a diciembre
- Los totales se calculan automáticamente
- Se pueden crear departamentos personalizados sobre la marcha

## 🔐 Seguridad

- ⚠️ **Nunca** hagas push del archivo `.env` a Git
- Usa `.env.example` como referencia
- Las credenciales se manejan solo en variables de entorno
- En Render, configura variables de entorno en el dashboard

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Responsive (funciona en celular, tablet y desktop)
- ✅ Funciona con conexión a internet

## ❓ Solución de Problemas

### Error de conexión a Base de Datos
- Verifica que MongoDB Atlas está activo
- Confirma que la IP actual está en la whitelist de Atlas
- Revisa que `MONGODB_URI` en `.env` es correcto

### Servidor no inicia
- Asegúrate de tener Node.js 16+ instalado
- Ejecuta `npm install` para instalar dependencias
- Revisa puerto 3005 no esté en uso

### Formulario no guarda datos
- Verifica que el servidor está corriendo
- Abre la consola del navegador (F12) para ver errores
- Revisa las logs del servidor

## 📞 Soporte

Para reportar errores o sugerencias, abre un **Issue** en GitHub.

---

**Última actualización**: 2024
**Versión**: 1.0.0
