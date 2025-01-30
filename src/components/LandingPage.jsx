import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Coordinación de Centro Quirúrgico
      </h1>
      <h2 className="text-xl text-gray-600 mb-6 text-center">
        Agenda Semanal Turno Tarde
      </h2>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
          onClick={() => navigate("/registro")}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
