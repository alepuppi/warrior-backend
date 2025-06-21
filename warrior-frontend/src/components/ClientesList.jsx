import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./ClientesList.css";

const ClientesList = ({ cerrar, onEditarCliente }) => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(0);
  const clientesPorPagina = 5;

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/listado`);
        if (!response.ok) throw new Error("Error al obtener clientes");
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("❌ Error al cargar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const handleClose = () => {
    cerrar();
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre_completo} ${cliente.dni} ${cliente.correo} ${cliente.celular}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const inicio = paginaActual * clientesPorPagina;
  const clientesAMostrar = clientesFiltrados.slice(inicio, inicio + clientesPorPagina);

  const cambiarPagina = ({ selected }) => {
    setPaginaActual(selected);
  };

  return (
    <div className="clientes-modal">
      <div className="clientes-modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Listado de Clientes</h2>

        <input
          className="search-bar"
          type="text"
          placeholder="🔍 Buscar por nombre, DNI, celular o email"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(0);
          }}
        />

        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Celular</th>
              <th>Email</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {clientesAMostrar.length > 0 ? (
              clientesAMostrar.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.nombre_completo}</td>
                  <td>{cliente.celular}</td>
                  <td>{cliente.correo}</td>
                  <td>
                    <button className="edit-btn" onClick={() => onEditarCliente(cliente)}>
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"← Anterior"}
          nextLabel={"Siguiente →"}
          pageCount={Math.ceil(clientesFiltrados.length / clientesPorPagina)}
          onPageChange={cambiarPagina}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      </div>
    </div>
  );
};

export default ClientesList;
