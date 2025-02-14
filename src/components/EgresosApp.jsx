// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EgresosApp = () => {
//   const [tabla, setTabla] = useState({
//     Lunes: Array(8).fill(''),
//     Martes: Array(8).fill(''),
//     Miércoles: Array(8).fill(''),
//     Jueves: Array(8).fill(''),
//     Viernes: Array(8).fill(''),
//   });
//   const [diaActual, setDiaActual] = useState('');
//   const [horaHabilitada, setHoraHabilitada] = useState(false);
//   const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
//   const [horaActual, setHoraActual] = useState(null); // Estado para la hora actual
//   const [error, setError] = useState(null); // Estado para manejar el error de la API

//   // Obtener la URL del backend desde las variables de entorno
//   const backendUrl = 'https://egreso-backend.onrender.com';

  // // Obtener la hora actual de Argentina desde una API externa
  // useEffect(() => {
  //   const obtenerHora = async () => {
  //     try {
  //       const respuesta = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
  //         params: {
  //           key: 'CW4R7HZTRQJK', // Clave de la API
  //           format: 'json',
  //           by: 'zone',
  //           zone: 'America/Argentina/Buenos_Aires',
  //         }
  //       });
  //       const hora = new Date(respuesta.data.formatted);
  //       setHoraActual(hora);
  //     } catch (error) {
  //       setError('No se pudo obtener la hora de Argentina. Intenta más tarde.');
  //       console.error('Error al obtener la hora:', error);
  //     }
  //   };

  //   obtenerHora();
  // }, []);

//   useEffect(() => {
//     if (horaActual) {
//       const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
//       const dia = diasSemana[horaActual.getDay() - 1]; // getDay() devuelve 0 para domingo
//       setDiaActual(dia);

//       const horaActual_ = horaActual.getHours();
//       const minutosActuales = horaActual.getMinutes();

//       // Habilitar edición solo entre las 11:30 a 20:30hs
//       if ((horaActual_ > 11 || (horaActual_ === 11 && minutosActuales >= 30)) && 
//           (horaActual_ < 20 || (horaActual_ === 20 && minutosActuales <= 30))) {
//         setHoraHabilitada(true);
//       } else {
//         setHoraHabilitada(false);
//       }
//     }
//   }, [horaActual]);

//   // Obtener la tabla desde el servidor
//   useEffect(() => {
//     axios
//       .get(`${backendUrl}/api/turnos`)
//       .then((response) => {
//         if (response.data && Array.isArray(response.data) && response.data.length > 0) {
//           const turnos = response.data[0]; // Suponiendo que solo hay un documento de turnos
//           const turnosConCeldas = {
//             Lunes: turnos.Lunes || Array(8).fill(''),
//             Martes: turnos.Martes || Array(8).fill(''),
//             Miércoles: turnos.Miércoles || Array(8).fill(''),
//             Jueves: turnos.Jueves || Array(8).fill(''),
//             Viernes: turnos.Viernes || Array(8).fill(''),
//           };
//           setTabla(turnosConCeldas);
//         } else {
//           setTabla({
//             Lunes: Array(8).fill(''),
//             Martes: Array(8).fill(''),
//             Miércoles: Array(8).fill(''),
//             Jueves: Array(8).fill(''),
//             Viernes: Array(8).fill(''),
//           });
//         }
//       })
//       .catch((error) => {
//         console.error('Error al obtener los turnos:', error);
//         setTabla({
//           Lunes: Array(8).fill(''),
//           Martes: Array(8).fill(''),
//           Miércoles: Array(8).fill(''),
//           Jueves: Array(8).fill(''),
//           Viernes: Array(8).fill(''),
//         });
//       });
//   }, [backendUrl]);

//   // Función para manejar la anotación del usuario
//   const manejarAnotacion = async (filaIndex, hora) => {
//     if (!horaHabilitada || usuarioRegistrado || !diaActual) {
//       alert('No puedes anotarte ahora o ya estás registrado.');
//       return;
//     }

//     const nombreUsuario = prompt('Ingresa tu nombre:');
//     if (nombreUsuario) {
//       const nuevaTabla = { ...tabla };

//       if (nuevaTabla[diaActual][filaIndex] === '') {
//         // Guardar nombre y hora juntos en la tabla
//         nuevaTabla[diaActual][filaIndex] = `${nombreUsuario} - ${hora}`;
//         setTabla(nuevaTabla);
//         setUsuarioRegistrado(true);

