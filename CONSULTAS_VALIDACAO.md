# 🔍 Consultas SQL para Validação

## 📅 Data: 16/10/2025
## 🎯 Objetivo: Validar e monitorar o sistema de captura de leads

---

## ✅ 1. VALIDAÇÕES INICIAIS

### **1.1 Verificar se as tabelas foram criadas:**

```sql
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('respostas_questionario', 'contatos')
ORDER BY table_name;
```

**Resultado esperado:** 2 linhas
- contatos | BASE TABLE
- respostas_questionario | BASE TABLE

---

### **1.2 Verificar todas as colunas da tabela contatos:**

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contatos'
ORDER BY ordinal_position;
```

**Colunas esperadas:**
- id (uuid)
- nome (text)
- email (text)
- whatsapp (text)
- mensagem (text)
- respostas_id (uuid)
- status (USER-DEFINED)
- data_agendamento (timestamp with time zone)
- observacoes (text)
- aceite_privacidade_em (timestamp with time zone)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

---

### **1.3 Verificar todas as colunas da tabela respostas_questionario:**

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'respostas_questionario'
ORDER BY ordinal_position;
```

**Colunas esperadas:**
- id (uuid)
- segmento (ARRAY)
- funcao_na_empresa (text)
- objetivo_simplificar (text)
- situacao_atual (text)
- motivacao (ARRAY)
- maturidade_digital (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

---

### **1.4 Verificar se a view foi criada:**

```sql
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'vw_leads_completos';
```

**Resultado esperado:** 1 linha
- vw_leads_completos | VIEW

---

### **1.5 Verificar os valores do ENUM status:**

```sql
SELECT 
  enumlabel as status_valor,
  enumsortorder as ordem
FROM pg_enum
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
WHERE pg_type.typname = 'status_agendamento'
ORDER BY enumsortorder;
```

**Valores esperados:**
1. pendente
2. agendado
3. realizado
4. cancelado

---

## 📊 2. CONSULTAS DE MONITORAMENTO

### **2.1 Ver todos os leads (últimos 50):**

```sql
SELECT * FROM vw_leads_completos 
ORDER BY data_cadastro DESC 
LIMIT 50;
```

---

### **2.2 Contar total de leads:**

```sql
SELECT COUNT(*) as total_leads FROM contatos;
```

---

### **2.3 Contar leads por status:**

```sql
SELECT 
  status,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentual
FROM contatos
GROUP BY status
ORDER BY total DESC;
```

**Exemplo de resultado:**
```
status      | total | percentual
------------|-------|------------
pendente    | 45    | 75.00
agendado    | 10    | 16.67
realizado   | 5     | 8.33
```

---

### **2.4 Leads cadastrados hoje:**

```sql
SELECT 
  nome,
  email,
  whatsapp,
  status,
  TO_CHAR(created_at, 'HH24:MI:SS') as hora_cadastro
FROM contatos
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

---

### **2.5 Leads cadastrados nos últimos 7 dias:**

```sql
SELECT 
  DATE(created_at) as data,
  COUNT(*) as total_leads
FROM contatos
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY data DESC;
```

---

### **2.6 Leads cadastrados nos últimos 30 dias:**

```sql
SELECT 
  DATE(created_at) as data,
  COUNT(*) as total_leads
FROM contatos
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY data DESC;
```

---

## 🎯 3. ANÁLISE DE RESPOSTAS DO QUESTIONÁRIO

### **3.1 Contar leads por segmento (top 10):**

```sql
SELECT 
  unnest(segmento) as segmento,
  COUNT(*) as total
FROM respostas_questionario
WHERE segmento IS NOT NULL
GROUP BY unnest(segmento)
ORDER BY total DESC
LIMIT 10;
```

---

### **3.2 Contar leads por função na empresa:**

```sql
SELECT 
  funcao_na_empresa,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentual
FROM respostas_questionario
WHERE funcao_na_empresa IS NOT NULL
GROUP BY funcao_na_empresa
ORDER BY total DESC;
```

---

### **3.3 Contar leads por objetivo:**

```sql
SELECT 
  objetivo_simplificar,
  COUNT(*) as total
FROM respostas_questionario
WHERE objetivo_simplificar IS NOT NULL
GROUP BY objetivo_simplificar
ORDER BY total DESC;
```

---

### **3.4 Contar leads por situação atual:**

```sql
SELECT 
  situacao_atual,
  COUNT(*) as total
FROM respostas_questionario
WHERE situacao_atual IS NOT NULL
GROUP BY situacao_atual
ORDER BY total DESC;
```

---

### **3.5 Contar leads por maturidade digital:**

```sql
SELECT 
  maturidade_digital,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentual
FROM respostas_questionario
WHERE maturidade_digital IS NOT NULL
GROUP BY maturidade_digital
ORDER BY total DESC;
```

---

### **3.6 Análise de motivações (top 10):**

```sql
SELECT 
  unnest(motivacao) as motivacao,
  COUNT(*) as total
FROM respostas_questionario
WHERE motivacao IS NOT NULL
GROUP BY unnest(motivacao)
ORDER BY total DESC
LIMIT 10;
```

---

## 📅 4. GESTÃO DE AGENDAMENTOS

### **4.1 Ver agendamentos futuros:**

```sql
SELECT 
  nome,
  email,
  whatsapp,
  data_agendamento,
  TO_CHAR(data_agendamento, 'DD/MM/YYYY HH24:MI') as data_formatada,
  observacoes
FROM contatos
WHERE status = 'agendado' 
AND data_agendamento > NOW()
ORDER BY data_agendamento;
```

---

### **4.2 Ver agendamentos de hoje:**

```sql
SELECT 
  nome,
  email,
  whatsapp,
  TO_CHAR(data_agendamento, 'HH24:MI') as horario,
  observacoes
FROM contatos
WHERE status = 'agendado' 
AND DATE(data_agendamento) = CURRENT_DATE
ORDER BY data_agendamento;
```

---

### **4.3 Ver agendamentos da semana:**

```sql
SELECT 
  DATE(data_agendamento) as data,
  COUNT(*) as total_agendamentos
FROM contatos
WHERE status = 'agendado' 
AND data_agendamento BETWEEN NOW() AND NOW() + INTERVAL '7 days'
GROUP BY DATE(data_agendamento)
ORDER BY data;
```

---

### **4.4 Ver agendamentos atrasados (passados):**

```sql
SELECT 
  nome,
  email,
  whatsapp,
  data_agendamento,
  TO_CHAR(data_agendamento, 'DD/MM/YYYY HH24:MI') as data_formatada
FROM contatos
WHERE status = 'agendado' 
AND data_agendamento < NOW()
ORDER BY data_agendamento DESC;
```

---

### **4.5 Ver reuniões realizadas (últimas 30):**

```sql
SELECT 
  nome,
  email,
  TO_CHAR(created_at, 'DD/MM/YYYY') as data_cadastro,
  observacoes
FROM contatos
WHERE status = 'realizado'
ORDER BY created_at DESC
LIMIT 30;
```

---

## ⚖️ 5. VALIDAÇÃO LGPD (ACEITE DE PRIVACIDADE)

### **5.1 Verificar se todos os leads têm aceite registrado:**

```sql
SELECT 
  COUNT(*) as total_leads,
  COUNT(aceite_privacidade_em) as com_aceite,
  COUNT(*) - COUNT(aceite_privacidade_em) as sem_aceite
FROM contatos;
```

**Resultado esperado:** sem_aceite = 0

---

### **5.2 Ver todos os aceites de privacidade:**

```sql
SELECT 
  nome,
  email,
  aceite_privacidade_em,
  TO_CHAR(aceite_privacidade_em, 'DD/MM/YYYY HH24:MI:SS') as data_aceite_formatada,
  created_at
FROM contatos
WHERE aceite_privacidade_em IS NOT NULL
ORDER BY aceite_privacidade_em DESC
LIMIT 50;
```

---

### **5.3 Leads sem aceite registrado (NÃO DEVERIA EXISTIR):**

```sql
SELECT 
  id,
  nome,
  email,
  created_at
FROM contatos
WHERE aceite_privacidade_em IS NULL;
```

**Resultado esperado:** 0 linhas

---

### **5.4 Aceites de privacidade por dia (últimos 30 dias):**

```sql
SELECT 
  DATE(aceite_privacidade_em) as data,
  COUNT(*) as total_aceites
FROM contatos
WHERE aceite_privacidade_em >= NOW() - INTERVAL '30 days'
GROUP BY DATE(aceite_privacidade_em)
ORDER BY data DESC;
```

---

### **5.5 Tempo médio entre aceite e cadastro:**

```sql
SELECT 
  AVG(EXTRACT(EPOCH FROM (created_at - aceite_privacidade_em))) as segundos_diferenca,
  AVG(EXTRACT(EPOCH FROM (created_at - aceite_privacidade_em))) / 60 as minutos_diferenca
FROM contatos
WHERE aceite_privacidade_em IS NOT NULL;
```

**Resultado esperado:** Próximo de 0 (aceite e cadastro simultâneos)

---

## 🔍 6. VALIDAÇÃO DE DUPLICIDADE

### **6.1 Verificar emails duplicados:**

```sql
SELECT 
  email,
  COUNT(*) as total_cadastros,
  STRING_AGG(nome, ', ') as nomes,
  MIN(created_at) as primeiro_cadastro,
  MAX(created_at) as ultimo_cadastro
FROM contatos
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY total_cadastros DESC;
```

**Resultado esperado:** 0 linhas (sistema impede duplicidade)

---

### **6.2 Verificar WhatsApp duplicados:**

```sql
SELECT 
  whatsapp,
  COUNT(*) as total_cadastros,
  STRING_AGG(nome, ', ') as nomes,
  STRING_AGG(email, ', ') as emails
FROM contatos
GROUP BY whatsapp
HAVING COUNT(*) > 1
ORDER BY total_cadastros DESC;
```

**Resultado esperado:** 0 linhas (sistema impede duplicidade)

---

### **6.3 Buscar lead específico por email:**

```sql
SELECT * FROM vw_leads_completos 
WHERE email = 'email@exemplo.com';
```

---

### **6.4 Buscar lead específico por WhatsApp:**

```sql
SELECT * FROM vw_leads_completos 
WHERE whatsapp = '11987654321';
```

---

## 📈 7. RELATÓRIOS GERENCIAIS

### **7.1 Dashboard completo (visão geral):**

```sql
SELECT 
  'Total de Leads' as metrica,
  COUNT(*)::text as valor
FROM contatos

UNION ALL

SELECT 
  'Leads Hoje' as metrica,
  COUNT(*)::text as valor
FROM contatos
WHERE DATE(created_at) = CURRENT_DATE

UNION ALL

SELECT 
  'Leads Últimos 7 dias' as metrica,
  COUNT(*)::text as valor
FROM contatos
WHERE created_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
  'Agendamentos Futuros' as metrica,
  COUNT(*)::text as valor
FROM contatos
WHERE status = 'agendado' AND data_agendamento > NOW()

UNION ALL

SELECT 
  'Reuniões Realizadas' as metrica,
  COUNT(*)::text as valor
FROM contatos
WHERE status = 'realizado'

UNION ALL

SELECT 
  'Taxa de Conversão (Agendado/Total)' as metrica,
  ROUND(
    (SELECT COUNT(*) FROM contatos WHERE status = 'agendado')::numeric * 100.0 / 
    NULLIF((SELECT COUNT(*) FROM contatos), 0), 
    2
  )::text || '%' as valor;
```

---

### **7.2 Funil de conversão:**

```sql
WITH funil AS (
  SELECT 
    COUNT(*) FILTER (WHERE status = 'pendente') as pendentes,
    COUNT(*) FILTER (WHERE status = 'agendado') as agendados,
    COUNT(*) FILTER (WHERE status = 'realizado') as realizados,
    COUNT(*) as total
  FROM contatos
)
SELECT 
  'Pendente' as etapa,
  pendentes as quantidade,
  ROUND(pendentes * 100.0 / NULLIF(total, 0), 2) as percentual
FROM funil

UNION ALL

SELECT 
  'Agendado' as etapa,
  agendados as quantidade,
  ROUND(agendados * 100.0 / NULLIF(total, 0), 2) as percentual
FROM funil

UNION ALL

SELECT 
  'Realizado' as etapa,
  realizados as quantidade,
  ROUND(realizados * 100.0 / NULLIF(total, 0), 2) as percentual
FROM funil;
```

---

### **7.3 Leads que precisam de contato (pendentes há mais de 24h):**

```sql
SELECT 
  nome,
  email,
  whatsapp,
  created_at,
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as cadastrado_em,
  EXTRACT(HOUR FROM (NOW() - created_at)) as horas_aguardando
FROM contatos
WHERE status = 'pendente'
AND created_at < NOW() - INTERVAL '24 hours'
ORDER BY created_at;
```

---

### **7.4 Performance por período (últimos 6 meses):**

```sql
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as mes,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'agendado') as agendados,
  COUNT(*) FILTER (WHERE status = 'realizado') as realizados,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'realizado')::numeric * 100.0 / 
    NULLIF(COUNT(*), 0), 
    2
  ) as taxa_conversao_pct
