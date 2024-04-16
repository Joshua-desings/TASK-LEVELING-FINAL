import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import DeadlinePicker from "./DeadlinePicker";

const TaskEdit = ({ open, handleClose, note, fetchNotes, showSnackbar }) => {
  const [updatedNote, setUpdatedNote] = useState({
    title: "",
    description: "",
    difficulty: "",
    deadline: null,
    progress: "pending", // Inicializa el progreso como "pending"
  });

  // Actualiza el estado cuando `note` cambia
  useEffect(() => {
    if (note) {
      setUpdatedNote({
        title: note.title || "",
        description: note.description || "",
        difficulty: note.difficulty || "",
        deadline: note.deadline || null,
        progress: note.progress || "pending", // Asigna "pending" si el progreso está vacío
      });
    }
  }, [note]);

  const handleInputChange = (e) => {
    setUpdatedNote({
      ...updatedNote,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:5000/api/tasks/${note._id}`,
        updatedNote,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotes();
      handleClose();
      showSnackbar("Tarea actualizada exitosamente.", "success");
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      showSnackbar(
        "Error al actualizar la tarea. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="body1">Editar Tarea</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          name="title"
          value={updatedNote.title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Descripción"
          name="description"
          value={updatedNote.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          variant="outlined"
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Dificultad</InputLabel>
          <Select
            name="difficulty"
            value={updatedNote.difficulty}
            onChange={handleInputChange}
            label="Dificultad"
          >
            <MenuItem value="E">E - Muy Fácil</MenuItem>
            <MenuItem value="D">D - Fácil</MenuItem>
            <MenuItem value="C">C - Normal</MenuItem>
            <MenuItem value="B">B - Difícil</MenuItem>
            <MenuItem value="A">A - Muy Difícil</MenuItem>
            <MenuItem value="S">S - Pesadilla</MenuItem>
          </Select>
        </FormControl>
        <DeadlinePicker
          label="Hora límite"
          value={updatedNote.deadline}
          onChange={(value) =>
            setUpdatedNote({ ...updatedNote, deadline: value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleUpdateNote} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEdit;
