import React from "react";

const AdminHome: React.FC = () => {
  return (
    <div>
      <div className="topbar d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-3">Bienvenido Administrador!</h1>
        <i className="bi bi-bell-fill fs-4"></i>
      </div>
      <hr />
      <p>Panel de administrador</p>
    </div>
  );
};

export default AdminHome;
