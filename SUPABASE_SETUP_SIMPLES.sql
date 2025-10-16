-- =====================================================
-- VLUMA - Setup Simplificado do Supabase
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELA: respostas_questionario
-- =====================================================

CREATE TABLE respostas_questionario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  segmento TEXT[],
  funcao_na_empresa TEXT,
  objetivo_simplificar TEXT,
  situacao_atual TEXT,
  motivacao TEXT[],
  maturidade_digital TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 2. CRIAR TABELA: contatos
-- =====================================================

CREATE TABLE contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  mensagem TEXT,
  respostas_id UUID REFERENCES respostas_questionario(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 3. CRIAR ÍNDICES
-- =====================================================

CREATE INDEX idx_respostas_created_at ON respostas_questionario(created_at DESC);
CREATE INDEX idx_respostas_segmento ON respostas_questionario USING GIN(segmento);
CREATE INDEX idx_contatos_created_at ON contatos(created_at DESC);
CREATE INDEX idx_contatos_email ON contatos(email);
CREATE INDEX idx_contatos_respostas_id ON contatos(respostas_id);

-- =====================================================
-- 4. CRIAR FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CRIAR TRIGGERS
-- =====================================================

CREATE TRIGGER set_updated_at_respostas
  BEFORE UPDATE ON respostas_questionario
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_contatos
  BEFORE UPDATE ON contatos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 6. DESABILITAR RLS (para desenvolvimento)
-- =====================================================

ALTER TABLE respostas_questionario DISABLE ROW LEVEL SECURITY;
ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CRIAR VIEW para consultar leads completos
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
-- 8. VERIFICAR SE FUNCIONOU
-- =====================================================

-- Execute esta consulta para verificar:
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('respostas_questionario', 'contatos');
