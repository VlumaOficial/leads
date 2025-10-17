# 📊 Google Analytics - Configuração

## 🎯 Objetivo
Rastrear comportamento dos usuários, conversões e métricas do funil de leads.

---

## 🔧 Como Configurar

### **1. Criar Propriedade no Google Analytics**

1. Acesse: https://analytics.google.com
2. Clique em **Admin** (engrenagem no canto inferior esquerdo)
3. Clique em **Criar Propriedade**
4. Preencha:
   - **Nome da propriedade:** VLUMA - Captura de Leads
   - **Fuso horário:** (GMT-03:00) Brasília
   - **Moeda:** Real brasileiro (BRL)
5. Clique em **Avançar**
6. Configure os detalhes da empresa
7. Clique em **Criar**

---

### **2. Obter o ID de Medição (Measurement ID)**

1. Após criar a propriedade, vá em **Fluxos de dados**
2. Clique em **Adicionar fluxo** → **Web**
3. Preencha:
   - **URL do site:** https://seu-dominio.vercel.app
   - **Nome do fluxo:** VLUMA Leads
4. Clique em **Criar fluxo**
5. **Copie o ID de Medição** (formato: `G-XXXXXXXXXX`)

---

### **3. Adicionar o ID no Projeto**

Substitua `G-XXXXXXXXXX` pelo seu ID real em 2 arquivos:

#### **Arquivo 1: `/index.html`**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU-ID-AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SEU-ID-AQUI');
</script>
```

#### **Arquivo 2: `/src/hooks/useAnalytics.ts`**
```typescript
// Linha 20
window.gtag('config', 'G-SEU-ID-AQUI', {
  page_path: location.pathname + location.search,
});
```

---

## 📊 Eventos Rastreados Automaticamente

### **1. Pageviews (Visualizações de Página)**
Rastreado automaticamente em todas as rotas:
- `/` - Tela inicial (WelcomeScreen)
- `/questionnaire/1` - Etapa 1 do questionário
- `/questionnaire/2` - Etapa 2 do questionário
- `/questionnaire/3` - Etapa 3 do questionário
- `/questionnaire/4` - Etapa 4 do questionário
- `/questionnaire/5` - Etapa 5 do questionário
- `/contact` - Formulário de contato
- `/success` - Tela de sucesso

---

## 🎯 Eventos Customizados Disponíveis

### **Para usar os eventos, importe o analytics:**
```typescript
import { analytics } from '@/hooks/useAnalytics';
```

### **1. Início do Questionário**
```typescript
analytics.startQuestionnaire();
```
**Quando usar:** Quando o usuário clica em "Quero descobrir como" na tela inicial.

---

### **2. Progresso do Questionário**
```typescript
analytics.questionnaireStep(1, 'Segmento');
analytics.questionnaireStep(2, 'Função na Empresa');
// etc...
```
**Quando usar:** A cada etapa concluída do questionário.

---

### **3. Conclusão do Questionário**
```typescript
analytics.completeQuestionnaire();
```
**Quando usar:** Quando o usuário completa todas as 5 etapas.

---

### **4. Envio do Formulário**
```typescript
analytics.submitContact({
  hasMessage: true,
  segmentCount: 2,
  motivationCount: 3
});
```
**Quando usar:** Quando o formulário de contato é enviado com sucesso.

---

### **5. Lead Duplicado**
```typescript
analytics.duplicateLead('agendado');
```
**Quando usar:** Quando o sistema detecta email/WhatsApp duplicado.

---

### **6. Aceite de Privacidade**
```typescript
analytics.acceptPrivacy();
```
**Quando usar:** Quando o usuário marca o checkbox de privacidade.

---

### **7. Cliques em Botões**
```typescript
analytics.clickButton('Próximo', 'Questionário Etapa 1');
analytics.clickButton('Voltar', 'Questionário Etapa 3');
```
**Quando usar:** Para rastrear cliques importantes.

---

## 📈 Métricas Importantes no Google Analytics

### **1. Funil de Conversão**
Acompanhe quantos usuários:
1. Visitam a página inicial
2. Iniciam o questionário
3. Completam cada etapa
4. Chegam ao formulário de contato
5. Enviam o formulário

### **2. Taxa de Abandono**
Identifique em qual etapa os usuários mais desistem.

### **3. Tempo Médio**
Quanto tempo leva para completar o questionário.

### **4. Dispositivos**
Desktop vs Mobile - qual converte mais?

### **5. Origem do Tráfego**
De onde vêm os leads (Google, redes sociais, direto, etc.)

---

## 🔍 Como Ver os Eventos no Google Analytics

### **Tempo Real:**
1. Vá em **Relatórios** → **Tempo real**
2. Veja eventos acontecendo agora

### **Eventos:**
1. Vá em **Relatórios** → **Engajamento** → **Eventos**
2. Veja todos os eventos registrados

### **Conversões:**
1. Vá em **Configurar** → **Eventos**
2. Marque eventos importantes como "Conversão"
3. Sugestões:
   - `contact_submitted` ← Principal conversão
   - `questionnaire_completed`
   - `privacy_accepted`

---

## 📊 Relatórios Customizados Sugeridos

### **1. Funil de Leads**
```
Etapa 1: Pageview (/)
Etapa 2: questionnaire_started
Etapa 3: questionnaire_step (step_number = 5)
Etapa 4: questionnaire_completed
Etapa 5: contact_submitted
```

### **2. Performance por Etapa**
```
Evento: questionnaire_step
Dimensão: step_name
Métrica: Contagem de eventos
```

### **3. Leads Duplicados**
```
Evento: duplicate_lead
Dimensão: lead_status
Métrica: Contagem de eventos
```

---

## 🎯 Metas Recomendadas

### **Meta 1: Lead Capturado**
- **Tipo:** Evento
- **Evento:** `contact_submitted`
- **Valor:** R$ 50 (valor estimado do lead)

### **Meta 2: Questionário Completo**
- **Tipo:** Evento
- **Evento:** `questionnaire_completed`

### **Meta 3: Aceite de Privacidade**
- **Tipo:** Evento
- **Evento:** `privacy_accepted`

---

## 🔐 Privacidade e LGPD

### **Dados NÃO coletados:**
- ❌ Nome
- ❌ Email
- ❌ WhatsApp
- ❌ Informações pessoais

### **Dados coletados:**
- ✅ Pageviews (páginas visitadas)
- ✅ Eventos (ações realizadas)
- ✅ Tempo de permanência
- ✅ Dispositivo e navegador
- ✅ Origem do tráfego

**Nota:** O Google Analytics coleta apenas dados anônimos de comportamento.

---

## 🧪 Testar se Está Funcionando

### **1. Modo de Depuração (Chrome)**

1. Instale a extensão: **Google Analytics Debugger**
2. Ative a extensão
3. Abra o Console (F12)
4. Navegue pelo site
5. Veja os eventos sendo enviados

### **2. Tempo Real no Google Analytics**

1. Abra o site em uma aba
2. Abra o Google Analytics em outra aba
3. Vá em **Relatórios** → **Tempo real**
4. Navegue pelo site
5. Veja os eventos aparecendo em tempo real

---

## 📝 Exemplo de Implementação

### **WelcomeScreen.tsx**
```typescript
import { analytics } from '@/hooks/useAnalytics';