//         // Enviar los datos al servidor para guardarlos
//         try {
//           await axios.post(`${backendUrl}/api/turnos`, {
//             filaIndex: filaIndex,
//             dia: diaActual,
//             nombre: nombreUsuario,
//             hora: hora, // Enviar tanto el nombre como la hora
//           });
//           alert('Turno guardado correctamente');
//         } catch (error) {
//           console.error('Error al guardar el turno:', error);
//           alert('Ocurrió un error al guardar el turno');
//         }
//       } else {
//         alert('Este turno ya está ocupado. Por favor, selecciona otro.');
//       }
//     }
//   };

//   const handleSelectChange = (event, filaIndex) => {
//     const horaSeleccionada = event.target.value;
//     manejarAnotacion(filaIndex, horaSeleccionada);
//   };

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>Turnos para irse temprano</h1>
//       <h2>Día actual: {diaActual || 'No disponible'}</h2>
//       {!horaHabilitada && <p>La edición se habilitará entre las 19:03 y las 19:04.</p>}

//       <table border="1">
//         <thead>
//           <tr>
//             <th>Lunes</th>
//             <th>Martes</th>
//             <th>Miércoles</th>
//             <th>Jueves</th>
//             <th>Viernes</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.from({ length: 8 }).map((_, filaIndex) => (
//             <tr key={filaIndex}>
//               {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
//                 <td
//                   key={dia}
//                   onClick={(event) => {
//                     if (event.target.tagName !== 'SELECT') {
//                       manejarAnotacion(filaIndex, ''); // No disparar el prompt si es un select
//                     }
//                   }}
//                   style={{
//                     backgroundColor:
//                       dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada
//                         ? 'lightgreen'
//                         : dia === diaActual
//                         ? 'lightcoral'
//                         : 'lightgrey',
//                     pointerEvents: dia === diaActual && horaHabilitada ? 'auto' : 'none',
//                   }}
//                 >
//                   {tabla[dia][filaIndex].split(' - ')[0]} {/* Mostrar solo el nombre */}
//                   {dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada && (
//                     <select onChange={(e) => handleSelectChange(e, filaIndex)}>
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

//       <p>* Solo puedes anotarte en tu turno correspondiente. Máximo 8 personas por día.</p>
//     </div>
//   );
// };

// export default EgresosApp;

