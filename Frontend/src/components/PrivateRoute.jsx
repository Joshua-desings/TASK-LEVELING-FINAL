import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext'; // Importa el hook de autenticación

const PrivateRoute = ({ element, ...props }) => {
  const { isAuthenticated } = useAuth(); // Usa el hook de autenticación para verificar si el usuario está autenticado

  // Si el usuario está autenticado, renderiza el elemento de la ruta, de lo contrario, redirige a la página de inicio de sesión
  return isAuthenticated ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/login" replace /> // Redirige a la página de inicio de sesión
  );
};

export default PrivateRoute;
