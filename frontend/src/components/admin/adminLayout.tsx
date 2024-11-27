import React from "react";
import AdminHeader from "./adminHeader";
import AdminSidebar from "./adminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
