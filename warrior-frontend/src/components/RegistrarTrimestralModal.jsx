import React, { useState, useEffect } from "react";
import "./registrarMensualModal.css"; // Usa los mismos estilos

const RegistrarTrimestralModal = ({ cerrar }) => {
  const [formulario, setFormulario] = useState({
    dni: "",
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    metodoPago: "",
    numeroBoleta: "",
  });

  // Autocompletar nombre por DNI
  const buscarNombrePorDNI = async (dni) => {
    if (dni.length >= 8) {
      try {
        const res = await fetch(`http://localhost:3006/api/clientes/buscar/${dni}`);
        const data = await res.json();

        if (data && data.nombre_completo) {
          setFormulario((prev) => ({
            ...prev,
            nombre: data.nombre_completo,
          }));
        } else {
          setFormulario((prev) => ({
            ...prev,
            nombre: "",
          }));
        }
      } catch (error) {
        console.error("Error buscando nombre:", error);
        setFormulario((prev) => ({
          ...prev,
          nombre: "",
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));

    if (name === "dni") {
      buscarNombrePorDNI(value);
    }
  };

  // Calcular fecha fin automáticamente al cambiar fechaInicio
  useEffect(() => {
    if (formulario.fechaInicio) {
      const fecha = new Date(formulario.fechaInicio);
      fecha.setMonth(fecha.getMonth() + 3);
      const fechaFormateada = fecha.toISOString().split("T")[0];
      setFormulario((prev) => ({ ...prev, fechaFin: fechaFormateada }));
    }
  }, [formulario.fechaInicio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formulario);

    try {
      const respuesta = await fetch("http://localhost:3006/api/membresias/trimestral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      const text = await respuesta.text();
      const data = text ? JSON.parse(text) : {};

      if (respuesta.ok) {
        alert("¡Membresía trimestral registrada!");
        cerrar();
      } else {
        alert("Error al registrar la membresía:\n" + (data.detalles || data.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error inesperado: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <button className="modal-cerrar" onClick={cerrar}>✖</button>
        <h2>Registrar Membresía Trimestral</h2>
        <form onSubmit={handleSubmit} className="formulario-mensual">
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formulario.dni}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formulario.nombre}
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
            name="fechaFin"
            value={formulario.fechaFin}
            disabled
            readOnly
          />
          <input
            type="text"
            name="metodoPago"
            placeholder="Método de pago"
            value={formulario.metodoPago}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="numeroBoleta"
            placeholder="Número de boleta"
            value={formulario.numeroBoleta}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-enviar">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarTrimestralModal;
