// routes/clientes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // usa tu pool

// Buscar cliente por DNI desde la tabla de membresías
router.get('/api/clientes/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        CASE 
          WHEN dni_1 = ? THEN nombre_completo_1
          WHEN dni_2 = ? THEN nombre_completo_2
        END AS nombre,
        ? AS dni,
        fecha_inicio AS fecha_matricula,
        fecha_fin AS fecha_vencimiento
      FROM membresias
      WHERE dni_1 = ? OR dni_2 = ?
      ORDER BY fecha_inicio DESC
      LIMIT 1
      `,
      [dni, dni, dni, dni, dni]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error buscando cliente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
