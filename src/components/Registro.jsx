import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Cambiamos useHistory por useNavigate

const Registro = () => {
  const [legajo, setLegajo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate(); // Usamos el hook useNavigate

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post('https://egreso-backend.onrender.com/api/auth/registro', {
        legajo,
        contraseña,
        email,
      });
      setMensaje('Usuario registrado exitosamente');
      setTimeout(() => navigate('/login'), 2000); // Usamos navigate en lugar de history.push
    } catch (error) {
      setMensaje('Error al registrar el usuario');
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegistro}>
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
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default Registro;
