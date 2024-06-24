import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RotasPrivadas: React.FC = () => {
  const { email } = useContext(AuthContext);
  const location = useLocation();

  return email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default RotasPrivadas;
