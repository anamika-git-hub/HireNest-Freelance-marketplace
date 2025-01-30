import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { UserRoleProvider } from "../../context/userRoleContext";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
    <UserRoleProvider showSidebar={false}>
      <Header />
      {children}
      <Footer />
      </UserRoleProvider>
    </>
  );
};

export default LayoutWrapper;
