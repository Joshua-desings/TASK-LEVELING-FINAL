const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: false,
    minlength: 0,
    maxlength: 1000,
  },
  difficulty: {
    type: String,
    enum: ["E", "D", "C", "B", "A", "S"],
  },
  experience: {
    type: Number,
    required: true,
    default: 0,
  },
  deadline: {
    type: Date,
    required: false,
  },
  progress: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 2;
      }
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo de usuario si se necesita
  },
});

taskSchema.index({ createdAt: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