////////////////////////////// DE ACA PA ABAJO FUNCIONA FLAMA SIN VALIDACION DE LEGAJO EN TURNOS \\\\\\\\\\\\\\\\\\\


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
  const [horaActual, setHoraActual] = useState(null);
  const [error, setError] = useState(null);

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
      const dia = diasSemana[horaActual.getDay() - 1];
      setDiaActual(dia);
      const hora_ = horaActual.getHours();
      const minutos = horaActual.getMinutes();
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
  //       console.log("Respuesta de la API:", response);
        
  //       // Verifica si los turnos existen dentro de la respuesta
  //       const turnos = response.data;
  //       if (turnos && turnos.Lunes) {
  //         console.log("Datos de turnos obtenidos:", turnos);
  //         setTabla(turnos); // Asignamos los datos directamente a la tabla
  //       } else {
  //         console.log("No se encontraron turnos en la base de datos.");
  //         setError('No se encontraron turnos en la base de datos.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error al obtener los turnos:', error);
  //       setError('Error al obtener los turnos.');
  //     });
  // }, [backendUrl]);
  
  useEffect(() => {
    axios.get(`${backendUrl}/api/turnos`)
      .then((response) => {
        console.log("Respuesta de la API:", response);
  
        const turnos = response.data;
        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        
        // Verificar si los días existen en la respuesta y recorrerlos
        const turnosDisponibles = {};
        let turnosValidados = true;
  
        // Recorrer todos los días de la semana
        diasSemana.forEach((dia) => {
          if (turnos[dia]) {
            turnosDisponibles[dia] = turnos[dia];
          } else {
            turnosValidados = false;
            console.log(`Faltan datos para el día: ${dia}`);
          }
        });
  
        // Si todos los días tienen datos válidos, actualizamos el estado
        if (turnosValidados) {
          console.log("Turnos validados correctamente:", turnosDisponibles);
          setTabla(turnosDisponibles);  // Asignamos todos los turnos de la semana
        } else {
          console.log("No todos los días tienen turnos.");
          setError('No se encontraron turnos completos en la base de datos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener los turnos:', error);
        setError('Error al obtener los turnos.');
      });
  }, [backendUrl]);
  
  
  

  const manejarAnotacion = async (filaIndex, hora) => {
    if (!horaHabilitada || usuarioRegistrado || !diaActual) {
      alert('No puedes anotarte ahora o ya estás registrado.');
      return;
    }

    const nombreUsuario = prompt('Ingresa tu nombre:');
    if (nombreUsuario) {
      const nuevaTabla = { ...tabla };
      if (nuevaTabla[diaActual][filaIndex] === '') {
        // Concatenar nombre con hora y guardarlo en la base de datos
        nuevaTabla[diaActual][filaIndex] = `${nombreUsuario} ${hora}`;
        setTabla(nuevaTabla);
        setUsuarioRegistrado(true);

        try {
          console.log('Enviando datos:', { filaIndex, dia: diaActual, nombre: `${nombreUsuario} ${hora}` });
          await axios.post(`${backendUrl}/api/turnos`, { filaIndex, dia: diaActual, nombre: `${nombreUsuario} ${hora}` });
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

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Turnos para irse temprano</h1>
      <h2>Día actual: {diaActual || 'No disponible'}</h2>
      {!horaHabilitada && <p>La edición se habilita entre las 11:30 y las 20:30.</p>}
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
                    if (event.target.tagName !== 'SELECT') manejarAnotacion(filaIndex, '');
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
                  {tabla[dia][filaIndex]} {/* Mostrar el nombre y la hora concatenados */}
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

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EgresosApp = () => {
//   const [tabla, setTabla] = useState({
//     Lunes: Array(8).fill(''),
//     Martes: Array(8).fill(''),
//     Miércoles: Array(8).fill(''),
//     Jueves: Array(8).fill(''),
//     Viernes: Array(8).fill(''),
//   });
//   const [diaActual, setDiaActual] = useState('');
//   const [horaHabilitada, setHoraHabilitada] = useState(false);
//   const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
//   const [horaActual, setHoraActual] = useState(null);
//   const [error, setError] = useState(null);
//   const [legajo, setLegajo] = useState('');
//   const [turnoRegistrado, setTurnoRegistrado] = useState(false);

//   const backendUrl = 'https://egreso-backend.onrender.com';

//   // Obtener la hora actual de Argentina desde una API externa
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
//       const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
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

//   // Obtener la tabla de turnos desde el backend
//   // useEffect(() => {
//   //   axios.get(`${backendUrl}/api/turnos`)
//   //     .then((response) => {
//   //       if (response.data.length > 0) {
//   //         setTabla(response.data[0]);
//   //         // Cargar el estado de usuarioRegistrado desde localStorage
//   //         const registrado = localStorage.getItem('usuarioRegistrado');
//   //         if (registrado === 'true') {
//   //           setUsuarioRegistrado(true);
//   //         }
//   //       }
//   //     })
//   //     .catch((error) => console.error('Error al obtener los turnos:', error));
//   // }, [backendUrl]);

//   useEffect(() => {
//     axios.get(`${backendUrl}/api/turnos`)
//       .then((response) => {
//         console.log('Datos de turnos recibidos:', response.data);
  
//         if (Array.isArray(response.data) && response.data.length > 0) {
//           const turnos = response.data[0]; // Si es un array, tomar el primer objeto
  
//           // Validar que tiene los días de la semana
//           const nuevaTabla = {
//             Lunes: turnos.Lunes || Array(8).fill(''),
//             Martes: turnos.Martes || Array(8).fill(''),
//             Miércoles: turnos.Miércoles || Array(8).fill(''),
//             Jueves: turnos.Jueves || Array(8).fill(''),
//             Viernes: turnos.Viernes || Array(8).fill(''),
//           };
  
//           setTabla(nuevaTabla);
//         }
//       })
//       .catch((error) => console.error('Error al obtener los turnos:', error));
//   }, [backendUrl]);

//   // Verificar si el legajo ya tiene un turno registrado
//   const verificarLegajoRegistrado = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/turnos/legajo/${legajo}`);
//       if (response.data && response.data.turnoRegistrado) {
//         setTurnoRegistrado(true);
//         alert('Este legajo ya tiene un turno registrado.');
//       } else {
//         setTurnoRegistrado(false);
//       }
//     } catch (error) {
//       console.error('Error al verificar el legajo:', error);
//       setError('Hubo un error al verificar el legajo.');
//     }
//   };

//   useEffect(() => {
//     if (legajo) {
//       verificarLegajoRegistrado();
//     }
//   }, [legajo]);

//   const manejarAnotacion = async (filaIndex, hora) => {
//     console.log('Manejando anotación...', { filaIndex, hora, diaActual, usuarioRegistrado });
  
//     if (!horaHabilitada || usuarioRegistrado || !diaActual) {
//       console.log('No permitido, hora habilitada:', horaHabilitada, 'Usuario registrado:', usuarioRegistrado, 'Día actual:', diaActual);
//       alert('No puedes anotarte ahora o ya estás registrado.');
//       return;
//     }
  
//     const nombreUsuario = prompt('Ingresa tu nombre:');
//     console.log('Nombre ingresado por usuario:', nombreUsuario);
  
//     if (nombreUsuario) {
//       const nuevaTabla = { ...tabla };
//       if (nuevaTabla[diaActual][filaIndex] === '') {
//         // Verificar si el usuario ya tiene un turno registrado
//         const turnos = await axios.get(`${backendUrl}/api/turnos`);
//         console.log('Turnos obtenidos desde backend:', turnos.data);
  
//         const turnoExistente = Object.values(turnos.data).some(dia =>
//           dia.some(turno => turno.split(' ')[0] === nombreUsuario) // Compara solo el nombre sin la hora
//         );
  
//         if (turnoExistente) {
//           console.log('Turno ya registrado:', turnoExistente);
//           alert('Ya tienes un turno registrado.');
//           return;
//         }
  
//         // Concatenar nombre con hora y guardarlo en la base de datos
//         nuevaTabla[diaActual][filaIndex] = `${nombreUsuario} ${hora}`;
//         setTabla(nuevaTabla);
//         setUsuarioRegistrado(true);
        
//         // Guardar el estado en localStorage
//         localStorage.setItem('usuarioRegistrado', 'true');
  
//         try {
//           console.log('Enviando datos al backend:', { filaIndex, dia: diaActual, nombre: `${nombreUsuario} ${hora}` });
//           await axios.post(`${backendUrl}/api/turnos`, { filaIndex, dia: diaActual, nombre: `${nombreUsuario} ${hora}` });
//           alert('Turno guardado correctamente');
//         } catch (error) {
//           console.error('Error al guardar el turno:', error);
//           alert('Ocurrió un error al guardar el turno');
//         }
//       } else {
//         console.log('Este turno ya está ocupado.');
//         alert('Este turno ya está ocupado. Por favor, selecciona otro.');
//       }
//     }
//   };  

//   const handleSelectChange = (event, filaIndex) => {
//     const horaSeleccionada = event.target.value;
//     manejarAnotacion(filaIndex, horaSeleccionada);
//   };

//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Turnos para irse temprano</h1>
//       <h2>Día actual: {diaActual || 'No disponible'}</h2>
//       {!horaHabilitada && <p>La edición se habilita entre las 11:30 y las 20:30.</p>}  
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Lunes</th>
//             <th>Martes</th>
//             <th>Miércoles</th>
//             <th>Jueves</th>
//             <th>Viernes</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.from({ length: 8 }).map((_, filaIndex) => (
//             <tr key={filaIndex}>
//               {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
//                 <td
//                   key={dia}
//                   onClick={(event) => {
//                     if (event.target.tagName !== 'SELECT') manejarAnotacion(filaIndex, '');
//                   }}
//                   style={{
//                     backgroundColor:
//                       dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada
//                         ? 'lightgreen'
//                         : dia === diaActual
//                           ? 'lightcoral'
//                           : 'lightgrey',
//                     pointerEvents: dia === diaActual && horaHabilitada ? 'auto' : 'none',
//                   }}
//                 >
//                   {tabla[dia][filaIndex]} {/* Mostrar el nombre y la hora concatenados */}
//                   {dia === diaActual && tabla[dia][filaIndex] === '' && horaHabilitada && (
//                     <select onChange={(e) => handleSelectChange(e, filaIndex)}>
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
//       <p>* Solo puedes anotarte en tu turno correspondiente. Máximo 8 personas por día.</p>
//     </div>
//   );  
// };

// export default EgresosApp;


