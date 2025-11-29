import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  return (
    <div
      className="sidebar bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h2 className="fs-5 mb-4">Level-Up Gamer (Administrador)</h2>

      <ul className="menu list-unstyled">
        <li>
          <Link
            to="/productos"
            className="text-white text-decoration-none d-block py-2"
          >
            <i className="bi bi-bag"></i> Productos
          </Link>
        </li>
        <li>
          <Link
            to="/categorias"
            className="text-white text-decoration-none d-block py-2"
          >
            <i className="bi bi-tags"></i> Categorías
          </Link>
        </li>
        <li>
          <Link
            to="/usuarios"
            className="text-white text-decoration-none d-block py-2"
          >
            <i className="bi bi-people me-2"></i> Usuarios
          </Link>
        </li>
        <li className="mt-2">
          <Link
            to="/nuevo-producto"
            className="text-white text-decoration-none d-block py-2"
          >
            <i className="bi bi-plus-circle"></i> Nuevo Producto
          </Link>
        </li>
      </ul>
      <hr className="text-secondary" />

      <ul className="menu list-unstyled">
        <li>
          <Link
            to="/admin"
            className="text-white text-decoration-none d-block py-2"
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/configuracion"
            className="text-white text-decoration-none d-block py-2"
          >
            Configuración
          </Link>
        </li>
        <li>
          <Link
            to="/ayuda"
            className="text-white text-decoration-none d-block py-2"
          >
            Ayuda
          </Link>
        </li>
        <li>
          <Link
            to="/perfil"
            className="text-white text-decoration-none d-block py-2"
          >
            Perfil
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className="text-white text-decoration-none d-block py-2"
          >
            Cerrar Sesión
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default AdminDashboard;
