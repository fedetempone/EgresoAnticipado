import { useState, useEffect } from 'react';
import axios from 'axios';

const UserService = (backendUrl) => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const legajo = localStorage.getItem('legajo');
    if (legajo) {
      axios.get(`${backendUrl}/api/auth/usuarios/${legajo}`)
        .then((response) => {
          if (response.data && response.data.nombre) {
            setUsuario(response.data.nombre);
          } else {
            setError('No se encontró el usuario.');
          }
        })
        .catch(() => {
          setError('Error al obtener el usuario.');
        });
    }
  }, [backendUrl]);

  return { usuario, error };
};

export default UserService;
