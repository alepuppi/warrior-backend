import React, { useState, useEffect } from "react";
import "./clientemodal.css";

const EditarClienteModal = ({ cliente, cerrar }) => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre_completo || "");
      setDni(cliente.dni || "");
      setEmail(cliente.correo || "");
      setCelular(cliente.celular || "");
    }
  }, [cliente]);

  const handleGuardar = async () => {
    const clienteActualizado = {
      nombre,
      dni,
      correo: email,
      celular,
    };

    try {
      console.log("Enviando datos:", clienteActualizado);

      const response = await fetch(
        `http://localhost:3006/api/clientes/editar/${cliente.id}`, // ✅ Ruta corregida
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteActualizado),
        }
      );

      const resultado = await response.json();
      console.log("Respuesta del servidor:", resultado);

      if (response.ok) {
        alert("Cliente actualizado correctamente");
        cerrar(true);
      } else {
        alert("Error al actualizar el cliente");
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      alert("Error de conexión al actualizar el cliente");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
        />
        <button onClick={handleGuardar}>Guardar Cambios</button>
      </div>
    </div>
  );
};

export default EditarClienteModal;
