const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa CORS
const Turno = require('./models/Turno'); // Asegúrate de que el modelo está correctamente importado

const app = express();
const port = 5000;

// Configura CORS para permitir solicitudes desde el frontend (puerto 3000)
app.use(cors());

// Middleware para manejar las solicitudes JSON
app.use(express.json());

// Ruta para obtener los turnos (GET)
app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await Turno.find(); // Obtener los turnos de la base de datos
    res.json(turnos);
  } catch (error) {
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
  .catch((err) => console.error('Error al conectar a la base de datos', err));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
