import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { useAuth } from "../hooks/AuthContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { username, logout } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // Eliminar tokens del almacenamiento local al cerrar sesión
      localStorage.removeItem("accessToken");
      localStorage.removeItem("adminToken");

      // Hacer la solicitud de logout al servidor si es necesario
      await axios.get("/api/logout");

      // Redireccionar a la página de inicio de sesión
      window.location.href = "http://localhost:3000/";

      // Llama a la función de logout al cerrar sesión
      logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const menuAnimation = useSpring({
    opacity: anchorEl ? 1 : 0,
    transform: anchorEl ? "scale(1)" : "scale(0)",
  });

  return (
    <AppBar position="sticky" style={{ marginBottom: "20px" }}>
      <Toolbar className="justify-between">
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Muestra el nombre de usuario en el texto de bienvenida */}
          <Typography variant="h6" style={{ marginRight: "1rem" }}>
            Bienvenido {username}
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
            edge="end"
          >
            <AccountCircleIcon />
          </IconButton>
        </div>
        <animated.div style={menuAnimation}>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </animated.div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
