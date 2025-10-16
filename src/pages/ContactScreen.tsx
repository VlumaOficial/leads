"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "E-mail inválido." }),
  whatsapp: z.string().min(1, { message: "WhatsApp é obrigatório." }), // Alterado para obrigatório
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactScreen = () => {
  const navigate = useNavigate();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Dados de contato enviados:", data);
    // Here you would typically send the data to your backend
    showSuccess("✨ Obrigado! Em breve entraremos em contato para entender seu momento e sugerir o melhor caminho para simplificar sua rotina.");
    localStorage.removeItem("questionnaireAnswers"); // Clear answers after submission
    navigate("/"); // Redirect to home or a thank you page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Estamos prontos para criar algo juntos. 🤝
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Deixe seus dados para que um especialista entre em contato e entenda
          melhor o seu momento. Sem pressa. Sem compromisso. Apenas uma boa
          conversa.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name" className="sr-only">
              Nome
            </Label>
            <Input
              id="name"
              placeholder="👤 Nome"
              {...form.register("name")}
              className="py-2"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="sr-only">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="📧 E-mail"
              {...form.register("email")}
              className="py-2"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="whatsapp" className="sr-only">
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              placeholder="📱 WhatsApp (obrigatório)" // Placeholder atualizado
              {...form.register("whatsapp")}
              className="py-2"
            />
            {form.formState.errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {form.formState.errors.whatsapp.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="message" className="sr-only">
              Quer contar um pouco mais sobre o que busca? (opcional)
            </Label>
            <Textarea
              id="message"
              placeholder="🗣️ Quer contar um pouco mais sobre o que busca? (opcional)"
              {...form.register("message")}
              rows={4}
              className="py-2"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            📘 Ao enviar este questionário, você concorda com nossa{" "}
            <a
              href="https://coreait.com.br/politica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Política de Privacidade
            </a>{" "}
            e autoriza o uso das informações fornecidas para contato e análise
            do seu perfil de interesse, conforme a Lei Geral de Proteção de
            Dados (Lei nº 13.709/18). 🔒 Suas informações são tratadas com
            confidencialidade e não serão compartilhadas com terceiros.
          </p>

          <Button type="submit" className="w-full py-3 text-lg mt-6">
            📩 Quero conversar com um especialista
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactScreen;