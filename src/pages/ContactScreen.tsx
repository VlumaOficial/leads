"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare, Send, Shield, Handshake } from "lucide-react";
import Logo from "@/components/Logo";

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
  message: z.string().optional().transform(e => e === "" ? null : e), // Tornando opcional e transformando string vazia em null
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactScreen = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = React.useState(false);
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
    setIsSubmitting(true);
    try {
      // 1. Verificar se email ou WhatsApp já existem
      const whatsappLimpo = data.whatsapp.replace(/\D/g, '');
      
      const { data: contatoExistente, error: verificacaoError } = await supabase
        .from("contatos")
        .select("id, nome, status, data_agendamento, created_at")
        .or(`email.eq.${data.email},whatsapp.eq.${whatsappLimpo}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (verificacaoError && verificacaoError.code !== 'PGRST116') {
        // PGRST116 = nenhum registro encontrado (ok)
        console.error("Erro ao verificar duplicidade:", verificacaoError);
      }

      // 2. Se já existe, redireciona para tela de sucesso com informações
      if (contatoExistente) {
        localStorage.setItem("leadSuccess", JSON.stringify({
          nome: contatoExistente.nome,
          email: data.email,
          status: contatoExistente.status,
          dataAgendamento: contatoExistente.data_agendamento
        }));
        navigate("/success");
        return;
      }

      // 3. Se não existe, continua com o cadastro normal
      const savedAnswers = localStorage.getItem("questionnaireAnswers");
      const questionnaireAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};

      // 4. Inserir as respostas do questionário no Supabase
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

      // 5. Inserir os dados de contato no Supabase, vinculando às respostas
      const { error: contatoError } = await supabase.from("contatos").insert([
        {
          nome: data.name,
          email: data.email,
          whatsapp: whatsappLimpo,
          mensagem: data.message,
          respostas_id: respostasId,
          status: 'pendente', // Status inicial
          aceite_privacidade_em: new Date().toISOString(), // Registra data/hora do aceite
        },
      ]);

      if (contatoError) {
        console.error("Erro ao salvar dados de contato:", contatoError);
        showError("Erro ao salvar seus dados de contato. Tente novamente.");
        return;
      }

      // 6. Salvar dados para tela de sucesso e redirecionar
      localStorage.setItem("leadSuccess", JSON.stringify({
        nome: data.name,
        email: data.email,
        status: 'pendente'
      }));
      localStorage.removeItem("questionnaireAnswers");
      navigate("/success");
      
    } catch (error) {
      console.error("Erro inesperado ao enviar formulário:", error);
      showError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fundo-escuro via-gray-950 to-pink-vivid/10 p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-pink-vivid/20 rounded-full blur-[120px]"
          animate={{
            x: [0, -90, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-laranja-cta/15 rounded-full blur-[120px]"
          animate={{
            x: [0, 70, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo VLUMA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Logo size={70} animate={true} />
        </motion.div>

        <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-pink-vivid/20 shadow-2xl shadow-pink-vivid/10 p-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-black text-branco-puro mb-4 leading-tight"
          >
            Estamos prontos para criar algo{" "}
            <span className="bg-gradient-to-r from-pink-vivid to-laranja-cta bg-clip-text text-transparent">
              juntos
            </span>
            . <Handshake className="inline w-8 h-8 text-pink-vivid" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-cinza-claro mb-8 leading-relaxed"
          >
            Deixe seus dados para que um especialista entre em contato e entenda
            melhor o seu momento. Sem pressa. Sem compromisso. Apenas uma boa
            conversa.
          </motion.p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="name" className="sr-only">Nome</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-vivid">
                <User className="w-5 h-5" />
              </div>
              <Input
                id="name"
                placeholder="Nome completo"
                {...form.register("name")}
                className="pl-12 py-3 bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro placeholder:text-cinza-claro rounded-xl"
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.name.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="email" className="sr-only">E-mail</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-vivid">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="E-mail"
                {...form.register("email")}
                className="pl-12 py-3 bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro placeholder:text-cinza-claro rounded-xl"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.email.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Label htmlFor="whatsapp" className="sr-only">WhatsApp</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-vivid">
                <Phone className="w-5 h-5" />
              </div>
              <Input
                id="whatsapp"
                placeholder="WhatsApp (obrigatório)"
                {...form.register("whatsapp")}
                value={formatPhoneNumber(form.watch("whatsapp"))}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  form.setValue("whatsapp", formatted, { shouldValidate: true });
                }}
                className="pl-12 py-3 bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro placeholder:text-cinza-claro rounded-xl"
              />
            </div>
            {form.formState.errors.whatsapp && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.whatsapp.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Label htmlFor="message" className="sr-only">Mensagem</Label>
            <div className="relative">
              <div className="absolute left-4 top-4 text-cyan-vivid">
                <MessageSquare className="w-5 h-5" />
              </div>
              <Textarea
                id="message"
                placeholder="Quer contar um pouco mais sobre o que busca? (opcional)"
                {...form.register("message")}
                rows={4}
                className="pl-12 py-3 bg-white/5 border-white/20 focus:border-cyan-vivid text-branco-puro placeholder:text-cinza-claro rounded-xl resize-none"
              />
            </div>
            {form.formState.errors.message && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.message.message}
              </p>
            )}
          </motion.div>

          {/* Checkbox de Consentimento de Privacidade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-6 border-t border-white/10"
          >
            <div className="bg-purple-vivid/10 border border-purple-vivid/30 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-purple-vivid" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-branco-puro mb-2">
                    Política de Privacidade e Proteção de Dados
                  </h3>
                  <p className="text-xs text-cinza-claro leading-relaxed">
                    Ao enviar este formulário, você autoriza o uso das informações fornecidas para contato e análise do seu perfil de interesse, conforme a{" "}
                    <strong className="text-branco-suave">Lei Geral de Proteção de Dados (Lei nº 13.709/18)</strong>.
                    Suas informações são tratadas com confidencialidade e não serão compartilhadas com terceiros.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy-consent"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(!!checked)}
                  className="mt-0.5 border-purple-vivid/50 data-[state=checked]:bg-purple-vivid data-[state=checked]:border-purple-vivid"
                />
                <label
                  htmlFor="privacy-consent"
                  className="text-sm text-branco-suave cursor-pointer leading-relaxed"
                >
                  Li e concordo com a{" "}
                  <a
                    href="https://coreait.com.br/politica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-vivid hover:text-cyan-vivid/80 underline font-semibold transition-colors"
                  >
                    Política de Privacidade e Uso de Dados
                  </a>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !agreedToPrivacy || !form.formState.isValid}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-laranja-cta to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-laranja-cta/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.div>
                  Enviando...
                </>
              ) : (
                <>
                  ✨ Finalizar e Enviar Minhas Respostas
                  <Send className="w-5 h-5" />
                </>
              )}
            </Button>

          </motion.div>
        </form>
      </div>
      </motion.div>
    </div>
  );
};

export default ContactScreen;