import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Declaração do tipo para gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Hook para rastrear pageviews
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

// Função para rastrear eventos customizados
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

// Eventos específicos do questionário
export const analytics = {
  // Rastrear início do questionário
  startQuestionnaire: () => {
    trackEvent('questionnaire_started', {
      event_category: 'engagement',
      event_label: 'Questionário Iniciado',
    });
  },

  // Rastrear progresso do questionário
  questionnaireStep: (step: number, stepName: string) => {
    trackEvent('questionnaire_step', {
      event_category: 'engagement',
      event_label: `Etapa ${step}: ${stepName}`,
      step_number: step,
      step_name: stepName,
    });
  },

  // Rastrear conclusão do questionário
  completeQuestionnaire: () => {
    trackEvent('questionnaire_completed', {
      event_category: 'engagement',
      event_label: 'Questionário Concluído',
    });
  },

  // Rastrear envio do formulário de contato
  submitContact: (data: {
    hasMessage: boolean;
    segmentCount: number;
    motivationCount: number;
  }) => {
    trackEvent('contact_submitted', {
      event_category: 'conversion',
      event_label: 'Formulário de Contato Enviado',
      has_message: data.hasMessage,
      segment_count: data.segmentCount,
      motivation_count: data.motivationCount,
    });
  },

  // Rastrear lead duplicado
  duplicateLead: (status: string) => {
    trackEvent('duplicate_lead', {
      event_category: 'engagement',
      event_label: 'Lead Duplicado Detectado',
      lead_status: status,
    });
  },

  // Rastrear aceite de privacidade
  acceptPrivacy: () => {
    trackEvent('privacy_accepted', {
      event_category: 'engagement',
      event_label: 'Política de Privacidade Aceita',
    });
  },

  // Rastrear cliques em botões importantes
  clickButton: (buttonName: string, location: string) => {
    trackEvent('button_click', {
      event_category: 'engagement',
      event_label: buttonName,
      button_location: location,
    });
  },
};
