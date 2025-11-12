const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const PDFDocument = require('pdfkit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se sirven archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importar el modelo Donation
const Donation = require('./models/Donation');

// Rutas para servir las vistas HTML

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/donationhistory', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'donationhistory.html'));
});

app.get('/generatereports', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'generatereports.html'));
});

app.get('/reports', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reports.html'));
});

app.get('/edit-declaration/:donorName', (req, res) => {
  // Ahora se envía el archivo HTML de edición, y la carga dinámica de datos deberá hacerse vía JavaScript en el cliente
  res.sendFile(path.join(__dirname, 'public', 'editdeclaration.html'));
});

app.get('/editdeclaration/:id', (req, res) => {
  // Ruta actualizada para editar por ID de donación
  res.sendFile(path.join(__dirname, 'public', 'editdeclaration.html'));
});

app.get('/api/donor/:donorName', async (req, res) => {
  const donorName = req.params.donorName;
  try {
    const donor = await Donation.findOne({ NombrePersona: donorName });
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    const totalDonations = await Donation.aggregate([
      { $match: { NombrePersona: donorName } },
      { $group: { _id: "$NombrePersona", total: { $sum: "$Monto" } } }
    ]);
    res.json({ donor, total: totalDonations.length > 0 ? totalDonations[0].total : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nueva ruta para obtener una donación específica por ID
app.get('/api/donation/:id', async (req, res) => {
  const donationId = req.params.id;
  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Ruta para eliminar una donación por ID
app.get('/delete-donation/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Donation.findByIdAndDelete(id);
    res.redirect('/donationhistory'); // Redirige a la lista de donaciones después de eliminar
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).send('Error deleting donation');
  }
});


app.get('/edit-declaration/:nombrePersona', (req, res) => {
  const nombrePersona = req.params.nombrePersona;

  // Buscar la donación en la base de datos usando nombrePersona
  Donacion.findOne({ NombrePersona: nombrePersona })
    .then(donation => {
      if (donation) {
        res.render('edit-donation', { donation });
      } else {
        res.status(404).send('Donation not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching donation');
    });
});





app.get('/api/donaciones', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ NombrePersona: 1 });
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});


app.get('/edit-declaration/:nombrePersona', async (req, res) => {
  const nombrePersona = req.params.nombrePersona;

  try {
    // Buscar la donación en la base de datos usando el nombre del donante
    const donation = await Donation.findOne({ NombrePersona: nombrePersona });

    if (donation) {
      // Enviar los datos de la donación como JSON
      res.json(donation);
    } else {
      res.status(404).send('Donation not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching donation');
  }
});

app.post('/edit-donation', async (req, res) => {
  const { donationId, NombrePersona, fecha, descripcion, monto } = req.body;

  try {
    // Buscar la donación por ID único
    const donation = await Donation.findById(donationId);

    if (donation) {
      // Actualizar los campos de la donación con los nuevos datos
      donation.FechaDonacion = new Date(fecha + 'T12:00:00');  // Agregar tiempo para evitar problemas de zona horaria
      donation.Descripcion = descripcion;
      donation.Monto = parseFloat(monto);

      // Guardar los cambios en la base de datos
      await donation.save();

      // Enviar respuesta JSON de éxito
      res.json({ success: true, message: 'Donation updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Donation not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating donation' });
  }
});


// Ruta: Generar PDF de todas las donaciones (tabla)
app.get('/generate-pdf', async (req, res) => {
  const donations = await Donation.find().sort({ NombrePersona: 1 });

  if (donations.length === 0) {
    return res.status(404).send('No donations to display');
  }

  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Donations_List.pdf"');

  doc.pipe(res);

  doc.fontSize(18).text('Donations List', { align: 'center' });
  doc.moveDown();

  const tableTop = 100;
  const col1X = 50;
  const col2X = 200;
  const col3X = 450;
  const col4X = 550;

  doc.fontSize(12).text('Donor Name', col1X, tableTop);
  doc.text('Description', col2X, tableTop);
  doc.text('Amount', col3X, tableTop, { width: 80, align: 'right' });
  doc.text('Donation Date', col4X, tableTop, { width: 80, align: 'right' });

  doc.moveTo(col1X, tableTop + 15)
     .lineTo(750, tableTop + 15)
     .stroke();

  let rowY = tableTop + 25;
  donations.forEach(donation => {
    doc.fontSize(10).text(donation.NombrePersona, col1X, rowY);
    doc.text(donation.Descripcion, col2X, rowY);
    doc.text(`$${donation.Monto.toFixed(2)}`, col3X, rowY, { width: 80, align: 'right' });
    doc.text(new Date(donation.FechaDonacion).toLocaleDateString(), col4X, rowY, { width: 80, align: 'right' });
    rowY += 20;
    if (rowY > doc.page.height - 50) {
      doc.addPage({ margin: 30, size: 'A4', layout: 'landscape' });
      rowY = 50;
    }
  });

  doc.end();
});

// Ruta para cargar la página de edición de donaciones
app.get('/edit-declaration/:nombrePersona', async (req, res) => {
  try {
    const nombrePersona = req.params.nombrePersona;

    // Buscar la donación en la base de datos usando el nombre del donante
    const donation = await Donacion.findOne({ NombrePersona: nombrePersona });

    if (donation) {
      // Renderizar la vista y pasar la donación como un objeto JSON dentro de un script
      res.render('edit-donation', { 
        donation: JSON.stringify(donation)  // Convertir el objeto a JSON
      });
    } else {
      res.status(404).send('Donation not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching donation');
  }
});


// Ruta: Generar PDF resumen por nombre de donante
app.get('/generate-summary', async (req, res) => {
  const donorName = req.query.nombreDonante;

  if (!donorName) {
    return res.status(400).send('Donor name is required');
  }

  const donor = await Donation.findOne({ NombrePersona: donorName });

  if (!donor) {
    return res.status(404).send('Donor not found');
  }

  const totalDonations = await Donation.aggregate([
    { $match: { NombrePersona: donor.NombrePersona } },
    { $group: { _id: "$NombrePersona", total: { $sum: "$Monto" } } }
  ]);

  const doc = new PDFDocument({ size: 'letter' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Donor_Summary.pdf"');

  doc.pipe(res);

  doc.fontSize(18).text('FUENTE DE VIDA', { align: 'center' });
  doc.fontSize(12).text('ASAMBLEAS DE DIOS\n1216 3rd St.\nPerry, IA 50220\n\n', { align: 'center' });
  doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}\n\n`, { align: 'right' });

  doc.text(`${donor.NombrePersona}\nPerry, IA 50220\n\n\n`);
  doc.text(`Dear ${donor.NombrePersona},\n\n`);
  doc.text(`Thank you for your contributions to Fuente De Vida A/D church. Our records indicate that your total giving from 2025-01-01 to ${new Date().toLocaleDateString()} was $_${totalDonations[0].total.toFixed(2)}.____________\n\n`);
  doc.text('This total includes checks and cash for Pledge, Tithe and offering gifts.\n\n');
  doc.text('Should you have any questions regarding your contributions, please contact me at (515) 210-8767.\n\n\n\n');
  doc.text('Sincerely,\n\n\n\nDelfina Zepeda\nContributions Secretary\n');

  doc.end();
});

// Ruta: Generar reporte por departamento y rango de fechas
app.get('/api/reports/by-department', async (req, res) => {
  try {
    const { department, startDate, endDate } = req.query;
    
    let query = {};
    
    if (department && department !== 'all') {
      query.Descripcion = department;
    }
    
    if (startDate || endDate) {
      query.FechaDonacion = {};
      if (startDate) {
        query.FechaDonacion.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.FechaDonacion.$lte = end;
      }
    }
    
    const donations = await Donation.find(query).sort({ FechaDonacion: -1 });
    
    const total = donations.reduce((sum, donation) => sum + donation.Monto, 0);
    
    res.json({
      donations,
      total,
      count: donations.length
    });
  } catch (error) {
    console.error('Error generating department report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Ruta: Obtener lista de departamentos únicos
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Donation.distinct('Descripcion');
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Ruta: Generar PDF de reporte por departamento
app.get('/generate-department-pdf', async (req, res) => {
  try {
    const { department, startDate, endDate } = req.query;
    
    let query = {};
    
    if (department && department !== 'all') {
      query.Descripcion = department;
    }
    
    if (startDate || endDate) {
      query.FechaDonacion = {};
      if (startDate) {
        query.FechaDonacion.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.FechaDonacion.$lte = end;
      }
    }
    
    const donations = await Donation.find(query).sort({ FechaDonacion: -1 });
    
    if (donations.length === 0) {
      return res.status(404).send('No donations found for the selected criteria');
    }
    
    const total = donations.reduce((sum, donation) => sum + donation.Monto, 0);
    
    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'portrait' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Department_Report_${department || 'All'}.pdf"`);
    
    doc.pipe(res);
    
    // Encabezado
    doc.fontSize(20).text('FUENTE DE VIDA', { align: 'center' });
    doc.fontSize(12).text('Reporte de Donaciones por Departamento\n\n', { align: 'center' });
    
    // Información del filtro
    doc.fontSize(10);
    doc.text(`Departamento: ${department || 'Todos'}`, { align: 'left' });
    if (startDate) doc.text(`Fecha Inicio: ${new Date(startDate).toLocaleDateString()}`, { align: 'left' });
    if (endDate) doc.text(`Fecha Fin: ${new Date(endDate).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}\n\n`, { align: 'left' });
    
    // Tabla
    const tableTop = doc.y;
    const col1X = 50;
    const col2X = 200;
    const col3X = 350;
    const col4X = 450;
    
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Donante', col1X, tableTop);
    doc.text('Departamento', col2X, tableTop);
    doc.text('Monto', col3X, tableTop);
    doc.text('Fecha', col4X, tableTop);
    
    doc.moveTo(col1X, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();
    
    let rowY = tableTop + 25;
    doc.font('Helvetica');
    
    donations.forEach(donation => {
      if (rowY > 750) {
        doc.addPage({ margin: 30, size: 'A4', layout: 'portrait' });
        rowY = 50;
      }
      
      doc.fontSize(9);
      doc.text(donation.NombrePersona, col1X, rowY, { width: 140, ellipsis: true });
      doc.text(donation.Descripcion, col2X, rowY, { width: 140, ellipsis: true });
      doc.text(`$${donation.Monto.toFixed(2)}`, col3X, rowY);
      doc.text(new Date(donation.FechaDonacion).toLocaleDateString(), col4X, rowY);
      rowY += 20;
    });
    
    // Total
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total de Donaciones: ${donations.length}`, col1X, rowY + 20);
    doc.text(`Monto Total: $${total.toFixed(2)}`, col1X, rowY + 40);
    
    doc.end();
  } catch (error) {
    console.error('Error generating department PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

// Ruta: Generar PDF de la declaración (después de la edición)
app.post('/generate-declaration-pdf', async (req, res) => {
  const { NombrePersona, fecha, descripcion, monto, total } = req.body;

  const doc = new PDFDocument({ size: 'letter' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Donor_Summary.pdf"');

  doc.pipe(res);

  doc.fontSize(18).text('FUENTE DE VIDA', { align: 'center' });
  doc.fontSize(12).text('ASAMBLEAS DE DIOS\n1216 3rd St.\nPerry, IA 50220\n\n', { align: 'center' });
  doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}\n\n`, { align: 'right' });

  doc.text(`${NombrePersona}\nPerry, IA 50220\n\n\n`);
  doc.text(`Dear ${NombrePersona},\n\n`);
  doc.text(`Thank you for your contributions to Fuente De Vida A/D church. Our records indicate that your total giving from 2025-01-01 to ${fecha} was $_${total}.____________\n\n`);
  doc.text(`Description: ${descripcion}\n`);
  doc.text(`Amount: $${monto}\n\n`);
  doc.text('This total includes checks and cash for Pledge, Tithe, and offering gifts.\n\n');
  doc.text('Should you have any questions regarding your contributions, please contact me at (515) 210-8767.\n\n\n\n');
  doc.text('Sincerely,\n\n\n\nDelfina Zepeda\nContributions Secretary\n');

  doc.end();
});



// Ruta para registrar donaciones
app.post('/donations', async (req, res) => {
  const { NombrePersona, Descripcion, Monto, FechaDonacion } = req.body;
  
  // Crear fecha ajustando por zona horaria local
  const fechaIngresada = new Date(FechaDonacion + 'T12:00:00');

  if (isNaN(fechaIngresada)) {
    return res.status(400).send("Fecha de donación no válida.");
  }

  if (Descripcion.length !== Monto.length) {
    return res.status(400).send("Descripción y Monto deben tener la misma cantidad de elementos.");
  }

  const donations = Descripcion.map((desc, index) => ({
    NombrePersona,
    Descripcion: desc,
    Monto: Monto[index],
    FechaDonacion: fechaIngresada,
  }));

  try {
    await Donation.insertMany(donations);
    res.redirect('/');
  } catch (error) {
    console.error('Error al guardar las donaciones:', error);
    res.status(500).send("Error al guardar las donaciones.");
  }
});

// Ruta para obtener todas las donaciones
app.get('/api/donaciones', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    console.error('Error al recuperar las donaciones:', error);
    res.status(500).send("Error al recuperar las donaciones.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
