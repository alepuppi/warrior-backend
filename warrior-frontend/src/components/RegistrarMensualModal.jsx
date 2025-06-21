import React, { useState } from 'react';
import './clientemodal.css';

const RegistrarMensualModal = ({ cerrar }) => {
  const [formulario, setFormulario] = useState({
    dni: '',
    nombre: '',
    fechaInicio: '',
    metodoPago: '',
    numeroBoleta: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Si se está escribiendo el DNI, intentar buscar el nombre
    if (name === 'dni' && value.length >= 8) {
      fetch(`${import.meta.env.VITE_API_URL}/api/clientes/buscar/${value}`)
      .then((res) => res.json())
        .then((data) => {
          if (data && data.nombre_completo) {
            setFormulario((prev) => ({ ...prev, nombre: data.nombre_completo }));
          } else {
            setFormulario((prev) => ({ ...prev, nombre: '' }));
          }
        })
        .catch((err) => {
          console.error('Error al buscar cliente por DNI:', err);
          setFormulario((prev) => ({ ...prev, nombre: '' }));
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosParaEnviar = {
      nombre_completo: formulario.nombre,
      dni: formulario.dni,
      fecha_inicio: formulario.fechaInicio,
      metodo_pago: formulario.metodoPago,
      numero_boleta: formulario.numeroBoleta,
    };

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/membresias/mensual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar),
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert('¡Membresía registrada con éxito!');
        cerrar();
      } else {
        console.error('Error del servidor:', resultado);
        alert('Error al registrar la membresía: ' + resultado.error);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Ocurrió un error al registrar la membresía.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Registrar Membresía Mensual</h2>
        <form onSubmit={handleSubmit}>
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
            disabled // Evita que el usuario edite este campo
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
          <button type="submit">Registrar</button>
        </form>
        <button className="cerrar-btn" onClick={cerrar}>Cerrar</button>
      </div>
    </div>
  );
};

export default RegistrarMensualModal;
