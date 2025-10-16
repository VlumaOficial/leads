"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

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
    <div className="w-full max-w-md mx-auto mb-6">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
        Etapa {currentStep} de {totalSteps}
      </p>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
};

export default ProgressIndicator;