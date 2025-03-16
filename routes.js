const express = require("express");
const router = express.Router();
const Donacion = require("./models/Donacion");

// Ruta para mostrar la página principal (con donaciones)
router.get("/", async (req, res) => {
  try {
    const donaciones = await Donacion.find();
    res.render("index", { donaciones });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para agregar una nueva donación
router.post("/donaciones", async (req, res) => {
  try {
    const { NombrePersona, Descripcion, Monto } = req.body;
    const nuevaDonacion = new Donacion({ NombrePersona, Descripcion, Monto });
    await nuevaDonacion.save();
    res.redirect("/");  // Redirige a la página principal después de agregar la donación
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
