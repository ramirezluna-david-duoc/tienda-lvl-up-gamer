import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminProductos from "./pages/AdminProductos";
import { Productos } from "./pages/Producto";
import AdminHome from "./pages/AdminHome";
import NuevoProducto from "./pages/NuevoProducto";
import AdminUsuarios from "./pages/AdminUsuarios";
import NuevoUsuario from "./pages/NuevoUsuario";

/*
function App() {
  return (
    <>
      <BrowserRouter>
        <AdminDashboard />
        <Routes>
          <Route path="/Producto" element={<Productos />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
  */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route element={<Layout />}>
          <Route path="admin" element={<AdminHome />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="nuevo-producto" element={<NuevoProducto />} />
          <Route path="producto" element={<Productos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="nuevo-usuario" element={<NuevoUsuario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
