import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EgresosApp = () => {
  const [tabla, setTabla] = useState({
    Lunes: Array(8).fill(''),
    Martes: Array(8).fill(''),
    Miercoles: Array(8).fill(''),
    Jueves: Array(8).fill(''),
    Viernes: Array(8).fill(''),
  });
  const [diaActual, setDiaActual] = useState('');
  const [horaHabilitada, setHoraHabilitada] = useState(false);
  const [turnoGuardado, setTurnoGuardado] = useState(false);
  const [error, setError] = useState(null);
  const [horaActual, setHoraActual] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const backendUrl = 'https://egreso-backend.onrender.com';

  // Obtener la hora actual de Argentina desde timezonedb
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
        console.log('la hora actual es:' , hora);
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
      const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
      const dia = diasSemana[horaActual.getDay() - 1];
      setDiaActual(dia);
      const hora_ = horaActual.getHours();
      const minutos = horaActual.getMinutes();
      console.log('dias semana es:' , diasSemana);
      console.log('dia es:' , dia);
      if ((hora_ > 11 || (hora_ === 11 && minutos >= 30)) && (hora_ < 20 || (hora_ === 20 && minutos <= 30))) {
        setHoraHabilitada(true);
      } else {
        setHoraHabilitada(false);
      }
    }
  }, [horaActual]);

  // useEffect(() => {
  //   axios.get(`${backendUrl}/api/turnos`)
  //     .then((response) => {
  //       const turnos = response.data;
  //       const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

  //       const turnosDisponibles = {};
  //       let turnosValidados = true;

  //       diasSemana.forEach((dia) => {
  //         if (turnos[dia]) {
  //           turnosDisponibles[dia] = turnos[dia];
  //         } else {
  //           turnosValidados = false;
  //           console.log(`Faltan datos para el día: ${dia}`);
  //         }
  //       });

  //       if (turnosValidados) {
  //         setTabla(turnosDisponibles);
  //       } else {
  //         setError('No se encontraron turnos completos en la base de datos.');
  //       }
  //     })
  //     .catch(() => {
  //       setError('Error al obtener los turnos.');
  //     });
  // }, [backendUrl]);
  useEffect(() => {
    console.log('Consultando los turnos desde el frontend...');  // Log inicial cuando se hace la solicitud
  
    axios.get(`${backendUrl}/api/turnos`)
      .then((response) => {
        const turnos = response.data;
        const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  
        console.log('Datos obtenidos desde el backend:', turnos); // Verificar los datos obtenidos desde el backend
  
        const turnosDisponibles = {};
        let turnosValidados = true;
  
        diasSemana.forEach((dia) => {
          if (turnos[dia]) {
            turnosDisponibles[dia] = turnos[dia];
            console.log(`Turnos para el día ${dia}:`, turnos[dia]); // Verificar los turnos para cada día
          } else {
            turnosValidados = false;
            console.log(`Faltan datos para el día: ${dia}`);  // Si faltan turnos para algún día, logueamos este mensaje
          }
        });
  
        if (turnosValidados) {
          console.log('Todos los turnos están completos, actualizando la tabla.');  // Log cuando todos los turnos son válidos
          setTabla(turnosDisponibles);
        } else {
          console.log('No todos los turnos están completos.');  // Log si hay datos faltantes
          setError('No se encontraron turnos completos en la base de datos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener los turnos:', error);  // Log de error en caso de que falle la solicitud
        setError('Error al obtener los turnos.');
      });
  }, [backendUrl]);

  // Obtener nombre de usuario desde la colección de usuarios
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
  }, []);

  const manejarSeleccion = (filaIndex, hora) => {
    if (!horaHabilitada || turnoGuardado) {
      alert('No puedes anotarte ahora o ya estás registrado.');
      return;
    }
    setFilaSeleccionada(filaIndex);
    setHoraSeleccionada(hora);
  };

  const confirmarTurno = async () => {
    console.log('Fila seleccionada:', filaSeleccionada);
    console.log('Hora seleccionada:', horaSeleccionada);
    console.log('Usuario:', usuario);

    if (filaSeleccionada === null || filaSeleccionada === undefined || !horaSeleccionada || !usuario) {
      alert('Selecciona una hora antes de confirmar.');
      return;
    }
  
    // Verificar si el usuario ya está registrado en alguna posición del día actual
    const turnoExistente = tabla[diaActual].some(turno => turno.includes(usuario));
    if (turnoExistente) {
      alert('Ya tienes un turno registrado para este día.');
      return;
    }
  
    const nuevaTabla = { ...tabla };
    if (nuevaTabla[diaActual][filaSeleccionada] === '') {
      nuevaTabla[diaActual][filaSeleccionada] = `${usuario} ${horaSeleccionada}`;
      setTabla(nuevaTabla);
      setTurnoGuardado(true);
  
      // Guardar en localStorage
      localStorage.setItem('turno', JSON.stringify({ nombre: `${usuario} ${horaSeleccionada}`, dia: diaActual }));
  
      try {
        await axios.post(`${backendUrl}/api/turnos`, { filaIndex: filaSeleccionada, dia: diaActual, nombre: `${usuario} ${horaSeleccionada}` });
        alert('Turno guardado correctamente');
      } catch (error) {
        console.error('Error al guardar el turno:', error);
        alert('Ocurrió un error al guardar el turno');
      }
    } else {
      alert('Este turno ya está ocupado. Por favor, selecciona otro.');
    }
  };
  
  // useEffect(() => {
  //   const turnoGuardadoEnLocalStorage = JSON.parse(localStorage.getItem('turno'));
  //   const legajo = localStorage.getItem('legajo');
  
  //   if (turnoGuardadoEnLocalStorage && legajo) {
  //     console.log("el dia actual es:", diaActual);
  //     axios.get(`${backendUrl}/api/turnos/${diaActual}`)
  //       .then((response) => {
  //         const turnosDelDia = response.data;
          
  //         // Verificar si el usuario sigue en la base de datos
  //         const turnoExiste = turnosDelDia.some(turno => turno.includes(usuario));
  
  //         if (!turnoExiste) {
  //           localStorage.removeItem('turno'); // Eliminar turno si ya no existe en la base de datos
  //           setTurnoGuardado(false);
  //         }
  //       })
  //       .catch(() => {
  //         setError('Error al verificar el turno en la base de datos.');
  //       });
  //   }
  // }, [diaActual, usuario]);
  // useEffect(() => {
  //   const turnoGuardadoEnLocalStorage = JSON.parse(localStorage.getItem('turno'));
  //   const legajo = localStorage.getItem('legajo');
  
  //   if (turnoGuardadoEnLocalStorage && legajo) {
  //     console.log("el dia actual es:", diaActual);
  //     axios.get(`${backendUrl}/api/turnos/${diaActual}`)
  //       .then((response) => {
  //         const turnosDelDia = response.data[diaActual]; // Accedemos al array de turnos del día actual
  
  //         if (turnosDelDia) {
  //           // Verificar si el usuario sigue en la base de datos
  //           console.log("turnos del dia:", turnosDelDia);
  //           const turnoExiste = turnosDelDia.some(turno => turno.includes(usuario));
  
  //           if (!turnoExiste) {
  //             localStorage.removeItem('turno'); // Eliminar turno si ya no existe en la base de datos
  //             setTurnoGuardado(false);
  //           }
  //         } else {
  //           console.error('No se encontraron turnos para el día actual');
  //           setError('Error al verificar el turno en la base de datos.');
  //         }
  //       })
  //       .catch(() => {
  //         setError('Error al verificar el turno en la base de datos.');
  //       });
  //   }
  // }, [diaActual, usuario]);
  useEffect(() => {
    const turnoGuardadoEnLocalStorage = JSON.parse(localStorage.getItem('turno'));
    const legajo = localStorage.getItem('legajo');
  
    if (turnoGuardadoEnLocalStorage && legajo) {
      console.log("el dia actual es:", diaActual);
      axios.get(`${backendUrl}/api/turnos/${diaActual}`)
        .then((response) => {
          const turnosDelDia = response.data[diaActual]; // Accedemos al array de turnos del día actual
          console.log("Respuesta de turnos:", response.data);
          console.log("Turnos del día actual:", turnosDelDia);
          console.log("Valor de usuario:", usuario);
  
          if (turnosDelDia) {
            // Verificar si el usuario sigue en la base de datos
            const turnoExiste = turnosDelDia.some(turno => turno.includes(usuario));
            console.log("¿Turno existe? ", turnoExiste);
            if (!turnoExiste) {
              localStorage.removeItem('turno'); // Eliminar turno si ya no existe en la base de datos
              setTurnoGuardado(false);
            }
          } else {
            console.error('No se encontraron turnos para el día actual');
            setError('Error al verificar el turno en la base de datos.');
          }
        })
        .catch((error) => {
          console.error('Error al verificar el turno en la base de datos:', error);
          setError('Error al verificar el turno en la base de datos.');
        });
    }
  }, [diaActual, usuario]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Turnos para irse temprano</h1>
      {usuario && <h2>¡Hola, {usuario}!</h2>} {/* Mensaje de bienvenida con el nombre del usuario */}
      <h2>Día actual: {diaActual || 'No disponible'}</h2>
      {!horaHabilitada && <p>La edición se habilita entre las 11:30 y las 20:30.</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miercoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, filaIndex) => (
            <tr key={filaIndex}>
              {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].map((dia) => (
                <td key={dia} style={{
                  backgroundColor: dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada ? 'lightgreen' : 'lightgrey',
                  pointerEvents: dia === diaActual && horaHabilitada ? 'auto' : 'none',
                }}>
                  {tabla[dia][filaIndex]} 
                  {dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada && (
                    <select onChange={(e) => manejarSeleccion(filaIndex, e.target.value)}>
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
      <button onClick={confirmarTurno}>Confirmar</button>
    </div>
  );
};

export default EgresosApp;

