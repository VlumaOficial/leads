"use client";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressIndicator from "@/components/ProgressIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Briefcase, Sparkles, Scale, BarChart3, Puzzle, Home, Building2, Construction, GraduationCap, Laptop, Store, ShoppingCart, Pizza, PawPrint, Rocket, DollarSign, Settings, Factory, Brain, Building, Clock, Globe, MessageSquare, Compass, Lightbulb, User, Bot, TrendingUp, Users } from "lucide-react";
import Logo from "@/components/Logo";

interface Question {
  id: string;
  question: string;
  type: "radio" | "checkbox";
  options: { value: string; label: string; icon?: any }[];
}

interface MultiQuestionStep {
  id: string;
  questions: Question[];
}

type QuestionnaireStep = Question | MultiQuestionStep;

const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: "segment",
    question: "Qual dessas opções melhor descreve seu segmento?",
    type: "checkbox", // Alterado para checkbox
    options: [
      { value: "clinicas-saude", label: "Clínicas e Saúde", icon: Briefcase },
      { value: "beleza-bem-estar", label: "Beleza e Bem-Estar", icon: Sparkles },
      { value: "advocacia", label: "Advocacia", icon: Scale },
      { value: "contabilidade", label: "Contabilidade", icon: BarChart3 },
      { value: "consultorias", label: "Consultorias", icon: Puzzle },
      { value: "corretores", label: "Corretores (Seguros e Imóveis)", icon: Home },
      { value: "imobiliarias", label: "Imobiliárias", icon: Building2 },
      { value: "construcao", label: "Construção", icon: Construction },
      { value: "educacao-cursos", label: "Educação e Cursos", icon: GraduationCap },
      { value: "marketing-digital", label: "Marketing Digital", icon: Laptop },
      { value: "lojas-comercio", label: "Lojas e Comércio", icon: Store },
      { value: "e-commerce", label: "E-commerce", icon: ShoppingCart },
      { value: "pizzarias", label: "Pizzarias", icon: Pizza },
      { value: "pet-shops", label: "Pet Shops", icon: PawPrint },
      { value: "empreendedores", label: "Empreendedores", icon: Rocket },
      { value: "financas", label: "Finanças", icon: DollarSign },
      { value: "saas-tech", label: "SaaS / Tech", icon: Settings },
      { value: "industrias", label: "Indústrias", icon: Factory },
      { value: "profissionais-liberais", label: "Profissionais Liberais", icon: Brain },
      { value: "agencias", label: "Agências", icon: Building },
      { value: "outros", label: "Outros", icon: Sparkles },
    ],
  },
  {
    id: "role-in-company", // Nova etapa adicionada
    question: "Qual a sua função na empresa?",
    type: "radio",
    options: [
      { value: "proprietario", label: "CEO / Proprietário(a)", icon: User },
      { value: "gerente", label: "Gerente / Coordenador(a)", icon: BarChart3 },
      { value: "analista", label: "Analista / Especialista", icon: Briefcase },
      { value: "autonomo", label: "Autônomo(a) / Freelancer", icon: Rocket },
      { value: "outro", label: "Outro", icon: Sparkles },
    ],
  },
  {
    id: "simplify-goal",
    question: "O que você gostaria de simplificar hoje?",
    type: "radio",
    options: [
      { value: "vendas-atendimento", label: "Vendas e atendimento", icon: TrendingUp },
      { value: "rotina-tarefas", label: "Rotina e tarefas repetitivas", icon: Clock },
      {
        value: "divulgacao-presenca",
        label: "Divulgação e presença digital",
        icon: Globe
      },
      {
        value: "comunicacao-relacionamento",
        label: "Comunicação e relacionamento",
        icon: MessageSquare
      },
      { value: "descobrindo", label: "Ainda estou descobrindo", icon: Compass },
    ],
  },
  {
    id: "challenges-aspirations",
    questions: [
      {
        id: "current-situation",
        question: "Qual dessas frases mais parece com a sua situação atual?",
        type: "radio",
        options: [
          {
            value: "automatizar",
            label: "“Faço muita coisa manual e quero automatizar.”",
            icon: MessageSquare
          },
          {
            value: "atrair-clientes",
            label: "“Quero atrair mais clientes e ser mais visto.”",
            icon: Rocket
          },
          {
            value: "colocar-em-pratica",
            label: "“Tenho boas ideias, mas não sei como colocar em prática.”",
            icon: Lightbulb
          },
          {
            value: "focar-no-que-importa",
            label: "“Preciso de mais tempo para focar no que importa.”",
            icon: Clock
          },
          {
            value: "entender-ia",
            label: "“Quero entender o que a IA pode fazer por mim.”",
            icon: Bot
          },
        ],
      },
      {
        id: "motivation",
        question: "O que te motiva a buscar soluções agora?",
        type: "checkbox",
        options: [
          { value: "crescer-negocio", label: "Crescer o negócio", icon: TrendingUp },
          { value: "ganhar-tempo", label: "Ganhar tempo e tranquilidade", icon: Clock },
          {
            value: "testar-novas-formas",
            label: "Testar novas formas de trabalhar",
            icon: Lightbulb
          },
          {
            value: "aprender-tecnologia",
            label: "Aprender sobre tecnologia e IA",
            icon: Bot
          },
          {
            value: "melhorar-atendimento",
            label: "Melhorar o atendimento ao cliente",
            icon: Users
          },
        ],
      },
    ],
  },
  {
    id: "digital-maturity",
    question: "Hoje, você já usa alguma ferramenta digital no seu dia a dia?",
    type: "radio",
    options: [
      { value: "sim-varias", label: "Sim, uso várias (sou digital)", icon: CheckCircle2 },
      { value: "algumas-evoluir", label: "Uso algumas, mas quero evoluir", icon: Compass },
      { value: "comecando-agora", label: "Estou começando agora", icon: Rocket },
      {
        value: "nao-entender",
        label: "Ainda não, quero entender como funciona",
        icon: Lightbulb
      },
    ],
  },
];

