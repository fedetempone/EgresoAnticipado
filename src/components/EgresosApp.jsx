// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EgresosApp = () => {
//   const [tabla, setTabla] = useState({
//     Lunes: Array(8).fill(''),
//     Martes: Array(8).fill(''),
//     Miercoles: Array(8).fill(''),
//     Jueves: Array(8).fill(''),
//     Viernes: Array(8).fill(''),
//   });
//   const [diaActual, setDiaActual] = useState('');
//   const [horaHabilitada, setHoraHabilitada] = useState(false);
//   const [turnoGuardado, setTurnoGuardado] = useState(false);
//   const [error, setError] = useState(null);
//   const [horaActual, setHoraActual] = useState(null);
//   const [usuario, setUsuario] = useState(null);
//   const [horaSeleccionada, setHoraSeleccionada] = useState(null);
//   const [filaSeleccionada, setFilaSeleccionada] = useState(null);

//   const backendUrl = 'https://egreso-backend.onrender.com';

//   // Obtener la hora actual de Argentina desde timezonedb
//   useEffect(() => {
//     const obtenerHora = async () => {
//       try {
//         const respuesta = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
//           params: {
//             key: 'CW4R7HZTRQJK', // Clave de la API
//             format: 'json',
//             by: 'zone',
//             zone: 'America/Argentina/Buenos_Aires',
//           }
//         });
//         const hora = new Date(respuesta.data.formatted);
//         setHoraActual(hora);
//       } catch (error) {
//         setError('No se pudo obtener la hora de Argentina. Intenta más tarde.');
//         console.error('Error al obtener la hora:', error);
//       }
//     };

//     obtenerHora();
//   }, []);

//   useEffect(() => {
//     if (horaActual) {
//       const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
//       const dia = diasSemana[horaActual.getDay() - 1];
//       setDiaActual(dia);
//       const hora_ = horaActual.getHours();
//       const minutos = horaActual.getMinutes();
//       if ((hora_ > 11 || (hora_ === 11 && minutos >= 30)) && (hora_ < 20 || (hora_ === 20 && minutos <= 30))) {
//         setHoraHabilitada(true);
//       } else {
//         setHoraHabilitada(false);
//       }
//     }
//   }, [horaActual]);

//   useEffect(() => {  
//     axios.get(`${backendUrl}/api/turnos`)
//       .then((response) => {
//         const turnos = response.data;
//         const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']; 
//         const turnosDisponibles = {};
//         let turnosValidados = true;
  
//         diasSemana.forEach((dia) => {
//           if (turnos[dia]) {
//             turnosDisponibles[dia] = turnos[dia];
//           } else {
//             turnosValidados = false;
//           }
//         });
  
//         if (turnosValidados) {    
//           setTabla(turnosDisponibles);
//         } else {
//           setError('No se encontraron turnos completos en la base de datos.');
//         }
//       })
//       .catch((error) => {
//         console.error('Error al obtener los turnos:', error);  // Log de error en caso de que falle la solicitud
//         setError('Error al obtener los turnos.');
//       });
//   }, [backendUrl]);

//   // Obtener nombre de usuario desde la colección de usuarios
//   useEffect(() => {
//     const legajo = localStorage.getItem('legajo');
//     if (legajo) {
//       axios.get(`${backendUrl}/api/auth/usuarios/${legajo}`)
//         .then((response) => {
//           if (response.data && response.data.nombre) {
//             setUsuario(response.data.nombre);
//           } else {
//             setError('No se encontró el usuario.');
//           }
//         })
//         .catch(() => {
//           setError('Error al obtener el usuario.');
//         });
//     }
//   }, []);

//   const manejarSeleccion = (filaIndex, hora) => {
//     if (!horaHabilitada || turnoGuardado) {
//       alert('No puedes anotarte ahora o ya estás registrado.');
//       return;
//     }
//     setFilaSeleccionada(filaIndex);
//     setHoraSeleccionada(hora);
//   };

