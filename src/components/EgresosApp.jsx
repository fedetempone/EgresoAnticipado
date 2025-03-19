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
  //   const [horaConfirmacion, setHoraConfirmacion] = useState('');
  //   const [turnoVerificado, setTurnoVerificado] = useState(false); // Bandera para controlar la verificación
  
  //   const diaActual = horaActual ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][horaActual.getDay() - 1] : '';
    
  //   useEffect(() => {
  //     if (usuario && diaActual && !turnoVerificado) {
  //       verificarTurnoExistente(); // Solo se ejecuta si no se ha verificado previamente
  //     }
  //   }, [usuario, diaActual, turnoVerificado]);
  
  //   const verificarTurnoExistente = async () => {
  //     if (!usuario || !diaActual) return;
  
  //     try {
  //       const respuesta = await axios.get(`${backendUrl}/api/turnos/${diaActual}`);
  //       const turnosDelDia = respuesta.data;
  //       console.log("Turnos del día:", turnosDelDia);
  
  //       const turnoExistente = turnosDelDia[diaActual]?.find(turno => turno.includes(usuario));
  //       console.log("Turno existente encontrado:", turnoExistente);
        
  //       if (turnoExistente) {
  //         alert(`Ya tienes un turno asignado: ${turnoExistente}`);
  //         setTurnoGuardado(true); // Marcar que ya tiene un turno
  //       }
  
  //       // Marcar la verificación como completada
  //       setTurnoVerificado(true);
  //     } catch (error) {
  //       console.error('Error al verificar turno existente:', error);
  //       alert('Ocurrió un error al verificar los turnos.');
  //     }
  //   };
  
  //   // El resto del código sigue igual
  //   const manejarSeleccion = (filaIndex, hora) => {
  //     console.log("Hora seleccionada:", hora);
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

  //     const obtenerHoraServidor = async () => {
  //       try {
  //         const response = await axios.get(`${backendUrl}/api/hora`); 
  //         return response.data.hora; 
  //       } catch (error) {
  //         console.error("Error al obtener la hora del servidor:", error);
  //         return null;
  //       }
  //     };

  //     // Obtener la hora del servidor
  //     const horaDelServidor = await obtenerHoraServidor();
  //     if (!horaDelServidor) {
  //       alert('No se pudo obtener la hora del servidor.');
  //       return;
  //     }
  
  //     setHoraConfirmacion(horaDelServidor); // Guardamos la hora obtenida del servidor
  //     console.log("Hora confirmada (hora del servidor):", horaDelServidor);
  
  //     const nuevaTabla = { ...tabla };
  //     console.log("Tabla antes de guardar el turno:", nuevaTabla);
  
  //     if (nuevaTabla[diaActual][filaSeleccionada] === '') {
  //       nuevaTabla[diaActual][filaSeleccionada] = `${usuario} ${horaSeleccionada} horadeconfirmacion: ${horaDelServidor}`;
  //       setTurnoGuardado(true);
  
  //       console.log("Turno confirmado. Enviando al backend...");
  //       try {
  //         // Enviar los datos al backend
  //         const response = await axios.post(`${backendUrl}/api/turnos`, { 
  //           filaIndex: filaSeleccionada, 
  //           dia: diaActual, 
  //           nombre: `${usuario} ${horaSeleccionada} horadeconfirmacion: ${horaDelServidor}`,
  //         });
  //         console.log("Respuesta del backend:", response);
  //         alert('Turno guardado correctamente');
  //       } catch (error) {
  //         console.error('Error al guardar el turno:', error);
  //         alert('Ocurrió un error al guardar el turno');
  //       }
  //     } else {
  //       alert('Este turno ya está ocupado. Por favor, selecciona otro.');
  //     }
  //   };
  
  //   if (error || errorUsuario) {
  //     console.error("Error en los servicios:", error || errorUsuario);
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
  const [turnoVerificado, setTurnoVerificado] = useState(false); // Bandera para controlar la verificación

  const diaActual = horaActual ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][horaActual.getDay() - 1] : '';
  
  // Decodificar el día actual para la consulta
  const diaActualDecodificado = diaActual ? decodeURIComponent(diaActual) : '';

  useEffect(() => {
    if (usuario && diaActualDecodificado && !turnoVerificado) {
      verificarTurnoExistente(); // Solo se ejecuta si no se ha verificado previamente
    }
  }, [usuario, diaActualDecodificado, turnoVerificado]);

  const verificarTurnoExistente = async () => {
    if (!usuario || !diaActualDecodificado) return;

    try {
      const respuesta = await axios.get(`${backendUrl}/api/turnos/${diaActualDecodificado}`);
      console.log('respuestaenegresosapp es: ', respuesta);
      const turnosDelDia = respuesta.data;
      console.log("Turnos del día:", turnosDelDia);

      const turnoExistente = turnosDelDia[diaActualDecodificado]?.find(turno => turno.includes(usuario));
      console.log("Turno existente encontrado:", turnoExistente);
      
      if (turnoExistente) {
        alert(`Ya tienes un turno asignado: ${turnoExistente}`);
        setTurnoGuardado(true); // Marcar que ya tiene un turno
      }

      // Marcar la verificación como completada
      setTurnoVerificado(true);
    } catch (error) {
      console.error('Error al verificar turno existente:', error);
      alert('Ocurrió un error al verificar los turnos.');
    }
  };

  // El resto del código sigue igual
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

    const obtenerHoraServidor = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hora`); 
        console.log('responseobtenerhoraservidores:', response);
        return response.data.hora; 
      } catch (error) {
        console.error("Error al obtener la hora del servidor:", error);
        return null;
      }
    };

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

    if (nuevaTabla[diaActualDecodificado][filaSeleccionada] === '') {
      nuevaTabla[diaActualDecodificado][filaSeleccionada] = `${usuario} ${horaSeleccionada} horadeconfirmacion: ${horaDelServidor}`;
      setTurnoGuardado(true);

      console.log("Turno confirmado. Enviando al backend...");
      try {
        // Enviar los datos al backend
        const response = await axios.post(`${backendUrl}/api/turnos`, { 
          filaIndex: filaSeleccionada, 
          dia: diaActualDecodificado, 
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
      <ShiftsTable tabla={tabla} diaActual={diaActualDecodificado} horaHabilitada={horaHabilitada} manejarSeleccion={manejarSeleccion} />
      <ShiftConfirmation confirmarTurno={confirmarTurno} />
    </div>
  );
};

export default EgresosApp;
