import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

interface Usuario {
  id?: string;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  user: string;
  region: string;
  comuna: string;
  direccion: string;
}

const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [rutEditar, setRutEditar] = useState("");
  const [rutEliminar, setRutEliminar] = useState("");

  // UI state for modal and toast
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const storedUsuarios = localStorage.getItem("usuarios");
    if (storedUsuarios) {
      const parsed: Usuario[] = JSON.parse(storedUsuarios);
      // Normalizar: asegurar id único para cada usuario
      const normalized = parsed.map((u) => ({
        ...u,
        id: u.id ? u.id : uuidv4(),
      }));
      const hadMissing = parsed.some((u) => !u.id);
      if (hadMissing) {
        localStorage.setItem("usuarios", JSON.stringify(normalized));
      }
      setUsuarios(normalized);
    }
  }, []);

  const toggleEditar = () => setMostrarEditar(!mostrarEditar);
  const toggleEliminar = () => setMostrarEliminar(!mostrarEliminar);

  // Eliminar usuario
  const performDeleteById = (id: string) => {
    const storedUsuarios = localStorage.getItem("usuarios");
    const lista: Usuario[] = storedUsuarios ? JSON.parse(storedUsuarios) : [];
    const nuevaLista = lista.filter((u) => u.id !== id);
    localStorage.setItem("usuarios", JSON.stringify(nuevaLista));
    setUsuarios(nuevaLista);
    setToastMessage("Usuario eliminado correctamente");
    setShowToast(true);
  };

  const requestDeleteById = (id: string) => {
    setIdToDelete(id);
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

  const deleteByRut = (rut: string) => {
    const storedUsuarios = localStorage.getItem("usuarios");
    const lista: Usuario[] = storedUsuarios ? JSON.parse(storedUsuarios) : [];
    const encontrado = lista.find((u) => u.rut === rut);
    if (!encontrado) {
      setToastMessage("No se encontró un usuario con ese RUT");
      setShowToast(true);
      return;
    }
    if (!encontrado.id) encontrado.id = uuidv4();
    requestDeleteById(encontrado.id);
  };

  const handleEliminar = () => {
    if (!rutEliminar) {
      setToastMessage("Ingrese un RUT válido");
      setShowToast(true);
      return;
    }
    deleteByRut(rutEliminar);
    setRutEliminar("");
    setMostrarEliminar(false);
  };

  const handleEditar = () => {
    if (!rutEditar) {
      setToastMessage("Ingrese un RUT válido");
      setShowToast(true);
      return;
    }
    // Por ahora solo mostramos mensaje, implementaremos edición después
    setToastMessage(`Editar usuario con RUT: ${rutEditar}`);
    setShowToast(true);
    setRutEditar("");
    setMostrarEditar(false);
  };

  return (
    <div>
      <div className="topbar d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-3">Usuarios</h1>
        <div className="d-flex gap-2">
          <Link
            to="/nuevo-usuario"
            className="btn btn-primary text-white text-decoration-none"
          >
            Agregar nuevo usuario
          </Link>
          <button onClick={toggleEditar} className="btn btn-warning">
            Editar usuario
          </button>
          <button onClick={toggleEliminar} className="btn btn-danger">
            Eliminar usuario
          </button>
        </div>
        <i className="bi bi-bell-fill fs-4"></i>
      </div>

      {mostrarEditar && (
        <div className="bg-light p-3 rounded mb-3">
          <h2 className="fs-5">Ingrese el RUT del usuario a editar</h2>
          <input
            type="text"
            value={rutEditar}
            onChange={(e) => setRutEditar(e.target.value)}
            placeholder="Ingrese el RUT del usuario"
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
          <h2 className="fs-5">Ingrese el RUT del usuario a eliminar</h2>
          <input
            type="text"
            value={rutEliminar}
            onChange={(e) => setRutEliminar(e.target.value)}
            placeholder="Ingrese el RUT del usuario"
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
      <p>Lista de usuarios</p>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Fecha de nacimiento</th>
            <th>Usuario</th>
            <th>Región</th>
            <th>Comuna</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id ?? u.rut}>
                <td>{u.rut}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.email}</td>
                <td>{u.fecha_nacimiento}</td>
                <td>{u.user}</td>
                <td>{u.region}</td>
                <td>{u.comuna}</td>
                <td>{u.direccion}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      u.id ? requestDeleteById(u.id) : deleteByRut(u.rut)
                    }
                    title="Eliminar usuario"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center text-muted">
                No hay usuarios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro que deseas eliminar este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast notifications */}
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

export default AdminUsuarios;