//   const confirmarTurno = async () => {
//     console.log('el dia acutal es: ',diaActual);
//     if (filaSeleccionada === null || filaSeleccionada === undefined || !horaSeleccionada || !usuario) {
//       alert('Selecciona una hora antes de confirmar.');
//       return;
//     }
  
//     // Verificar si el usuario ya está registrado en alguna posición del día actual
//     const turnoExistente = tabla[diaActual].some(turno => turno.includes(usuario));
//     if (turnoExistente) {
//       alert('Ya tienes un turno registrado para este día.');
//       return;
//     }
  
//     const nuevaTabla = { ...tabla };
//     if (nuevaTabla[diaActual][filaSeleccionada] === '') {
//       nuevaTabla[diaActual][filaSeleccionada] = `${usuario} ${horaSeleccionada}`;
//       setTabla(nuevaTabla);
//       setTurnoGuardado(true);

//        // Obtener la hora de confirmación (hora actual)
//       const horaConfirmacion = new Date().toLocaleString();
  
//       // Guardar en localStorage
//       localStorage.setItem('turno', JSON.stringify({ nombre: `${usuario} ${horaSeleccionada}`, dia: diaActual, horaConfirmacion }));
  
//       try {
//         await axios.post(`${backendUrl}/api/turnos`, { 
//           filaIndex: filaSeleccionada, 
//           dia: diaActual, nombre: `${usuario} ${horaSeleccionada}`,
//           horaConfirmacion: horaConfirmacion,
//         });
//         alert('Turno guardado correctamente');
//       } catch (error) {
//         console.error('Error al guardar el turno:', error);
//         alert('Ocurrió un error al guardar el turno');
//       }
//     } else {
//       alert('Este turno ya está ocupado. Por favor, selecciona otro.');
//     }
//   };
  
//   useEffect(() => {
//     const turnoGuardadoEnLocalStorage = JSON.parse(localStorage.getItem('turno'));
//     const legajo = localStorage.getItem('legajo');
  
//     if (turnoGuardadoEnLocalStorage && legajo) {
//       axios.get(`${backendUrl}/api/turnos/${diaActual}`)
//         .then((response) => {
//           const turnosDelDia = response.data[diaActual]; // Accedemos al array de turnos del día actual
  
//           if (turnosDelDia) {
//             // Verificar si el usuario sigue en la base de datos
//             const turnoExiste = turnosDelDia.some(turno => turno.includes(usuario));
//             if (!turnoExiste) {
//               localStorage.removeItem('turno'); // Eliminar turno si ya no existe en la base de datos
//               setTurnoGuardado(false);
//             }
//           } else {
//             console.error('No se encontraron turnos para el día actual');
//             setError('Error al verificar el turno en la base de datos.');
//           }
//         })
//         .catch((error) => {
//           console.error('Error al verificar el turno en la base de datos:', error);
//           setError('Error al verificar el turno en la base de datos.');
//         });
//     }
//   }, [diaActual, usuario]);

//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Turnos para irse temprano</h1>
//       {usuario && <h2>¡Hola, {usuario}!</h2>} {/* Mensaje de bienvenida con el nombre del usuario */}
//       <h2>Día actual: {diaActual || 'No disponible'}</h2>
//       {!horaHabilitada && <p>La edición se habilita entre las 11:30 y las 20:30.</p>}
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Lunes</th>
//             <th>Martes</th>
//             <th>Miercoles</th>
//             <th>Jueves</th>
//             <th>Viernes</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.from({ length: 8 }).map((_, filaIndex) => (
//             <tr key={filaIndex}>
//               {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].map((dia) => (
//                 <td key={dia} style={{
//                   backgroundColor: dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada ? 'lightgreen' : 'lightgrey',
//                   pointerEvents: dia === diaActual && horaHabilitada ? 'auto' : 'none',
//                 }}>
//                   {tabla[dia][filaIndex]} 
//                   {dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada && (
//                     <select onChange={(e) => manejarSeleccion(filaIndex, e.target.value)}>
//                       <option value="">Selecciona una hora</option>
//                       <option value="18:00">18:00</option>
//                       <option value="18:30">18:30</option>
//                       <option value="19:00">19:00</option>
//                       <option value="19:30">19:30</option>
//                       <option value="20:00">20:00</option>
//                     </select>
//                   )}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button onClick={confirmarTurno}>Confirmar</button>
//     </div>
//   );
// };

