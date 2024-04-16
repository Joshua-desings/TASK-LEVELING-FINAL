const Task = require("../models/taskModel");
const Joi = require("joi");
const mongoose = require('mongoose');

// Esquema de validación para la creación y actualización de tareas
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(0).max(1000).allow('').optional(),
  difficulty: Joi.string().valid("E", "D", "C", "B", "A", "S").required(),
  deadline: Joi.date().iso().greater('now').optional().allow(null),
  progress: Joi.string().valid("pending", "in_progress", "completed").required(),
  tags: Joi.array().items(Joi.string()).max(2).optional()
});

// Obtener todas las tareas del usuario con paginación, ordenamiento y filtrado
exports.getAllTasks = async (req, res) => {
  try {
    // Obtener parámetros de la solicitud
    const { userId } = req.user;
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", progress, deadline, priority } = req.query;

    // Validar parámetros de paginación y ordenamiento
    const paginationSchema = Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).optional(),
      sortBy: Joi.string().valid("createdAt", "priority", "deadline").optional(),
      sortOrder: Joi.string().valid("asc", "desc").optional()
    });

    const { error: paginationError } = paginationSchema.validate({ page, limit, sortBy, sortOrder });
    if (paginationError) {
      return res.status(400).json({ success: false, message: "Parámetros de paginación y ordenamiento inválidos", error: paginationError.details });
    }

    // Construir filtro de consulta
    const filter = { createdBy: userId };
    if (progress) filter.progress = progress;
    if (deadline) filter.deadline = { $lte: new Date(deadline) };
    if (priority) filter.priority = priority;

    // Realizar consulta a la base de datos
    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Enviar respuesta al cliente
    res.status(200).json({
      success: true,
      data: tasks,
      pagination: { totalTasks, totalPages, currentPage: page, pageSize: limit }
    });
  } catch (error) {
    console.error("Error al obtener las tareas del usuario:", error);
    res.status(500).json({ success: false, message: "Error al obtener las tareas del usuario" });
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      // Error de validación
      return res
        .status(422)
        .json({ message: "Error de validación", error: error.details });
    }

    const newTask = await Task.create({
      ...req.body,
      createdBy: req.user.userId,
    });

    res.status(201).json(newTask);
  } catch (error) {
    // Error interno del servidor
    console.error("Error al crear la tarea:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al crear la tarea" });
  }
};

// Obtener una tarea por su ID
exports.getTaskById = async (req, res) => {
  try {
    // Validar si el ID de tarea es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
      return res.status(400).json({ message: "ID de tarea no válido" });
    }

    // Buscar la tarea en la base de datos
    const task = await Task.findOne({ _id: req.params.taskId, createdBy: req.user.userId });

    // Manejar el caso en el que la tarea no se encuentre
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Devolver la tarea encontrada
    res.json(task);
  } catch (error) {
    // Manejar errores específicos
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "ID de tarea no válido" });
    } else {
      console.error("Error al obtener la tarea:", error);
      res.status(500).json({ message: "Error al obtener la tarea" });
    }
  }
};

// Actualizar una tarea por su ID
exports.updateTask = async (req, res) => {
  try {
    // Validar los datos de la tarea actualizada
    const { error: validationError } = taskSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError.details[0].message });
    }

    // Verificar si el ID de tarea es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
      return res.status(400).json({ message: "ID de tarea no válido" });
    }

    // Buscar y actualizar la tarea en la base de datos
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.taskId, createdBy: req.user.userId },
      req.body,
      { new: true }
    );

    // Manejar el caso en el que la tarea no se encuentre
    if (!updatedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Devolver la tarea actualizada
    res.json(updatedTask);
  } catch (error) {
    // Manejar errores específicos
    console.error("Error al actualizar la tarea:", error);
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};


// Actualizar el progreso de una tarea por su ID
exports.updateTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const { taskId } = req.params;
    const { userId } = req.user;

    // Verificar si la tarea existe y fue creada por el usuario actual
    const task = await Task.findOne({ _id: taskId, createdBy: userId });
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Verificar si el progreso proporcionado es válido
    if (!["pending", "in_progress", "completed"].includes(progress)) {
      return res.status(400).json({ message: "El progreso proporcionado no es válido" });
    }

    // Actualizar el progreso de la tarea
    task.progress = progress;

    // Otorgar experiencia al usuario en base a la prioridad de la tarea
    let expEarned = 0;
    if (task.priority === "D") {
      expEarned = 1000;
    } else if (task.priority === "S") {
      expEarned = 6000;
    }

    // Aquí podrías agregar lógica adicional para otorgar experiencia en base a otros factores, si es necesario.

    // Guardar los cambios en la tarea
    await task.save();

    // Devolver la tarea actualizada y la experiencia ganada
    res.json({ task, expEarned });
  } catch (error) {
    console.error("Error al actualizar el progreso de la tarea:", error);
    res.status(500).json({ message: "Error al actualizar el progreso de la tarea" });
  }
};


// Eliminar una tarea por su ID
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.user;

    // Buscar y eliminar la tarea
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });

    // Verificar si la tarea fue encontrada y eliminada correctamente
    if (!deletedTask) {
      return res.status(404).json({ message: "No se encontró la tarea o no tienes permiso para eliminarla" });
    }

    // Devolver mensaje de éxito
    res.json({ message: "Tarea eliminada correctamente", deletedTask });
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
};

