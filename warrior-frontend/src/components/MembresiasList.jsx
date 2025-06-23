import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MembresiaModal.css";

const MembresiasList = ({ cerrar }) => {
  const [membresias, setMembresias] = useState([]);

  useEffect(() => {
    obtenerMembresias();
  }, []);

  const obtenerMembresias = async () => {
    try {
      console.log("Llamando a:", "https://thewarriorhouse.onrender.com/api/membresias/listado");
      const response = await axios.get("https://thewarriorhouse.onrender.com/api/membresias/listado");
      setMembresias(response.data);
    } catch (error) {
      console.error("Error al obtener membresías:", error);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await axios.get(
        "https://thewarriorhouse.onrender.com/api/membresias/descargar-pdf",
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "membresias.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
    }
  };

  const descargarExcel = async () => {
    try {
      const response = await axios.get(
        "https://thewarriorhouse.onrender.com/api/membresias/descargar-excel",
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "membresias.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar Excel:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Listado de Membresías</h2>
        <button className="cerrar-btn" onClick={cerrar}>X</button>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button onClick={descargarPDF}>Descargar PDF</button>
          <button onClick={descargarExcel}>Descargar Excel</button>
        </div>

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>DNI</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Tipo</th>
                <th>Boleta</th>
                <th>Método pago</th>
              </tr>
            </thead>
            <tbody>
              {membresias.flatMap((m) => {
                const fila1 = (
                  <tr key={`${m.id}-1`}>
                    <td>{m.nombre_completo_1}</td>
                    <td>{m.dni_1}</td>
                    <td>{m.fecha_inicio?.split("T")[0]}</td>
                    <td>{m.fecha_fin?.split("T")[0]}</td>
                    <td>{m.tipo_membresia}</td>
                    <td>{m.numero_boleta}</td>
                    <td>{m.metodo_pago}</td>
                  </tr>
                );

                const fila2 = m.nombre_completo_2 ? (
                  <tr key={`${m.id}-2`}>
                    <td>{m.nombre_completo_2}</td>
                    <td>{m.dni_2}</td>
                    <td>{m.fecha_inicio?.split("T")[0]}</td>
                    <td>{m.fecha_fin?.split("T")[0]}</td>
                    <td>{m.tipo_membresia}</td>
                    <td>{m.numero_boleta}</td>
                    <td>{m.metodo_pago}</td>
                  </tr>
                ) : null;

                return fila2 ? [fila1, fila2] : [fila1];
              })}
              {membresias.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No hay membresías registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembresiasList;
