const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

// Función para crear el administrador primordial
exports.createAdmin = async (req, res) => {
  try {
    // Verificar si ya existe un administrador en la base de datos
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Ya existe un administrador en la base de datos' });
    }

    // Crear el administrador primordial
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();

    res.status(201).json({ message: 'Administrador primordial creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el administrador:', error);
    res.status(500).json({ message: 'Ocurrió un error al crear el administrador' });
  }
};
