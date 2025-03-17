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
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/donationhistory', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'donationhistory.html'));
});

app.get('/generatereports', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'generatereports.html'));
});

app.get('/edit-declaration/:donorName', (req, res) => {
  // Ahora se envía el archivo HTML de edición, y la carga dinámica de datos deberá hacerse vía JavaScript en el cliente
  res.sendFile(path.join(__dirname, 'views', 'editdeclaration.html'));
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


app.get('/api/donaciones', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ NombrePersona: 1 });
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: 'Failed to fetch donations' });
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
  doc.text(`Thank you for your contributions to Fuente De Vida A/D church. Our records indicate that your total giving from 2024-01-01 to ${new Date().toLocaleDateString()} was $_${totalDonations[0].total.toFixed(2)}.____________\n\n`);
  doc.text('This total includes checks and cash for Pledge, Tithe and offering gifts.\n\n');
  doc.text('Should you have any questions regarding your contributions, please contact me at (515) 210-8767.\n\n\n\n');
  doc.text('Sincerely,\n\n\n\nDelfina Zepeda\nContributions Secretary\n');

  doc.end();
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
  doc.text(`Thank you for your contributions to Fuente De Vida A/D church. Our records indicate that your total giving from 2024-01-01 to ${fecha} was $_${total}.____________\n\n`);
  doc.text(`Description: ${descripcion}\n`);
  doc.text(`Amount: $${monto}\n\n`);
  doc.text('This total includes checks and cash for Pledge, Tithe, and offering gifts.\n\n');
  doc.text('Should you have any questions regarding your contributions, please contact me at (515) 210-8767.\n\n\n\n');
  doc.text('Sincerely,\n\n\n\nDelfina Zepeda\nContributions Secretary\n');

  doc.end();
});

// Ruta: Agregar donación (envío del formulario)
app.post('/donations', async (req, res) => {
  const { NombrePersona, Descripcion, Monto, FechaDonacion } = req.body;
  const fechaIngresada = new Date(FechaDonacion);

  if (isNaN(fechaIngresada)) {
    return res.status(400).send("Fecha de donación no válida.");
  }

  const donation = new Donation({ 
    NombrePersona, 
    Descripcion, 
    Monto, 
    FechaDonacion: fechaIngresada 
  });

  await donation.save();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
