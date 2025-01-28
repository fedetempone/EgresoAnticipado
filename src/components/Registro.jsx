// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Registro = () => {
//   const [legajo, setLegajo] = useState('');
//   const [email, setEmail] = useState('');
//   const [contraseña, setContraseña] = useState('');
//   const [mensaje, setMensaje] = useState('');
//   const [usuarioValido, setUsuarioValido] = useState(false); // Estado para controlar si el legajo es válido
//   const navigate = useNavigate();

//   // Función para manejar el registro
//   const handleRegistro = async (e) => {
//     e.preventDefault();

//     try {
//       // Si el legajo es válido, el usuario debe registrarse o actualizar los datos
//       if (usuarioValido) {
//         if (email === '' || contraseña === '') {
//           setMensaje('Por favor, complete los campos de email y contraseña.');
//           return;
//         }

//         // Si el email y la contraseña son nulos, los actualizamos
//         const respuestaRegistro = await axios.put('https://egreso-backend.onrender.com/api/auth/registro', {
//           legajo,
//           email,
//           contraseña,
//         });

//         setMensaje('Usuario registrado exitosamente');
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         setMensaje('El legajo no es válido');
//       }
//     } catch (error) {
//       setMensaje('Error al registrar el usuario');
//       console.error('Error al registrar el usuario:', error.response?.data || error.message);
//     }
//   };

//   // Función para validar el legajo
//   const validarLegajo = async () => {
//     try {
//       const respuesta = await axios.get(`https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`);
//       if (respuesta.data) {
//         // Si el legajo es válido, habilitar los campos de email y contraseña
//         setUsuarioValido(true);
//         setMensaje('Legajo válido, por favor complete los datos');
//       }
//     } catch (error) {
//       setMensaje('Legajo no encontrado');
//       console.error('Error al validar el legajo:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Registro</h1>
//       {mensaje && <p>{mensaje}</p>}

//       <form onSubmit={handleRegistro}>
//         {/* Campo para el legajo */}
//         <div>
//           <label htmlFor="legajo">Legajo:</label>
//           <input
//             type="text"
//             id="legajo"
//             value={legajo}
//             onChange={(e) => setLegajo(e.target.value)}
//             required
//           />
//         </div>

//         {/* Botón para validar el legajo */}
//         <div>
//           <button type="button" onClick={validarLegajo}>
//             Validar Legajo
//           </button>
//         </div>

//         {/* Si el legajo es válido, mostrar los campos de email y contraseña */}
//         {usuarioValido && (
//           <>
//             <div>
//               <label htmlFor="email">Email:</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="contraseña">Contraseña:</label>
//               <input
//                 type="password"
//                 id="contraseña"
//                 value={contraseña}
//                 onChange={(e) => setContraseña(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <button type="submit">Registrar</button>
//             </div>
//           </>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Registro;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [legajo, setLegajo] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuarioNuevo, setUsuarioNuevo] = useState(false);
  const navigate = useNavigate();

  // Función para validar el legajo y determinar el estado del usuario
  const validarLegajo = async () => {
    try {
      // Obtener todos los usuarios de la base de datos
      const { data: usuarios } = await axios.get(
        'https://egreso-backend.onrender.com/api/auth/usuarios'
      );

      // Buscar el usuario con el legajo ingresado
      const usuario = usuarios.find((user) => user.legajo === legajo);

      if (usuario) {
        if (usuario.contraseña || usuario.email) {
          // Si el usuario tiene contraseña o email, redirigir a login
          setMensaje('El usuario ya está registrado. Redirigiendo a login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          // Si el usuario no tiene contraseña ni email, es un nuevo usuario
          setUsuarioNuevo(true);
          setMensaje('Legajo válido. Por favor, complete los datos.');
        }
      } else {
        setMensaje('Legajo no encontrado.');
      }
    } catch (error) {
      setMensaje('Error al validar el legajo.');
      console.error('Error al validar el legajo:', error);
    }
  };

  // Función para manejar el registro
  const handleRegistro = async (e) => {
    e.preventDefault();

    if (!usuarioNuevo) {
      setMensaje('Primero debe validar el legajo.');
      return;
    }

    if (!email || !contraseña || !confirmarContraseña) {
      setMensaje('Por favor, complete todos los campos.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.put(`https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`, {
        email,
        contraseña,
      });

      setMensaje('Usuario registrado exitosamente. Redirigiendo a login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMensaje('Error al registrar el usuario.');
      console.error('Error al registrar el usuario:', error);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      {mensaje && <p>{mensaje}</p>}

      <form onSubmit={handleRegistro}>
        {/* Campo para el legajo */}
        <div>
          <label htmlFor="legajo">Legajo:</label>
          <input
            type="text"
            id="legajo"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
            required
          />
        </div>

        {/* Botón para validar el legajo */}
        <div>
          <button type="button" onClick={validarLegajo}>
            Validar Legajo
          </button>
        </div>

        {/* Campos para email y contraseña */}
        {usuarioNuevo && (
          <>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="contraseña">Contraseña:</label>
              <input
                type="password"
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmarContraseña">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmarContraseña"
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
                required
              />
            </div>

            <button type="submit">Registrar</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Registro;

