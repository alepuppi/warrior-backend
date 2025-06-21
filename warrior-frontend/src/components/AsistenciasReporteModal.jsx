// components/AsistenciasReporteModal.jsx
import React, { useState } from "react";
import './reporteAsistenciasModal.css';

const AsistenciasReporteModal = ({ cerrar }) => {
  const [mes, setMes] = useState("");

  const descargarReporte = async () => {
    if (!mes) return alert("Selecciona un mes primero");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/asistencias/reporte/${mes}`);
      if (!response.ok) throw new Error("Error al descargar el reporte");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_asistencias_mes_${mes}.csv`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("No se pudo generar el reporte");
      console.error(error);
    }
  };

  return (
    <div className="reporte-modal-overlay">
      <div className="reporte-modal">
        <h2>Reporte de Asistencias</h2>

        <select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">-- Seleccionar mes --</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <div className="reporte-buttons">
          <button onClick={descargarReporte}>Descargar</button>
          <button className="cancel" onClick={cerrar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AsistenciasReporteModal;
