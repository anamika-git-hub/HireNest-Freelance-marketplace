import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const currentUser = useSelector((state: RootState) => state.user.currentUser);
const currentUser = localStorage.getItem('role')

  if (currentUser !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }


  return <>{children}</>;
};

export default PrivateRoute;
