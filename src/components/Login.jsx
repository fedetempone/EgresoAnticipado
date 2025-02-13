import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [legajo, setLegajo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://egreso-backend.onrender.com/api/auth/login', {
        legajo,
        contraseña,
      });

      const data = response.data;

      if (data.message === 'Legajo no encontrado') {
        setMensaje('El legajo ingresado no existe');
        return;
      }

      if (data.message === 'Contraseña incorrecta') {
        setMensaje('La contraseña es incorrecta');
        return;
      }

      if (data.message === 'Legajo sin contraseña') {
        setMensaje('El legajo no está registrado. Por favor, regístrese.');
        navigate('/registro'); // Redirige al formulario de registro
        return;
      }

      // Si el login es exitoso
      
      localStorage.setItem('authToken', data.token);
      setMensaje('Login exitoso. Aguarde y podra agendar su turno...');
      setTimeout(() => {
        navigate('/turnos');
      }, 2000);
    } catch (error) {
      setMensaje('El usuario  y la contraseña no coinciden');
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
        <button type="submit">Iniciar sesión</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default Login;
