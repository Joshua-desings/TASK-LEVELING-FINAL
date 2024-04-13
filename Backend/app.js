const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const User = require("./models/userModel");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
const app = express();

// Configuración de variables de entorno
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conexión a la base de datos MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conexión a la base de datos establecida"))
  .catch((err) => console.error("Error al conectar a la base de datos:", err));

// Configuración de Passport y Estrategia de Autenticación Local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: "Correo electrónico no registrado",
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());

// Middlewares adicionales
app.use(express.json());
app.use(cors()); // Permite solicitudes de otros dominios

// Middleware para limitar la tasa de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de solicitudes por IP
});
app.use(limiter);

// Rutas
app.use("/api", authRoutes); // Rutas de autenticación
app.use("/api", adminRoutes); // Rutas para el administrador
app.use("/api", taskRoutes); // Rutas para las tareas

// Middleware de manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ocurrió un error en el servidor" });
});

// Iniciar servidor con nodemon en desarrollo
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
} else {
  module.exports = app;
}
