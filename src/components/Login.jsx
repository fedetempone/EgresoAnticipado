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
      // Primero, verificar si el legajo existe
      const userResponse = await axios.get(`https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`);
      
      // Si el usuario no existe
      if (!userResponse.data) {
        setMensaje('El legajo ingresado no existe');
        setIsLoading(false);
        return;
      }

      const usuario = userResponse.data;

      // Verificar si la contraseña del usuario es null
      if (usuario.contraseña === null) {
        setMensaje('Usuario no registrado. Por favor, regístrese.');
        setIsLoading(false);

        // Mostrar el mensaje durante 1.5 segundos antes de redirigir al registro
        setTimeout(() => {
          navigate('/registro');
        }, 1500);  // Redirige después de 1.5 segundos
        return;
      }

      // Si el legajo tiene contraseña, verificar que la ingresada sea correcta
      if (usuario.contraseña !== contraseña) {
        setMensaje('Contraseña incorrecta');
        setIsLoading(false);
        return;
      }

      // Si todo está correcto, hacer login llamando al backend para obtener el token
      const loginResponse = await axios.post('https://egreso-backend.onrender.com/api/auth/login', {
        legajo,
        contraseña,
      });

      const { token } = loginResponse.data;

      // Guardar el token y los datos del usuario
      localStorage.setItem('authToken', token);
      localStorage.setItem('legajo', legajo);
      localStorage.setItem('usuario', usuario.nombre);

      // Actualizar el estado en el componente App para indicar que está autenticado
      setIsAuthenticated(true);

      // Redirigir al usuario a la sección de turnos
      navigate('/turnos');
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
