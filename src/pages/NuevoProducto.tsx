import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { v4 as uuidv4 } from "uuid";

interface ProductoForm {
  product: string;
  nombre_producto: string;
  descripcion: string;
  precio: number | "";
  stock: number | "";
  critical_stock: number | "";
  categoria: string;
  imagen_producto: File | null;
}

const NuevoProducto: React.FC = () => {
  const [form, setForm] = useState<ProductoForm>({
    product: "",
    nombre_producto: "",
    descripcion: "",
    precio: "",
    stock: "",
    critical_stock: "",
    categoria: "",
    imagen_producto: null,
  });
  const [errores, setErrores] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;

    if (type === "file") {
      const files = (target as HTMLInputElement).files;
      setForm((prev) => ({
        ...prev,
        [name]: files && files[0] ? files[0] : null,
      }));
      return;
    }

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
    if (!form.product) nuevosErrores.push("El código es obligatorio");
    if (!form.nombre_producto) nuevosErrores.push("El nombre es obligatorio");
    if (
      form.precio === "" ||
      (typeof form.precio === "number" && form.precio < 0)
    )
      nuevosErrores.push("Precio inválido");
    if (form.stock === "" || (typeof form.stock === "number" && form.stock < 0))
      nuevosErrores.push("Stock inválido");
    if (!form.categoria) nuevosErrores.push("Seleccione una categoría");
    setErrores(nuevosErrores);
    if (nuevosErrores.length === 0) {
      // Guardado simulado: puedes adaptarlo a localStorage o API
      const productosGuardados = localStorage.getItem("productos");
      const lista = productosGuardados ? JSON.parse(productosGuardados) : [];
      lista.push({
        id: uuidv4(),
        product: form.product,
        product_name: form.nombre_producto,
        descripcion: form.descripcion,
        precio: form.precio === "" ? 0 : form.precio,
        stock: form.stock === "" ? 0 : form.stock,
        critical_stock: form.critical_stock === "" ? 0 : form.critical_stock,
        categoria: form.categoria,
      });
      localStorage.setItem("productos", JSON.stringify(lista));
      navigate("/productos");
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
          <label htmlFor="product">Código del producto*</label>
          <input
            type="text"
            id="product"
            name="product"
            className="form-control mb-2"
            placeholder="Ingrese el código del producto"
            value={form.product}
            onChange={handleChange}
            required
          />

          <label htmlFor="nombre_producto">Nombre del producto*</label>
          <input
            type="text"
            id="nombre_producto"
            name="nombre_producto"
            className="form-control mb-2"
            placeholder="Ingrese el nombre del producto"
            value={form.nombre_producto}
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

          <label htmlFor="stock">Stock*</label>
          <input
            type="number"
            id="stock"
            name="stock"
            className="form-control mb-2"
            placeholder="Ingrese la cantidad del producto"
            min={0}
            step={1}
            value={form.stock}
            onChange={handleChange}
            required
          />

          <label htmlFor="critical_stock">Stock Crítico</label>
          <input
            type="number"
            id="critical_stock"
            name="critical_stock"
            className="form-control mb-2"
            placeholder="Stock crítico"
            min={0}
            step={1}
            value={form.critical_stock}
            onChange={handleChange}
          />

          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            className="form-control mb-2"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una categoría --</option>
            <option value="accesorios">Accesorios</option>
            <option value="consolas">Consolas</option>
            <option value="computadores">Computadores</option>
            <option value="sillas">Sillas Gamers</option>
            <option value="mouse">Mouse</option>
            <option value="mousepad">Mousepads</option>
            <option value="poleras">Poleras y polerones</option>
          </select>

          <label htmlFor="imagen_producto">Imagen del producto</label>
          <input
            type="file"
            id="imagen_producto"
            name="imagen_producto"
            className="form-control mb-2"
            accept="image/*"
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
