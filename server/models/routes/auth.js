// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta al modelo sea correcta

// const router = express.Router();

// // Registro de Usuario (actualización de email o contraseña si son nulos)
// router.put('/registro', async (req, res) => {
//   const { legajo, email, contraseña } = req.body;

//   try {
//     const usuarioExistente = await Usuario.findOne({ legajo });

//     if (!usuarioExistente) {
//       return res.status(400).json({ message: 'El legajo no está registrado' });
//     }

//     // Si el usuario ya tiene email y contraseña, no lo actualizamos
//     if (usuarioExistente.email && usuarioExistente.contraseña) {
//       return res.status(400).json({ message: 'El usuario ya tiene email y contraseña registrados' });
//     }

//     // Si el email es null, lo actualizamos
//     if (!usuarioExistente.email && email) {
//       usuarioExistente.email = email;
//     }

//     // Si la contraseña es null, la actualizamos
//     if (!usuarioExistente.contraseña && contraseña) {
//       const hashedPassword = await bcrypt.hash(contraseña, 10);
//       usuarioExistente.contraseña = hashedPassword;
//     }

//     await usuarioExistente.save();
//     res.status(200).json({ message: 'Usuario actualizado correctamente' });

//   } catch (error) {
//     console.error('Error al registrar el usuario:', error);
//     res.status(500).json({ message: 'Error al registrar el usuario' });
//   }
// });

// // Login de Usuario
// router.post('/login', async (req, res) => {
//   const { legajo, contraseña } = req.body;

//   try {
//     const usuario = await Usuario.findOne({ legajo });
//     if (!usuario) {
//       return res.status(400).json({ message: 'Usuario no encontrado' });
//     }

//     const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
//     if (!esValida) {
//       return res.status(400).json({ message: 'Contraseña incorrecta' });
//     }

//     // Generar token JWT
//     const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login exitoso', token });
//   } catch (error) {
//     console.error('Error al iniciar sesión:', error);
//     res.status(500).json({ message: 'Error al iniciar sesión' });
//   }
// });

// // Ruta GET para obtener todos los usuarios
// router.get('/usuarios', async (req, res) => {
//   try {
//     const usuarios = await Usuario.find(); // Obtiene todos los usuarios
//     res.status(200).json(usuarios); // Responde con la lista de usuarios
//   } catch (error) {
//     console.error('Error al obtener los usuarios:', error);
//     res.status(500).json({ message: 'Error al obtener los usuarios' });
//   }
// });

// // Ruta GET para obtener un usuario específico por legajo
// router.get('/usuarios/:legajo', async (req, res) => {
//   const { legajo } = req.params; // Obtener el legajo desde los parámetros de la URL

//   try {
//     const usuario = await Usuario.findOne({ legajo }); // Buscar por legajo
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }
//     res.status(200).json(usuario); // Responder con el usuario encontrado
//   } catch (error) {
//     console.error('Error al obtener el usuario:', error);
//     res.status(500).json({ message: 'Error al obtener el usuario' });
//   }
// });

// module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../Usuario');
const router = express.Router();

// Validación del legajo para ver si el usuario puede actualizar su información
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

// Actualización de email y contraseña de un usuario por su legajo
router.put('/usuarios/:legajo', async (req, res) => {
  console.log('Solicitud recibida en /usuarios/:legajo');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  const { legajo } = req.params;
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ legajo });

    if (!usuario) {
      return res.status(404).json({ message: 'El legajo no está registrado' });
    }

    // Si el usuario ya tiene email y contraseña registrados, no permitimos la actualización
    if (usuario.email && usuario.contraseña) {
      return res.status(400).json({ message: 'El usuario ya tiene email y contraseña registrados' });
    }

    // Validar que se proporcionen ambos valores (email y contraseña)
    if (!email || !contraseña) {
      return res.status(400).json({ message: 'Se deben proporcionar email y contraseña' });
    }

    // Actualizar el email
    usuario.email = email;

    // Hashear y actualizar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    usuario.contraseña = hashedPassword;

    // Guardar los cambios en la base de datos
    await usuario.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

// Exportar el router
module.exports = router;
