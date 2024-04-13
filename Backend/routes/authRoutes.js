const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Rutas para autenticación y gestión de usuarios
router.post("/signup", authController.signup); // Registro de nuevos usuarios
router.post("/login", authController.login); // Inicio de sesión
router.post("/logout", authController.logout); // Cierre de sesión

// Rutas protegidas que requieren autenticación de administrador
router.use(authMiddleware); // Middleware de autenticación para las siguientes rutas

// Listar usuarios (requiere autenticación de administrador)
router.get("/users", authController.getAllUsers);

// Promover usuarios a administradores (requiere autenticación de administrador)
router.post("/users/:userId/promote", authController.promoteToAdmin);

// Quitar la promoción de administrador a los usuarios (requiere autenticación de administrador)
router.post("/users/:userId/demote", authController.demoteFromAdmin);

module.exports = router;
