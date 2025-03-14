import React from 'react';

const CurrentTime = ({ diaActual, horaHabilitada }) => {
  return (
    <>
      <h2>Día actual: {diaActual || 'No disponible'}</h2>
      {!horaHabilitada && <p>La edición se habilita entre las 11:30 y las 20:30.</p>}
    </>
  );
};

export default CurrentTime;
