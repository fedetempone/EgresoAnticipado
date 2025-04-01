import React from 'react';
import "../stylesheets/landingPage.css";

const ShiftConfirmation = ({ confirmarTurno }) => {
  return <button className='css-button-arrow--sky' onClick={confirmarTurno}>Confirmar</button>;
};

export default ShiftConfirmation;