FROM contatos
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY mes DESC;
```

---

## 🧹 8. MANUTENÇÃO E LIMPEZA

### **8.1 Atualizar status de agendamento vencido para pendente:**

```sql
UPDATE contatos 
SET status = 'pendente',
    observacoes = COALESCE(observacoes || ' | ', '') || 'Agendamento vencido em ' || TO_CHAR(data_agendamento, 'DD/MM/YYYY HH24:MI')
WHERE status = 'agendado' 
AND data_agendamento < NOW();
```

---

### **8.2 Ver últimas atualizações (updated_at):**

```sql
SELECT 
  nome,
  email,
  status,
  updated_at,
  created_at,
  EXTRACT(HOUR FROM (updated_at - created_at)) as horas_entre_criacao_e_atualizacao
FROM contatos
WHERE updated_at > created_at
ORDER BY updated_at DESC
LIMIT 20;
```

---

## 🔐 9. SEGURANÇA E AUDITORIA

### **9.1 Verificar RLS (Row Level Security):**

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('contatos', 'respostas_questionario');
```

**Para desenvolvimento:** rowsecurity = false  
**Para produção:** rowsecurity = true

---

### **9.2 Ver políticas RLS (se habilitado):**

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('contatos', 'respostas_questionario');
```

---

## 📝 10. CONSULTAS DE TESTE

### **10.1 Inserir lead de teste:**

```sql
-- 1. Inserir respostas do questionário
INSERT INTO respostas_questionario (
  segmento, 
  funcao_na_empresa, 
  objetivo_simplificar, 
  situacao_atual, 
  motivacao, 
  maturidade_digital
) VALUES (
  ARRAY['clinicas-saude', 'beleza-bem-estar'],
  'proprietario',
  'vendas-atendimento',
  'automatizar',
  ARRAY['crescer-negocio', 'ganhar-tempo'],
  'algumas-evoluir'
) RETURNING id;

