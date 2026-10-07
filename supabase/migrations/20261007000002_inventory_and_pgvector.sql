-- ==============================================================================
-- Triadix ERP - Fase 3: Inventario, Multisede y pgvector (Mind)
-- ==============================================================================

-- 1. Habilitar extensión pgvector para búsquedas semánticas (Mostrador Inteligente)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabla de Categorías (Jerárquica)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Productos Base
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    sku_prefix VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 19.00, -- IVA estándar
    is_active BOOLEAN DEFAULT true,
    -- Vector para búsqueda semántica (ej. 1536 dimensiones para OpenAI, o 384 para modelos locales)
    embedding vector(384), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Variantes (Lámina 3x3, 4x4, etc.)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    attributes JSONB NOT NULL, -- Ej: {"medida": "3x3", "material": "acero galvanizado"}
    price_adjustment DECIMAL(12, 2) DEFAULT 0.00,
    barcode VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Niveles de Inventario por Sede
CREATE TABLE inventory_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    reserved_quantity DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    min_stock_level DECIMAL(10, 2) DEFAULT 5.00 NOT NULL,
    warehouse_location VARCHAR(100), -- Ej: "Pasillo 4, Estante B"
    last_restock_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(branch_id, variant_id)
);

-- Triggers de Auditoría
CREATE TRIGGER audit_products_changes AFTER INSERT OR UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER audit_inventory_changes AFTER INSERT OR UPDATE OR DELETE ON inventory_levels FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_levels ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (Todos los autenticados pueden ver el inventario)
CREATE POLICY "Lectura de catálogo para todos" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura de variantes para todos" ON product_variants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura de inventario para todos" ON inventory_levels FOR SELECT TO authenticated USING (true);

-- Función de búsqueda semántica para el Mostrador Inteligente
CREATE OR REPLACE FUNCTION search_products_smart(
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  sku_prefix VARCHAR,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    products.id,
    products.name,
    products.sku_prefix,
    1 - (products.embedding <=> query_embedding) AS similarity
  FROM products
  WHERE 1 - (products.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

