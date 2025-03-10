import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { UserRoleProvider } from "../../context/userRoleContext";
import { logoutUser } from "../../store/userSlice";
import ConfirmMessage from "./ConfirmMessage";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem("role");
    dispatch(logoutUser());
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <UserRoleProvider showSidebar={false}>
        <Header onLogout={initiateLogout} />
        {children}
        <Footer />
        {showLogoutConfirm && (
          <ConfirmMessage
            message="Are you sure you want to logout?"
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )}
      </UserRoleProvider>
    </>
  );
};

export default LayoutWrapper;