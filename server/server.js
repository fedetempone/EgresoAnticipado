// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const Turno = require('./models/Turno');
// const authRoutes = require('./models/routes/auth'); // Importar las rutas de autenticación

// const app = express();

// // Configura CORS
// const allowedOrigins = ['http://localhost:5173', 'https://egreso-backend.onrender.com', 'https://egresoanticipado-frontend.onrender.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('No permitido por CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

// // Middleware para manejar JSON
// app.use(express.json());

// // Usar las rutas de autenticación con prefijo unificado
// app.use('/api/auth', authRoutes);

// // Ruta para obtener los turnos
// app.get('/api/turnos', async (req, res) => {
//   try {
//     const turnos = await Turno.find();
//     if (turnos.length === 0) {
//       res.json({ Lunes: Array(8).fill(''), Martes: Array(8).fill(''), Miercoles: Array(8).fill(''), Jueves: Array(8).fill(''), Viernes: Array(8).fill('') });
//     } else {
//       res.json(turnos[0]);
//     }
//   } catch (error) {
//     console.error('Error al obtener los turnos:', error);
//     res.status(500).send('Error al obtener los turnos');
//   }
// });

// // Ruta para guardar el turno
// app.post('/api/turnos', async (req, res) => {
//   const { filaIndex, dia, nombre } = req.body;
//   console.log('Datos recibidos del frontend:', { filaIndex, dia, nombre });

//   try {
//     let turnos = await Turno.findOne();
//     console.log('Turnos obtenidos de la base de datos:', turnos);

//     if (!turnos) {
//       turnos = new Turno({
//         Lunes: Array(8).fill(''),
//         Martes: Array(8).fill(''),
//         Miercoles: Array(8).fill(''),
//         Jueves: Array(8).fill(''),
//         Viernes: Array(8).fill(''),
//       });
//     }

//     // Verificar si el nombre ya está registrado en el turno para ese día y fila
//     const turnoExistente = turnos[dia].find(turno => turno.includes(nombre));
//     console.log('Turno existente en la base de datos:', turnoExistente);

//     if (turnoExistente) {
//       return res.status(400).json({ message: 'Este usuario ya tiene un turno registrado' });
//     }

//     if (turnos[dia][filaIndex] === '') {
//       turnos[dia][filaIndex] = nombre;
//       await turnos.save();
//       console.log('Turno guardado en la base de datos:', turnos);
//       res.status(200).json({ message: 'Turno guardado con éxito' });
//     } else {
//       console.log('Este turno ya está ocupado.');
//       res.status(400).json({ message: 'Este turno ya está ocupado' });
//     }
//   } catch (error) {
//     console.error('Error al guardar el turno:', error);
//     res.status(500).json({ message: 'Error al guardar el turno' });
//   }
// });

// // Conectar a la base de datos MongoDB Atlas
// mongoose
//   .connect('mongodb+srv://fedetempo:fede2101@egresos.gmgjv.mongodb.net/?retryWrites=true&w=majority&appName=egresos')
//   .then(() => console.log('Conectado a la base de datos'))
//   .catch((err) => {
//     console.error('Error al conectar a la base de datos:', err);
//     process.exit(1);
//   });

// // Iniciar el servidor
// const port = process.env.PORT || 10000;
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// ACA EMPIEZA EL ULTIMO CODIGO FUNCIONAL PONELE... ↓↓↓↓

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const Turno = require('./models/Turno');
// const authRoutes = require('./models/routes/auth'); // Importar las rutas de autenticación

// const app = express();

// // Configura CORS
// const allowedOrigins = ['http://localhost:5173', 'https://egreso-backend.onrender.com', 'https://egresoanticipado-frontend.onrender.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('No permitido por CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

// // Middleware para manejar JSON
// app.use(express.json());

// // Usar las rutas de autenticación con prefijo unificado
// app.use('/api/auth', authRoutes);

// // Ruta para obtener los turnos
// app.get('/api/turnos', async (req, res) => {
//   try {
//     const turnos = await Turno.find();
//     console.log('Turnos obtenidos de la base de datos en /api/turnos:', turnos);  // Agregar log
//     if (turnos.length === 0) {
//       console.log('No se encontraron turnos, devolviendo la estructura vacía');
//       return res.json({ Lunes: Array(8).fill(''), Martes: Array(8).fill(''), Miercoles: Array(8).fill(''), Jueves: Array(8).fill(''), Viernes: Array(8).fill('') });
//     } else {
//       return res.json(turnos[0]);
//     }
//   } catch (error) {
//     console.error('Error al obtener los turnos:', error);
//     res.status(500).send('Error al obtener los turnos');
//   }
// });

// // Ruta para obtener los turnos de un día específico
// app.get('/api/turnos/:dia', async (req, res) => {
//   const dia = req.params.dia; // Obtener el nombre del día desde la URL

//   try {
//     const turnos = await Turno.find();
//     console.log('Turnos obtenidos de la base de datos en /api/turnos/:dia:', turnos);  // Agregar log
//     if (turnos.length === 0) {
//       return res.status(404).json({ message: 'No se encontraron turnos en la base de datos' });
//     }

//     // Verificar si el día existe en la base de datos
//     if (!turnos[0][dia]) {
//       console.log('Día no válido:', dia);
//       return res.status(404).json({ message: 'Día no válido' });
//     }

//     // Devolver los turnos para ese día
//     res.json({ [dia]: turnos[0][dia] });
//   } catch (error) {
//     console.error('Error al obtener los turnos:', error);
//     res.status(500).send('Error al obtener los turnos');
//   }
// });

// // Ruta para guardar el turno
// app.post('/api/turnos', async (req, res) => {
//   const { filaIndex, dia, nombre } = req.body;
//   console.log('Datos recibidos del frontend para guardar turno:', { filaIndex, dia, nombre });  // Agregar log

//   try {
//     let turnos = await Turno.findOne();
//     console.log('Turnos obtenidos de la base de datos para guardado:', turnos);  // Agregar log

//     if (!turnos) {
//       turnos = new Turno({
//         Lunes: Array(8).fill(''),
//         Martes: Array(8).fill(''),
//         Miercoles: Array(8).fill(''),
//         Jueves: Array(8).fill(''),
//         Viernes: Array(8).fill(''),
//       });
//     }

//     // Verificar si el nombre ya está registrado en el turno para ese día y fila
//     const turnoExistente = turnos[dia].find(turno => turno.includes(nombre));

//     if (turnoExistente) {
//       return res.status(400).json({ message: 'Este usuario ya tiene un turno registrado' });
//     }

//     if (turnos[dia][filaIndex] === '') {
//       turnos[dia][filaIndex] = nombre;
//       await turnos.save();
//       res.status(200).json({ message: 'Turno guardado con éxito' });
//     } else {
//       res.status(400).json({ message: 'Este turno ya está ocupado' });
//     }
//   } catch (error) {
//     console.error('Error al guardar el turno:', error);
//     res.status(500).json({ message: 'Error al guardar el turno' });
//   }
// });

// // Conectar a la base de datos MongoDB Atlas
// mongoose
//   .connect('mongodb+srv://fedetempo:fede2101@egresos.gmgjv.mongodb.net/?retryWrites=true&w=majority&appName=egresos')
//   .then(() => console.log('Conectado a la base de datos'))
//   .catch((err) => {
//     console.error('Error al conectar a la base de datos:', err);
//     process.exit(1);
//   });

// // Iniciar el servidor
// const port = process.env.PORT || 10000;
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

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
