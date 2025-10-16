"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const PrivacyConsent = () => {
  const [agreed, setAgreed] = React.useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (agreed) {
      navigate("/welcome");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">
          Política de Privacidade
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Para prosseguir, precisamos do seu consentimento para coletar e
          processar seus dados conforme nossa Política de Privacidade. Suas
          informações são tratadas com confidencialidade e não serão
          compartilhadas com terceiros.
        </p>
        <div className="flex items-center justify-center mb-8">
          <Checkbox
            id="privacy-agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(!!checked)}
            className="mr-2"
          />
          <label
            htmlFor="privacy-agreement"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Li e concordo com a{" "}
            <a
              href="https://coreait.com.br/politica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Política de Privacidade e Uso de Dados
            </a>
            .
          </label>
        </div>
        <Button
          onClick={handleContinue}
          disabled={!agreed}
          className="w-full py-3 text-lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default PrivacyConsent;