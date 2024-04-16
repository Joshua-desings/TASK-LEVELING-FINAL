import React, { useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";

import {
  Modal,
  Fade,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import DeadlinePicker from "../components/DeadlinePicker";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TaskCreation = ({
  openCreationModal,
  handleCloseCreationModal,
  fetchNotes,
  showSnackbar,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("E");
  const [deadline, setDeadline] = useState(null);
  const [titleError, setTitleError] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const props = useSpring({
    opacity: openCreationModal ? 1 : 0,
    marginTop: openCreationModal ? 0 : -50,
  });

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleDeadlineChange = (newDate) => {
    setDeadline(newDate);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length >= 3) {
      setTitleError(false);
    } else {
      setTitleError(true);
    }
  };

  const handleCreateNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const requestData = {
        title,
        description,
        difficulty,
        progress: "pending",
        deadline,
      };

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Tarea creada:", response.data);
      fetchNotes();
      setTitle("");
      setDescription("");
      setDifficulty("E");
      setDeadline(null);
      handleCloseCreationModal();
      showSnackbar("Tarea creada exitosamente.", "success");
    } catch (error) {
      console.error("Error al crear la tarea:", error.response.data.message);
      showSnackbar(
        "Error al crear la tarea. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  };

  return (
    <>
      <Modal
        open={openCreationModal}
        onClose={handleCloseCreationModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={openCreationModal}>
          <animated.div
            style={{
              ...props,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: isMobile ? "1rem" : "2rem",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                width: isMobile ? "80%" : "auto",
                maxWidth: isMobile ? "none" : "500px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" style={{ fontFamily: "inherit" }}>
                  Crear nueva misión
                </Typography>
                <CloseIcon
                  onClick={handleCloseCreationModal}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <TextField
                label="Título"
                fullWidth
                margin="normal"
                variant="outlined"
                value={title}
                onChange={handleTitleChange}
                error={titleError}
                helperText={
                  titleError && "El título debe tener al menos 3 caracteres"
                }
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon color="primary" fontSize="small" />
                  ),
                  endAdornment: titleError ? (
                    <ErrorIcon color="error" fontSize="small" />
                  ) : (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ),
                }}
              />
              <TextField
                label="Descripción (Opcional)"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon color="primary" fontSize="small" />
                  ),
                }}
              />
              <FormControl
                fullWidth
                style={{ marginTop: "1rem", marginBottom: "0.6rem" }}
              >
                <InputLabel>Dificultad</InputLabel>
                <Select
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  style={{ marginTop: "0.5rem" }}
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
                value={deadline}
                onChange={handleDeadlineChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateNote}
                startIcon={<DescriptionIcon />}
                fullWidth
                style={{ marginTop: "1rem" }}
                disabled={titleError || title.length < 3}
              >
                Crear
              </Button>
            </div>
          </animated.div>
        </Fade>
      </Modal>
    </>
  );
};

export default TaskCreation;
