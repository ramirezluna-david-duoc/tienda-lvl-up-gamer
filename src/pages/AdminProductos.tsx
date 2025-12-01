import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import { api, isApiError } from "../services/api";
import { v4 as uuidv4 } from "uuid";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";

interface Producto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: string; // titulo de categoría
}
const AdminProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [codigoEditar, setCodigoEditar] = useState("");
  const [codigoEliminar, setCodigoEliminar] = useState("");

  useEffect(() => {
    api
      .getProductos()
      .then(setProductos)
      .catch((err) => {
        console.error("Error cargando productos", err);
      });
  }, []);

  const toggleEditar = () => setMostrarEditar(!mostrarEditar);
  const toggleEliminar = () => setMostrarEliminar(!mostrarEliminar);

  const handleEditar = async () => {
    if (!codigoEditar) {
      alert("Ingrese un código válido");
      return;
    }
    // Reutilizar el botón "Editar producto" para ir al formulario dedicado
    window.location.href = `/editar-producto/${encodeURIComponent(codigoEditar)}`;
    setCodigoEditar("");
    setMostrarEditar(false);
  };
  // UI state for confirm modal and toast
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // internal deletion (no UI confirmation) -- calls API and refreshes state
  const performDeleteById = async (idProducto: string) => {
    try {
      await api.deleteProducto(idProducto);
      setProductos((prev) => prev.filter((p) => p.id_producto !== idProducto));
      setToastMessage("Producto eliminado");
      setShowToast(true);
    } catch (err) {
      if (isApiError(err)) {
        setToastMessage(`Error ${err.status}: ${err.message}`);
      } else {
        setToastMessage("Error eliminando producto");
      }
      setShowToast(true);
    }
  };

  // request deletion: open modal and store id
  const requestDeleteById = (idProducto: string) => {
    setIdToDelete(idProducto);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (!idToDelete) return;
    performDeleteById(idToDelete);
    setIdToDelete(null);
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setIdToDelete(null);
    setShowConfirmModal(false);
  };

  const deleteByCode = (code: string) => {
    const encontrado = productos.find((p) => p.id_producto === code);
    if (!encontrado) {
      setToastMessage("No se encontró un producto con ese código");
      setShowToast(true);
      return;
    }
    requestDeleteById(encontrado.id_producto);
  };

  const handleEliminar = () => {
    if (!codigoEliminar) {
      setToastMessage("Ingrese un código válido");
      setShowToast(true);
      return;
    }
    deleteByCode(codigoEliminar);
    setCodigoEliminar("");
    setMostrarEliminar(false);
  };

  return (
    <div>
      <div className="topbar d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-3">Productos</h1>
        <div className="d-flex gap-2">
          <Link
            to="/nuevo-producto"
            className="btn btn-primary text-white text-decoration-none"
          >
            Agregar nuevo producto
          </Link>
          <button onClick={toggleEditar} className="btn btn-warning">
            Editar producto
          </button>
          <button onClick={toggleEliminar} className="btn btn-danger">
            Eliminar producto
          </button>
        </div>
        <i className="bi bi-bell-fill fs-4"></i>
      </div>

      {mostrarEditar && (
        <div className="bg-light p-3 rounded mb-3">
          <h2 className="fs-5">Ingrese el código del producto a editar</h2>
          <input
            type="text"
            value={codigoEditar}
            onChange={(e) => setCodigoEditar(e.target.value)}
            placeholder="Código del producto"
            className="form-control my-2"
          />
          <button onClick={handleEditar} className="btn btn-success me-2">
            Aceptar
          </button>
          <button onClick={toggleEditar} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      )}

      {mostrarEliminar && (
        <div className="bg-light p-3 rounded mb-3">
          <h2 className="fs-5">Ingrese el código del producto a eliminar</h2>
          <input
            type="text"
            value={codigoEliminar}
            onChange={(e) => setCodigoEliminar(e.target.value)}
            placeholder="Código del producto"
            className="form-control my-2"
          />
          <button onClick={handleEliminar} className="btn btn-danger me-2">
            Aceptar
          </button>
          <button onClick={toggleEliminar} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      )}

      <hr />
      <p>Lista de productos</p>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((p, index) => (
              <tr key={p.id_producto ?? index}>
                <td>{p.id_producto}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>{p.precio}</td>
                <td>{p.categoria}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => requestDeleteById(p.id_producto)}
                    title="Eliminar producto"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                No hay productos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Confirm modal */}
      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar este producto?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Tienda</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};
export default AdminProductos;
