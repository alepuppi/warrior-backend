const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// 📌 Ruta para registrar membresía mensual
router.post('/mensual', async (req, res) => {
  const { nombre_completo, dni, fecha_inicio, metodo_pago, numero_boleta } = req.body;

  if (!nombre_completo || !dni || !fecha_inicio || !metodo_pago || !numero_boleta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const sql = `
      INSERT INTO membresias (nombreCompleto, dni, fechaInicio, metodoPago, numeroBoleta, tipoMembresia)
      VALUES (?, ?, ?, ?, ?, 'Mensual')
    `;
    const valores = [nombre_completo, dni, fecha_inicio, metodo_pago, numero_boleta];
    const [result] = await pool.query(sql, valores);

    return res.status(200).json({ message: 'Membresía mensual registrada', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar membresía:", error);
    return res.status(500).json({ error: 'Error al registrar membresía', detalles: error.message });
  }
});

// ✅ RUTA PARA DUO
router.post('/duo', async (req, res) => {
  const {
    nombre1, dni1,
    nombre2, dni2,
    fechaInicio,
    metodoPago,
    numeroBoleta
  } = req.body;

  if (!nombre1 || !dni1 || !nombre2 || !dni2 || !fechaInicio || !metodoPago || !numeroBoleta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const nombresJuntos = `${nombre1} / ${nombre2}`;
    const dnisJuntos = `${dni1} / ${dni2}`;
    const sql = `
      INSERT INTO membresias (
        nombreCompleto, dni, fechaInicio, metodoPago, numeroBoleta, tipoMembresia
      ) VALUES (?, ?, ?, ?, ?, 'Duo')
    `;
    const valores = [nombresJuntos, dnisJuntos, fechaInicio, metodoPago, numeroBoleta];
    const [result] = await pool.query(sql, valores);

    return res.status(200).json({ message: 'Membresía Duo registrada', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar membresía Duo:", error);
    return res.status(500).json({ error: 'Error al registrar membresía Duo', detalles: error.message });
  }
});

// 📌 Ruta para registrar membresía Trimestral
router.post('/trimestral', async (req, res) => {
    console.log("📥 Datos recibidos en /trimestral:", req.body)
  const {
    nombre,
    dni,
    fechaInicio,
    fechaFin,
    metodoPago,
    numeroBoleta
  } = req.body;

  if (!nombre || !dni || !fechaInicio || !fechaFin || !metodoPago || !numeroBoleta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const sql = `
      INSERT INTO membresias (
        nombreCompleto, dni, fechaInicio,
        fechaFin, metodoPago, numeroBoleta, tipoMembresia
      ) VALUES (?, ?, ?, ?, ?, ?, 'Trimestral')
    `;
    const valores = [nombre, dni, fechaInicio, fechaFin, metodoPago, numeroBoleta];
    const [result] = await pool.query(sql, valores);

    return res.status(200).json({ message: 'Membresía Trimestral registrada', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar membresía Trimestral:", error);
    return res.status(500).json({ error: 'Error al registrar membresía Trimestral', detalles: error.message });
  }
});

module.exports = router;
