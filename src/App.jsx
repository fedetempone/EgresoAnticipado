import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EgresosApp from './components/EgresosApp';
import Login from './components/Login';
import Registro from './components/Registro';

function App() {
  // Supongamos que tienes algún tipo de estado que guarda si el usuario está autenticado
  const isAuthenticated = false; // Aquí deberías usar un estado o contexto que maneje la autenticación

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Si el usuario está autenticado, lo dirigimos a la app */}
          <Route path="/" element={isAuthenticated ? <EgresosApp /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
