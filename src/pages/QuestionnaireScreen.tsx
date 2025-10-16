"use client";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressIndicator from "@/components/ProgressIndicator";

interface Question {
  id: string;
  question: string;
  type: "radio" | "checkbox";
  options: { value: string; label: string }[];
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
    type: "radio",
    options: [
      { value: "clinicas-saude", label: "💼 Clínicas e Saúde" },
      { value: "beleza-bem-estar", label: "💆‍♀️ Beleza e Bem-Estar" },
      { value: "advocacia", label: "⚖️ Advocacia" },
      { value: "contabilidade", label: "📊 Contabilidade" },
      { value: "consultorias", label: "🧩 Consultorias" },
      { value: "corretores", label: "🏠 Corretores (Seguros e Imóveis)" },
      { value: "imobiliarias", label: "🏢 Imobiliárias" },
      { value: "construcao", label: "🏗️ Construção" },
      { value: "educacao-cursos", label: "🎓 Educação e Cursos" },
      { value: "marketing-digital", label: "💻 Marketing Digital" },
      { value: "lojas-comercio", label: "🏪 Lojas e Comércio" },
      { value: "e-commerce", label: "🛒 E-commerce" },
      { value: "pizzarias", label: "🍕 Pizzarias" },
      { value: "pet-shops", label: "🐾 Pet Shops" },
      { value: "empreendedores", label: "🚀 Empreendedores" },
      { value: "financas", label: "💰 Finanças" },
      { value: "saas-tech", label: "⚙️ SaaS / Tech" },
      { value: "industrias", label: "🏭 Indústrias" },
      { value: "profissionais-liberais", label: "🧠 Profissionais Liberais" },
      { value: "agencias", label: "🏢 Agências" },
      { value: "outros", label: "✨ Outros" },
    ],
  },
  {
    id: "simplify-goal",
    question: "O que você gostaria de simplificar hoje?",
    type: "radio",
    options: [
      { value: "vendas-atendimento", label: "📈 Vendas e atendimento" },
      { value: "rotina-tarefas", label: "⏱️ Rotina e tarefas repetitivas" },
      {
        value: "divulgacao-presenca",
        label: "🌐 Divulgação e presença digital",
      },
      {
        value: "comunicacao-relacionamento",
        label: "💬 Comunicação e relacionamento",
      },
      { value: "descobrindo", label: "🧭 Ainda estou descobrindo" },
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
            label: "💬 “Faço muita coisa manual e quero automatizar.”",
          },
          {
            value: "atrair-clientes",
            label: "🚀 “Quero atrair mais clientes e ser mais visto.”",
          },
          {
            value: "colocar-em-pratica",
            label: "💡 “Tenho boas ideias, mas não sei como colocar em prática.”",
          },
          {
            value: "focar-no-que-importa",
            label: "🧘‍♂️ “Preciso de mais tempo para focar no que importa.”",
          },
          {
            value: "entender-ia",
            label: "🤖 “Quero entender o que a IA pode fazer por mim.”",
          },
        ],
      },
      {
        id: "motivation",
        question: "O que te motiva a buscar soluções agora?",
        type: "checkbox",
        options: [
          { value: "crescer-negocio", label: "📈 Crescer o negócio" },
          { value: "ganhar-tempo", label: "🧘‍♀️ Ganhar tempo e tranquilidade" },
          {
            value: "testar-novas-formas",
            label: "💡 Testar novas formas de trabalhar",
          },
          {
            value: "aprender-tecnologia",
            label: "💬 Aprender sobre tecnologia e IA",
          },
          {
            value: "melhorar-atendimento",
            label: "🤝 Melhorar o atendimento ao cliente",
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
      { value: "sim-varias", label: "✅ Sim, uso várias (sou digital)" },
      { value: "algumas-evoluir", label: "🧭 Uso algumas, mas quero evoluir" },
      { value: "comecando-agora", label: "🚀 Estou começando agora" },
      {
        value: "nao-entender",
        label: "🤔 Ainda não, quero entender como funciona",
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
    <div key={q.id} className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
        {q.question}
      </h2>
      {q.type === "radio" && (
        <RadioGroup
          onValueChange={(value) => handleRadioChange(q.id, value)}
          value={answers[q.id] || ""}
          className="space-y-3"
        >
          {q.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-gray-700 dark:text-gray-300">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {q.type === "checkbox" && (
        <div className="space-y-3">
          {q.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={answers[q.id]?.includes(option.value) || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(q.id, option.value, !!checked)
                }
              />
              <Label htmlFor={option.value} className="text-gray-700 dark:text-gray-300">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
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

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            Voltar
          </Button>
          <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
            {currentStepIndex === questionnaireSteps.length - 1
              ? "Finalizar Questionário"
              : "Próximo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireScreen;