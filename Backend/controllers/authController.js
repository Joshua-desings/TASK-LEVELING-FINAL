const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Esquema de validación para la solicitud de registro
const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Esquema de validación para la solicitud de inicio de sesión
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.signup = async (req, res) => {
  try {
    // Validar los datos de entrada
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Validar los datos de entrada
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Obtenemos los datos del cuerpo de la solicitud
    const { email, password } = req.body;

    // Buscamos el usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Correo electrónico no registrado' });
    }

    // Verificamos la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generamos el token de acceso con el ID de usuario, el nombre de usuario y el rol como payload
    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role
    };

    // Generamos el token de acceso
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({ message: 'Inicio de sesión exitoso', token: accessToken, role: user.role, username: user.username });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
  }
};

exports.logout = async (req, res) => {
  try {
    
    // Envía un mensaje indicando que la sesión se cerró exitosamente
    res.status(200).send('Sesión cerrada exitosamente');

    // Redirige al usuario a la página de inicio después de cerrar sesión
    res.redirect('http://localhost:3000/');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).send('Error al cerrar sesión');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario tiene permisos de administrador
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "No tiene permiso para acceder a esta ruta" });
    }

    // Buscar los primeros 10 usuarios en la base de datos, seleccionando solo los campos necesarios y excluyendo la contraseña
    const users = await User.find({}, 'username email role').limit(10);

    // Verificar si se encontraron usuarios
    if (!users || users.length === 0) {
      throw new Error('No se encontraron usuarios');
    }

    // Devolver la lista de usuarios
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Ocurrió un error al obtener usuarios' });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    // Verificar si el usuario tiene permisos de administrador
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "No tiene permiso para realizar esta acción" });
    }

    const { userId } = req.params;

    // Buscar al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el rol del usuario a "Admin"
    user.role = 'Admin';
    await user.save();

    res.status(200).json({ message: 'Usuario promovido a administrador exitosamente' });
  } catch (error) {
    console.error('Error al promover usuario a administrador:', error);
    res.status(500).json({ message: 'Ocurrió un error al promover usuario a administrador' });
  }
};

exports.demoteFromAdmin = async (req, res) => {
  try {
    // Verificar si el usuario tiene permisos de administrador
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "No tiene permiso para realizar esta acción" });
    }

    const { userId } = req.params;

    // Buscar al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el rol del usuario
    user.role = 'Usuario';
    await user.save();

    res.status(200).json({ message: 'Privilegios de administrador removidos exitosamente' });
  } catch (error) {
    console.error('Error al remover privilegios de administrador:', error);
    res.status(500).json({ message: 'Ocurrió un error al remover privilegios de administrador' });
  }
};


