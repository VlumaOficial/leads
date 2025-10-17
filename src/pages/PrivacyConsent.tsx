"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Shield, FileText, Scale } from "lucide-react";

interface PrivacyConsentProps {
  open: boolean;
  onAccept: () => void;
  onOpenChange: (open: boolean) => void;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ open, onAccept, onOpenChange }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = React.useState(false);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
  };

  // Detectar scroll no viewport do ScrollArea
  React.useEffect(() => {
    if (!open) {
      setHasScrolledToBottom(false);
      return;
    }

    // Aguardar o modal renderizar completamente
    const timer = setTimeout(() => {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (!viewport) return;

      const handleScroll = () => {
        const scrollTop = viewport.scrollTop;
        const scrollHeight = viewport.scrollHeight;
        const clientHeight = viewport.clientHeight;
        
        // Considera que chegou ao final se estiver a 100px do fim (mais tolerante)
        if (scrollHeight - scrollTop - clientHeight < 100) {
          setHasScrolledToBottom(true);
        }
      };

      viewport.addEventListener('scroll', handleScroll);
      
      // Verificar se já está no final ao abrir (conteúdo pequeno)
      handleScroll();

      return () => {
        viewport.removeEventListener('scroll', handleScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-gradient-to-br from-card-dark/95 to-gray-950/95 backdrop-blur-xl border-purple-vivid/20 text-branco-puro">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-vivid to-cyan-vivid rounded-full blur-lg opacity-50" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-vivid to-cyan-vivid rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-purple-vivid via-cyan-vivid to-verde-inteligente bg-clip-text text-transparent">
              Política de Privacidade e Termos de Uso
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea 
          className="h-[55vh] pr-4"
        >
          <div className="space-y-8 text-sm text-cinza-claro leading-relaxed">
            {/* Política de Privacidade */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-vivid" />
                <h2 className="text-xl font-bold text-branco-puro">Política de Privacidade da Vluma</h2>
              </div>
              
              <p className="mb-4">
                Bem-vindo à Vluma, inscrita no CNPJ 87.085.542/500, com sede na Rua Americano da costa, 72 Roma, Salvador Bahia. Nosso compromisso é com a integridade e a segurança dos dados pessoais dos nossos usuários e clientes. Esta Política de Privacidade aplica-se a todas as interações digitais realizadas em nosso site www.vluma.com.br, serviços associados, aplicativos móveis e outras plataformas digitais sob nosso controle.
              </p>
              
              <p className="mb-6">
                Ao acessar e utilizar nossas plataformas, você reconhece e concorda com as práticas descritas nesta política. Nós tratamos a proteção de seus dados pessoais com a máxima seriedade e nos comprometemos a processá-los de forma responsável, transparente e segura.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Definições</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Dados Pessoais:</strong> são informações que identificam ou podem identificar uma pessoa natural.</li>
                <li><strong>Dados Pessoais Sensíveis:</strong> são informações que revelam características pessoais íntimas, como origem racial, convicções religiosas, opiniões políticas, dados genéticos ou biométricos.</li>
                <li><strong>Tratamento de Dados Pessoais:</strong> abrange qualquer operação com Dados Pessoais, como coleta, registro, armazenamento, uso, compartilhamento ou destruição.</li>
                <li><strong>Leis de Proteção de Dados:</strong> são todas as leis que regulamentam o Tratamento de Dados Pessoais, incluindo a LGPD (Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/18).</li>
              </ul>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Dados Coletados e Motivos da Coleta</h3>
              <p className="mb-3">Nós coletamos e processamos os seguintes tipos de dados pessoais:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Informações Fornecidas por Você:</strong> Isso inclui, mas não se limita a, nome, sobrenome, endereço de e-mail, endereço físico, informações de pagamento e quaisquer outras informações que você optar por fornecer ao criar uma conta, fazer uma compra ou interagir com nossos serviços de atendimento ao cliente.</li>
                <li><strong>Informações Coletadas Automaticamente:</strong> Quando você visita nosso site, coletamos automaticamente informações sobre seu dispositivo e sua interação com nosso site. Isso pode incluir dados como seu endereço IP, tipo de navegador, detalhes do dispositivo, fuso horário, páginas visitadas, produtos visualizados, sites ou termos de busca que o direcionaram ao nosso site, e informações sobre como você interage com nosso site.</li>
              </ul>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Uso de Cookies e Tecnologias de Rastreamento</h3>
              <p className="mb-3">
                A Vluma utiliza cookies, que são pequenos arquivos de texto armazenados no seu dispositivo, e outras tecnologias de rastreamento para melhorar a experiência do usuário em nosso site www.vluma.com.br, entender como nossos serviços são utilizados e otimizar nossas estratégias de marketing.
              </p>
              <p className="mb-3 font-semibold text-branco-suave">Tipos de Cookies Utilizados:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Cookies Essenciais:</strong> Essenciais para o funcionamento do site, permitindo que você navegue e use suas funcionalidades.</li>
                <li><strong>Cookies de Desempenho e Analíticos:</strong> Coletam informações sobre como os visitantes usam o nosso site.</li>
                <li><strong>Cookies de Funcionalidade:</strong> Permitem que o site lembre de escolhas que você faz.</li>
                <li><strong>Cookies de Publicidade e Redes Sociais:</strong> Usados para oferecer anúncios mais relevantes para você.</li>
              </ul>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Finalidades do Processamento de Dados</h3>
              <p className="mb-3">Os dados coletados são utilizados para:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Proporcionar, operar e melhorar nossos serviços e ofertas;</li>
                <li>Processar suas transações e enviar notificações relacionadas a suas compras;</li>
                <li>Personalizar sua experiência de usuário e recomendar conteúdo ou produtos que possam ser do seu interesse;</li>
                <li>Comunicar informações importantes, ofertas e promoções, conforme sua preferência de comunicação;</li>
                <li>Realizar análises internas para desenvolver e aprimorar nossos serviços;</li>
                <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
              </ul>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Compartilhamento e Transferência de Dados Pessoais</h3>
              <p className="mb-3">Nós podemos compartilhar seus dados pessoais com terceiros nas seguintes circunstâncias:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Com fornecedores de serviços e parceiros que nos auxiliam nas operações de negócio;</li>
                <li>Para cumprir com obrigações legais, responder a processos judiciais;</li>
                <li>Em caso de reestruturação corporativa, venda, fusão ou outra transferência de ativos.</li>
              </ul>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Links para outros sites e redes sociais</h3>
              <p className="mb-6">
                Nossa plataforma pode incluir links para sites externos de parceiros, anunciantes e fornecedores. Clicar nesses links implica que você será direcionado para fora do nosso site, entrando em domínios que seguem suas próprias políticas de privacidade, pelas quais não somos responsáveis.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Direitos dos Titulares dos Dados</h3>
              <p className="mb-3">Você possui diversos direitos em relação aos seus dados pessoais, incluindo:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>O direito de acesso, retificação ou exclusão de seus dados pessoais sob nossa posse;</li>
                <li>O direito de limitar ou se opor ao nosso processamento de seus dados;</li>
                <li>O direito à portabilidade de dados;</li>
                <li>O direito de retirar seu consentimento a qualquer momento.</li>
              </ul>
              <p className="mb-6">Para exercer esses direitos, entre em contato conosco através de <strong>adm@vluma.com.br</strong>.</p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Segurança dos Dados</h3>
              <p className="mb-6">
                Implementamos medidas de segurança técnica e organizacional para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, é importante notar que nenhum sistema é completamente seguro.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Alterações na Política de Privacidade</h3>
              <p className="mb-6">
                Nossa Política de Privacidade pode ser atualizada periodicamente. A versão mais atual será sempre publicada em nosso site, indicando a data da última revisão.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Contato</h3>
              <p className="mb-8">
                Se tiver dúvidas ou preocupações sobre nossa Política de Privacidade ou práticas de dados, por favor, não hesite em nos contatar em <strong>adm@vluma.com.br</strong>.
              </p>
            </section>

            {/* Termos de Uso */}
            <section className="border-t border-white/10 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-cyan-vivid" />
                <h2 className="text-xl font-bold text-branco-puro">Termos de Uso e Serviço da Vluma</h2>
              </div>
              
              <p className="mb-6">
                Seja Bem-Vindo ao site da Vluma. Antes de explorar tudo o que temos a oferecer, é importante que você entenda e concorde com algumas regras básicas que regem o uso do nosso site www.vluma.com.br, e qualquer outro serviço digital que nós oferecemos.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">1. Aceitando os Termos</h3>
              <p className="mb-6">
                Ao navegar e usar o site da Vluma, você concorda automaticamente com nossas regras e condições. Estamos sempre procurando melhorar, então esses termos podem mudar de vez em quando.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">2. Como Usar o Nosso Site</h3>
              <p className="mb-6">
                A maior parte do nosso site está aberta para você sem a necessidade de cadastro. No entanto, algumas seções especiais podem exigir que você crie uma conta. Pedimos que você seja honesto ao fornecer suas informações e que mantenha sua senha e login seguros.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">3. Sua Privacidade</h3>
              <p className="mb-6">
                Na Vluma, a privacidade é um valor essencial. Ao interagir com nosso site, você aceita nossa Política de Privacidade, que detalha nossa abordagem responsável e conforme às leis para o manejo dos seus dados pessoais.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">4. Direitos de Conteúdo</h3>
              <p className="mb-6">
                O conteúdo disponível no site da Vluma, incluindo, mas não se limitando a, textos, imagens, ilustrações, designs, ícones, fotografias, programas de computador, videoclipes e áudios, constitui propriedade intelectual protegida tanto pela legislação nacional quanto por tratados internacionais.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">5. Cookies e Mais</h3>
              <p className="mb-6">
                Utilizamos cookies para melhorar sua experiência, coletando informações anônimas durante sua visita, como suas preferências de idioma, duração da visita, páginas acessadas, e outras estatísticas de uso.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">6. Explorando Links Externos</h3>
              <p className="mb-6">
                Nosso site pode incluir links para sites externos que achamos que podem ser do seu interesse. Note que não temos controle sobre esses sites externos e, portanto, não somos responsáveis pelo seu conteúdo ou políticas.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">7. Mudanças e Atualizações</h3>
              <p className="mb-6">
                A evolução é parte de como operamos, o que significa que estes Termos de Uso podem passar por atualizações para refletir melhor as mudanças em nossos serviços ou na legislação.
              </p>

              <h3 className="text-lg font-semibold text-branco-suave mb-3">Dúvidas ou Comentários?</h3>
              <p className="mb-4">
                Se tiver dúvidas sobre estes termos, não hesite em nos contatar através do e-mail <strong>adm@vluma.com.br</strong>.
              </p>
            </section>

            {/* Indicador de scroll */}
            {!hasScrolledToBottom && (
              <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-card-dark via-card-dark/90 to-transparent py-4 text-center">
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm text-cyan-vivid font-semibold"
                >
                  ↓ Role para ler e aceitar ↓
                </motion.p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
          <p className="text-xs text-cinza-claro">
            {hasScrolledToBottom ? (
              <span className="text-verde-inteligente font-semibold">✓ Você leu todo o conteúdo</span>
            ) : (
              <span className="text-yellow-500">⚠ Role para ler todo o conteúdo</span>
            )}
          </p>
          <Button
            onClick={handleAccept}
            disabled={!hasScrolledToBottom}
            className="px-8 py-3 font-bold bg-gradient-to-r from-laranja-cta to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-laranja-cta/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Aceito os Termos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyConsent;