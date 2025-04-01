import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/landingPage.css";
import "../stylesheets/smallDevices.css"; 
import "../stylesheets/wideScreens.css"; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="rainbow">
        <h1 className="landing-title">Coordinación de Centro Quirúrgico</h1>
        <h2 className="landing-description">Agenda Semanal Turno Tarde</h2>
        <div className="landing-buttons">
          <div className="landingButton-login-button">
            <button className="css-button-arrow--sky" onClick={() => navigate("/login")}>
              Iniciar Sesión
            </button>
          </div>
          <div className="landingButton-register-button">
            <button className="css-button-arrow--sky" onClick={() => navigate("/registro")}>
              Registrarse
            </button>
          </div>
        </div>  
      </div> 
    </div>
  );
};

export default LandingPage;

