import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { api, isApiError } from "../services/api";

interface ProductoForm {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number | "";
  categoria_id?: number;
  categoria?: string; // titulo
  imagen?: string;
}

const NuevoProducto: React.FC = () => {
  const [form, setForm] = useState<ProductoForm>({
    id_producto: "",
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: undefined,
    categoria: "",
    imagen: "",
  });
  const [errores, setErrores] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; titulo: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategorias()
      .then((cats) => setCategorias(cats.map(c => ({ id: c.id, titulo: c.titulo }))))
      .catch((err) => console.error('Error cargando categorías', err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;

    if (type === "number") {
      const value = target.value === "" ? "" : Number(target.value);
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nuevosErrores: string[] = [];
    if (!form.id_producto) nuevosErrores.push("El código es obligatorio");
    if (!form.nombre) nuevosErrores.push("El nombre es obligatorio");
    if (
      form.precio === "" ||
      (typeof form.precio === "number" && form.precio < 0)
    )
      nuevosErrores.push("Precio inválido");
    if (!form.categoria_id && !form.categoria) nuevosErrores.push("Seleccione una categoría");
    setErrores(nuevosErrores);
    if (nuevosErrores.length === 0) {
      const payload = {
        id_producto: form.id_producto,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio === "" ? 0 : form.precio,
        categoria_id: form.categoria_id,
        categoria: form.categoria,
        imagen: form.imagen || undefined
      };
      api.createProducto(payload)
        .then(() => navigate("/productos"))
        .catch((err) => {
          if (isApiError(err)) {
            setErrores([`Error ${err.status}: ${err.message}`]);
          } else {
            setErrores(["Error creando el producto"]);
          }
        });
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar incluido por Layout; si se usa aislado, puedes añadirla aquí */}
      <div className="content flex-grow-1 p-4">
        <div className="topbar d-flex justify-content-between align-items-center mb-3">
          <h1>Agregar nuevo producto en la tienda</h1>
          <i className="bi bi-bell-fill"></i>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="id_producto">Código del producto*</label>
          <input
            type="text"
            id="id_producto"
            name="id_producto"
            className="form-control mb-2"
            placeholder="Ingrese el código del producto"
            value={form.id_producto}
            onChange={handleChange}
            required
          />

          <label htmlFor="nombre">Nombre del producto*</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control mb-2"
            placeholder="Ingrese el nombre del producto"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="descripcion">Descripción (opcional)</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            className="form-control mb-2"
            placeholder="Ingrese la descripción del producto"
            value={form.descripcion}
            onChange={handleChange}
          />

          <label htmlFor="precio">Precio*</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control mb-2"
            placeholder="Ingrese el precio del producto"
            min={0}
            step={1}
            value={form.precio}
            onChange={handleChange}
            required
          />

          {/* Campos de stock eliminados en esta versión: manejar stock en otra tabla o en tareas futuras */}

          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria_id"
            className="form-control mb-2"
            value={form.categoria_id ?? ""}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una categoría --</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.titulo}</option>
            ))}
          </select>

          <label htmlFor="imagen">URL de imagen (opcional)</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            className="form-control mb-2"
            placeholder="ruta/archivo.png"
            value={form.imagen}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-primary me-2">
            Agregar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/productos")}
          >
            Cancelar
          </button>
        </form>

        {errores.map((err, idx) => (
          <p key={idx} style={{ color: "red" }}>
            {err}
          </p>
        ))}
      </div>
    </div>
  );
};

export default NuevoProducto;
