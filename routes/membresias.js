const express = require('express');
const router = express.Router();
const { pool, registrarAuditoria } = require('../db');
const moment = require('moment');

// 📌 Ruta para registrar membresía mensual
router.post('/mensual', async (req, res) => {
  const { nombre_completo, dni, fecha_inicio, metodo_pago, numero_boleta } = req.body;

  if (!nombre_completo || !dni || !fecha_inicio || !metodo_pago || !numero_boleta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const fecha_fin = moment(fecha_inicio).add(1, 'months').format('YYYY-MM-DD');

    const sql = `
      INSERT INTO membresias (
        nombre_completo_1, dni_1, fecha_inicio, fecha_fin, metodo_pago, numero_boleta, tipo_membresia
      ) VALUES (?, ?, ?, ?, ?, ?, 'Mensual')
    `;
    const valores = [nombre_completo, dni, fecha_inicio, fecha_fin, metodo_pago, numero_boleta];
    const [result] = await pool.query(sql, valores);

    await registrarAuditoria('warrior', 'Registro', `Registró membresía Mensual (${dni})`);

    return res.status(200).json({ message: 'Membresía mensual registrada', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar membresía:", error);
    return res.status(500).json({ error: 'Error al registrar membresía', detalles: error.message });
  }
});

// 📌 Ruta para registrar membresía Duo
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
    let fechaFin;
    if (dni1 === dni2) {
      fechaFin = moment(fechaInicio).add(2, 'months').format('YYYY-MM-DD');
    } else {
      fechaFin = moment(fechaInicio).add(1, 'months').format('YYYY-MM-DD');
    }

    const sql = `
      INSERT INTO membresias (
        nombre_completo_1, dni_1,
        nombre_completo_2, dni_2,
        fecha_inicio, fecha_fin,
        metodo_pago, numero_boleta, tipo_membresia
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Duo')
    `;
    const valores = [
      nombre1, dni1,
      nombre2, dni2,
      fechaInicio, fechaFin,
      metodoPago, numeroBoleta
    ];
    const [result] = await pool.query(sql, valores);

    await registrarAuditoria('warrior', 'Registro', `Registró membresía Duo (${dni1} y ${dni2})`);

    return res.status(200).json({ message: 'Membresía Duo registrada', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar membresía Duo:", error);
    return res.status(500).json({ error: 'Error al registrar membresía Duo', detalles: error.message });
  }
});

// 📌 Ruta para registrar membresía Trimestral
router.post('/trimestral', async (req, res) => {
  const {
    nombre,
    dni,
    fechaInicio,
    metodoPago,
    numeroBoleta
  } = req.body;

  if (!nombre || !dni || !fechaInicio || !metodoPago || !numeroBoleta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const fechaFin = moment(fechaInicio).add(3, 'months').format('YYYY-MM-DD');

    const sql = `
      INSERT INTO membresias (
        nombre_completo_1, dni_1,
        fecha_inicio, fecha_fin,
        metodo_pago, numero_boleta, tipo_membresia
      ) VALUES (?, ?, ?, ?, ?, ?, 'Trimestral')
    `;
    const valores = [nombre, dni, fechaInicio, fechaFin, metodoPago, numeroBoleta];
    const [result] = await pool.query(sql, valores);

    await registrarAuditoria('warrior', 'Registro', `Registró membresía Trimestral (${dni})`);

    return res.status(200).json({ message: 'Membresía Trimestral registrada', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar membresía Trimestral:", error);
    return res.status(500).json({ error: 'Error al registrar membresía Trimestral', detalles: error.message });
  }
});

module.exports = router;
