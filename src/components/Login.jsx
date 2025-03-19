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
    setMensaje(''); // Limpiar cualquier mensaje anterior

    console.log("Intentando hacer login...");
    console.log("Legajo ingresado:", legajo);
    console.log("Contraseña ingresada:", contraseña);

    try {
      // Verificar si el legajo existe en la base de datos
      const userResponse = await axios.get(
        `https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`
      );

      console.log("Respuesta del backend:", userResponse.data);

      if (!userResponse.data) {
        setMensaje('El legajo ingresado no existe');
        setIsLoading(false);
        return;
      }

      const usuario = userResponse.data;

      // Si la contraseña en la base de datos es null, el usuario aún no se ha registrado completamente
      if (usuario.contraseña === null) {
        setMensaje('Usuario no registrado. Redirigiendo a registro...');
        setIsLoading(false);

        // Redirige al usuario a la página de registro después de 1.5 segundos
        setTimeout(() => {
          navigate('/registro');
        }, 1500);
        return;
      }

      // Verificar si la contraseña ingresada es correcta
      if (usuario.contraseña !== contraseña) {
        setMensaje('Contraseña incorrecta');
        setIsLoading(false);
        return;
      }

      console.log("Token del usuario:", usuario.token);
      // Si el usuario tiene un token, guardar los datos en localStorage y redirigir
      if (usuario.token) {
        localStorage.setItem('authToken', usuario.token);
        localStorage.setItem('legajo', legajo); // Guarda el legajo en localStorage
        localStorage.setItem('usuario', usuario.nombre);
        setMensaje('Login exitoso. Aguarde y podrá agendar su turno...');
        setTimeout(() => {
          navigate('/turnos');
        }, 2000);
      } else {
        // Si no hay token, muestra mensaje de error
        console.log('no hay token bobo');
        setMensaje('Error al iniciar sesión. Verifique sus datos.');
      }
    } catch (error) {
      // Manejar errores de red o problemas con la solicitud
      setMensaje('Error al hacer login. Intente nuevamente.');
      console.error('Error al hacer login', error);
    } finally {
      setIsLoading(false);
    }

    setIsAuthenticated(true); // Si el login es exitoso, marcar como autenticado
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
