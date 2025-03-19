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

    try {
      const userResponse = await axios.get(
        `https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`
      );

      if (!userResponse.data) {
        setMensaje('El legajo ingresado no existe');
        setIsLoading(false);
        return;
      }

      const usuario = userResponse.data;

      if (usuario.contraseña === null) {
        setMensaje('Usuario no registrado. Redirigiendo a registro...');
        setIsLoading(false);
        setTimeout(() => navigate('/registro'), 1500);
        return;
      }

      if (usuario.contraseña !== contraseña) {
        setMensaje('Contraseña incorrecta');
        setIsLoading(false);
        return;
      }

      // Almacenar el token en localStorage y continuar al dashboard de turnos
      localStorage.setItem('authToken', usuario.token);
      localStorage.setItem('legajo', legajo);
      localStorage.setItem('usuario', usuario.nombre);

      setMensaje('Login exitoso. Aguarde y podrá agendar su turno...');
      setTimeout(() => {
        navigate('/turnos');
      }, 2000);
    } catch (error) {
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
