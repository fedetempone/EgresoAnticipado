// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const ServiceShifts = (backendUrl, legajo, usuarioNombre) => {
//   const [tabla, setTabla] = useState({
//     Lunes: Array(8).fill(''),
//     Martes: Array(8).fill(''),
//     Miercoles: Array(8).fill(''),
//     Jueves: Array(8).fill(''),
//     Viernes: Array(8).fill(''),
//   });
//   const [error, setError] = useState(null);
//   const [turnoExistente, setTurnoExistente] = useState(null); // Para manejar si el usuario ya tiene un turno
//   const [diaActual, setDiaActual] = useState(null); // Guardar el día actual obtenido de la API
//   const [horaActual, setHoraActual] = useState(null); // Guardar la hora actual obtenida de la API

//   useEffect(() => {
//     // Obtener el día y la hora desde el backend (server.js)
//     const obtenerDiaYHora = async () => {
//       try {
//         const respuesta = await axios.get(`${backendUrl}/api/hora`);
//         const { dia, hora } = respuesta.data;
//         setDiaActual(dia); // Guardar el día actual
//         setHoraActual(hora); // Guardar la hora actual
//         console.log("Día actual:", dia, "Hora actual:", hora); // Verificar los valores
//       } catch (error) {
//         console.error('Error al obtener el día y la hora desde el servidor:', error);
//       }
//     };

//     obtenerDiaYHora();
//   }, [backendUrl]); // Solo se ejecuta una vez cuando el componente se monta

//   useEffect(() => {
//     if (diaActual) {
//       console.log("Día actual calculado en useEffect:", diaActual); // Verificación del día calculado desde la API

//       // Verificar si el usuario ya tiene un turno en el día actual
//       const verificarTurno = async () => {
//         try {
//           const respuesta = await axios.get(`${backendUrl}/api/turnos`);
//           const turnos = respuesta.data;

//           console.log("Turnos del día actual:", turnos); // Verificación de los turnos del día actual

//           // Verificar si el usuario ya tiene un turno en el día actual
//           if (turnos[diaActual]?.includes(usuarioNombre)) {
//             console.log("El usuario ya tiene un turno asignado para hoy.");
//             setTurnoExistente(`Ya tienes un turno asignado para hoy (${diaActual}).`);
//           } else {
//             setTurnoExistente(null); // No tiene un turno asignado en el día actual
//           }
//         } catch (error) {
//           console.error('Error al verificar turno:', error);
//           setError('Error al verificar turno.');
//         }
//       };

//       // Primero verificamos el turno y luego obtenemos la tabla de turnos
//       verificarTurno();

//       axios.get(`${backendUrl}/api/turnos`)
//         .then((response) => {
//           const turnos = response.data;
//           const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
//           const turnosDisponibles = {};
//           let turnosValidados = true;

//           diasSemana.forEach((dia) => {
//             if (turnos[dia]) {
//               turnosDisponibles[dia] = turnos[dia];
//             } else {
//               turnosValidados = false;
//             }
//           });

//           if (turnosValidados) {
//             setTabla(turnosDisponibles);
//           } else {
//             setError('No se encontraron turnos completos en la base de datos.');
//           }
//         })
//         .catch((error) => {
//           console.error('Error al obtener los turnos:', error);
//           setError('Error al obtener los turnos.');
//         });
//     }
//   }, [diaActual, backendUrl, usuarioNombre]);

//   const agregarTurno = async (horaSeleccionada) => {
//     if (turnoExistente) {
//       alert(turnoExistente); // Si ya tiene un turno, no dejar agregar otro
//       return;
//     }

//     try {
//       const respuesta = await axios.get(`${backendUrl}/api/turnos`);
//       const turnos = respuesta.data;
      
//       // Revisar si el turno ya existe antes de agregar
//       if (turnos[diaActual]?.includes(usuarioNombre)) {
//         alert('Ya tienes un turno asignado para este día.');
//         return;
//       }

//       // Aquí agregamos el turno (por ejemplo, a la base de datos)
//       const nuevoTurno = [...turnos[diaActual]]; // Copia de los turnos actuales
//       const indiceLibre = nuevoTurno.findIndex((turno) => turno === ''); // Encuentra la primera posición vacía

//       if (indiceLibre !== -1) {
//         nuevoTurno[indiceLibre] = `${usuarioNombre} ${horaSeleccionada}`;
//         await axios.put(`${backendUrl}/api/turnos`, {
//           [diaActual]: nuevoTurno
//         });
//         console.log('Turno agregado con éxito:', nuevoTurno);
//       } else {
//         alert('No hay espacios disponibles para este día.');
//       }
//     } catch (error) {
//       console.error('Error al agregar el turno:', error);
//       alert('Hubo un error al intentar agregar el turno.');
//     }
//   };

//   return { tabla, error, turnoExistente, agregarTurno, horaActual };
// };

// export default ServiceShifts;
// hasta aca funcionaba piola pero me dejaba agregar mas de un turno.... ↑↑↑↑↑


import { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceShifts = (backendUrl, legajo, usuarioNombre) => {
  const [tabla, setTabla] = useState({
    Lunes: Array(8).fill(''),
    Martes: Array(8).fill(''),
    Miercoles: Array(8).fill(''),
    Jueves: Array(8).fill(''),
    Viernes: Array(8).fill(''),
  });
  const [error, setError] = useState(null);
  const [turnoExistente, setTurnoExistente] = useState(null); // Para manejar si el usuario ya tiene un turno
  const [diaActual, setDiaActual] = useState(null); // Guardar el día actual obtenido de la API
  const [horaActual, setHoraActual] = useState(null); // Guardar la hora actual obtenida de la API

  useEffect(() => {
    // Obtener el día y la hora desde el backend (server.js)
    const obtenerDiaYHora = async () => {
      try {
        const respuesta = await axios.get(`${backendUrl}/api/hora`);
        const { dia, hora } = respuesta.data;
        setDiaActual(dia); // Guardar el día actual
        setHoraActual(hora); // Guardar la hora actual
        console.log("Día actual:", dia, "Hora actual:", hora); // Verificar los valores
      } catch (error) {
        console.error('Error al obtener el día y la hora desde el servidor:', error);
      }
    };

    obtenerDiaYHora();
  }, [backendUrl]); // Solo se ejecuta una vez cuando el componente se monta

  useEffect(() => {
    if (diaActual) {
      console.log("Día actual calculado en useEffect:", diaActual); // Verificación del día calculado desde la API

      // Verificar si el usuario ya tiene un turno en el día actual
      const verificarTurno = async () => {
        try {
          const respuesta = await axios.get(`${backendUrl}/api/turnos`);
          const turnos = respuesta.data;

          console.log("Turnos del día actual:", turnos); // Verificación de los turnos del día actual

          // Verificar si el nombre del usuario ya está en el arreglo de turnos del día actual
          if (turnos[diaActual] && turnos[diaActual].includes(usuarioNombre)) {
            console.log("El usuario ya tiene un turno asignado para hoy.");
            setTurnoExistente(`Ya tienes un turno asignado para hoy (${diaActual}).`);
          } else {
            setTurnoExistente(null); // No tiene un turno asignado en el día actual
          }
        } catch (error) {
          console.error('Error al verificar turno:', error);
          setError('Error al verificar turno.');
        }
      };

      // Primero verificamos el turno y luego obtenemos la tabla de turnos
      verificarTurno();

      axios.get(`${backendUrl}/api/turnos`)
        .then((response) => {
          const turnos = response.data;
          const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
          const turnosDisponibles = {};
          let turnosValidados = true;

          diasSemana.forEach((dia) => {
            if (turnos[dia]) {
              turnosDisponibles[dia] = turnos[dia];
            } else {
              turnosValidados = false;
            }
          });

          if (turnosValidados) {
            setTabla(turnosDisponibles);
          } else {
            setError('No se encontraron turnos completos en la base de datos.');
          }
        })
        .catch((error) => {
          console.error('Error al obtener los turnos:', error);
          setError('Error al obtener los turnos.');
        });
    }
  }, [diaActual, backendUrl, usuarioNombre]);

  const agregarTurno = async (horaSeleccionada) => {
    if (turnoExistente) {
      alert(turnoExistente); // Si ya tiene un turno, no dejar agregar otro
      return;
    }

    try {
      const respuesta = await axios.get(`${backendUrl}/api/turnos`);
      const turnos = respuesta.data;

      // Verificar si el nombre del usuario ya está en el arreglo de turnos del día actual
      if (turnos[diaActual] && turnos[diaActual].includes(usuarioNombre)) {
        alert('Ya tienes un turno asignado para este día.');
        return;
      }

      // Aquí agregamos el turno (por ejemplo, a la base de datos)
      const nuevoTurno = [...turnos[diaActual]]; // Copia de los turnos del día actual
      const indiceLibre = nuevoTurno.findIndex((turno) => turno === ''); // Encuentra la primera posición vacía

      if (indiceLibre !== -1) {
        nuevoTurno[indiceLibre] = `${usuarioNombre} ${horaSeleccionada}`;
        const turnosActualizados = { ...turnos, [diaActual]: nuevoTurno }; // Actualizamos el objeto con los nuevos turnos
        await axios.put(`${backendUrl}/api/turnos`, turnosActualizados); // Enviamos la actualización a la base de datos
        console.log('Turno agregado con éxito:', nuevoTurno);
      } else {
        alert('No hay espacios disponibles para este día.');
      }
    } catch (error) {
      console.error('Error al agregar el turno:', error);
      alert('Hubo un error al intentar agregar el turno.');
    }
  };

  return { tabla, error, turnoExistente, agregarTurno, horaActual };
};

export default ServiceShifts;
