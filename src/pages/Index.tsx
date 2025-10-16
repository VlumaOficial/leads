// Update this page (the content is just a fallback if you fail to update the page)

import { MadeWithDyad } from "@/components/made-with-dyad";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the privacy consent screen as the entry point
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecionando...</h1>
        <p className="text-xl text-gray-600">
          Você será redirecionado para a tela inicial.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;