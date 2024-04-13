import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

// Importar el componente Loader desde la carpeta utils
import Loader from "../utils/Loader";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [error, setError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Establecer el estado de carga en true antes de enviar la solicitud al servidor
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Role": role,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError("Error al obtener la lista de usuarios");
        setErrorAlert(true);
      } finally {
        // Establecer el estado de carga en false después de completar la solicitud
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const promoteToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `http://localhost:5000/api/users/${userId}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: "Admin" } : user
      );
      setUsers(updatedUsers);
      setSuccessMessage("Usuario promovido a administrador exitosamente");
      setSuccessAlert(true);
    } catch (error) {
      setErrorAlert(true);
      setError("Error al promover usuario a administrador");
    }
  };

  const demoteFromAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `http://localhost:5000/api/users/${userId}/demote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: "Usuario" } : user
      );
      setUsers(updatedUsers);
      setSuccessMessage("Privilegios de administrador removidos exitosamente");
      setSuccessAlert(true);
    } catch (error) {
      setErrorAlert(true);
      setError("Error al remover privilegios de administrador");
    }
  };

  const handleCloseErrorAlert = () => {
    setErrorAlert(false);
  };

  const handleCloseSuccessAlert = () => {
    setSuccessAlert(false);
  };

  return (
    <>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Loader loading={loading} />
      <Typography variant="h5" gutterBottom>
        Lista de Usuarios
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Promover</TableCell>
              <TableCell>Despromover</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => promoteToAdmin(user._id)}
                    disabled={user.role === "Admin"}
                  >
                    <ArrowUpward />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => demoteFromAdmin(user._id)}
                    disabled={user.role === "Usuario"}
                  >
                    <ArrowDownward />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box>
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Siguiente
        </Button>
      </Box>
      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={successAlert}
        autoHideDuration={2500}
        onClose={handleCloseSuccessAlert}
        message={successMessage}
      />
      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={errorAlert}
        autoHideDuration={2500}
        onClose={handleCloseErrorAlert}
        message={error}
      />
    </>
  );
};  

export default AdminPage;