//////////////////////////////////////////////////
const express = require('express');
const Usuario = require('../Usuario');
const Turno = require('../Turno');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'oasidh1298389aud0noasnas56464asd!';

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    console.log('usuariosobtenidos', usuarios);
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Validar legajo
router.post('/usuarios/validar-legajo', async (req, res) => {
  const { legajo } = req.body;
  try {
    const usuario = await Usuario.findOne({ legajo });
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
  try {
    const usuario = await Usuario.findOne({ legajo });

    if (!usuario) {
      return res.status(404).json({ message: 'Legajo no encontrado' });
    }

    if (usuario.contraseña === null) {
      return res.status(400).json({ message: 'Legajo sin contraseña. Por favor, regístrese.' });
    }

    if (usuario.contraseña !== contraseña) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { legajo: usuario.legajo, nombre: usuario.nombre, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Confirmar turno
router.post('/turnos/confirmar', async (req, res) => {
  const { legajo, dia, horario } = req.body;

  try {
    const turnoExistente = await Turno.findOne({ dia, 'turnos.nombre': legajo });
    if (turnoExistente) {
      return res.status(400).json({ message: 'Ya tienes un turno asignado en este día.' });
    }

    if (!horario) {
      return res.status(400).json({ message: 'Por favor, selecciona un horario.' });
    }

    const usuario = await Usuario.findOne({ legajo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const nombreUsuario = usuario.nombre;
    const turno = await Turno.findOne({ dia });

    if (!turno) {
      const nuevoTurno = new Turno({ dia, turnos: Array(8).fill(null) });
      nuevoTurno.turnos[horario] = `${nombreUsuario} - ${horario}`;
      await nuevoTurno.save();
    } else {
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
