const express = require("express");
const router = express.Router();
const { Parser } = require("json2csv");
const pool = require("../db"); // ✅ Usa el pool configurado con variables de entorno

// 📍 Ruta para registrar asistencia desde el huellero
router.post("/asistencias/registrar", async (req, res) => {
  const { dni, fecha, hora } = req.body;

  try {
    await pool.query(
      "INSERT INTO asistencias (dni, fecha, hora) VALUES (?, ?, ?)",
      [dni, fecha, hora]
    );
    res.status(200).json({ mensaje: "✅ Asistencia registrada correctamente" });
  } catch (err) {
    console.error("❌ Error al registrar asistencia:", err);
    res.status(500).json({ mensaje: "Error al registrar asistencia" });
  }
});

router.get("/asistencias/reporte/:mes", async (req, res) => {
  const mes = req.params.mes;
  const anio = new Date().getFullYear();

  const query = `
    SELECT a.id, a.dni, c.nombre_completo, a.fecha
    FROM asistencias a
    JOIN clientes c ON a.dni = c.dni
    WHERE MONTH(a.fecha) = ? AND YEAR(a.fecha) = ?
    ORDER BY a.fecha ASC
  `;

  try {
    const [results] = await pool.query(query, [mes, anio]);

    const fields = ["id", "dni", "nombre_completo", "fecha"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(results);

    res.header("Content-Type", "text/csv");
    res.attachment(`reporte_asistencias_mes_${mes}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error("❌ Error al generar el reporte:", err);
    return res.status(500).send("Error al generar el reporte");
  }
});

// 📍 Obtener asistencias del día actual con estado de membresía
router.get("/asistencias/actual", async (req, res) => {
  const hoy = new Date().toISOString().slice(0, 10);

  const query = `
    SELECT a.dni, c.nombre_completo, a.hora, c.fecha_vencimiento
    FROM asistencias a
    JOIN clientes c ON a.dni = c.dni
    WHERE a.fecha = ?
    ORDER BY a.hora DESC
  `;

  try {
    const [resultados] = await pool.query(query, [hoy]);

    const asistencias = resultados.map(row => {
      const vencido = new Date(row.fecha_vencimiento) < new Date();
      return {
        dni: row.dni,
        nombre: row.nombre_completo,
        hora: row.hora,
        fecha_vencimiento: row.fecha_vencimiento,
        vencido
      };
    });

    res.json(asistencias);
  } catch (err) {
    console.error("❌ Error al obtener asistencias actuales:", err);
    res.status(500).json({ error: "Error al obtener asistencias actuales" });
  }
});

module.exports = router;
