//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('https://egreso-backend.onrender.com/api/auth/login', {
//         legajo,
//         contraseña,
//       });
  
//       const data = response.data;
  
//       if (data.message === 'Legajo no encontrado') {
//         setMensaje('El legajo ingresado no existe');
//         return;
//       }
  
//       if (data.message === 'Contraseña incorrecta') {
//         setMensaje('La contraseña es incorrecta');
//         return;
//       }
  
//       if (data.message === 'Legajo sin contraseña') {
//         setMensaje('El legajo no está registrado. Por favor, regístrese.');
//         navigate('/registro'); // Redirige al formulario de registro
//         return;
//       }
  
//       // Si el login es exitoso
//       if (data.token) {
//         localStorage.setItem('authToken', data.token);
//         localStorage.setItem('legajo', legajo); // Guarda el legajo en localStorage
  
//         // Aquí agregamos el nombre del usuario en el localStorage
//         localStorage.setItem('usuario', data.nombre); // Guarda el nombre o algún identificador del usuario
  
//         // Verificar si ya tiene un turno agendado
//         const turnoAgendado = localStorage.getItem('turnoAgendado');
        
//         if (turnoAgendado === 'true') {
//           setMensaje('Ya tienes un turno agendado.');
//           setTimeout(() => {
//             navigate('/turnos');
//           }, 2000);
//         } else {
//           setMensaje('Login exitoso. Aguarde y podrá agendar su turno...');
//           setTimeout(() => {
//             console.log('Redirigiendo a /turnos...');
//             console.log('Token actual:', localStorage.getItem('authToken'));
//             console.log('Usuario actual:', localStorage.getItem('usuario'));
//             navigate('/turnos');
//           }, 2000);
//         }
//       }
//     } catch (error) {
//       setMensaje('El usuario y la contraseña no coinciden');
//       console.error('Error al hacer login', error);
//     }
//   };
  
//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Legajo"
//           value={legajo}
//           onChange={(e) => setLegajo(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Contraseña"
//           value={contraseña}
//           onChange={(e) => setContraseña(e.target.value)}
//           required
//         />
//         <button type="submit">Iniciar sesión</button>
//       </form>
//       {mensaje && <p>{mensaje}</p>}
//     </div>
//   );
// };

// export default Login;

// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [legajo, setLegajo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje('');  // Limpiar cualquier mensaje anterior

    try {
      const response = await axios.post('https://egreso-backend.onrender.com/api/auth/login', {
        legajo,
        contraseña,
      });

      const data = response.data;

      // Validación de respuestas
      if (data.message === 'Legajo no encontrado') {
        setMensaje('El legajo ingresado no existe');
        setIsLoading(false);
        return;
      }

      if (data.message === 'Contraseña incorrecta') {
        setMensaje('La contraseña es incorrecta');
        setIsLoading(false);
        return;
      }

      if (data.message === 'Legajo sin contraseña') {
        setMensaje('El legajo no está registrado. Por favor, regístrese.');
        setIsLoading(false);
        navigate('/registro');
        return;
      }

      if (data.token) {
        // Si el login es exitoso, guardamos el token y la info del usuario
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('legajo', legajo);

        const userResponse = await axios.get(`https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        const userData = userResponse.data;
        console.log("Datos del usuario:", userData);

        localStorage.setItem('usuario', userData.nombre);
        // Actualizar el estado en el componente App para indicar que está autenticado
        setIsAuthenticated(true);
        // Redirigimos al usuario a la sección de turnos
        navigate('/turnos');
      }
    } catch (error) {
      setMensaje('Error al iniciar sesión. Verifique sus datos.');
      setIsLoading(false);
      console.error('Error al hacer login', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Legajo"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default Login;
