const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Turno = require('./models/Turno');
const authRoutes = require('./models/routes/auth');

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

// Función para obtener la hora actual desde TimeZoneDB
const obtenerDiaActual = async () => {
  try {
    const respuesta = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
      params: {
        key: 'CW4R7HZTRQJK',
        format: 'json',
        by: 'zone',
        zone: 'America/Argentina/Buenos_Aires',
      }
    });

    const fecha = new Date(respuesta.data.formatted);
    const diaSemana = fecha.getDay(); // 0 (Domingo) a 6 (Sábado)

    if (diaSemana >= 1 && diaSemana <= 5) {
      const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
      return { dia: dias[diaSemana - 1], hora: fecha.toTimeString().split(' ')[0] };
    } else {
      return { dia: 'Fin de semana', hora: fecha.toTimeString().split(' ')[0] };
    }
  } catch (error) {
    console.error('Error al obtener el día desde la API:', error);
    return { error: 'Error al obtener la hora' };
  }
};

// Nueva ruta para obtener la hora actual
app.get('/api/hora', async (req, res) => {
  const horaServidor = await obtenerDiaActual();
  res.json(horaServidor);
});

// Ruta para obtener los turnos
app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await Turno.find();
    if (turnos.length === 0) {
      return res.json({
        Lunes: Array(8).fill(''),
        Martes: Array(8).fill(''),
        Miercoles: Array(8).fill(''),
        Jueves: Array(8).fill(''),
        Viernes: Array(8).fill(''),
      });
    } else {
      return res.json(turnos[0]);
    }
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).send('Error al obtener los turnos');
  }
});

// Ruta para obtener los turnos de un día específico
app.get('/api/turnos/:dia', async (req, res) => {
  const dia = req.params.dia;
  try {
    const turnos = await Turno.find();
    if (turnos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron turnos en la base de datos' });
    }
    if (!turnos[0][dia]) {
      return res.status(404).json({ message: 'Día no válido' });
    }
    res.json({ [dia]: turnos[0][dia] });
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).send('Error al obtener los turnos');
  }
});

// Ruta para guardar el turno
app.post('/api/turnos', async (req, res) => {
  const { filaIndex, dia, nombre } = req.body;
  try {
    let turnos = await Turno.findOne();
    if (!turnos) {
      turnos = new Turno({
        Lunes: Array(8).fill(''),
        Martes: Array(8).fill(''),
        Miercoles: Array(8).fill(''),
        Jueves: Array(8).fill(''),
        Viernes: Array(8).fill(''),
      });
    }

    const turnoExistente = turnos[dia].some(turno => turno === nombre);
    if (turnoExistente) {
      return res.status(400).json({ message: 'Este usuario ya tiene un turno registrado' });
    }

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

// Conectar a la base de datos MongoDB Atlas
mongoose
  .connect('mongodb+srv://fedetempo:fede2101@egresos.gmgjv.mongodb.net/?retryWrites=true&w=majority&appName=egresos')
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  });

// Iniciar el servidor
const port = 10000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

