const express = require('express');
const router = express.Router();
const { pool, registrarAuditoria } = require('../db');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

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
    const fechaFin = (dni1 === dni2)
      ? moment(fechaInicio).add(2, 'months').format('YYYY-MM-DD')
      : moment(fechaInicio).add(1, 'months').format('YYYY-MM-DD');

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

// 📌 Ruta para listar membresías
router.get('/listado', async (req, res) => {
  try {
    const [filas] = await pool.query(`
      SELECT
        id,
        nombre_completo_1,
        dni_1,
        nombre_completo_2,
        dni_2,
        fecha_inicio,
        fecha_fin,
        metodo_pago,
        numero_boleta,
        tipo_membresia
      FROM membresias
      ORDER BY fecha_inicio DESC
    `);

    const procesado = filas.flatMap((m) => {
      const fila1 = {
        nombre_completo: m.nombre_completo_1,
        dni: m.dni_1,
        fecha_inicio: m.fecha_inicio,
        fecha_fin: m.fecha_fin,
        tipo_membresia: m.tipo_membresia,
        numero_boleta: m.numero_boleta,
        metodo_pago: m.metodo_pago,
      };

      const fila2 = (m.dni_2 && m.dni_1 !== m.dni_2)
        ? {
            nombre_completo: m.nombre_completo_2,
            dni: m.dni_2,
            fecha_inicio: m.fecha_inicio,
            fecha_fin: m.fecha_fin,
            tipo_membresia: m.tipo_membresia,
            numero_boleta: m.numero_boleta,
            metodo_pago: m.metodo_pago,
          }
        : null;

      return fila2 ? [fila1, fila2] : [fila1];
    });

    return res.status(200).json(procesado);
  } catch (error) {
    console.error("❌ Error al obtener listado de membresías:", error);
    return res.status(500).json({ error: 'Error al obtener listado de membresías' });
  }
});

// 📌 Ruta para descargar PDF
router.get('/descargar-pdf', async (req, res) => {
  try {
    const [filas] = await pool.query("SELECT * FROM membresias ORDER BY fecha_inicio DESC");

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="membresias.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Listado de Membresías', { align: 'center' }).moveDown();

    filas.forEach((m, index) => {
      const fechaInicio = new Date(m.fecha_inicio).toISOString().split("T")[0];
      const fechaFin = m.fecha_fin ? new Date(m.fecha_fin).toISOString().split("T")[0] : "—";

      const persona1 = `${m.nombre_completo_1} (${m.dni_1})`;
      const persona2 = m.dni_2 && m.dni_1 !== m.dni_2
        ? ` y ${m.nombre_completo_2} (${m.dni_2})`
        : "";

      doc
        .fontSize(12)
        .text(`${index + 1}. ${persona1}${persona2} - ${m.tipo_membresia} - ${fechaInicio} → ${fechaFin}`)
        .moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    console.error("❌ Error al generar PDF:", err);
    res.status(500).send("Error al generar PDF");
  }
});

// 📌 Ruta para descargar Excel
router.get('/descargar-excel', async (req, res) => {
  try {
    const [filas] = await pool.query("SELECT * FROM membresias ORDER BY fecha_inicio DESC");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Membresías");

    worksheet.columns = [
      { header: "Nombre", key: "nombre_completo" },
      { header: "DNI", key: "dni" },
      { header: "Inicio", key: "fecha_inicio" },
      { header: "Fin", key: "fecha_fin" },
      { header: "Tipo", key: "tipo_membresia" },
      { header: "Boleta", key: "numero_boleta" },
      { header: "Pago", key: "metodo_pago" },
    ];

    filas.forEach((m) => {
      worksheet.addRow({
        nombre_completo: m.nombre_completo_1,
        dni: m.dni_1,
        fecha_inicio: m.fecha_inicio,
        fecha_fin: m.fecha_fin,
        tipo_membresia: m.tipo_membresia,
        numero_boleta: m.numero_boleta,
        metodo_pago: m.metodo_pago,
      });

      if (m.dni_2 && m.dni_1 !== m.dni_2) {
        worksheet.addRow({
          nombre_completo: m.nombre_completo_2,
          dni: m.dni_2,
          fecha_inicio: m.fecha_inicio,
          fecha_fin: m.fecha_fin,
          tipo_membresia: m.tipo_membresia,
          numero_boleta: m.numero_boleta,
          metodo_pago: m.metodo_pago,
        });
      }
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=membresias.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error al generar Excel:", err);
    res.status(500).send("Error al generar Excel");
  }
});

module.exports = router;
