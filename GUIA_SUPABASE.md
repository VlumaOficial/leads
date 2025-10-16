# 🗄️ Guia de Configuração do Supabase

## 📅 Data: 16/10/2025
## 🎯 Objetivo: Configurar banco de dados para captura de leads

---

## 📋 PASSO A PASSO

### **1. Acessar o Supabase Dashboard**

1. Abra: https://app.supabase.com
2. Faça login na sua conta
3. Selecione o projeto: **wepgwljeypsymffkhahq**

---

### **2. Abrir o SQL Editor**

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query** (Nova consulta)
3. Copie todo o conteúdo do arquivo `SUPABASE_SETUP.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione `Ctrl + Enter`)

---

### **3. Verificar se as Tabelas foram Criadas**

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 2 tabelas:
   - ✅ `respostas_questionario`
   - ✅ `contatos`
3. Clique em cada tabela para ver a estrutura

---

## 📊 ESTRUTURA DAS TABELAS

### **Tabela: respostas_questionario**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único (gerado automaticamente) |
| `segmento` | TEXT[] | Array com segmentos selecionados |
| `funcao_na_empresa` | TEXT | Função do lead na empresa |
| `objetivo_simplificar` | TEXT | O que deseja simplificar |
| `situacao_atual` | TEXT | Situação atual do negócio |
| `motivacao` | TEXT[] | Array com motivações |
| `maturidade_digital` | TEXT | Nível de maturidade digital |
| `created_at` | TIMESTAMP | Data/hora de criação |
| `updated_at` | TIMESTAMP | Data/hora de atualização |

### **Tabela: contatos**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único (gerado automaticamente) |
| `nome` | TEXT | Nome completo do lead |
| `email` | TEXT | E-mail do lead |
| `whatsapp` | TEXT | WhatsApp formatado |
| `mensagem` | TEXT | Mensagem opcional |
| `respostas_id` | UUID | Referência para respostas_questionario |
| `created_at` | TIMESTAMP | Data/hora de criação |
| `updated_at` | TIMESTAMP | Data/hora de atualização |

---

## 🔐 SEGURANÇA (RLS)

### **Configuração Atual: RLS DESABILITADO**

Por padrão, o script desabilita o RLS para facilitar o desenvolvimento:

```sql
ALTER TABLE respostas_questionario DISABLE ROW LEVEL SECURITY;
ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;
```

**Isso significa:**
- ✅ Qualquer pessoa pode inserir dados (INSERT)
- ✅ Perfeito para desenvolvimento e testes
- ⚠️ **NÃO recomendado para produção**

---

### **Para Produção: HABILITAR RLS**

Quando for para produção, edite o arquivo `SUPABASE_SETUP.sql`:

1. **Comente** as linhas de DISABLE:
```sql
-- ALTER TABLE respostas_questionario DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;
```

2. **Descomente** as linhas de ENABLE e políticas:
```sql
ALTER TABLE respostas_questionario ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on respostas_questionario" 
  ON respostas_questionario
  FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public insert on contatos" 
  ON contatos
  FOR INSERT 
  TO anon
  WITH CHECK (true);
```

3. Execute novamente no SQL Editor

---

## 🧪 TESTAR A CONFIGURAÇÃO

### **Opção 1: Inserir Dados de Teste via SQL**

No SQL Editor, execute:

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
  respostas_id
) VALUES (
  'João Silva',
  'joao@exemplo.com',
  '(11) 98765-4321',
  'Gostaria de saber mais sobre automação',
  'COLE_O_ID_AQUI'  -- ← Substitua pelo ID retornado acima
);
```

### **Opção 2: Testar via Aplicação**

1. Abra a aplicação: http://localhost:8080
2. Preencha o questionário completo
3. Envie o formulário de contato
4. Verifique no Supabase se os dados foram salvos

---

## 📊 CONSULTAS ÚTEIS

### **Ver todos os leads:**

```sql
SELECT * FROM vw_leads_completos LIMIT 100;
```

### **Contar leads por segmento:**

```sql
SELECT 
  unnest(segmento) as segmento,
  COUNT(*) as total
FROM respostas_questionario
GROUP BY unnest(segmento)
ORDER BY total DESC;
```

### **Contar leads por função:**

```sql
SELECT 
  funcao_na_empresa,
  COUNT(*) as total
FROM respostas_questionario
GROUP BY funcao_na_empresa
ORDER BY total DESC;
```

### **Leads cadastrados hoje:**

```sql
SELECT * FROM vw_leads_completos 
WHERE DATE(data_cadastro) = CURRENT_DATE;
```

### **Leads cadastrados nos últimos 7 dias:**

```sql
SELECT * FROM vw_leads_completos 
WHERE data_cadastro >= NOW() - INTERVAL '7 days';
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### **1. No Supabase Dashboard:**

1. Vá em **Table Editor**
2. Clique em `contatos`
3. Você deve ver os dados inseridos

### **2. No Console do Navegador (F12):**

Após enviar o formulário, verifique se há:
- ✅ Mensagem de sucesso
- ❌ Erros no console

### **3. Testar a View:**

```sql
SELECT * FROM vw_leads_completos;
```

Deve retornar os leads com todas as informações combinadas.

---

## ⚠️ TROUBLESHOOTING

### **Erro: "permission denied for table"**

**Causa:** RLS está habilitado mas sem políticas corretas.

**Solução:**
```sql
ALTER TABLE respostas_questionario DISABLE ROW LEVEL SECURITY;
ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;
```

---

### **Erro: "relation does not exist"**

**Causa:** Tabelas não foram criadas.

**Solução:**
1. Execute o script `SUPABASE_SETUP.sql` novamente
2. Verifique se há erros no SQL Editor

---

### **Erro: "duplicate key value violates unique constraint"**

**Causa:** Tentando inserir um ID que já existe.

**Solução:**
- Não especifique o `id` no INSERT
- Deixe o banco gerar automaticamente

---

### **Dados não aparecem na aplicação:**

**Verifique:**
1. ✅ Arquivo `.env` tem as credenciais corretas?
2. ✅ Tabelas foram criadas no Supabase?
3. ✅ RLS está desabilitado (para testes)?
4. ✅ Console do navegador mostra erros?

---

## 📁 ARQUIVOS RELACIONADOS

1. **SUPABASE_SETUP.sql** - Script SQL completo
2. **.env** - Credenciais do Supabase
3. **src/integrations/supabase/client.ts** - Cliente Supabase
4. **src/pages/ContactScreen.tsx** - Código que salva os dados

---

## 🚀 PRÓXIMOS PASSOS

Após configurar o Supabase:

1. ✅ Testar o fluxo completo da aplicação
2. ✅ Verificar se os dados estão sendo salvos
3. ✅ Criar dashboard para visualizar leads (opcional)
4. ✅ Configurar notificações por email (opcional)
5. ✅ Deploy da aplicação

---

## 📞 SUPORTE

Se tiver problemas:

1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase (Dashboard → Logs)
3. Teste as consultas SQL diretamente no SQL Editor
4. Verifique se o `.env` está correto

---

**Configuração do Supabase pronta! 🎉**

Execute o script SQL e teste a aplicação!

---

© 2025 VLUMA - Guia de Configuração do Supabase
