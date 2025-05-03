import React, { useState } from "react";
import axios from "axios";
import "./clientemodal.css";

const ClienteModal = ({ setMostrarModal }) => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    dni: "",
    celular: "",
    correo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombre_completo: formulario.nombre,
      dni: formulario.dni,
      celular: formulario.celular,
      correo: formulario.correo,
    };

    try {
      const response = await axios.post("http://localhost:3006/api/clientes/registrar", datos);
      console.log("✅ Cliente registrado:", response.data);
      setMostrarModal(false); // cerrar modal
    } catch (error) {
      console.error("❌ Error al registrar cliente:", error);
      alert("Error al registrar cliente. Verifica la consola.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="cerrar" onClick={() => setMostrarModal(false)}>✖</button>
        <h2>Registrar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} required />
          <label>DNI</label>
          <input type="text" name="dni" value={formulario.dni} onChange={handleChange} required />
          <label>Celular</label>
          <input type="text" name="celular" value={formulario.celular} onChange={handleChange} required />
          <label>Correo</label>
          <input type="email" name="correo" value={formulario.correo} onChange={handleChange} required />
          <button type="submit" className="btn-registrar">Registrar Cliente</button>
        </form>
      </div>
    </div>
  );
};

export default ClienteModal;
