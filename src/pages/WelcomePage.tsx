import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenido a Nuestra Aplicación</h1>
      <p>
        Estamos encantados de tenerte aquí. A continuación, encontrarás un
        tutorial interactivo para ayudarte a comenzar.
      </p>
      <div style={{ margin: "20px auto", maxWidth: "560px" }}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/C8E0kyVClrc"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <button
        onClick={handleContinue}
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Continuar
      </button>
    </div>
  );
};

export default WelcomePage;
