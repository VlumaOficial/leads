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
import { supabase } from "@/integrations/supabase/client"; // Importar o cliente Supabase

// Função para formatar o número de telefone
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/\D/g, ''); // Remove tudo que não é dígito
  let formattedNumber = '';

  if (phoneNumber.length > 0) {
    formattedNumber += `(${phoneNumber.substring(0, 2)}`;
  }
  if (phoneNumber.length > 2) {
    formattedNumber += `) ${phoneNumber.substring(2, 7)}`;
  }
  if (phoneNumber.length > 7) {
    formattedNumber += `-${phoneNumber.substring(7, 11)}`;
  }
  return formattedNumber;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "E-mail inválido." }),
  whatsapp: z.string().min(10, { message: "WhatsApp é obrigatório e deve ter pelo menos 10 dígitos." }).max(15, { message: "WhatsApp inválido." }), // Ajustado para validar o formato
  message: z.string().min(1, { message: "Mensagem é obrigatória." }), // Alterado para obrigatório
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

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // 1. Recuperar as respostas do questionário do localStorage
      const savedAnswers = localStorage.getItem("questionnaireAnswers");
      const questionnaireAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};

      // 2. Inserir as respostas do questionário no Supabase
      const { data: respostasData, error: respostasError } = await supabase
        .from("respostas_questionario")
        .insert([
          {
            segmento: questionnaireAnswers.segment || [],
            funcao_na_empresa: questionnaireAnswers["role-in-company"] || null,
            objetivo_simplificar: questionnaireAnswers["simplify-goal"] || null,
            situacao_atual: questionnaireAnswers["current-situation"] || null,
            motivacao: questionnaireAnswers.motivation || [],
            maturidade_digital: questionnaireAnswers["digital-maturity"] || null,
          },
        ])
        .select();

      if (respostasError) {
        console.error("Erro ao salvar respostas do questionário:", respostasError);
        showError("Erro ao salvar as respostas do questionário. Tente novamente.");
        return;
      }

      const respostasId = respostasData[0].id;

      // 3. Inserir os dados de contato no Supabase, vinculando às respostas
      const { error: contatoError } = await supabase.from("contatos").insert([
        {
          nome: data.name,
          email: data.email,
          whatsapp: data.whatsapp.replace(/\D/g, ''), // Salva apenas os dígitos do WhatsApp
          mensagem: data.message,
          respostas_id: respostasId,
        },
      ]);

      if (contatoError) {
        console.error("Erro ao salvar dados de contato:", contatoError);
        showError("Erro ao salvar seus dados de contato. Tente novamente.");
        return;
      }

      showSuccess("✨ Obrigado! Em breve entraremos em contato para entender seu momento e sugerir o melhor caminho para simplificar sua rotina.");
      localStorage.removeItem("questionnaireAnswers"); // Limpar respostas após o envio
      navigate("/"); // Redirecionar para a tela inicial
    } catch (error) {
      console.error("Erro inesperado ao enviar formulário:", error);
      showError("Ocorreu um erro inesperado. Tente novamente.");
    }
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
              placeholder="📱 WhatsApp (obrigatório)"
              {...form.register("whatsapp")}
              value={formatPhoneNumber(form.watch("whatsapp"))} // Aplica a formatação
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                form.setValue("whatsapp", formatted, { shouldValidate: true });
              }}
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
              placeholder="🗣️ Quer contar um pouco mais sobre o que busca? (obrigatório)"
              {...form.register("message")}
              rows={4}
              className="py-2"
            />
            {form.formState.errors.message && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {form.formState.errors.message.message}
              </p>
            )}
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