import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EgresosApp = () => {
  const [tabla, setTabla] = useState({
    Lunes: Array(8).fill(''),
    Martes: Array(8).fill(''),
    Miércoles: Array(8).fill(''),
    Jueves: Array(8).fill(''),
    Viernes: Array(8).fill(''),
  });
  const [diaActual, setDiaActual] = useState('');
  const [horaHabilitada, setHoraHabilitada] = useState(false);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [horaActual, setHoraActual] = useState(null); // Estado para la hora actual
  const [error, setError] = useState(null); // Estado para manejar el error de la API

  // Obtener la URL del backend desde las variables de entorno
  const backendUrl = 'https://egreso-backend.onrender.com';

  // Obtener la hora actual de Argentina desde una API externa
  useEffect(() => {
    const obtenerHora = async () => {
      try {
        const respuesta = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
          params: {
            key: 'CW4R7HZTRQJK', // Clave de la API
            format: 'json',
            by: 'zone',
            zone: 'America/Argentina/Buenos_Aires',
          }
        });
        const hora = new Date(respuesta.data.formatted);
        setHoraActual(hora);
      } catch (error) {
        setError('No se pudo obtener la hora de Argentina. Intenta más tarde.');
        console.error('Error al obtener la hora:', error);
      }
    };

    obtenerHora();
  }, []);

  useEffect(() => {
    if (horaActual) {
      const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      const dia = diasSemana[horaActual.getDay() - 1]; // getDay() devuelve 0 para domingo
      setDiaActual(dia);

      const horaActual_ = horaActual.getHours();
      const minutosActuales = horaActual.getMinutes();

      // Habilitar edición solo entre las 19:03 y 19:04
      if ((horaActual_ > 11 || (horaActual_ === 11 && minutosActuales >= 30)) && 
          (horaActual_ < 20 || (horaActual_ === 20 && minutosActuales <= 30))) {
        setHoraHabilitada(true);
      } else {
        setHoraHabilitada(false);
      }
    }
  }, [horaActual]);

  // Obtener la tabla desde el servidor
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/turnos`)
      .then((response) => {
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const turnos = response.data[0]; // Suponiendo que solo hay un documento de turnos
          const turnosConCeldas = {
            Lunes: turnos.Lunes || Array(8).fill(''),
            Martes: turnos.Martes || Array(8).fill(''),
            Miércoles: turnos.Miércoles || Array(8).fill(''),
            Jueves: turnos.Jueves || Array(8).fill(''),
            Viernes: turnos.Viernes || Array(8).fill(''),
          };
          setTabla(turnosConCeldas);
        } else {
          setTabla({
            Lunes: Array(8).fill(''),
            Martes: Array(8).fill(''),
            Miércoles: Array(8).fill(''),
            Jueves: Array(8).fill(''),
            Viernes: Array(8).fill(''),
          });
        }
      })
      .catch((error) => {
        console.error('Error al obtener los turnos:', error);
        setTabla({
          Lunes: Array(8).fill(''),
          Martes: Array(8).fill(''),
          Miércoles: Array(8).fill(''),
          Jueves: Array(8).fill(''),
          Viernes: Array(8).fill(''),
        });
      });
  }, [backendUrl]);

  // Función para manejar la anotación del usuario
  const manejarAnotacion = async (filaIndex, hora) => {
    if (!horaHabilitada || usuarioRegistrado || !diaActual) {
      alert('No puedes anotarte ahora o ya estás registrado.');
      return;
    }

    const nombreUsuario = prompt('Ingresa tu nombre:');
    if (nombreUsuario) {
      const nuevaTabla = { ...tabla };

      if (nuevaTabla[diaActual][filaIndex] === '') {
        // Guardar nombre y hora juntos en la tabla
        nuevaTabla[diaActual][filaIndex] = `${nombreUsuario} - ${hora}`;
        setTabla(nuevaTabla);
        setUsuarioRegistrado(true);

        // Enviar los datos al servidor para guardarlos
        try {
          await axios.post(`${backendUrl}/api/turnos`, {
            filaIndex,
            dia: diaActual,
            nombre: nombreUsuario,
            hora: hora, // Enviar tanto el nombre como la hora
          });
          alert('Turno guardado correctamente');
        } catch (error) {
          console.error('Error al guardar el turno:', error);
          alert('Ocurrió un error al guardar el turno');
        }
      } else {
        alert('Este turno ya está ocupado. Por favor, selecciona otro.');
      }
    }
  };

  const handleSelectChange = (event, filaIndex) => {
    const horaSeleccionada = event.target.value;
    manejarAnotacion(filaIndex, horaSeleccionada);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Turnos para irse temprano</h1>
      <h2>Día actual: {diaActual || 'No disponible'}</h2>
      {!horaHabilitada && <p>La edición se habilitará entre las 19:03 y las 19:04.</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, filaIndex) => (
            <tr key={filaIndex}>
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
                <td
                  key={dia}
                  onClick={(event) => {
                    if (event.target.tagName !== 'SELECT') {
                      manejarAnotacion(filaIndex, ''); // No disparar el prompt si es un select
                    }
                  }}
                  style={{
                    backgroundColor:
                      dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada
                        ? 'lightgreen'
                        : dia === diaActual
                        ? 'lightcoral'
                        : 'lightgrey',
                    pointerEvents: dia === diaActual && horaHabilitada ? 'auto' : 'none',
                  }}
                >
                  {tabla[dia][filaIndex].split(' - ')[0]} {/* Mostrar solo el nombre */}
                  {dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada && (
                    <select onChange={(e) => handleSelectChange(e, filaIndex)}>
                      <option value="">Selecciona una hora</option>
                      <option value="18:00">18:00</option>
                      <option value="18:30">18:30</option>
                      <option value="19:00">19:00</option>
                      <option value="19:30">19:30</option>
                      <option value="20:00">20:00</option>
                    </select>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p>* Solo puedes anotarte en tu turno correspondiente. Máximo 8 personas por día.</p>
    </div>
  );
};

export default EgresosApp;
