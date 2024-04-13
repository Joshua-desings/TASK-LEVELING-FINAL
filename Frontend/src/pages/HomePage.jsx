import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Container, Grid } from "@mui/material";

const HomePage = () => {
  return (
    <Container>
      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="h3" gutterBottom>
            Bienvenido a Task Leveling
          </Typography>
          <Typography variant="body1" paragraph>
            Task Leveling es una aplicación de gestión de tareas RPG que te
            ayuda a organizar tus tareas de una manera divertida y eficiente.
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Iniciar sesión
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/register"
              >
                Registrarse
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
