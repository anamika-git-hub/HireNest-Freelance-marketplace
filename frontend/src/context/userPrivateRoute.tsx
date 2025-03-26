import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const UserPrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const userRole = localStorage.getItem('role') 

  if(!userRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserPrivateRoute;
