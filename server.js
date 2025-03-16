const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
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
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Importar el modelo Donation
const Donation = require('./models/Donation');

// Route: Generate PDF of all donations (formatted as a table)
app.get('/generate-pdf', async (req, res) => {
  const donations = await Donation.find().sort({ NombrePersona: 1 });

  if (donations.length === 0) {
    return res.status(404).send('No donations to display');
  }

  // Create a new PDF document with margins and landscape layout
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Donations_List.pdf"');

  doc.pipe(res);

  // Title
  doc.fontSize(18).text('Donations List', { align: 'center' });
  doc.moveDown();

  // Table Header positions
  const tableTop = 100;
  const col1X = 50;  // Donor Name
  const col2X = 200; // Description
  const col3X = 450; // Amount
  const col4X = 550; // Donation Date

  // Draw table header
  doc.fontSize(12).text('Donor Name', col1X, tableTop);
  doc.text('Description', col2X, tableTop);
  doc.text('Amount', col3X, tableTop, { width: 80, align: 'right' });
  doc.text('Donation Date', col4X, tableTop, { width: 80, align: 'right' });

  // Draw a horizontal line below the header
  doc.moveTo(col1X, tableTop + 15)
     .lineTo(750, tableTop + 15)
     .stroke();

  // Draw each donation row
  let rowY = tableTop + 25;
  donations.forEach(donation => {
    doc.fontSize(10).text(donation.NombrePersona, col1X, rowY);
    doc.text(donation.Descripcion, col2X, rowY);
    doc.text(`$${donation.Monto.toFixed(2)}`, col3X, rowY, { width: 80, align: 'right' });
    doc.text(new Date(donation.FechaDonacion).toLocaleDateString(), col4X, rowY, { width: 80, align: 'right' });
    rowY += 20;
    // Add a new page if necessary
    if (rowY > doc.page.height - 50) {
      doc.addPage({ margin: 30, size: 'A4', layout: 'landscape' });
      rowY = 50;
    }
  });

  doc.end();
});

// Route: Generate summary PDF by donor name (search by name)
app.get('/generate-summary', async (req, res) => {
  const donorName = req.query.nombreDonante;

  if (!donorName) {
    return res.status(400).send('Donor name is required');
  }

  // Find first donation matching the donor name
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

// Ruta para mostrar el formulario de edición de la carta
app.get('/edit-declaration/:donorName', async (req, res) => {
  const donorName = req.params.donorName;

  if (!donorName) {
    return res.status(400).send('Donor name is required');
  }

  // Buscar la donación del donante
  const donor = await Donation.findOne({ NombrePersona: donorName });

  if (!donor) {
    return res.status(404).send('Donor not found');
  }

  // Buscar el total de las donaciones del donante
  const totalDonations = await Donation.aggregate([
    { $match: { NombrePersona: donor.NombrePersona } },
    { $group: { _id: "$NombrePersona", total: { $sum: "$Monto" } } }
  ]);

  // Renderizar la vista con los datos del donante
  res.render('editdeclaration', {
    donor: donor,
    total: totalDonations[0].total.toFixed(2)
  });
});

// Ruta para generar el PDF después de la edición
app.post('/generate-declaration-pdf', async (req, res) => {
  const { NombrePersona, fecha, descripcion, monto, total } = req.body;

  // Crear el PDF con los datos editados
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

// Ruta para generar el PDF de la carta de donación
app.post('/generate-declaration-pdf', async (req, res) => {
  const { NombrePersona, fecha, descripcion, monto } = req.body;

  // Lógica para generar el PDF con los datos proporcionados
  try {
    const pdfBuffer = await generateDeclarationPDF(NombrePersona, fecha, descripcion, monto);
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
});

// Función para generar el PDF (reemplaza esto con tu propia lógica)
async function generateDeclarationPDF(NombrePersona, fecha, descripcion, monto) {
  const { jsPDF } = require("jspdf");

  const doc = new jsPDF();

  doc.text(`Donation Declaration for ${NombrePersona}`, 10, 10);
  doc.text(`Date: ${fecha}`, 10, 20);
  doc.text(`Description: ${descripcion}`, 10, 30);
  doc.text(`Amount Donated: $${monto}`, 10, 40);

  return doc.output('arraybuffer');
}

// Route: Render Reports view
app.get('/generatereports', async (req, res) => {
  const donations = await Donation.find().sort({ NombrePersona: 1 });
  res.render('generatereports', { donaciones: donations });
});

// Route: Render Donation History view
app.get('/donationhistory', async (req, res) => {
  const donations = await Donation.find().sort({ NombrePersona: 1 });
  res.render('donationhistory', { donaciones: donations });
});

// Route: Add donation (form submission)
app.post('/donations', async (req, res) => {
  const { NombrePersona, Descripcion, Monto, FechaDonacion } = req.body;

  // Convertir la fecha ingresada a un objeto Date
  const fechaIngresada = new Date(FechaDonacion);

  // Verificar si la fecha ingresada es válida
  if (isNaN(fechaIngresada)) {
    return res.status(400).send("Fecha de donación no válida.");
  }

  // Crear una nueva donación con la fecha ingresada
  const donation = new Donation({ 
    NombrePersona, 
    Descripcion, 
    Monto, 
    FechaDonacion: fechaIngresada 
  });

  // Guardar la donación en la base de datos
  await donation.save();
  
  // Redirigir a la página de inicio o historial de donaciones
  res.redirect('/donationhistory');
});

// Route: Main page (Donation Registration)
app.get('/', async (req, res) => {
  const donations = await Donation.find().sort({ NombrePersona: 1 });
  res.render('index', { donaciones: donations });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
