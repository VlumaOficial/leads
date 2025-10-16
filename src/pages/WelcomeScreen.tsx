"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Shield } from "lucide-react";
import Logo from "@/components/Logo";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Limpa as respostas do questionário do localStorage antes de iniciar um novo
    localStorage.removeItem("questionnaireAnswers");
    navigate("/questionnaire/1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fundo-escuro via-gray-950 to-cyan-vivid/10 p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-vivid/20 rounded-full blur-[120px]"
          animate={{
            x: [0, -100, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-verde-inteligente/15 rounded-full blur-[120px]"
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-purple-vivid/15 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo VLUMA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Logo size={80} animate={true} />
        </motion.div>

        <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-cyan-vivid/20 shadow-2xl shadow-cyan-vivid/10 p-8 md:p-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-branco-puro mb-6 leading-tight"
          >
            Soluções que{" "}
            <span className="bg-gradient-to-r from-cyan-vivid to-verde-inteligente bg-clip-text text-transparent">
              simplificam
            </span>
            .<br />
            Resultados que{" "}
            <span className="bg-gradient-to-r from-laranja-cta to-pink-vivid bg-clip-text text-transparent">
              encantam
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-cinza-claro mb-6 leading-relaxed"
          >
            Responda a{" "}
            <strong className="text-cyan-vivid font-bold">6 perguntas rápidas</strong>{" "}
            e descubra como podemos ajudar a transformar desafios em soluções
            simples — do seu jeito.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-8 text-branco-suave"
          >
            <Clock className="w-5 h-5 text-verde-inteligente" />
            <span className="text-base">Leva menos de 2 minutos!</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleStart}
              className="group w-full py-4 px-8 text-lg font-bold bg-gradient-to-r from-laranja-cta to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-laranja-cta/30 flex items-center justify-center gap-2"
            >
              Quero descobrir como
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <p className="text-xs text-cinza-claro flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              Seus dados estão seguros e protegidos pela LGPD
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;