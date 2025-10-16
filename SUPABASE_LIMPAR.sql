-- =====================================================
-- VLUMA - Limpar Banco de Dados (use com cuidado!)
-- Execute APENAS se precisar recomeçar do zero
-- =====================================================

-- ⚠️ ATENÇÃO: Este script vai DELETAR todas as tabelas e dados!
-- Use apenas se quiser recomeçar a configuração do zero

-- =====================================================
-- 1. REMOVER VIEW
-- =====================================================

DROP VIEW IF EXISTS vw_leads_completos;

-- =====================================================
-- 2. REMOVER TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS set_updated_at_respostas ON respostas_questionario;
DROP TRIGGER IF EXISTS set_updated_at_contatos ON contatos;
DROP TRIGGER IF EXISTS update_respostas_updated_at ON respostas_questionario;
DROP TRIGGER IF EXISTS update_contatos_updated_at ON contatos;

-- =====================================================
-- 3. REMOVER FUNÇÃO
-- =====================================================

DROP FUNCTION IF EXISTS update_updated_at();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- =====================================================
-- 4. REMOVER TABELAS (CASCADE remove relacionamentos)
-- =====================================================

DROP TABLE IF EXISTS contatos CASCADE;
DROP TABLE IF EXISTS respostas_questionario CASCADE;

-- =====================================================
-- 5. VERIFICAR SE FOI REMOVIDO
-- =====================================================

SELECT 'Banco de dados limpo!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('respostas_questionario', 'contatos');

-- Se a consulta acima não retornar nenhuma linha, está tudo limpo!
-- Agora você pode executar o SUPABASE_SETUP_SIMPLES.sql
