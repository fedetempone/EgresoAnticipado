import React from 'react';

const TurnosTable = ({ tabla, diaActual, horaHabilitada, manejarSeleccion }) => {
  return (
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
  );
};

export default TurnosTable;