const QuestionnaireScreen = () => {
  const { step } = useParams<{ step: string }>();
  const currentStepIndex = parseInt(step || "1") - 1;
  const navigate = useNavigate();

  const [answers, setAnswers] = React.useState<Record<string, any>>(() => {
    const savedAnswers = localStorage.getItem("questionnaireAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  React.useEffect(() => {
    localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));
  }, [answers]);

  const currentQuestionnaireStep = questionnaireSteps[currentStepIndex];

  if (!currentQuestionnaireStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center text-gray-700 dark:text-gray-300">
          Questionário finalizado ou etapa inválida.
        </div>
      </div>
    );
  }

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentValues = new Set(prev[questionId] || []);
      if (checked) {
        currentValues.add(value);
      } else {
        currentValues.delete(value);
      }
      return { ...prev, [questionId]: Array.from(currentValues) };
    });
  };

  const isCurrentStepValid = () => {
    if ("questions" in currentQuestionnaireStep) {
      // Multi-question step
      return currentQuestionnaireStep.questions.every((q) => {
        if (q.type === "radio") {
          return answers[q.id] !== undefined;
        } else if (q.type === "checkbox") {
          return answers[q.id] && answers[q.id].length > 0;
        }
        return false;
      });
    } else {
      // Single question step
      if (currentQuestionnaireStep.type === "radio") {
        return answers[currentQuestionnaireStep.id] !== undefined;
      } else if (currentQuestionnaireStep.type === "checkbox") {
        return answers[currentQuestionnaireStep.id] && answers[currentQuestionnaireStep.id].length > 0;
      }
    }
    return false;
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      // Optionally show a toast error here
      return;
    }
    if (currentStepIndex < questionnaireSteps.length - 1) {
      navigate(`/questionnaire/${currentStepIndex + 2}`);
    } else {
      navigate("/contact");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      navigate(`/questionnaire/${currentStepIndex}`);
    } else {
      navigate("/welcome");
    }
  };

  const renderQuestion = (q: Question) => (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-xl md:text-2xl font-bold text-branco-puro mb-6 leading-tight">
        {q.question}
      </h2>
      {q.type === "radio" && (
        <RadioGroup
          onValueChange={(value) => handleRadioChange(q.id, value)}
          value={answers[q.id] || ""}
          className="space-y-3"
        >
          {q.options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="relative flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-vivid/50 rounded-xl p-4 cursor-pointer transition-all duration-300">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="border-blue-vivid/50 text-blue-vivid"
                />
                <Label
                  htmlFor={option.value}
                  className="text-branco-suave cursor-pointer flex-1 leading-relaxed group-hover:text-branco-puro transition-colors flex items-center gap-2"
                >
                  {option.icon && <option.icon className="w-4 h-4 text-cyan-vivid flex-shrink-0" />}
                  {option.label}
                </Label>
                {answers[q.id] === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-verde-inteligente" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </RadioGroup>
      )}
      {q.type === "checkbox" && (
        <div className="space-y-3">
          {q.options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="relative flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-vivid/50 rounded-xl p-4 cursor-pointer transition-all duration-300">
                <Checkbox
                  id={option.value}
                  checked={answers[q.id]?.includes(option.value) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(q.id, option.value, !!checked)
                  }
                  className="border-cyan-vivid/50 data-[state=checked]:bg-cyan-vivid data-[state=checked]:border-cyan-vivid"
                />
                <Label
                  htmlFor={option.value}
                  className="text-branco-suave cursor-pointer flex-1 leading-relaxed group-hover:text-branco-puro transition-colors flex items-center gap-2"
                >
                  {option.icon && <option.icon className="w-4 h-4 text-cyan-vivid flex-shrink-0" />}
                  {option.label}
                </Label>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-fundo-escuro via-gray-950 to-blue-vivid/10 p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-vivid/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-purple-vivid/15 rounded-full blur-[120px]"
          animate={{
            x: [0, -70, 0],
            y: [0, -35, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo VLUMA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Logo size={60} />
        </motion.div>

        <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-blue-vivid/20 shadow-2xl shadow-blue-vivid/10 p-6 md:p-8">
        <ProgressIndicator
          currentStep={currentStepIndex + 1}
          totalSteps={questionnaireSteps.length}
        />

        {"questions" in currentQuestionnaireStep ? (
          // Render multiple questions for a multi-question step
          currentQuestionnaireStep.questions.map(renderQuestion)
        ) : (
          // Render a single question for a single-question step
          renderQuestion(currentQuestionnaireStep)
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mt-8"
        >
          <Button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-branco-puro border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className="flex-[2] py-3 font-bold bg-gradient-to-r from-blue-vivid to-cyan-vivid hover:from-cyan-vivid hover:to-blue-vivid text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-vivid/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {currentStepIndex === questionnaireSteps.length - 1
              ? "Finalizar Questionário"
              : "Próximo"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
};

export default QuestionnaireScreen;