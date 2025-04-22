const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const { Parser } = require("json2csv");

// Ajusta estos datos con los de tu base
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "warrior_db"
});

router.get("/asistencias/reporte/:mes", (req, res) => {
  const mes = req.params.mes;
  const anio = new Date().getFullYear();

  const query = `
    SELECT a.id, a.dni, c.nombre_completo, a.fecha
    FROM asistencias a
    JOIN clientes c ON a.dni = c.dni
    WHERE MONTH(a.fecha) = ? AND YEAR(a.fecha) = ?
    ORDER BY a.fecha ASC
  `;

  connection.query(query, [mes, anio], (err, results) => {
    if (err) return res.status(500).send("Error al generar el reporte");

    const fields = ["id", "dni", "nombre_completo", "fecha"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(results);

    res.header("Content-Type", "text/csv");
    res.attachment(`reporte_asistencias_mes_${mes}.csv`);
    return res.send(csv);
  });
});

module.exports = router;
