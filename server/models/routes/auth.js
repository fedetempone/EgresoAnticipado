// const express = require('express');
// const Usuario = require('../Usuario');
// const Turno = require('../Turno');  // Asegúrate de tener un modelo de Turno
// const router = express.Router();

// // Obtener todos los usuarios
// router.get('/usuarios', async (req, res) => {
//   try {
//     const usuarios = await Usuario.find();
//     res.status(200).json(usuarios);
//   } catch (error) {
//     console.error('Error al obtener los usuarios:', error);
//     res.status(500).json({ message: 'Error al obtener los usuarios' });
//   }
// });

// // Validación del legajo para ver si el usuario puede actualizar su información
// router.post('/usuarios/validar-legajo', async (req, res) => {
//   const { legajo } = req.body;
//   try {
//     const usuario = await Usuario.findOne({ legajo });
//     console.log('Usuario encontrado:', usuario);
//     if (!usuario) {
//       return res.status(404).json({ message: 'Legajo no encontrado' });
//     }

//     if (usuario.email && usuario.contraseña) {
//       return res.status(400).json({ message: 'Usuario ya registrado con email y contraseña' });
//     }

//     res.status(200).json({ message: 'Legajo válido para actualizar' });
//   } catch (error) {
//     console.error('Error al validar legajo:', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// });

// // Ruta para login
// router.post('/login', async (req, res) => {
//   const { legajo, contraseña } = req.body;
//   try {
//     const usuario = await Usuario.findOne({ legajo });

//     if (!usuario) {
//       return res.status(404).json({ message: 'Legajo no encontrado' });
//     }

//     // Si el usuario tiene contraseña null, se redirige al formulario de registro
//     if (usuario.contraseña === null) {
//       return res.status(400).json({ message: 'Legajo sin contraseña. Por favor, regístrese.' });
//     }

//     // Verificar la contraseña sin encriptación
//     if (usuario.contraseña !== contraseña) {
//       return res.status(400).json({ message: 'Contraseña incorrecta' });
//     }

//     // Imprimir usuario en consola para verificar si el nombre existe
//     console.log('Usuario encontrado:', usuario);

//     // Si la contraseña es correcta, enviar también el nombre del usuario
//     res.status(200).json({ 
//       message: 'Login exitoso', 
//       token: 'some-jwt-token', 
//       nombre: usuario.nombre // Agregar el nombre a la respuesta
//     });

//   } catch (error) {
//     console.error('Error al hacer login:', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// });


// // Ruta para confirmar el turno
// router.post('/turnos/confirmar', async (req, res) => {
//   const { legajo, dia, horario } = req.body;  // Esperamos el legajo, el día y el horario seleccionados

//   try {
//     // Verificamos si el usuario ya tiene un turno en el día seleccionado
//     const turnoExistente = await Turno.findOne({ dia, 'turnos.nombre': legajo });
    
//     if (turnoExistente) {
//       return res.status(400).json({ message: 'Ya tienes un turno asignado en este día.' });
//     }

//     // Verificamos que el usuario haya seleccionado un horario
//     if (!horario) {
//       return res.status(400).json({ message: 'Por favor, selecciona un horario.' });
//     }

//     // Obtenemos el nombre del usuario a partir del legajo
//     const usuario = await Usuario.findOne({ legajo });

//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }

//     const nombreUsuario = usuario.nombre;

//     // Guardamos el turno en la colección "turnos"
//     const turno = await Turno.findOne({ dia });

//     if (!turno) {
//       // Si no existe el turno para el día, lo creamos
//       const nuevoTurno = new Turno({
//         dia,
//         turnos: Array(8).fill(null)  // Suponiendo que hay 8 espacios disponibles
//       });
//       turno.turnos[horario] = `${nombreUsuario} - ${horario}`;
//       await nuevoTurno.save();
//     } else {
//       // Si ya existe, actualizamos el turno
//       turno.turnos[horario] = `${nombreUsuario} - ${horario}`;
//       await turno.save();
//     }

//     res.status(200).json({ message: 'Turno confirmado correctamente' });
//   } catch (error) {
//     console.error('Error al confirmar el turno:', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// });

// // Obtener usuario por legajo
// router.get('/usuarios/:legajo', async (req, res) => {
//   const { legajo } = req.params;
//   try {
//     const usuario = await Usuario.findOne({ legajo });
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }

//     res.status(200).json(usuario);
//   } catch (error) {
//     console.error('Error al obtener el usuario:', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// });

// // Ruta para actualizar los datos de un usuario
// router.put('/usuarios/:legajo', async (req, res) => {
//   const { legajo } = req.params;  // Legajo del usuario que queremos actualizar
//   const { email, contraseña } = req.body;  // Los nuevos datos

//   try {
//     // Buscamos al usuario por legajo y lo actualizamos
//     const usuario = await Usuario.findOneAndUpdate(
//       { legajo },  // Buscar por legajo
//       { email, contraseña },  // Actualizar estos campos
//       { new: true }  // Retornar el documento actualizado
//     );

//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }
//     res.status(200).json(usuario);  // Devolver el usuario actualizado
//   } catch (error) {
//     console.error('Error al actualizar el usuario:', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// });

// module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../Usuario'); // Asegúrate de que esta ruta sea correcta
const Turno = require('../Turno'); // Asegúrate de que esta ruta sea correcta

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
// Ejemplo de manejo del login en el backend
router.post('/api/auth/login', async (req, res) => {
  const { legajo, contraseña } = req.body;
  
  const usuario = await Usuario.findOne({ legajo });

  if (!usuario) {
    return res.status(400).json({ message: 'Legajo no encontrado' });
  }

  if (usuario.contraseña === null) {
    return res.status(400).json({ message: 'Legajo sin contraseña' });
  }

  // Verifica la contraseña
  if (usuario.contraseña !== contraseña) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  // Generar token y retornar
  const token = generateToken(usuario); // tu lógica para generar el token
  res.json({ token });
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
    // Buscamos al usuario por legajo y lo actualizamos
    const usuario = await Usuario.findOneAndUpdate(
      { legajo },  // Buscar por legajo
      { email, contraseña },  // Actualizar estos campos
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
