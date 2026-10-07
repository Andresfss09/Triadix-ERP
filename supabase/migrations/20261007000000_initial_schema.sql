-- ==============================================================================
-- Triadix ERP - Fase 1: Base y Esquema de Base de Datos
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumeración para los roles del sistema (basado en el diseño)
CREATE TYPE app_role AS ENUM (
    'super_admin',      -- Fundadores
    'security_admin',   -- Seguridad (Nicolás)
    'ai_admin',         -- IA (Luis)
    'gerente_sede',     -- Gerente de una sede específica
    'vendedor',         -- Mostrador Inteligente, POS
    'bodeguero',        -- Entradas/salidas, traslados
    'demo_readonly'     -- Modo demostración (sin mutaciones)
);

-- 3. Tabla de Sedes (branches)
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Perfiles Extendidos (profiles)
-- Se vincula directamente a auth.users de Supabase
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    role app_role DEFAULT 'vendedor'::app_role NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para updated_at en branches
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_branches_modtime
    BEFORE UPDATE ON branches
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Trigger para updated_at en profiles
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Habilitar RLS en estas tablas (las políticas se agregarán en la Fase 2)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

