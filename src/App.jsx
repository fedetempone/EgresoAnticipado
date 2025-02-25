import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EgresosApp from './components/EgresosApp';
import Login from './components/Login';
import Registro from './components/Registro';
import LandingPage from './components/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el usuario tiene un token en localStorage
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Nueva pantalla de bienvenida */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/turnos" element={isAuthenticated ? <EgresosApp /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


