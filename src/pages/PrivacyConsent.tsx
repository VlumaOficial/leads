"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2 } from "lucide-react";

const PrivacyConsent = () => {
  const [agreed, setAgreed] = React.useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (agreed) {
      navigate("/welcome");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fundo-escuro via-gray-950 to-purple-vivid/10 p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-vivid/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-vivid/15 rounded-full blur-[120px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-purple-vivid/20 shadow-2xl shadow-purple-vivid/10 p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-vivid to-cyan-vivid rounded-full blur-xl opacity-50" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-vivid to-cyan-vivid rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-black text-branco-puro mb-4"
          >
            Política de{" "}
            <span className="bg-gradient-to-r from-purple-vivid via-cyan-vivid to-verde-inteligente bg-clip-text text-transparent">
              Privacidade
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-cinza-claro mb-6 leading-relaxed"
          >
            Para prosseguir, precisamos do seu consentimento para coletar e
            processar seus dados conforme nossa Política de Privacidade. Suas
            informações são tratadas com confidencialidade e não serão
            compartilhadas com terceiros.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 gap-3 mb-8"
          >
            <div className="flex items-center gap-3 text-left bg-white/5 rounded-lg p-3 border border-white/10">
              <Lock className="w-5 h-5 text-cyan-vivid flex-shrink-0" />
              <span className="text-sm text-branco-suave">Dados criptografados e seguros</span>
            </div>
            <div className="flex items-center gap-3 text-left bg-white/5 rounded-lg p-3 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-verde-inteligente flex-shrink-0" />
              <span className="text-sm text-branco-suave">Conforme LGPD (Lei 13.709/18)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-3 mb-8 text-left bg-purple-vivid/10 border border-purple-vivid/20 rounded-lg p-4"
          >
            <Checkbox
              id="privacy-agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
              className="mt-0.5 border-purple-vivid/50 data-[state=checked]:bg-purple-vivid data-[state=checked]:border-purple-vivid"
            />
            <label
              htmlFor="privacy-agreement"
              className="text-sm font-medium text-branco-suave cursor-pointer leading-relaxed"
            >
              Li e concordo com a{" "}
              <a
                href="https://coreait.com.br/politica"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-vivid hover:text-cyan-vivid/80 underline transition-colors"
              >
                Política de Privacidade e Uso de Dados
              </a>
              .
            </label>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={handleContinue}
              disabled={!agreed}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-laranja-cta to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-laranja-cta/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Continuar →
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyConsent;