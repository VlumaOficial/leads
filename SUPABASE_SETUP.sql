-- =====================================================
-- VLUMA - Configuração do Supabase para Captura de Leads
-- Data: 16/10/2025
-- =====================================================

-- =====================================================
-- 1. TABELA: respostas_questionario
-- Armazena as respostas do questionário de qualificação
-- =====================================================

CREATE TABLE IF NOT EXISTS respostas_questionario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Etapa 1: Segmento (checkbox - array)
  segmento TEXT[],
  
  -- Etapa 2: Função na empresa (radio - texto único)
  funcao_na_empresa TEXT,
  
  -- Etapa 3: Objetivo simplificar (radio - texto único)
  objetivo_simplificar TEXT,
  
  -- Etapa 4: Situação atual (radio - texto único)
  situacao_atual TEXT,
  
  -- Etapa 4: Motivação (checkbox - array)
  motivacao TEXT[],
  
  -- Etapa 5: Maturidade digital (radio - texto único)
  maturidade_digital TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_respostas_created_at ON respostas_questionario(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_respostas_segmento ON respostas_questionario USING GIN(segmento);
CREATE INDEX IF NOT EXISTS idx_respostas_funcao ON respostas_questionario(funcao_na_empresa);

-- =====================================================
-- 2. TABELA: contatos
-- Armazena os dados de contato dos leads
-- =====================================================

CREATE TABLE IF NOT EXISTS contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados de contato
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  mensagem TEXT,
  
  -- Relacionamento com respostas do questionário
  respostas_id UUID REFERENCES respostas_questionario(id) ON DELETE CASCADE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON contatos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contatos_email ON contatos(email);
CREATE INDEX IF NOT EXISTS idx_contatos_respostas_id ON contatos(respostas_id);

-- =====================================================
-- 3. TRIGGER: Atualizar updated_at automaticamente
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para respostas_questionario
DROP TRIGGER IF EXISTS update_respostas_updated_at ON respostas_questionario;
CREATE TRIGGER update_respostas_updated_at
    BEFORE UPDATE ON respostas_questionario
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para contatos
DROP TRIGGER IF EXISTS update_contatos_updated_at ON contatos;
CREATE TRIGGER update_contatos_updated_at
    BEFORE UPDATE ON contatos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. RLS (Row Level Security) - OPÇÃO 1: DESABILITADO
-- Use esta opção para desenvolvimento/testes
-- =====================================================

ALTER TABLE respostas_questionario DISABLE ROW LEVEL SECURITY;
ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. RLS (Row Level Security) - OPÇÃO 2: HABILITADO
-- Use esta opção para produção (comente a OPÇÃO 1)
-- =====================================================

-- Descomente as linhas abaixo para habilitar RLS em produção:

-- ALTER TABLE respostas_questionario ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- -- Política: Permitir INSERT público (anônimo)
-- CREATE POLICY "Allow public insert on respostas_questionario" 
--   ON respostas_questionario
--   FOR INSERT 
--   TO anon
--   WITH CHECK (true);

-- CREATE POLICY "Allow public insert on contatos" 
--   ON contatos
--   FOR INSERT 
--   TO anon
--   WITH CHECK (true);

-- -- Política: Permitir SELECT apenas para usuários autenticados
-- CREATE POLICY "Allow authenticated read on respostas_questionario" 
--   ON respostas_questionario
--   FOR SELECT 
--   TO authenticated
--   USING (true);

-- CREATE POLICY "Allow authenticated read on contatos" 
--   ON contatos
--   FOR SELECT 
--   TO authenticated
--   USING (true);

-- =====================================================
-- 6. VIEW: Leads Completos (JOIN das duas tabelas)
-- =====================================================

CREATE OR REPLACE VIEW vw_leads_completos AS
SELECT 
  c.id as contato_id,
  c.nome,
  c.email,
  c.whatsapp,
  c.mensagem,
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
-- 7. CONSULTAS ÚTEIS
-- =====================================================

-- Ver todos os leads (últimos 100)
-- SELECT * FROM vw_leads_completos LIMIT 100;

-- Contar leads por segmento
-- SELECT 
--   unnest(segmento) as segmento,
--   COUNT(*) as total
-- FROM respostas_questionario
-- GROUP BY unnest(segmento)
-- ORDER BY total DESC;

-- Contar leads por função
-- SELECT 
--   funcao_na_empresa,
--   COUNT(*) as total
-- FROM respostas_questionario
-- GROUP BY funcao_na_empresa
-- ORDER BY total DESC;

-- Leads cadastrados hoje
-- SELECT * FROM vw_leads_completos 
-- WHERE DATE(data_cadastro) = CURRENT_DATE;

-- Leads cadastrados nos últimos 7 dias
-- SELECT * FROM vw_leads_completos 
-- WHERE data_cadastro >= NOW() - INTERVAL '7 days';

-- =====================================================
-- 8. DADOS DE TESTE (OPCIONAL)
-- =====================================================

-- Descomente para inserir dados de teste:

-- INSERT INTO respostas_questionario (
--   segmento, 
--   funcao_na_empresa, 
--   objetivo_simplificar, 
--   situacao_atual, 
--   motivacao, 
--   maturidade_digital
-- ) VALUES (
--   ARRAY['clinicas-saude', 'beleza-bem-estar'],
--   'proprietario',
--   'vendas-atendimento',
--   'automatizar',
--   ARRAY['crescer-negocio', 'ganhar-tempo'],
--   'algumas-evoluir'
-- ) RETURNING id;

-- -- Use o ID retornado acima para inserir o contato:
-- INSERT INTO contatos (
--   nome, 
--   email, 
--   whatsapp, 
--   mensagem, 
--   respostas_id
-- ) VALUES (
--   'João Silva',
--   'joao@exemplo.com',
--   '(11) 98765-4321',
--   'Gostaria de saber mais sobre automação',
--   'COLE_O_ID_AQUI'
-- );

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Para executar este script:
-- 1. Acesse o Supabase Dashboard (https://app.supabase.com)
-- 2. Selecione seu projeto
-- 3. Vá em "SQL Editor"
-- 4. Cole este script completo
-- 5. Clique em "Run" ou pressione Ctrl+Enter
-- 6. Verifique se as tabelas foram criadas em "Table Editor"
