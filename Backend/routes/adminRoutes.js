const express = require("express");
const router = express.Router();
const createAdminScript = require("../config/createAdminScript");
const authMiddleware = require("../middleware/authMiddleware");

// Ruta para ejecutar el script y crear el administrador primordial
router.post("/create-admin", authMiddleware, (req, res) => {
  createAdminScript(); // Ejecuta el script para crear el administrador primordial
  res
    .status(200)
    .json({
      message: "Proceso de creación del administrador primordial iniciado",
    });
});

module.exports = router;