-- 2. Copie o ID retornado e use no próximo INSERT:
INSERT INTO contatos (
  nome, 
  email, 
  whatsapp, 
  mensagem, 
  respostas_id,
  status,
  aceite_privacidade_em
) VALUES (
  'João Silva Teste',
  'teste@exemplo.com',
  '11987654321',
  'Lead de teste',
  'COLE_O_ID_AQUI',
  'pendente',
  NOW()
);
```

---

### **10.2 Atualizar lead de teste para agendado:**

```sql
UPDATE contatos 
SET status = 'agendado',
    data_agendamento = NOW() + INTERVAL '2 days',
    observacoes = 'Teste de agendamento'
WHERE email = 'teste@exemplo.com';
```

---

### **10.3 Deletar lead de teste:**

```sql
DELETE FROM contatos WHERE email = 'teste@exemplo.com';
-- As respostas serão deletadas automaticamente (CASCADE)
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Execute estas consultas na ordem para validar todo o sistema:

- [ ] 1.1 - Verificar tabelas criadas
- [ ] 1.2 - Verificar colunas de contatos
- [ ] 1.3 - Verificar colunas de respostas_questionario
- [ ] 1.4 - Verificar view criada
- [ ] 1.5 - Verificar valores do ENUM
- [ ] 2.2 - Contar total de leads
- [ ] 5.1 - Verificar aceites de privacidade
- [ ] 5.3 - Verificar leads sem aceite (deve ser 0)
- [ ] 6.1 - Verificar emails duplicados (deve ser 0)
- [ ] 6.2 - Verificar WhatsApp duplicados (deve ser 0)
- [ ] 7.1 - Ver dashboard completo

---

**Todas as consultas prontas para validação! 🎉**

Use estas queries no SQL Editor do Supabase para monitorar e validar o sistema.

---

© 2025 VLUMA - Consultas SQL para Validação e Monitoramento
