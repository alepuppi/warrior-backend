import React, { useState } from "react";
import './MembresiaModal.css';
import RegistrarMensualModal from "./RegistrarMensualModal";
import RegistrarDuoModal from "./RegistrarDuoModal";
import RegistrarTrimestralModal from "./RegistrarTrimestralModal";

const MembresiaModal = ({ setMostrarModal }) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [mostrarModalPrincipal, setMostrarModalPrincipal] = useState(true);
  const [mostrarRegistroMensual, setMostrarRegistroMensual] = useState(false);
  const [mostrarRegistroDuo, setMostrarRegistroDuo] = useState(false);
  const [mostrarRegistroTrimestral, setMostrarRegistroTrimestral] = useState(false);

  const opciones = [
    { nombre: "Mensual", precio: 100 },
    { nombre: "Duo", precio: 180 },
    { nombre: "Trimestral", precio: 260 },
  ];

  const handleSeleccion = (nombre) => {
    setOpcionSeleccionada(nombre);
    setMostrarModalPrincipal(false);

    setTimeout(() => {
      if (nombre === "Mensual") {
        setMostrarRegistroMensual(true);
      } else if (nombre === "Duo") {
        setMostrarRegistroDuo(true);
      } else if (nombre === "Trimestral") {
        setMostrarRegistroTrimestral(true);
      }
    }, 300);

    console.log("Membresía seleccionada:", nombre);
  };

  return (
    <>
      {mostrarModalPrincipal && (
        <div className="modal-overlay">
          <div className="modal-membresia">
          <button
  className="cerrar"
  onClick={() => {
    setMostrarRegistroMensual(false);
    setMostrarRegistroDuo(false);
    setMostrarRegistroTrimestral(false);
    setMostrarModalPrincipal(false);
    setMostrarModal(false);
  }}
>
  ✖
</button>

            <div className="contenedor-opciones">
              {opciones.map((opcion, index) => (
                <div
                  className={`opcion ${opcionSeleccionada === opcion.nombre ? "destacada" : ""}`}
                  key={index}
                >
                  <h3>{opcion.nombre}</h3>
                  <p className="precio">
                    <span className="moneda">$</span>
                    {opcion.precio}
                    <span className="mes"> / mes</span>
                  </p>
                  <button
                    className="btn-seleccionar"
                    onClick={() => handleSeleccion(opcion.nombre)}
                  >
                    Seleccionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mostrarRegistroMensual && (
        <RegistrarMensualModal
          cerrar={() => {
            setMostrarRegistroMensual(false);
            setMostrarModalPrincipal(true); // 🌿 Volver al selector principal
          }}
        />
      )}

      {mostrarRegistroDuo && (
        <RegistrarDuoModal
          cerrar={() => {
            setMostrarRegistroDuo(false);
            setMostrarModalPrincipal(true); // 🌿 Igual aquí
          }}
        />
      )}

      {mostrarRegistroTrimestral && (
        <RegistrarTrimestralModal
          cerrar={() => {
            setMostrarRegistroTrimestral(false);
            setMostrarModalPrincipal(true); // 🌿 Y aquí también
          }}
        />
      )}
    </>
  );
};

export default MembresiaModal;
