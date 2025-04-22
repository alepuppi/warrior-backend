// En routes/clientes.js o donde tengas las rutas de clientes
const express = require('express');
const router = express.Router();
const db = require('../db'); // Ajusta según tu configuración

router.get('/api/clientes/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT nombre, dni, fecha_matricula, fecha_vencimiento FROM membresias WHERE dni = ? ORDER BY fecha_matricula DESC LIMIT 1",
      [dni]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error buscando cliente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