// export default EgresosApp;

// //ultimo codigo funcionando correctamente ↓↓↓↓

// import React, { useState, useEffect } from 'react';
// import ShiftsTable from './ShiftsTable';
// import ShiftConfirmation from './ShiftConfirmation';
// import CurrentTime from './CurrentTime';
// import ErrorMessage from './ErrorMessage';
// import UserGreeting from './UserGreeting';
// import useServiceTime from './ServiceTime';
// import useServiceShifts from './ServiceShifts';
// import useUserService from './UserService';
// import axios from 'axios';

// const EgresosApp = () => {
//   const backendUrl = 'https://egreso-backend.onrender.com';
//   const { horaActual, horaHabilitada } = useServiceTime();
//   const { tabla, error } = useServiceShifts(backendUrl);
//   const { usuario, error: errorUsuario } = useUserService(backendUrl);

//   const [turnoGuardado, setTurnoGuardado] = useState(false);
//   const [filaSeleccionada, setFilaSeleccionada] = useState(null);
//   const [horaSeleccionada, setHoraSeleccionada] = useState(null);

//   const diaActual = horaActual ? ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'][horaActual.getDay() - 1] : '';

//   // Verificar si el usuario ya tiene un turno asignado en el día actual
//   const verificarTurnoExistente = async () => {
//     if (!usuario || !diaActual) return;

//     try {
//       const respuesta = await axios.get(`${backendUrl}/api/turnos/${diaActual}`);
//       const turnosDelDia = respuesta.data;

//       const turnoExistente = turnosDelDia[diaActual].find(turno => turno.includes(usuario));
      
//       if (turnoExistente) {
//         alert(`Ya tienes un turno asignado: ${turnoExistente}`);
//         setTurnoGuardado(true); // Marcar que ya tiene un turno
//       }
//     } catch (error) {
//       console.error('Error al verificar turno existente:', error);
//       alert('Ocurrió un error al verificar los turnos.');
//     }
//   };

//   // Ejecutar la verificación de turno al cargar el componente o al cambiar el usuario/día
//   useEffect(() => {
//     if (usuario && diaActual) {
//       verificarTurnoExistente();
//     }
//   }, [usuario, diaActual]);

//   const manejarSeleccion = (filaIndex, hora) => {
//     if (!horaHabilitada || turnoGuardado) {
//       alert('No puedes anotarte ahora o ya estás registrado.');
//       return;
//     }
//     setFilaSeleccionada(filaIndex);
//     setHoraSeleccionada(hora);
//   };

//   const confirmarTurno = async () => {
//     if (filaSeleccionada === null || filaSeleccionada === undefined || !horaSeleccionada || !usuario) {
//       alert('Selecciona una hora antes de confirmar.');
//       return;
//     }

//     const nuevaTabla = { ...tabla };
//     if (nuevaTabla[diaActual][filaSeleccionada] === '') {
//       nuevaTabla[diaActual][filaSeleccionada] = `${usuario} ${horaSeleccionada}`;
//       setTurnoGuardado(true);

//       try {
//         await axios.post(`${backendUrl}/api/turnos`, { 
//           filaIndex: filaSeleccionada, 
//           dia: diaActual, 
//           nombre: `${usuario} ${horaSeleccionada}`,
//         });
//         alert('Turno guardado correctamente');
//       } catch (error) {
//         alert('Ocurrió un error al guardar el turno');
//       }
//     } else {
//       alert('Este turno ya está ocupado. Por favor, selecciona otro.');
//     }
//   };

//   if (error || errorUsuario) {
//     return <ErrorMessage error={error || errorUsuario} />;
//   }

