# 🙏 Sistema de Gestión de Donaciones
## Iglesia Fuente de Vida

---

## 📖 Descripción

Sistema integral y seguro para la gestión de donaciones eclesiales. Proporciona herramientas profesionales para registrar, organizar y generar reportes de contribuciones, facilitando la administración transparente de fondos parroquiales.

**Características**: Registro de donaciones • Reportes por departamento • Cartas de declaración • Vista previa segura • Exportación a PDF

---

## ✨ Funcionalidades Principales

### 📝 **Registro de Donaciones**
- Formulario intuitivo y fácil de usar
- Selector dinámico de departamentos
- Validación automática de datos
- Soporte para múltiples donaciones por sesión

### 📊 **Reportes Avanzados**
- Filtrar por departamento específico
- Buscar por rango de fechas personalizado
- Generar por año calendario
- Totales calculados automáticamente

### 📋 **Cartas de Declaración**
- Generar certificados por donante
- Período personalizable por año
- Verificación previa antes de imprimir
- Formato profesional en PDF

### 👁️ **Sistema de Verificación**
- Vista previa de donaciones antes de reportes
- Validación de totales en tiempo real
- Interfaz clara y transparente
- Garantía de exactitud en números

### 📱 **Diseño Responsivo**
- Interfaz moderna y profesional
- Compatible con todos los dispositivos
- Fácil navegación
- Accesibilidad mejorada

---

## 🚀 Requisitos e Instalación

### Requisitos Previos
- **Node.js** v14 o superior
- **npm** o **yarn** (gestor de paquetes)
- Conexión a Internet para base de datos

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Carolina-Hernnadez17/Donaciones_iglesia.git
cd Donaciones_iglesia
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env (proporcionar al administrador)
cp .env.example .env
# Editar .env con credenciales proporcionadas
```

4. **Iniciar servidor**
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

5. **Acceder a la aplicación**
```
Abrir navegador: http://localhost:3005
```

---

## 📂 Estructura del Proyecto

```
donaciones-iglesia/
├── 📁 models/
│   └── Donation.js              # Esquema de base de datos
│
├── 📁 public/
│   ├── 📁 css/
│   │   └── styles.css           # Estilos personalizados
│   ├── 📁 js/
│   │   └── utils.js             # Funciones auxiliares
│   │
│   ├── index.html               # 🏠 Página principal
│   ├── generatereports.html      # 📊 Generador de reportes
│   ├── donationhistory.html      # 📜 Historial de donaciones
│   ├── donor-summary.html        # 👤 Resumen de donante
│   └── editdeclaration.html      # ✏️ Edición de donaciones
│
├── 📄 server.js                 # Servidor Express principal
├── 📄 package.json              # Dependencias del proyecto
├── 📄 .env                      # Variables de entorno (no compartir)
├── 📄 .gitignore                # Archivos ignorados en Git
└── 📄 README.md                 # Este archivo
```

---

## 🎯 Guía de Uso

### 1️⃣ Registrar una Donación

```
1. Ir a: Página Principal
2. Completar formulario:
   • Nombre del donante
   • Departamento (desplegable)
   • Monto en dólares
   • Fecha de donación
3. Hacer clic: "Registrar Donación"
4. Confirmación: Mensaje de éxito
```

### 2️⃣ Ver Historial de Donaciones

```
1. Ir a: Historial de Donaciones
2. Búsqueda: Nombre, monto o departamento
3. Filtros: Aplicar criterios
4. Resultado: Lista completa y ordenada
```

### 3️⃣ Generar Reporte por Departamento

```
1. Ir a: Generador de Reportes
2. Seleccionar:
   • Departamento
   • Rango de fechas (opcional)
3. Aplicar filtros
4. Descargar: PDF con resumen
```

### 4️⃣ Generar Carta de Declaración

```
1. Ir a: Generador de Reportes
2. Buscar: Nombre del donante
3. Seleccionar: Año de consulta
4. Vista previa: Verificar totales
5. Generar: Descargar PDF certificado
```

---

## 🔐 Seguridad y Confidencialidad

### Protección de Datos
✅ Credenciales **nunca** se exponen en código  
✅ Variables de entorno protegidas  
✅ Conexión encriptada a base de datos  
✅ Validación de entrada en todos los campos  

### Buenas Prácticas
- No compartir archivo `.env`
- No commit de credenciales a Git
- Usar contraseñas seguras
- Acceso restringido al servidor

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología |
|-----------|------------|
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Frontend | HTML5 + CSS3 + JavaScript |
| Estilos | Bootstrap 5.3.3 |
| PDF | PDFKit |
| Control de versión | Git |

---

## 📞 Soporte y Mantenimiento

### Problemas Comunes

**Error: "Cannot find module..."**
```bash
# Solución:
npm install
```

**Error: "Port already in use"**
```bash
# Cambiar puerto en .env
PORT=3006
```

**La base de datos no conecta**
- Verificar credenciales en `.env`
- Confirmar conexión a Internet
- Contactar al administrador del servidor

### Contacto de Soporte
Para asistencia técnica, contactar al equipo de TI de la iglesia.

---

## 📚 Documentación Adicional

- **Departamentos Disponibles**: Misiones, Alabanza, Jóvenes, Niños, Construcción, Diezmos, Ofrendas, Otros
- **Formatos de Fecha**: DD/MM/YYYY (ej: 15/11/2026)
- **Moneda**: USD ($)
- **Idioma**: Español

---

## 📋 Versión y Cambios

**Versión Actual**: 2.1.0  
**Última Actualización**: Noviembre 2026  
**Estado**: Producción

### Características Recientes
- ✅ Vista previa de donaciones mejorada
- ✅ Filtro por año calendárico
- ✅ Totales verificables antes de imprimir
- ✅ Diseño responsivo optimizado

---

## ⚖️ Licencia y Derechos

© 2026 **Iglesia Fuente de Vida**  
Todos los derechos reservados.

Sistema desarrollado y mantenido para uso interno de la congregación.

---

## 🙏 Notas Importantes

- Sistema diseñado únicamente para administración interna
- Mantener confidencialidad de donantes
- Usar con responsabilidad y transparencia
- Reportes para verificación interna solamente

**"Porque Dios ama al que da con alegría"** - 2 Corintios 9:7

## 🚀 Instalación

### Requisitos Previos
- **Node.js** v14 o superior
- **npm** o **yarn** (gestor de paquetes)
- Conexión a Internet

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Carolina-Hernnadez17/Donaciones_iglesia.git
cd Donaciones_iglesia
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Contactar al administrador para obtener archivo `.env` con credenciales

4. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

5. **Acceder a la aplicación**
```
http://localhost:3005
```

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

### Generar Carta de Declaración con Preview
1. Ir a "Generate Reports"
2. Ingresar el nombre del donante
3. Seleccionar el año deseado
4. Hacer clic en "Preview & Generate"
5. Aparecerá una ventana con:
   - Nombre del donante
   - Año seleccionado
   - Total de donaciones en ese año
   - Cantidad de transacciones
6. Verificar que el total sea correcto
7. Hacer clic en "Back" para buscar otro donante o "Generate PDF" para descargar

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
