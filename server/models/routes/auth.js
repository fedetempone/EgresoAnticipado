const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../Usuario');

const router = express.Router();

// Registro de Usuario
router.post('/registro', async (req, res) => {
  const { legajo, contraseña, email } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ legajo });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El legajo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ legajo, contraseña: hashedPassword, email });
    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Login de Usuario
router.post('/login', async (req, res) => {
  const { legajo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ legajo });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const esValida = await usuario.comparePassword(contraseña);
    if (!esValida) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Ruta GET para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Obtiene todos los usuarios
    res.status(200).json(usuarios); // Responde con la lista de usuarios
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Ruta GET para obtener un usuario específico por legajo
router.get('/usuarios/:legajo', async (req, res) => {
  const { legajo } = req.params; // Obtener el legajo desde los parámetros de la URL

  try {
    const usuario = await Usuario.findOne({ legajo }); // Buscar por legajo
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario); // Responder con el usuario encontrado
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

module.exports = router;
