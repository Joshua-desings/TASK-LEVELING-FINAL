const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

// Función para crear el administrador primordial
const createAdmin = async () => {
  try {
    // Verificar si ya existe un administrador en la base de datos
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      console.log("Ya existe un administrador en la base de datos");
      return;
    }

    // Obtener las credenciales del administrador primordial desde el archivo .env
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el administrador primordial
    const admin = new User({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
    });

    // Guardar el administrador en la base de datos
    await admin.save();
    console.log("Administrador primordial creado exitosamente");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
};

// Función para crear un administrador desde una solicitud HTTP
exports.createAdmin = async (req, res) => {
  try {
    // Verificar si ya existe un administrador en la base de datos
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Ya existe un administrador en la base de datos" });
    }

    // Crear el administrador primordial
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username,
      email,
      password: hashedPassword,
      role: "Admin",
    });
    await admin.save();

    res
      .status(201)
      .json({ message: "Administrador primordial creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el administrador:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al crear el administrador" });
  }
};

// Ejecutar la función para crear el administrador primordial
createAdmin();
