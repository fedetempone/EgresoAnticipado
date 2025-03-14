import React from 'react';

const UserGreeting = ({ usuario }) => {
  return usuario && <h2>¡Hola, {usuario}!</h2>;
};

export default UserGreeting;
