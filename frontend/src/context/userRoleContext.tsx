import React, { createContext, useContext, useState, useEffect } from "react";
import UserSidebar from "../components/shared/UserSideBar";

interface UserRoleContextProps {
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: React.ReactNode, showSidebar: boolean }> = ({ children ,showSidebar = true}) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "client");

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role") || "client");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("roleChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("roleChange", handleStorageChange);
    };
  }, []);

  if(showSidebar == true){
    return (
      <UserRoleContext.Provider value={{ userRole, setUserRole }}>
       <UserSidebar>{children}</UserSidebar>
      </UserRoleContext.Provider>
    );
  }else {
    return (
      <UserRoleContext.Provider value={{ userRole, setUserRole }}>
       {children}
      </UserRoleContext.Provider>
    );
  }
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};
