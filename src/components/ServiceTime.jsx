import { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceTime = () => {
  const [horaActual, setHoraActual] = useState(null);
  const [horaHabilitada, setHoraHabilitada] = useState(false);

  useEffect(() => {
    const obtenerHora = async () => {
      try {
        const respuesta = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
          params: {
            key: 'CW4R7HZTRQJK',
            format: 'json',
            by: 'zone',
            zone: 'America/Argentina/Buenos_Aires',
          }
        });
        const hora = new Date(respuesta.data.formatted);
        setHoraActual(hora);
      } catch (error) {
        console.error('Error al obtener la hora:', error);
      }
    };

    obtenerHora();
  }, []);

  useEffect(() => {
    if (horaActual) {
      const hora_ = horaActual.getHours();
      const minutos = horaActual.getMinutes();
      if ((hora_ > 11 || (hora_ === 11 && minutos >= 30)) && (hora_ < 20 || (hora_ === 20 && minutos <= 30))) {
        setHoraHabilitada(true);
      } else {
        setHoraHabilitada(false);
      }
    }
  }, [horaActual]);

  return { horaActual, horaHabilitada };
};

export default ServiceTime;
