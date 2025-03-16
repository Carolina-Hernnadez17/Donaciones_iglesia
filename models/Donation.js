const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Aunque los nombres de campo están en español, se mostrarán en inglés en las vistas.
  NombrePersona: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Monto: { type: Number, required: true },
  FechaDonacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
