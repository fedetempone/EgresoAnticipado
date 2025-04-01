// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import EgresosApp from './components/EgresosApp';
// import Login from './components/Login';
// import Registro from './components/Registro';
// import LandingPage from './components/LandingPage';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     setIsAuthenticated(!!token);

//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('authToken'));
//     };

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   if (isAuthenticated === null) {
//     return <div>Cargando...</div>; // Mientras se verifica el estado de autenticación
//   }

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//           <Route path="/registro" element={<Registro />} />
//           <Route path="/turnos" element={isAuthenticated ? <EgresosApp /> : <Navigate to="/login" />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import EgresosApp from "./components/EgresosApp";
import Login from "./components/Login";
import Registro from "./components/Registro";
import LandingPage from "./components/LandingPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation(); // Ahora sí funciona porque estamos dentro de <Router>

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Cambiar la clase en #root según la ruta
  useEffect(() => {
    const rootElement = document.getElementById("root");

    if (location.pathname.includes("/turnos")) {
      rootElement.classList.add("turnos-background");
    } else {
      rootElement.classList.remove("turnos-background");
    }
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/turnos" element={isAuthenticated ? <EgresosApp /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
