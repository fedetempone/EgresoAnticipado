const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Turno = require('./models/Turno');
const authRoutes = require('./models/routes/auth'); // Importar las rutas de autenticación

const app = express();

// Configura CORS
const allowedOrigins = ['http://localhost:5173', 'https://egreso-backend.onrender.com', 'https://egresoanticipado-frontend.onrender.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware para manejar JSON
app.use(express.json());

// Usar las rutas de autenticación con prefijo unificado
app.use('/api/auth', authRoutes);

// Ruta para obtener los turnos
app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await Turno.find();
    if (turnos.length === 0) {
      res.json({ Lunes: Array(8).fill(''), Martes: Array(8).fill(''), Miercoles: Array(8).fill(''), Jueves: Array(8).fill(''), Viernes: Array(8).fill('') });
    } else {
      res.json(turnos[0]);
    }
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).send('Error al obtener los turnos');
  }
});

// Ruta para guardar el turno
app.post('/api/turnos', async (req, res) => {
  const { filaIndex, dia, nombre } = req.body;
  console.log('Datos recibidos del frontend:', { filaIndex, dia, nombre });

  try {
    let turnos = await Turno.findOne();
    console.log('Turnos obtenidos de la base de datos:', turnos);

    if (!turnos) {
      turnos = new Turno({
        Lunes: Array(8).fill(''),
        Martes: Array(8).fill(''),
        Miércoles: Array(8).fill(''),
        Jueves: Array(8).fill(''),
        Viernes: Array(8).fill(''),
      });
    }

    // Verificar si el nombre ya está registrado en el turno para ese día y fila
    const turnoExistente = turnos[dia].find(turno => turno.includes(nombre));
    console.log('Turno existente en la base de datos:', turnoExistente);

    if (turnoExistente) {
      return res.status(400).json({ message: 'Este usuario ya tiene un turno registrado' });
    }

    if (turnos[dia][filaIndex] === '') {
      turnos[dia][filaIndex] = nombre;
      await turnos.save();
      console.log('Turno guardado en la base de datos:', turnos);
      res.status(200).json({ message: 'Turno guardado con éxito' });
    } else {
      console.log('Este turno ya está ocupado.');
      res.status(400).json({ message: 'Este turno ya está ocupado' });
    }
  } catch (error) {
    console.error('Error al guardar el turno:', error);
    res.status(500).json({ message: 'Error al guardar el turno' });
  }
});

// Conectar a la base de datos MongoDB Atlas
mongoose
  .connect('mongodb+srv://fedetempo:fede2101@egresos.gmgjv.mongodb.net/?retryWrites=true&w=majority&appName=egresos')
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  });

// Iniciar el servidor
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
