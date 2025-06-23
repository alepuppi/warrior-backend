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
      const response = await axios.get("https://thewarriorhouse.onrender.com/api/membresias/listado");
      setMembresias(response.data);
    } catch (error) {
      console.error("Error al obtener membresías:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Listado de Membresías</h2>
        <button className="cerrar-btn" onClick={cerrar}>X</button>
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
              {membresias.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre_completo_1}</td>
                  <td>{m.dni_1}</td>
                  <td>{m.fecha_inicio?.split("T")[0]}</td>
                  <td>{m.fecha_fin?.split("T")[0]}</td>
                  <td>{m.tipo_membresia}</td>
                  <td>{m.numero_boleta}</td>
                  <td>{m.metodo_pago}</td>
                </tr>
              ))}
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
