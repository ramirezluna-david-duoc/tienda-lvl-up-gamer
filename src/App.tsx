import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminProductos from "./pages/AdminProductos";
import { Productos } from "./pages/Producto";
import AdminHome from "./pages/AdminHome";

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
          <Route path="producto" element={<Productos />} />
          {/* Añadir más rutas hijas aquí */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