//   return (
//     <div>
//       <h1>Turnos para irse temprano</h1>
//       <UserGreeting usuario={usuario} />
//       <CurrentTime diaActual={diaActual} horaHabilitada={horaHabilitada} />
//       <ShiftsTable tabla={tabla} diaActual={diaActual} horaHabilitada={horaHabilitada} manejarSeleccion={manejarSeleccion} />
//       <ShiftConfirmation confirmarTurno={confirmarTurno} />
//     </div>
//   );
// };

// export default EgresosApp;




// POR LAS DUDAS GUARDE ESTO UN TOQUE....

  // const confirmarTurno = async () => {
  //   console.log("Confirmando turno...");
  //   console.log("Fila seleccionada:", filaSeleccionada, "Hora seleccionada:", horaSeleccionada, "Usuario:", usuario);

  //   if (filaSeleccionada === null || filaSeleccionada === undefined || !horaSeleccionada || !usuario) {
  //     alert('Selecciona una hora antes de confirmar.');
  //     return;
  //   }

  //   // Obtener la hora del servidor
  //   const horaDelServidor = await obtenerHoraServidor();
  //   if (!horaDelServidor) {
  //     alert('No se pudo obtener la hora del servidor.');
  //     return;
  //   }
  //   setHoraConfirmacion(horaDelServidor); // Guardamos la hora obtenida del servidor
  //   console.log("Hora confirmada (hora del servidor):", horaDelServidor);

  //   const nuevaTabla = { ...tabla };
  //   console.log("Tabla antes de guardar el turno:", nuevaTabla);

  //   if (nuevaTabla[diaActual][filaSeleccionada] === '') {
  //     nuevaTabla[diaActual][filaSeleccionada] = `${usuario} ${horaSeleccionada}`;
  //     setTurnoGuardado(true);

  //     console.log("Turno confirmado. Enviando al backend...");
  //     try {
  //       // Enviar los datos al backend
  //       const response = await axios.post(`${backendUrl}/api/turnos`, { 
  //         filaIndex: filaSeleccionada, 
  //         dia: diaActual, 
  //         nombre: `${usuario} ${horaSeleccionada}`,
  //         horaConfirmacion, // Hora actual obtenida del servidor
  //       });
  //       console.log("Respuesta del backend:", response);
  //       alert('Turno guardado correctamente');
  //     } catch (error) {
  //       console.error('Error al guardar el turno:', error);
  //       alert('Ocurrió un error al guardar el turno');
  //     }
  //   } else {
  //     alert('Este turno ya está ocupado. Por favor, selecciona otro.');
  //   }
  // };

  // HASTA ACA LLEGA LO QUE GUARDE ↑↑↑↑
  


import React, { useState, useEffect } from 'react';
import ShiftsTable from './ShiftsTable';
import ShiftConfirmation from './ShiftConfirmation';
import CurrentTime from './CurrentTime';
import ErrorMessage from './ErrorMessage';
import UserGreeting from './UserGreeting';
import useServiceTime from './ServiceTime';
import useServiceShifts from './ServiceShifts';
import useUserService from './UserService';
import axios from 'axios';

