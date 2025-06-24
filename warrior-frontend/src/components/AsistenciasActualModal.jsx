import React, { useEffect, useState } from "react";
import "./clientemodal.css"; // Reutiliza estilos

const AsistenciasActualModal = ({ cerrar }) => {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    const obtenerAsistencias = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/asistencias/hoy`);
        const data = await response.json();
        setAsistencias(data);
      } catch (error) {
        console.error("Error al obtener asistencias del día:", error);
      }
    };

    obtenerAsistencias(); // Llamada inicial

    const interval = setInterval(obtenerAsistencias, 10000); // Auto-actualiza cada 10 segundos

    return () => clearInterval(interval); // Limpia el intervalo al cerrar
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Asistencias del Día</h2>
        <button className="cerrar-btn" onClick={cerrar}>Cerrar</button>

        {asistencias.length === 0 ? (
          <p>No hay asistencias registradas hoy.</p>
        ) : (
          <table className="tabla-clientes">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Hora</th>
                <th>Estado</th> {/* ✅ Nuevo */}
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia, index) => (
                <tr key={index}>
                  <td>{asistencia.nombre}</td>
                  <td>{asistencia.dni}</td>
                  <td>{asistencia.hora}</td>
                  <td style={{ color: asistencia.vencido ? "red" : "green", fontWeight: "bold" }}>
                    {asistencia.vencido ? "VENCIDO" : "ACTIVO"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AsistenciasActualModal;
