import React, { useState } from "react";
import ClienteModal from "../components/ClienteModal";
import ClientesList from "../components/ClientesList";
import EditarClienteModal from "../components/EditarClienteModal";
import MembresiaModal from "../components/MembresiaModal";
import RegistrarMensualModal from "../components/RegistrarMensualModal";
import RegistrarDuoModal from "../components/RegistrarDuoModal";
import RegistrarTrimestralModal from "../components/RegistrarTrimestralModal";
import MembresiasList from "../components/MembresiasList";
import "./principal.css";
import logo from "../assets/logo.jpg";
import AsistenciasActualModal from "../components/AsistenciasActualModal";
import AsistenciasReporteModal from "../components/AsistenciasReporteModal";

const Principal = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarListado, setMostrarListado] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  const [mostrarModalMembresia, setMostrarModalMembresia] = useState(false);
  const [mostrarMensual, setMostrarMensual] = useState(false);
  const [mostrarDuo, setMostrarDuo] = useState(false);
  const [mostrarTrimestral, setMostrarTrimestral] = useState(false);
  const [mostrarListadoMembresias, setMostrarListadoMembresias] = useState(false);
  const [mostrarAsistenciasActual, setMostrarAsistenciasActual] = useState(false);
  const [mostrarAsistenciasReporte, setMostrarAsistenciasReporte] = useState(false);

  const cerrarModales = () => {
    setMostrarRegistro(false);
    setMostrarListado(false);
    setClienteEditar(null);
    setMostrarModalMembresia(false);
    setMostrarMensual(false);
    setMostrarDuo(false);
    setMostrarTrimestral(false);
    setMostrarListadoMembresias(false);
    setMostrarAsistenciasActual(false);
    setMostrarAsistenciasReporte(false);
  };

  const abrirModalRegistro = () => {
    cerrarModales();
    setMostrarRegistro(true);
  };

  const abrirModalListado = () => {
    cerrarModales();
    setMostrarListado(true);
  };

  const abrirModalMembresia = () => {
    cerrarModales();
    setMostrarModalMembresia(true);
  };

  const abrirListadoMembresias = () => {
    cerrarModales();
    setMostrarListadoMembresias(true);
  };

  const editarCliente = (cliente) => {
    cerrarModales();
    setTimeout(() => setClienteEditar(cliente), 0);
  };

  const abrirAsistenciasActual = () => {
    cerrarModales();
    setMostrarAsistenciasActual(true);
  };

  const abrirAsistenciasReporte = () => {
    cerrarModales();
    setMostrarAsistenciasReporte(true);
  };

  return (
    <div className="principal-container">
      {/* NAVBAR */}
      <div className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            Clientes
            <ul className="submenu">
              <li onClick={abrirModalRegistro}>Registrar</li>
              <li onClick={abrirModalListado}>Ver listado</li>
            </ul>
          </li>
          <li className="nav-item">
            Membresías
            <ul className="submenu">
              <li onClick={abrirModalMembresia}>Registrar</li>
              <li onClick={abrirListadoMembresias}>Listado</li>
            </ul>
          </li>
          <li className="nav-item">
            Asistencias
            <ul className="submenu">
              <li onClick={abrirAsistenciasActual}>Actual</li>
              <li onClick={abrirAsistenciasReporte}>Reporte</li>
            </ul>
          </li>
          <li className="nav-item">
            Renovación
            <ul className="submenu">
              <li>Buscar</li>
              <li>Reporte</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* LOGO CENTRAL */}
      <div className="logo-container">
        <img src={logo} alt="The Warrior House" />
      </div>

      {/* MODALES */}
      {mostrarRegistro && (
        <ClienteModal cerrar={cerrarModales} setMostrarModal={setMostrarRegistro} />
      )}

      {mostrarListado && (
        <ClientesList cerrar={cerrarModales} onEditarCliente={editarCliente} />
      )}

      {clienteEditar && (
        <EditarClienteModal cliente={clienteEditar} cerrar={cerrarModales} />
      )}

      {mostrarModalMembresia && (
        <MembresiaModal
          setMostrarModal={setMostrarModalMembresia}
          seleccionarMensual={() => {
            setMostrarModalMembresia(false);
            setMostrarMensual(true);
          }}
          seleccionarDuo={() => {
            setMostrarModalMembresia(false);
            setMostrarDuo(true);
          }}
          seleccionarTrimestral={() => {
            setMostrarModalMembresia(false);
            setMostrarTrimestral(true);
          }}
        />
      )}

      {mostrarMensual && (
        <RegistrarMensualModal cerrar={cerrarModales} />
      )}

      {mostrarDuo && (
        <RegistrarDuoModal cerrar={cerrarModales} />
      )}

      {mostrarTrimestral && (
        <RegistrarTrimestralModal cerrar={cerrarModales} />
      )}

      {mostrarListadoMembresias && (
        <MembresiasList cerrar={cerrarModales} />
      )}

      {mostrarAsistenciasActual && (
        <AsistenciasActualModal cerrar={cerrarModales} />
      )}

      {mostrarAsistenciasReporte && (
        <AsistenciasReporteModal cerrar={cerrarModales} />
      )}
    </div>
  );
};

export default Principal;
