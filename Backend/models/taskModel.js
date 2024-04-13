const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: false,
    minlength: 0,
    maxlength: 1000,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo de usuario si se necesita
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"], // Prioridad de la tarea
  },
  tags: [String], // Etiquetas asociadas a la tarea
});

taskSchema.index({ createdAt: 1 }); // Índice para mejorar el rendimiento de las consultas

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
