-- =====================================================
-- VLUMA - Tabela de Agendamentos e Validações
-- Execute este script após o SUPABASE_SETUP_SIMPLES.sql
-- =====================================================

-- =====================================================
-- 1. CRIAR ENUM para status do agendamento
-- =====================================================

CREATE TYPE status_agendamento AS ENUM (
  'pendente',           -- Lead cadastrado, aguardando contato
  'agendado',          -- Reunião agendada
  'realizado',         -- Reunião já realizada
  'cancelado'          -- Agendamento cancelado
);

-- =====================================================
-- 2. ADICIONAR COLUNAS na tabela contatos
-- =====================================================

ALTER TABLE contatos 
ADD COLUMN IF NOT EXISTS status status_agendamento DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS data_agendamento TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS aceite_privacidade_em TIMESTAMPTZ;

-- =====================================================
-- 3. CRIAR ÍNDICES para busca rápida
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_contatos_status ON contatos(status);
CREATE INDEX IF NOT EXISTS idx_contatos_data_agendamento ON contatos(data_agendamento);

-- =====================================================
-- 4. CRIAR FUNÇÃO para verificar duplicidade
-- =====================================================

CREATE OR REPLACE FUNCTION verificar_contato_existente(
  p_email TEXT,
  p_whatsapp TEXT
)
RETURNS TABLE (
  existe BOOLEAN,
  status status_agendamento,
  data_agendamento TIMESTAMPTZ,
  nome TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as existe,
    c.status,
    c.data_agendamento,
    c.nome,
    c.created_at
  FROM contatos c
  WHERE c.email = p_email OR c.whatsapp = p_whatsapp
  ORDER BY c.created_at DESC
  LIMIT 1;
  
  -- Se não encontrou nenhum registro, retorna FALSE
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT FALSE, NULL::status_agendamento, NULL::TIMESTAMPTZ, NULL::TEXT, NULL::TIMESTAMPTZ;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. ATUALIZAR VIEW para incluir status
-- =====================================================

DROP VIEW IF EXISTS vw_leads_completos;

CREATE OR REPLACE VIEW vw_leads_completos AS
SELECT 
  c.id as contato_id,
  c.nome,
  c.email,
  c.whatsapp,
  c.mensagem,
  c.status,
  c.data_agendamento,
  c.observacoes,
  c.aceite_privacidade_em,
  c.created_at as data_cadastro,
  r.id as respostas_id,
  r.segmento,
  r.funcao_na_empresa,
  r.objetivo_simplificar,
  r.situacao_atual,
  r.motivacao,
  r.maturidade_digital
FROM contatos c
LEFT JOIN respostas_questionario r ON c.respostas_id = r.id
ORDER BY c.created_at DESC;

-- =====================================================
-- 6. CONSULTAS ÚTEIS
-- =====================================================

-- Verificar se email/telefone já existe:
-- SELECT * FROM verificar_contato_existente('email@exemplo.com', '(11) 98765-4321');

-- Ver leads por status:
-- SELECT status, COUNT(*) as total FROM contatos GROUP BY status;

-- Ver agendamentos futuros:
-- SELECT * FROM vw_leads_completos 
-- WHERE status = 'agendado' AND data_agendamento > NOW()
-- ORDER BY data_agendamento;

-- =====================================================
-- 7. DADOS DE TESTE (opcional)
-- =====================================================

-- Atualizar um lead existente para teste:
-- UPDATE contatos 
-- SET status = 'agendado', 
--     data_agendamento = NOW() + INTERVAL '2 days',
--     observacoes = 'Reunião agendada via WhatsApp'
-- WHERE email = 'seu@email.com';

-- =====================================================
-- VERIFICAR
-- =====================================================

SELECT 'Agendamentos configurados com sucesso!' as status;
