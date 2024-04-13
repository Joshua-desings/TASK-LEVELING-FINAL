const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Integrar el middleware de autenticación en todas las rutas de tareas
router.use(authMiddleware);

// Rutas para todas las tareas
router
  .route("/tasks")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

// Rutas para una tarea específica
router
  .route("/tasks/:taskId")
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