const EgresosApp = () => {
  const backendUrl = 'https://egreso-backend.onrender.com';
  const { horaActual, horaHabilitada } = useServiceTime();
  const { tabla, error } = useServiceShifts(backendUrl);
  const { usuario, error: errorUsuario } = useUserService(backendUrl);

  const [turnoGuardado, setTurnoGuardado] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horaConfirmacion, setHoraConfirmacion] = useState('');

  const diaActual = horaActual ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][horaActual.getDay() - 1] : '';

  useEffect(() => {
    if (usuario && diaActual) {
      verificarTurnoExistente();
    }
  }, [usuario, diaActual]);
  
  // Verificar si el usuario ya tiene un turno asignado en el día actual
  const verificarTurnoExistente = async () => {
    if (!usuario || !diaActual) return;

    try {
      const respuesta = await axios.get(`${backendUrl}/api/turnos/${diaActual}`);
      const turnosDelDia = respuesta.data;
      console.log("Turnos del día:", turnosDelDia);

      const turnoExistente = turnosDelDia[diaActual]?.find(turno => turno.includes(usuario));
      console.log("Turno existente encontrado:", turnoExistente);
      
      if (turnoExistente) {
        alert(`Ya tienes un turno asignado: ${turnoExistente}`);
        setTurnoGuardado(true); // Marcar que ya tiene un turno
      }
    } catch (error) {
      console.error('Error al verificar turno existente:', error);
      alert('Ocurrió un error al verificar los turnos.');
    }
  };

  // Ejecutar la verificación de turno al cargar el componente o al cambiar el usuario/día
  useEffect(() => {
    console.log("Verificando turno, usuario:", usuario, "día:", diaActual);
    if (usuario && diaActual) {
      verificarTurnoExistente();
    }
  }, [usuario, diaActual]);

  // Función para obtener la hora del servidor
  const obtenerHoraServidor = async () => {
    console.log("Solicitando hora del servidor...");
    try {
      const response = await axios.get(`${backendUrl}/api/hora`);
      console.log("Hora del servidor recibida:", response.data.hora);
      return response.data.hora; // Suponiendo que la respuesta tiene una propiedad `hora`
    } catch (error) {
      console.error('Error al obtener la hora del servidor:', error);
      alert('Error al obtener la hora del servidor');
      return null;
    }
  };

  const manejarSeleccion = (filaIndex, hora) => {
    console.log("Hora seleccionada:", hora);
    if (!horaHabilitada || turnoGuardado) {
      alert('No puedes anotarte ahora o ya estás registrado.');
      return;
    }
    setFilaSeleccionada(filaIndex);
    setHoraSeleccionada(hora);
  };

  const confirmarTurno = async () => {
    if (filaSeleccionada === null || filaSeleccionada === undefined || !horaSeleccionada || !usuario) {
      alert('Selecciona una hora antes de confirmar.');
      return;
    }

    // Obtener la hora del servidor
    const horaDelServidor = await obtenerHoraServidor();
    if (!horaDelServidor) {
      alert('No se pudo obtener la hora del servidor.');
      return;
    }

    setHoraConfirmacion(horaDelServidor); // Guardamos la hora obtenida del servidor
    console.log("Hora confirmada (hora del servidor):", horaDelServidor);

    const nuevaTabla = { ...tabla };
    console.log("Tabla antes de guardar el turno:", nuevaTabla);

    if (nuevaTabla[diaActual][filaSeleccionada] === '') {
      nuevaTabla[diaActual][filaSeleccionada] = `${usuario} ${horaSeleccionada} horadeconfirmacion: ${horaDelServidor}`;
      setTurnoGuardado(true);

      console.log("Turno confirmado. Enviando al backend...");
      try {
        // Enviar los datos al backend
        const response = await axios.post(`${backendUrl}/api/turnos`, { 
          filaIndex: filaSeleccionada, 
          dia: diaActual, 
          nombre: `${usuario} ${horaSeleccionada} horadeconfirmacion: ${horaDelServidor}`,
        });
        console.log("Respuesta del backend:", response);
        alert('Turno guardado correctamente');
      } catch (error) {
        console.error('Error al guardar el turno:', error);
        alert('Ocurrió un error al guardar el turno');
      }
    } else {
      alert('Este turno ya está ocupado. Por favor, selecciona otro.');
    }
  };

  if (error || errorUsuario) {
    console.error("Error en los servicios:", error || errorUsuario);
    return <ErrorMessage error={error || errorUsuario} />;
  }

  return (
    <div>
      <h1>Turnos para irse temprano</h1>
      <UserGreeting usuario={usuario} />
      <CurrentTime diaActual={diaActual} horaHabilitada={horaHabilitada} />
      <ShiftsTable tabla={tabla} diaActual={diaActual} horaHabilitada={horaHabilitada} manejarSeleccion={manejarSeleccion} />
      <ShiftConfirmation confirmarTurno={confirmarTurno} />
    </div>
  );
};

export default EgresosApp;
