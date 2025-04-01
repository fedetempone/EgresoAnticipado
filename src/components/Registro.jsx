import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/landingPage.css";
import "../stylesheets/smallDevices.css"; 
import "../stylesheets/wideScreens.css"; 
import "../stylesheets/registro.css"; 

const Registro = () => {
  const [legajo, setLegajo] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuarioNuevo, setUsuarioNuevo] = useState(false);
  const [legajoValidado, setLegajoValidado] = useState(false);
  const [codigoValido, setCodigoValido] = useState(false); // Estado para el código
  const navigate = useNavigate();

  // Función para validar el legajo y determinar el estado del usuario
  const validarLegajo = async () => {
    try {
      const { data: usuarios } = await axios.get(
        'https://egreso-backend.onrender.com/api/auth/usuarios'
      );

      const usuario = usuarios.find((user) => user.legajo === legajo);

      if (usuario) {
        if (usuario.contraseña || usuario.email) {
          setMensaje('El usuario ya está registrado. Redirigiendo a login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setUsuarioNuevo(true);
          setLegajoValidado(true); // Oculta el campo de legajo y el botón de validación
          setMensaje(
            'Legajo válido. Por favor, ingrese el código que le fue suministrado.'
          );
        }
      } else {
        setMensaje('Legajo no encontrado.');
      }
    } catch (error) {
      setMensaje('Error al validar el legajo.');
      console.error('Error al validar el legajo:', error);
    }
  };

  // Función para verificar el código del usuario
  const verificarCodigo = async () => {
    try {
      const { data: usuarios } = await axios.get(
        'https://egreso-backend.onrender.com/api/auth/usuarios'
      );
      const usuario = usuarios.find((user) => user.legajo === legajo);

      if (usuario && usuario.codigo === codigo) {
        setCodigoValido(true);
        setMensaje('Código correcto. Por favor, complete los datos para registrar el usuario.');
      } else {
        setCodigoValido(false);
        setMensaje('Código incorrecto. Intenta nuevamente.');
      }
    } catch (error) {
      setMensaje('Error al verificar el código.');
      console.error('Error al verificar el código:', error);
    }
  };

  // Validar email con REGEX
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Función para manejar el registro
  const handleRegistro = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setMensaje('El email no es válido.');
      return;
    }

    if (!usuarioNuevo) {
      setMensaje('Primero debe validar el legajo.');
      return;
    }

    if (!codigoValido) {
      setMensaje('Debe ingresar un código válido.');
      return;
    }

    if (!email || !contraseña || !confirmarContraseña) {
      setMensaje('Por favor, complete todos los campos.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    try {
      // console.log('usuaruoi de registro.jsx', usuario);
      await axios.put(`https://egreso-backend.onrender.com/api/auth/usuarios/${legajo}`, {
        email,
        contraseña,
      });

      setMensaje('Usuario registrado exitosamente. Redirigiendo a login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMensaje('Error al registrar el usuario.');
      console.error('Error al registrar el usuario:', error);
    }
  };

  return (
    <div className="landing-container">
      <div className="rainbow">
        <h1>REGISTRARSE</h1>
        {mensaje && <p style={{ whiteSpace: 'pre-line' }}>{mensaje}</p>}
        <div className="login-container">
        <form onSubmit={handleRegistro}>
          {/* Solo mostramos el campo de legajo si no ha sido validado */}
          {!legajoValidado && (
            <>
              <div className='legajo-container-form'>
                <label htmlFor="legajo">Legajo:</label>
                <input
                  type="text"
                  id="legajo"
                  value={legajo}
                  onChange={(e) => setLegajo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Evita que el formulario se envíe
                      validarLegajo();
                    }
                  }}
                  required
                />
              </div>
              <div>
                <button className='css-button-arrow--sky' type="button" onClick={validarLegajo}>Validar Legajo</button>
              </div>
            </>
          )}

          {/* Campo para ingresar el código si el legajo es válido */}
          {legajoValidado && !codigoValido && (
            <div>
              <label htmlFor="codigo">Código:</label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Evita que el formulario se envíe
                    verificarCodigo();
                  }
                }}
                required
              />
              <button type="button" onClick={verificarCodigo}>Verificar Código</button>
            </div>
          )}

          {/* Campos para email y contraseña solo si el código es válido */}
          {codigoValido && (
            <>
            <div className="registro-container">
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="contraseña">Contraseña:</label>
                <input
                  type="password"
                  id="contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegistro(e)}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmarContraseña">Confirmar Contraseña:</label>
                <input
                  type="password"
                  id="confirmarContraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegistro(e)}
                  required
                />
              </div>
              </div>
              <button className='css-button-arrow--sky' type="submit">Registrar</button>
            </>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;

