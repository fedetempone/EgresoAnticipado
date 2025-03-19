const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../Usuario');
const Turno = require('../Turno');
const router = express.Router();  

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Validación del legajo para ver si el usuario puede actualizar su información
router.post('/usuarios/validar-legajo', async (req, res) => {
  const { legajo } = req.body;
  try {
    const usuario = await Usuario.findOne({ legajo });
    console.log('Usuario encontrado:', usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Legajo no encontrado' });
    }

    if (usuario.email && usuario.contraseña) {
      return res.status(400).json({ message: 'Usuario ya registrado con email y contraseña' });
    }

    res.status(200).json({ message: 'Legajo válido para actualizar' });
  } catch (error) {
    console.error('Error al validar legajo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para login
router.post('/login', async (req, res) => {
  const { legajo, contraseña } = req.body;
  
  const usuario = await Usuario.findOne({ legajo });

  if (!usuario) {
    return res.status(400).json({ message: 'Legajo no encontrado' });
  }

  if (usuario.contraseña === null) {
    return res.status(400).json({ message: 'Legajo sin contraseña' });
  }

  // Verifica la contraseña utilizando bcrypt
  const esContraseñaCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!esContraseñaCorrecta) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  // Generar token y retornar
  const token = generateToken(usuario); // tu lógica para generar el token
  res.json({ token });
});

// Ruta para registrar un usuario (con encriptación de la contraseña)
router.post('/api/auth/registro', async (req, res) => {
  const { legajo, email, contraseña } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ legajo });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'Legajo ya registrado' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    // Crear un nuevo usuario con la contraseña encriptada
    const nuevoUsuario = new Usuario({
      legajo,
      email,
      contraseña: contraseñaEncriptada,
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para confirmar el turno
router.post('/turnos/confirmar', async (req, res) => {
  const { legajo, dia, horario } = req.body;  // Esperamos el legajo, el día y el horario seleccionados

  try {
    // Verificamos si el usuario ya tiene un turno en el día seleccionado
    const turnoExistente = await Turno.findOne({ dia, 'turnos.nombre': legajo });
    
    if (turnoExistente) {
      return res.status(400).json({ message: 'Ya tienes un turno asignado en este día.' });
    }

    // Verificamos que el usuario haya seleccionado un horario
    if (!horario) {
      return res.status(400).json({ message: 'Por favor, selecciona un horario.' });
    }

    // Obtenemos el nombre del usuario a partir del legajo
    const usuario = await Usuario.findOne({ legajo });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const nombreUsuario = usuario.nombre;

    // Guardamos el turno en la colección "turnos"
    const turno = await Turno.findOne({ dia });

    if (!turno) {
      // Si no existe el turno para el día, lo creamos
      const nuevoTurno = new Turno({
        dia,
        turnos: Array(8).fill(null)  // Suponiendo que hay 8 espacios disponibles
      });
      turno.turnos[horario] = `${nombreUsuario} - ${horario}`;
      await nuevoTurno.save();
    } else {
      // Si ya existe, actualizamos el turno
      turno.turnos[horario] = `${nombreUsuario} - ${horario}`;
      await turno.save();
    }

    res.status(200).json({ message: 'Turno confirmado correctamente' });
  } catch (error) {
    console.error('Error al confirmar el turno:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener usuario por legajo
router.get('/usuarios/:legajo', async (req, res) => {
  const { legajo } = req.params;
  try {
    const usuario = await Usuario.findOne({ legajo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para actualizar los datos de un usuario
router.put('/usuarios/:legajo', async (req, res) => {
  const { legajo } = req.params;  // Legajo del usuario que queremos actualizar
  const { email, contraseña } = req.body;  // Los nuevos datos

  try {
    // Si la contraseña es nueva, la encriptamos antes de actualizar
    let contraseñaEncriptada = contraseña;
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      contraseñaEncriptada = await bcrypt.hash(contraseña, salt);
    }

    // Buscamos al usuario por legajo y lo actualizamos
    const usuario = await Usuario.findOneAndUpdate(
      { legajo },  // Buscar por legajo
      { email, contraseña: contraseñaEncriptada },  // Actualizar estos campos
      { new: true }  // Retornar el documento actualizado
    );

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);  // Devolver el usuario actualizado
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;

