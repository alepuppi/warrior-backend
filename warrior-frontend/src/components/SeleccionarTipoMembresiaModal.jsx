import React from 'react';
import './clienteModal.css'; // Reutilizando tus estilos

const SeleccionarTipoMembresiaModal = ({ onClose, onSeleccionar }) => {
  const tipos = [
    { nombre: 'Mensual', precio: 100 },
    { nombre: 'Duo', precio: 180 },
    { nombre: 'Trimestral', precio: 260 },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', backgroundColor: '#000' }}>
        <button className="cerrar" onClick={onClose}>✖</button>
        <div className="membresia-tipo-container">
          {tipos.map((tipo) => (
            <div key={tipo.nombre} className="membresia-tarjeta">
              <h3>{tipo.nombre}</h3>
              <p><strong>${tipo.precio}</strong> / mes</p>
              <button className="btn-seleccionar" onClick={() => onSeleccionar(tipo.nombre)}>
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeleccionarTipoMembresiaModal;
