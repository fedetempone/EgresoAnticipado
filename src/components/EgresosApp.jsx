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

//   // Estado para el formulario de registro
//   const [legajo, setLegajo] = useState('');
//   const [email, setEmail] = useState('');
//   const [contraseña, setContraseña] = useState('');
//   const [registroError, setRegistroError] = useState('');

//   const backendUrl = 'https://egreso-backend.onrender.com';

//   // Función para registrar al usuario
//   const registrarUsuario = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`${backendUrl}/api/auth/registro`, {
//         legajo,
//         email,
//         contraseña,
//       });
//       alert('Usuario registrado con éxito');
//       setUsuarioRegistrado(true); // Marcar al usuario como registrado
//     } catch (error) {
//       console.error('Error al registrar usuario:', error);
//       setRegistroError(error.response?.data?.message || 'Error al registrar usuario');
//     }
//   };

//   // Obtener la hora de Argentina
//   useEffect(() => {
//     const obtenerHora = async () => {
//       try {
//         const respuesta = await axios.get('http://api.timezonedb.com/v2.1/get-time-zone', {
//           params: {
//             key: 'CW4R7HZTRQJK',
//             format: 'json',
//             by: 'zone',
//             zone: 'America/Argentina/Buenos_Aires',
//           },
//         });
//         const hora = new Date(respuesta.data.formatted);
//         console.log('Hora obtenida de la API:', hora);
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

//       const horaActual_ = horaActual.getHours();
//       const minutosActuales = horaActual.getMinutes();

//       if ((horaActual_ > 11 || (horaActual_ === 11 && minutosActuales >= 30)) &&
//         (horaActual_ < 20 || (horaActual_ === 20 && minutosActuales <= 30))) {
//         setHoraHabilitada(true);
//       } else {
//         setHoraHabilitada(false);
//       }
//     }
//   }, [horaActual]);

//   const manejarAnotacion = async (filaIndex) => {
//     if (!horaHabilitada || usuarioRegistrado || !diaActual) {
//       alert('No puedes anotarte ahora o ya estás registrado.');
//       return;
//     }

//     const nombreUsuario = prompt('Ingresa tu nombre:');
//     if (nombreUsuario) {
//       const nuevaTabla = { ...tabla };
//       if (nuevaTabla[diaActual][filaIndex] === '') {
//         nuevaTabla[diaActual][filaIndex] = nombreUsuario;
//         setTabla(nuevaTabla);
//         setUsuarioRegistrado(true);

//         try {
//           await axios.post(`${backendUrl}/api/turnos`, {
//             filaIndex,
//             dia: diaActual,
//             nombre: nombreUsuario,
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
//                   onClick={() => dia === diaActual && manejarAnotacion(filaIndex)}
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
//                   {tabla[dia][filaIndex]}
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

  // Estado para el formulario de registro
  const [legajo, setLegajo] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [registroError, setRegistroError] = useState('');

  const backendUrl = 'https://egreso-backend.onrender.com';

  // Función para registrar al usuario
  const registrarUsuario = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/auth/registro`, {
        legajo,
        email,
        contraseña,
      });
      alert('Usuario registrado con éxito');
      setUsuarioRegistrado(true); // Marcar al usuario como registrado
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setRegistroError(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  // Obtener los turnos ocupados desde la base de datos
  const obtenerTurnos = async () => {
    try {
      const respuesta = await axios.get(`${backendUrl}/api/turnos`);
      const turnos = respuesta.data; // Suponiendo que los turnos vienen con la estructura que usas en el frontend
      const nuevaTabla = { Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [] };

      turnos.forEach((turno) => {
        const { dia, filaIndex, nombre } = turno;
        nuevaTabla[dia][filaIndex] = nombre;
      });

      setTabla(nuevaTabla); // Actualizamos la tabla con los datos de la base de datos
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      setError('Error al obtener los turnos');
    }
  };

  // Obtener la hora de Argentina
  useEffect(() => {
    const obtenerHora = async () => {
      try {
        const respuesta = await axios.get('http://api.timezonedb.com/v2.1/get-time-zone', {
          params: {
            key: 'CW4R7HZTRQJK',
            format: 'json',
            by: 'zone',
            zone: 'America/Argentina/Buenos_Aires',
          },
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

  // Cargar turnos al montar el componente
  useEffect(() => {
    obtenerTurnos();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  useEffect(() => {
    if (horaActual) {
      const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      const dia = diasSemana[horaActual.getDay() - 1];
      setDiaActual(dia);

      const horaActual_ = horaActual.getHours();
      const minutosActuales = horaActual.getMinutes();

      if ((horaActual_ > 11 || (horaActual_ === 11 && minutosActuales >= 30)) &&
        (horaActual_ < 20 || (horaActual_ === 20 && minutosActuales <= 30))) {
        setHoraHabilitada(true);
      } else {
        setHoraHabilitada(false);
      }
    }
  }, [horaActual]);

  const manejarAnotacion = async (filaIndex) => {
    if (!horaHabilitada || usuarioRegistrado || !diaActual) {
      alert('No puedes anotarte ahora o ya estás registrado.');
      return;
    }

    const nombreUsuario = prompt('Ingresa tu nombre:');
    if (nombreUsuario) {
      const nuevaTabla = { ...tabla };
      if (nuevaTabla[diaActual][filaIndex] === '') {
        nuevaTabla[diaActual][filaIndex] = nombreUsuario;
        setTabla(nuevaTabla);
        setUsuarioRegistrado(true);

        try {
          await axios.post(`${backendUrl}/api/turnos`, {
            filaIndex,
            dia: diaActual,
            nombre: nombreUsuario,
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Turnos para irse temprano</h1>
      <h2>Día actual: {diaActual || 'No disponible'}</h2>
      {!horaHabilitada && <p>La edición se habilitará entre las 11:30 AM y las 8:30 PM.</p>}
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
                  onClick={() => dia === diaActual && manejarAnotacion(filaIndex)}
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
                  {tabla[dia][filaIndex]}
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


