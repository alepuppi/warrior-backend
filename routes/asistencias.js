const express = require("express");
const router = express.Router();
const { Parser } = require("json2csv");
const pool = require("../db"); // ✅ Usa el pool configurado con variables de entorno

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

module.exports = router;
