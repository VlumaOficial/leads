"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Mail, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

interface SuccessScreenProps {
  nome?: string;
  email?: string;
  status?: 'pendente' | 'agendado' | 'realizado';
  dataAgendamento?: string;
}

const SuccessScreen = () => {
  const navigate = useNavigate();
  const [dadosLead, setDadosLead] = React.useState<SuccessScreenProps>({});

  React.useEffect(() => {
    // Recupera dados do localStorage
    const dados = localStorage.getItem("leadSuccess");
    if (dados) {
      setDadosLead(JSON.parse(dados));
    }
  }, []);

  const handleVoltar = () => {
    // Limpa dados e redireciona para o site da Vluma
    localStorage.removeItem("leadSuccess");
    localStorage.removeItem("questionnaireAnswers");
    window.location.href = "https://www.vluma.com.br";
  };

  const getMensagemPorStatus = () => {
    const { status, dataAgendamento, nome } = dadosLead;

    if (status === 'agendado' && dataAgendamento) {
      const data = new Date(dataAgendamento);
      const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return {
        titulo: `${nome ? nome.split(' ')[0] : 'Olá'}, você já tem um agendamento!`,
        mensagem: `Identificamos que você já possui uma reunião agendada para ${dataFormatada}.`,
        submensagem: "Em caso de dúvidas, entre em contato conosco.",
        icone: Calendar,
        cor: "from-blue-vivid to-cyan-vivid"
      };
    }

    if (status === 'realizado') {
      return {
        titulo: `${nome ? nome.split(' ')[0] : 'Olá'}, já realizamos sua apresentação!`,
        mensagem: "Identificamos que você já participou de uma apresentação conosco anteriormente.",
        submensagem: "Em caso de dúvidas ou para agendar uma nova conversa, entre em contato.",
        icone: CheckCircle2,
        cor: "from-verde-inteligente to-cyan-vivid"
      };
    }

    // Status 'pendente' ou novo cadastro
    return {
      titulo: `${nome ? nome.split(' ')[0] : 'Obrigado'}, recebemos suas informações!`,
      mensagem: "Em breve, um especialista da VLUMA entrará em contato para entender melhor o seu momento e apresentar as melhores soluções.",
      submensagem: "Fique atento ao seu WhatsApp e e-mail!",
      icone: CheckCircle2,
      cor: "from-cyan-vivid to-verde-inteligente"
    };
  };

  const mensagem = getMensagemPorStatus();
  const IconeStatus = mensagem.icone;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fundo-escuro via-gray-950 to-verde-inteligente/10 p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-verde-inteligente/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-cyan-vivid/15 rounded-full blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
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

        <div className="bg-gradient-to-br from-card-dark/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-verde-inteligente/20 shadow-2xl shadow-verde-inteligente/10 p-8 md:p-12 text-center">
          {/* Ícone de Sucesso */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className={`bg-gradient-to-br ${mensagem.cor} p-6 rounded-full`}>
              <IconeStatus className="w-16 h-16 text-branco-puro" />
            </div>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-black text-branco-puro mb-4 leading-tight"
          >
            {mensagem.titulo}
          </motion.h1>

          {/* Mensagem Principal */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-cinza-claro mb-4 leading-relaxed"
          >
            {mensagem.mensagem}
          </motion.p>

          {/* Submensagem */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base text-branco-suave mb-8"
          >
            {mensagem.submensagem}
          </motion.p>

          {/* Card de Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-cyan-vivid mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Dúvidas?</span>
            </div>
            <a 
              href="mailto:contato@vluma.com.br"
              className="text-branco-puro hover:text-cyan-vivid transition-colors text-lg font-medium"
            >
              contato@vluma.com.br
            </a>
          </motion.div>

          {/* Botão Voltar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={handleVoltar}
              className="w-full bg-gradient-to-r from-cyan-vivid to-verde-inteligente hover:from-cyan-vivid/90 hover:to-verde-inteligente/90 text-branco-puro font-bold py-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-vivid/50 group"
            >
              Voltar ao Início
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;
