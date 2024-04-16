import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useSpring, animated } from "react-spring";

// Define una paleta de colores moderna y profesional para modo claro
const lightTheme = createTheme({
  palette: {
    mode: "light", // Define el modo claro
    primary: {
      main: "#2979FF", // Azul brillante
    },
    secondary: {
      main: "#FF7043", // Naranja intenso
    },
    error: {
      main: "#D32F2F", // Rojo oscuro para errores
    },
    warning: {
      main: "#FFA000", // Amarillo oscuro para advertencias
    },
    success: {
      main: "#388E3C", // Verde oscuro para éxito
    },
    info: {
      main: "#1976D2", // Azul claro para información
    },
    background: {
      default: "#F5F5F5", // Fondo gris claro
      paper: "#FFFFFF", // Fondo blanco
    },
    text: {
      primary: "#333333", // Texto principal gris oscuro
      secondary: "#666666", // Texto secundario gris medio
      disabled: "#CCCCCC", // Texto deshabilitado gris claro
    },
    input: {
      backgroundColor: "#ECEFF1", // Fondo azul claro para inputs
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Fuente predeterminada
  },
});

// Define una paleta de colores para modo oscuro
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Define el modo oscuro
    primary: {
      main: "#64B5F6", // Azul claro para modo oscuro
    },
    secondary: {
      main: "#FFAB91", // Naranja claro para modo oscuro
    },
    error: {
      main: "#EF9A9A", // Rojo claro para modo oscuro
    },
    warning: {
      main: "#FFCC80", // Amarillo claro para modo oscuro
    },
    success: {
      main: "#A5D6A7", // Verde claro para modo oscuro
    },
    info: {
      main: "#90CAF9", // Azul claro para modo oscuro
    },
    background: {
      default: "#303030", // Fondo gris oscuro
      paper: "#424242", // Fondo gris oscuro más oscuro
    },
    text: {
      primary: "#FFFFFF", // Texto blanco
      secondary: "#CCCCCC", // Texto gris claro
      disabled: "#757575", // Texto gris medio
    },
    input: {
      backgroundColor: "#616161", // Fondo gris oscuro para inputs
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Fuente predeterminada
  },
});

// Renderiza la aplicación con los estilos personalizados utilizando ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));

function ToggleColorMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const springProps = useSpring({
    transform: isDarkMode ? "rotate(180deg)" : "rotate(0deg)",
  });

  const toggleColorMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <animated.div
      style={{
        ...springProps,
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 2000,
      }}
    >
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <IconButton onClick={toggleColorMode} color="inherit">
          {isDarkMode ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </ThemeProvider>
    </animated.div>
  );
}

root.render(
  <React.StrictMode>
    <ToggleColorMode />
    <App />
  </React.StrictMode>
);
