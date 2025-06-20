import React, { useState } from "react";
import "./clientemodal.css";

const RegistrarDuoModal = ({ cerrar }) => {
  const [formulario, setFormulario] = useState({
    dni1: "",
    nombre1: "",
    dni2: "",
    nombre2: "",
    fechaInicio: "",
    metodoPago: "",
    numeroBoleta: "",
  });

  const buscarNombrePorDNI = async (dni, persona) => {
    if (dni.length >= 8) {
      try {
        const res = await fetch(`http://localhost:3006/api/clientes/buscar/${dni}`);
        const data = await res.json();

        if (data && data.nombre_completo) {
          setFormulario((prev) => ({
            ...prev,
            [persona === 1 ? "nombre1" : "nombre2"]: data.nombre_completo,
          }));
        } else {
          setFormulario((prev) => ({
            ...prev,
            [persona === 1 ? "nombre1" : "nombre2"]: "",
          }));
        }
      } catch (error) {
        console.error("Error buscando nombre:", error);
        setFormulario((prev) => ({
          ...prev,
          [persona === 1 ? "nombre1" : "nombre2"]: "",
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    if (name === "dni1") buscarNombrePorDNI(value, 1);
    if (name === "dni2") buscarNombrePorDNI(value, 2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosCorrectos = {
        nombre1: formulario.nombre1,
        dni1: formulario.dni1,
        nombre2: formulario.nombre2,
        dni2: formulario.dni2,
        fechaInicio: formulario.fechaInicio,
        metodoPago: formulario.metodoPago,
        numeroBoleta: formulario.numeroBoleta,
      };
      

    try {
        const respuesta = await fetch("http://localhost:3006/api/membresias/duo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosCorrectos),
          });
          

      if (respuesta.ok) {
        alert("¡Membresía Duo registrada exitosamente!");
        cerrar();
      } else {
        const texto = await respuesta.text();
        alert("Error al registrar la membresía:\n" + texto);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error inesperado: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="cerrar" onClick={cerrar}>X</button>
        <h2>Registrar Membresía Duo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="dni1"
            placeholder="DNI - Persona 1"
            value={formulario.dni1}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nombre1"
            placeholder="Nombre completo - Persona 1"
            value={formulario.nombre1}
            onChange={handleChange}
            required
            disabled
          />
          <input
            type="text"
            name="dni2"
            placeholder="DNI - Persona 2"
            value={formulario.dni2}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nombre2"
            placeholder="Nombre completo - Persona 2"
            value={formulario.nombre2}
            onChange={handleChange}
            required
            disabled
          />
          <input
            type="date"
            name="fechaInicio"
            value={formulario.fechaInicio}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="metodoPago"
            placeholder="Método de Pago"
            value={formulario.metodoPago}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="numeroBoleta"
            placeholder="Número de Boleta"
            value={formulario.numeroBoleta}
            onChange={handleChange}
            required
          />

          <div className="botones">
            <button className="btn-registrar" type="submit">Registrar</button>
            <button
              className="btn-registrar"
              type="button"
              onClick={cerrar}
              style={{ backgroundColor: "yellow", color: "black" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarDuoModal;
