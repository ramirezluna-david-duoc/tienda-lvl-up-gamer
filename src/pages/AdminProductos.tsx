import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

interface Producto {
  product: string;
  product_name: string;
  descripcion: string;
  precio: number;
  stock: number;
  critical_stock: number;
  categoria: string;
}
const AdminProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [codigoEditar, setCodigoEditar] = useState("");
  const [codigoEliminar, setCodigoEliminar] = useState("");

  useEffect(() => {
    const storedProductos = localStorage.getItem("productos");
    if (storedProductos) {
      setProductos(JSON.parse(storedProductos));
    }
  }, []);

  const toggleEditar = () => setMostrarEditar(!mostrarEditar);
  const toggleEliminar = () => setMostrarEliminar(!mostrarEliminar);

  const handleEditar = () => {
    if (!codigoEditar) return alert("Ingrese un código válido");
    alert(`Editar producto con código: ${codigoEditar}`);
    setCodigoEditar("");
    setMostrarEditar(false);
  };
  const handleEliminar = () => {
    if (!codigoEliminar) return alert("Ingrese un código válido");
    alert(`Eliminar producto con código: ${codigoEliminar}`);
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
            <th>Stock</th>
            <th>Stock Crítico</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((p, index) => (
              <tr key={index}>
                <td>{p.product}</td>
                <td>{p.product_name}</td>
                <td>{p.descripcion}</td>
                <td>{p.precio}</td>
                <td>{p.stock}</td>
                <td>{p.critical_stock}</td>
                <td>{p.categoria}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                No hay productos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default AdminProductos;
