"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-cinza-claro">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-bold text-cyan-vivid">
          {Math.round(progressValue)}%
        </span>
      </div>
      
      {/* Custom Progress Bar */}
      <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-vivid via-verde-inteligente to-cyan-vivid rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressIndicator;