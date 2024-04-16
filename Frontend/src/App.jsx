import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTransition, animated } from "react-spring";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskManagerPage from "./pages/TaskManagerPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Ruta protegida para la administración de notas */}
          <Route
            path="/task"
            element={<PrivateRoute component={TaskManagerPage} />}
          />
          {/* Ruta protegida para la página de administración */}
          <Route
            path="/admin"
            element={<PrivateRoute component={AdminPage} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// En PrivateRoute.jsx
const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth(); // Obtiene el estado de autenticación desde el contexto

  // Transiciones de animación
  const transitions = useTransition(isAuthenticated ? <Component /> : null, {
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
  });

  // Renderiza el componente proporcionado si el usuario está autenticado, de lo contrario, redirige a la página de inicio de sesión
  return (
    <>
      <Header />
      {transitions((style, item) => (
        <animated.div style={style}>{item}</animated.div>
      ))}
    </>
  );
};

export default App;
