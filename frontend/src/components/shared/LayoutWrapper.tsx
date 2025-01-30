import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let userRole = localStorage.getItem('role') || 'guest'
  return (
    <>
      <Header userRole={userRole}/>
      {children}
      <Footer />
    </>
  );
};

export default LayoutWrapper;
