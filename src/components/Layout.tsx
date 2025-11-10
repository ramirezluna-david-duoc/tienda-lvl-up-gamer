import React from "react";
import AdminDashboard from "./AdminDashboard";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="d-flex">
      <AdminDashboard />
      <div className="content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
