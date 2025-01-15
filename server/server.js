// SERVER.JS

// FUNCIONANDO EN COORELATIVIDAD CON EGRESOS APP 14/1 TODO FUNCIONANDO CONECTADA
// A BASE DE DATOS

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Turno = require('./models/Turno');
const Usuario = require('./models/Usuario'); // Asegúrate de que el modelo Usuario esté correctamente importado
const authRoutes = require('./routes/auth'); // Importar las rutas de autenticación

const app = express();

// Obtén el puerto desde el entorno o usa 5000 para desarrollo local
const port = process.env.PORT || 10000;

// Configura CORS (Permitir solo solicitudes de tu frontend)
const allowedOrigins = ['http://localhost:5173', 'https://egreso-backend.onrender.com/'];  // Permitir ambos orígenes
app.use(cors({
  origin: allowedOrigins,
}));

// Middleware para manejar las solicitudes JSON
app.use(express.json());

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes); // Definir las rutas de autenticación en el prefijo /api/auth

// Ruta para obtener los turnos (GET)
app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await Turno.find(); // Obtener los turnos de la base de datos
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).send('Error al obtener los turnos');
  }
});

// Ruta para guardar el turno (POST)
app.post('/api/turnos', async (req, res) => {
  const { filaIndex, dia, nombre } = req.body;

  try {
    // Busca el documento de turnos
    let turnos = await Turno.findOne();

    if (!turnos) {
      // Si no existe el documento, inicialízalo
      turnos = new Turno({
        Lunes: Array(8).fill(''),
        Martes: Array(8).fill(''),
        Miércoles: Array(8).fill(''),
        Jueves: Array(8).fill(''),
        Viernes: Array(8).fill(''),
      });
    }

    // Actualiza el turno correspondiente
    if (turnos[dia][filaIndex] === '') {
      turnos[dia][filaIndex] = nombre;
      await turnos.save();
      res.status(200).json({ message: 'Turno guardado con éxito' });
    } else {
      res.status(400).json({ message: 'Este turno ya está ocupado' });
    }
  } catch (error) {
    console.error('Error al guardar el turno:', error);
    res.status(500).json({ message: 'Error al guardar el turno' });
  }
});

// Ruta para validar legajo para registro
app.post('/api/usuarios/validar-legajo', async (req, res) => {
  const { legajo } = req.body;

  try {
    const usuario = await Usuario.findOne({ legajo });
    if (!usuario) {
      return res.status(404).json({ message: 'Legajo no encontrado' });
    }

    if (usuario.contraseña) {
      return res.status(400).json({ message: 'Usuario ya registrado, inicie sesión' });
    }

    res.status(200).json({ message: 'Legajo válido, puede registrarse' });
  } catch (error) {
    console.error('Error al validar legajo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para registrar usuario
app.post('/api/usuarios/registrar', async (req, res) => {
  const { legajo, contraseña, email } = req.body;

  try {
    const usuario = await Usuario.findOne({ legajo });
    if (!usuario || usuario.contraseña) {
      return res.status(400).json({ message: 'No se puede registrar este usuario' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    usuario.contraseña = hashedPassword;
    usuario.email = email;
    await usuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para iniciar sesión
app.post('/api/usuarios/login', async (req, res) => {
  const { legajo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ legajo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para recuperar contraseña
app.post('/api/usuarios/recuperar', async (req, res) => {
  const { legajo } = req.body;

  try {
    const usuario = await Usuario.findOne({ legajo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Configurar transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tuemail@gmail.com',
        pass: 'tucontraseña'
      }
    });

    const mailOptions = {
      from: 'tuemail@gmail.com',
      to: usuario.email,
      subject: 'Recuperación de contraseña',
      text: `Tu contraseña es: ${usuario.contraseña}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Conectar a la base de datos MongoDB Atlas
mongoose
  .connect('mongodb+srv://tuusuario:tucontraseña@tudatabase.mongodb.net/egresos?retryWrites=true&w=majority')
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Detener el servidor si hay un error de conexión a la base de datos
  });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
