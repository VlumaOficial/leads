"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/questionnaire/1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          ✨ Soluções que simplificam. Resultados que encantam.
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Responda a 5 perguntas rápidas e descubra como podemos ajudar a
          transformar desafios em soluções simples — do seu jeito.
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
          (Leva menos de 2 minutos!)
        </p>
        <Button onClick={handleStart} className="w-full py-3 text-lg">
          👉 Quero descobrir como
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;