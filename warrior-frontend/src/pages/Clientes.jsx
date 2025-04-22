import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ClientesList from "../components/ClientesList";
import ClienteModal from "../components/ClienteModal";

const Clientes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const location = useLocation();

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // 🔹 Detectar si venimos desde el submenú con "listado"
  useEffect(() => {
    if (location.state?.modal === "listado") {
      openModal("listado");
    }
  }, [location.state]);

  return (
    <div>
      <h2>Clientes</h2>
      <button onClick={() => openModal("registrar")}>Registrar Cliente</button>

      {modalOpen && (
        <>
          {modalType === "registrar" ? (
            <ClienteModal onClose={closeModal} />
          ) : (
            <ClientesList cerrar={closeModal} onEditarCliente={() => {}} />
          )}
        </>
      )}
    </div>
  );
};

export default Clientes;
