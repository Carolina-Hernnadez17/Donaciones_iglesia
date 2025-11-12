# Sistema de Donaciones - Iglesia Fuente de Vida

## 🎯 Descripción
Sistema completo de gestión de donaciones para iglesias con capacidad de generar reportes por departamento, rango de fechas y donante.

## ✨ Características Principales

### 1. **Registro de Donaciones**
- Formulario dinámico para agregar múltiples donaciones
- Selector de departamentos predefinidos
- Formato de fecha mejorado
- Validación de datos

### 2. **Departamentos Disponibles**
- Misiones
- Alabanza
- Jóvenes
- Niños
- Construcción
- Diezmos
- Ofrendas
- Otros

### 3. **Reportes y Consultas**
- **Reporte por Departamento**: Filtra donaciones por departamento específico
- **Reporte por Rango de Fechas**: Consulta donaciones entre dos fechas
- **Reporte Combinado**: Departamento + Rango de fechas
- **Resumen por Donante**: Genera carta de declaración personalizada
- **Exportación a PDF**: Todos los reportes son descargables en PDF

### 4. **Mejoras en el Diseño**
- Interfaz moderna y responsiva
- Animaciones y transiciones suaves
- Colores y gradientes atractivos
- Tablas con scroll personalizado
- Diseño optimizado para móviles

### 5. **Formato de Fechas**
- Formato español: DD/MM/YYYY
- Fechas correctamente formateadas en todas las vistas
- Año actualizado a 2025 en reportes

## 🚀 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB Atlas (cuenta configurada)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
cd donaciones-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
El archivo `.env` ya está configurado con:
```env
MONGO_URI=mongodb+srv://socawah:DCS007PCMJstUoZu@cluster0.sfa9z.mongodb.net/donaciones_db?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
```

4. **Iniciar el servidor**
```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

5. **Acceder a la aplicación**
Abrir el navegador en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
donaciones-app/
├── models/
│   └── Donation.js          # Modelo de MongoDB
├── public/
│   ├── css/
│   │   └── styles.css       # Estilos personalizados
│   ├── index.html           # Página principal - Registro
│   ├── donationhistory.html # Historial de donaciones
│   ├── generatereports.html # Generación de reportes
│   └── editdeclaration.html # Edición de donaciones
├── .env                      # Variables de entorno
├── package.json              # Dependencias del proyecto
├── server.js                 # Servidor Express
└── README.md                 # Este archivo
```

## 🔧 Uso del Sistema

### Registrar una Donación
1. Ir a la página principal
2. Llenar el formulario con:
   - Nombre del donante
   - Departamento (selector)
   - Monto
   - Fecha de donación
3. Hacer clic en "Register Donation"

### Generar Reporte por Departamento
1. Ir a "Generate Reports"
2. Seleccionar el departamento deseado
3. (Opcional) Seleccionar rango de fechas
4. Hacer clic en "Apply Filters"
5. Ver el resumen con total de donaciones y monto
6. Hacer clic en "Download PDF Report" para descargar

### Generar Carta de Declaración
1. Ir a "Generate Reports"
2. Ingresar el nombre del donante
3. Hacer clic en "Generate Declaration Letter"
4. Se descargará automáticamente el PDF

### Ver Historial
1. Ir a "Donation History"
2. Usar la barra de búsqueda para filtrar
3. Ver todas las donaciones con formato de fecha mejorado

## 📊 Ejemplo de Uso

### Consultar donaciones del departamento de Misiones
1. Filtro: Departamento = "Misiones"
2. Fecha inicio: 01/01/2025
3. Fecha fin: 11/11/2025
4. Resultado: Lista de todas las donaciones a Misiones con el total

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB Atlas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Framework CSS**: Bootstrap 5.3.3
- **Generación PDF**: PDFKit
- **Variables de Entorno**: dotenv

## 📝 Notas Importantes

1. **Seguridad**: La cadena de conexión a MongoDB está en el archivo `.env`. En producción, usar variables de entorno del servidor.

2. **Fechas**: Todas las fechas se muestran en formato español (DD/MM/YYYY)

3. **PDFs**: Los reportes en PDF se generan con el año 2025 como base

4. **Departamentos**: Los departamentos están predefinidos. Para agregar nuevos, modificar:
   - `index.html` (línea ~85)
   - `generatereports.html` (línea ~113)
   - `editdeclaration.html` (línea ~47)

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que la URI en `.env` sea correcta
- Verificar que la IP esté permitida en MongoDB Atlas
- Verificar credenciales de acceso

### El servidor no inicia
```bash
# Verificar que el puerto 3000 esté disponible
# Cambiar el puerto en .env si es necesario
PORT=3001
```

### Los estilos no se cargan
- Verificar que el archivo `public/css/styles.css` exista
- Limpiar caché del navegador (Ctrl + Shift + R)

## 📞 Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

## 📄 Licencia

© 2025 FUENTE DE VIDA. Todos los derechos reservados.
