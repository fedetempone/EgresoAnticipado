// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import EgresosApp from './components/EgresosApp';
// import Login from './components/Login';
// import Registro from './components/Registro';
// import LandingPage from './components/LandingPage';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // useEffect(() => {
//   //   // Verificar si el usuario tiene un token en localStorage
//   //   const token = localStorage.getItem('authToken');
//   //   setIsAuthenticated(!!token);
//   // }, []);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('authToken');
//       setIsAuthenticated(!!token);
//     };
  
//     checkAuth(); // Verifica al inicio
  
//     window.addEventListener('storage', checkAuth); // Escucha cambios en localStorage
  
//     return () => {
//       window.removeEventListener('storage', checkAuth);
//     };
//   }, []);

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Nueva pantalla de bienvenida */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/registro" element={<Registro />} />
//           <Route path="/turnos" element={isAuthenticated ? <EgresosApp /> : <Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EgresosApp from './components/EgresosApp';
import Login from './components/Login';
import Registro from './components/Registro';
import LandingPage from './components/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // Mientras se verifica el estado de autenticación
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/turnos" element={isAuthenticated ? <EgresosApp /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
