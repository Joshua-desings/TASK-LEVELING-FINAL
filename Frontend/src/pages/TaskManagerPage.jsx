import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TaskCreation from "../components/TaskCreation";
import TaskEdit from "../components/TaskEdit";
import { useAuth } from "../hooks/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loader from "../utils/Loader";

const TaskManagerPage = () => {
  const [notes, setNotes] = useState([]);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openCreationModal, setOpenCreationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [page]); // Fetch notes when page changes

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: 10,
        },
      });
      setNotes(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error al obtener las notas:", error);
      showSnackbar(
        "Error al obtener las notas. Por favor, inténtalo de nuevo.",
        "error"
      );
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleOpenEditModal = (note) => {
    setSelectedNote(note);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedNote(null);
    setOpenEditModal(false);
  };

  const handleDeleteConfirmation = (note) => {
    setSelectedNote(note);
    setDeleteConfirmationModal(true);
  };

  const handleDeleteNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `http://localhost:5000/api/tasks/${selectedNote._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotes();
      setDeleteConfirmationModal(false);
      showSnackbar("Tarea eliminada exitosamente.", "success");
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      showSnackbar(
        "Error al eliminar la tarea. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  };

  const handleCompletedChange = async (taskId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const noteToUpdate = notes.find((note) => note._id === taskId);
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: !noteToUpdate.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Tarea actualizada:", response.data);
      fetchNotes();
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      showSnackbar(
        "Error al actualizar la tarea. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {loadingNotes && <Loader loading={loadingNotes} />}
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Administrador de Tareas
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenCreationModal(true)}
              fullWidth
              style={{ marginBottom: "1rem" }}
            >
              Crear una nueva misión
            </Button>
          </Grid>
          <Grid item xs={12}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Card
                  key={note._id}
                  variant="outlined"
                  style={{ marginBottom: "1rem" }}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {note.title}
                    </Typography>
                    <Typography variant="body1">
                      Descripción: {note.description}
                    </Typography>
                    <Typography variant="body2">
                      Fecha límite:{" "}
                      {note.deadline ? note.deadline : "Sin fecha límite"}
                    </Typography>
                    <Typography variant="body2">
                      Progreso: {note.progress}
                    </Typography>
                    <Typography variant="body2">
                      Dificultad: {note.difficulty}
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: "flex-end" }}>
                    <Button
                      onClick={() => handleDeleteConfirmation(note)}
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                    <Button
                      onClick={() => handleOpenEditModal(note)}
                      startIcon={<EditIcon />}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleCompletedChange(note._id)}
                      color={note.completed ? "success" : "primary"}
                      startIcon={
                        note.completed ? (
                          <CheckCircleOutlineIcon style={{ color: "green" }} />
                        ) : (
                          <CheckCircleOutlineIcon />
                        )
                      }
                    >
                      {note.completed ? "Completado" : "Marcar como completado"}
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography variant="body1">
                No hay tareas disponibles.
              </Typography>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={handlePreviousPage}
                disabled={page === 1 || totalPages === 1}
              >
                Anterior
              </Button>
              <Typography variant="body1">
                Página {page} de {totalPages}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={page === totalPages || totalPages === 1}
              >
                Siguiente
              </Button>
            </div>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
        >
          <Alert severity={snackbarSeverity} onClose={closeSnackbar}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Modal
          open={openCreationModal}
          onClose={() => setOpenCreationModal(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80%",
                backgroundColor: "#fff",
              }}
            >
              <TaskCreation
                openCreationModal={openCreationModal}
                handleCloseCreationModal={() => setOpenCreationModal(false)}
                fetchNotes={fetchNotes}
                showSnackbar={showSnackbar}
              />
            </div>
          </Fade>
        </Modal>
        <Modal
          open={deleteConfirmationModal}
          onClose={() => setDeleteConfirmationModal(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={deleteConfirmationModal}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "auto", // Cambiamos la altura para que se ajuste al contenido
                padding: "1rem", // Añadimos un padding para darle espacio al contenido
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                  minWidth: "300px",
                  maxWidth: "500px",
                  width: "50%",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  ¿Estás seguro de que deseas eliminar esta tarea?
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteNote}
                  startIcon={<DeleteIcon />}
                  fullWidth
                  style={{ marginTop: "1rem" }}
                >
                  Sí, eliminar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setDeleteConfirmationModal(false)}
                  fullWidth
                  style={{ marginTop: "1rem" }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
        <TaskEdit
          open={openEditModal}
          handleClose={handleCloseEditModal}
          note={selectedNote}
          fetchNotes={fetchNotes}
          showSnackbar={showSnackbar}
        />
      </Container>
    </div>
  );
};

export default TaskManagerPage;
