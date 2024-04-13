// En el componente LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Snackbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorAlert, setErrorAlert] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        data
      );

      if (response.data.token) {
        // Almacena el token en el almacenamiento local
        localStorage.setItem("accessToken", response.data.token);
        // Almacena el rol del usuario en el almacenamiento local
        localStorage.setItem("userRole", response.data.role);

        // Redirige a la página adecuada según el rol del usuario
        if (response.data.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/notes");
        }

        // Establece el nombre de usuario en el contexto de autenticación
        login(response.data.username);
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleCloseErrorAlert = () => {
    setErrorAlert(false);
  };

  return (
    <Container>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email", {
                required: "El correo electrónico es obligatorio",
              })}
              type="email"
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              error={errors.email ? true : false}
              helperText={errors.email && errors.email.message}
            />
            <TextField
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              type="password"
              label="Contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              error={errors.password ? true : false}
              helperText={errors.password && errors.password.message}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </form>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </Typography>
        </Grid>
      </Grid>

      <Snackbar
        open={errorAlert}
        autoHideDuration={6000}
        onClose={handleCloseErrorAlert}
        message="Inicio de sesión fallido. Verifica tus credenciales e intenta nuevamente."
      />
    </Container>
  );
};

export default LoginPage;
