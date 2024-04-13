import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Grid } from "@mui/material";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Eliminar el campo confirmPassword del objeto formData enviado al backend
    const { confirmPassword, ...data } = formData;

    if (data.password !== formData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Enviar datos del formulario al backend (excluyendo confirmPassword)
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        data
      );
      console.log(response.data);
      // Redirigir al usuario a la página de inicio de sesión después del registro exitoso
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      // Manejar errores de registro
    }
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
          <Typography variant="h4" gutterBottom>
            Registro
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Nombre de usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              name="email"
              type="email"
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="password"
              type="password"
              label="Contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={passwordError !== ""}
              helperText={passwordError}
            />
            <Button type="submit" variant="contained" color="primary">
              Registrarse
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;
