// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // Importa CORS
// const Turno = require('./models/Turno'); // Asegúrate de que el modelo está correctamente importado

// const app = express();
// const port = 5000;

// // Configura CORS para permitir solicitudes desde el frontend (puerto 3000)
// app.use(cors());

// // Middleware para manejar las solicitudes JSON
// app.use(express.json());

// // Ruta para obtener los turnos (GET)
// app.get('/api/turnos', async (req, res) => {
//   try {
//     const turnos = await Turno.find(); // Obtener los turnos de la base de datos
//     res.json(turnos);
//   } catch (error) {
//     res.status(500).send('Error al obtener los turnos');
//   }
// });

// // Ruta para guardar el turno (POST)
// app.post('/api/turnos', async (req, res) => {
//   const { filaIndex, dia, nombre } = req.body;

//   try {
//     // Busca el documento de turnos
//     let turnos = await Turno.findOne();

//     if (!turnos) {
//       // Si no existe el documento, inicialízalo
//       turnos = new Turno({
//         Lunes: Array(8).fill(''),
//         Martes: Array(8).fill(''),
//         Miércoles: Array(8).fill(''),
//         Jueves: Array(8).fill(''),
//         Viernes: Array(8).fill(''),
//       });
//     }

//     // Actualiza el turno correspondiente
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
//   .connect('mongodb+srv://fedetempo:fede2101@egresos.gmgjv.mongodb.net/?retryWrites=true&w=majority&appName=egresos', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Conectado a la base de datos'))
//   .catch((err) => console.error('Error al conectar a la base de datos', err));

// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Turno = require('./models/Turno');

const app = express();

// Obtén el puerto desde el entorno o usa 5000 para desarrollo local
const port = process.env.PORT || 5000;
const finalPort = port || 10000; 

// Configura CORS (Permitir solo solicitudes de tu frontend)
const allowedOrigins = ['https://egresoanticipado-frontend.onrender.com','http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
}));

// Middleware para manejar las solicitudes JSON
app.use(express.json());

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

// Conectar a la base de datos MongoDB Atlas
mongoose
  .connect('mongodb+srv://fedetempo:fede2101@egresos.gmgjv.mongodb.net/?retryWrites=true&w=majority&appName=egresos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Detener el servidor si hay un error de conexión a la base de datos
  });

// Iniciar el servidor
app.listen(finalPort, () => {
  console.log(`Servidor corriendo en http://localhost:${finalPort}`);
});