const handleStart = () => {
  analytics.startQuestionnaire();
  navigate('/questionnaire/1');
};
```

### **QuestionnaireScreen.tsx**
```typescript
import { analytics } from '@/hooks/useAnalytics';

const handleNext = () => {
  analytics.questionnaireStep(currentStep, stepName);
  // ... resto do código
};
```

### **ContactScreen.tsx**
```typescript
import { analytics } from '@/hooks/useAnalytics';

const onSubmit = async (data) => {
  // ... código de envio
  
  analytics.submitContact({
    hasMessage: !!data.message,
    segmentCount: questionnaireAnswers.segment?.length || 0,
    motivationCount: questionnaireAnswers.motivation?.length || 0,
  });
  
  // ... resto do código
};
```

---

## ✅ Checklist de Configuração

- [ ] Criar propriedade no Google Analytics
- [ ] Obter ID de Medição (G-XXXXXXXXXX)
- [ ] Substituir ID no `/index.html`
- [ ] Substituir ID no `/src/hooks/useAnalytics.ts`
- [ ] Fazer commit e push
- [ ] Deploy na Vercel
- [ ] Testar em Tempo Real
- [ ] Configurar eventos como conversões
- [ ] Criar relatórios customizados
- [ ] Configurar metas

---

## 📞 Suporte

**Documentação oficial:** https://support.google.com/analytics

---

**Google Analytics configurado e pronto para uso!** 📊

---

© 2025 VLUMA - Documentação Google Analytics
