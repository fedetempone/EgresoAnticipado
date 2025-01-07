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

//   // Obtener el día actual y verificar si es 01:00 AM o más tarde
//   useEffect(() => {
//     const ahora = new Date();
//     const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
//     const dia = diasSemana[ahora.getDay() - 1]; // getDay() devuelve 0 para domingo
//     setDiaActual(dia);

//     const horaActual = ahora.getHours();
//     const minutosActuales = ahora.getMinutes();
//     if (horaActual > 0 || (horaActual === 1 && minutosActuales >= 0)) {
//       setHoraHabilitada(true);
//     }

//     // Obtener la tabla desde el servidor
//     axios
//       .get('http://localhost:5000/api/turnos')
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
//           console.error('Formato de datos no válido:', response.data);
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
//   }, []);

//   // Función para manejar la anotación del usuario
//   const manejarAnotacion = async (filaIndex) => {
//     if (!horaHabilitada || usuarioRegistrado || !diaActual) {
//       alert('No puedes anotarte ahora o ya estás registrado.');
//       return;
//     }

//     const nombreUsuario = prompt('Ingresa tu nombre:');
//     if (nombreUsuario) {
//       const nuevaTabla = { ...tabla }; // Hacemos una copia del objeto tabla

//       if (nuevaTabla[diaActual][filaIndex] === '') {
//         nuevaTabla[diaActual][filaIndex] = nombreUsuario;
//         setTabla(nuevaTabla); // Actualizamos la tabla en el frontend
//         setUsuarioRegistrado(true);

//         // Enviar los datos al servidor para guardarlos
//         try {
//           await axios.post('http://localhost:5000/api/turnos', {
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

//   return (
//     <div>
//       <h1>Turnos para irse temprano</h1>
//       <h2>Día actual: {diaActual || 'No disponible'}</h2>
//       {!horaHabilitada && <p>La edición se habilitará a la 01:00 AM.</p>}

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
//                   {tabla[dia][filaIndex]} {/* Mostrar los nombres anotados */}
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

  // Obtener la URL del backend desde las variables de entorno
  const backendUrl = 'https://egresoanticipado.onrender.com';
  console.log('Backend URL:', backendUrl);

  // Obtener el día actual y verificar si es 01:00 AM o más tarde
  useEffect(() => {
    const ahora = new Date();
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const dia = diasSemana[ahora.getDay() - 1]; // getDay() devuelve 0 para domingo
    setDiaActual(dia);

    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();
    if (horaActual > 0 || (horaActual === 1 && minutosActuales >= 0)) {
      setHoraHabilitada(true);
    }

    // Obtener la tabla desde el servidor
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
          console.error('Formato de datos no válido:', response.data);
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
  const manejarAnotacion = async (filaIndex) => {
    if (!horaHabilitada || usuarioRegistrado || !diaActual) {
      alert('No puedes anotarte ahora o ya estás registrado.');
      return;
    }

    const nombreUsuario = prompt('Ingresa tu nombre:');
    if (nombreUsuario) {
      const nuevaTabla = { ...tabla }; // Hacemos una copia del objeto tabla

      if (nuevaTabla[diaActual][filaIndex] === '') {
        nuevaTabla[diaActual][filaIndex] = nombreUsuario;
        setTabla(nuevaTabla); // Actualizamos la tabla en el frontend
        setUsuarioRegistrado(true);

        // Enviar los datos al servidor para guardarlos
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

  return (
    <div>
      <h1>Turnos para irse temprano</h1>
      <h2>Día actual: {diaActual || 'No disponible'}</h2>
      {!horaHabilitada && <p>La edición se habilitará a la 01:00 AM.</p>}

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
                  {tabla[dia][filaIndex]} {/* Mostrar los nombres anotados */}
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
