-- ==============================================================================
-- Triadix ERP - Seed Data (Contexto Colombiano)
-- ==============================================================================

-- 1. Insertar Sedes (Colombia)
INSERT INTO branches (id, name, address, contact_info) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Principal Bogotá (Paloquemao)', 'Cra 24 # 15-22, Bogotá', '{"phone": "601-3456789", "email": "bogota@triadix.com.co"}'),
  ('22222222-2222-2222-2222-222222222222', 'Sede Medellín (La Bayadera)', 'Calle 38 # 52-11, Medellín', '{"phone": "604-2345678", "email": "medellin@triadix.com.co"}'),
  ('33333333-3333-3333-3333-333333333333', 'Sede Cali (San Nicolás)', 'Cra 5 # 19-34, Cali', '{"phone": "602-8901234", "email": "cali@triadix.com.co"}');

-- 2. Categorías
INSERT INTO categories (id, name, description) VALUES
  ('44444444-4444-4444-4444-444444444441', 'Aceros y Perfiles', 'Láminas, varillas, ángulos (Sidoc, Paz del Río)'),
  ('44444444-4444-4444-4444-444444444442', 'Obra Gris', 'Cemento, agregados, aditivos (Argos, Sika, Cemex)'),
  ('44444444-4444-4444-4444-444444444443', 'Acabados y Pinturas', 'Pintuco, Tito Pabón, Koraza');

-- 3. Productos (Precios en COP)
INSERT INTO products (id, category_id, sku_prefix, name, description, base_price) VALUES
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444442', 'CEM-ARGOS', 'Cemento Gris Argos Uso General 50kg', 'Cemento gris estándar para obra', 31500.00),
  ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444441', 'VAR-CORR', 'Varilla Corrugada Sidoc PDR', 'Varilla de acero para refuerzo estructural', 18500.00),
  ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444443', 'PIN-KORAZA', 'Vinilo Koraza Pintuco Exterior 5 Gal', 'Pintura exterior de alta resistencia', 245000.00);

-- 4. Variantes
INSERT INTO product_variants (id, product_id, sku, attributes, price_adjustment) VALUES
  ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555552', 'VAR-CORR-1/2-6M', '{"medida": "1/2 pulgada", "longitud": "6 metros"}', 0.00),
  ('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555552', 'VAR-CORR-3/8-6M', '{"medida": "3/8 pulgada", "longitud": "6 metros"}', -3500.00),
  ('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555551', 'CEM-ARGOS-50', '{"peso": "50kg"}', 0.00);

-- 5. Inventario
INSERT INTO inventory_levels (branch_id, variant_id, quantity, warehouse_location) VALUES
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', 450, 'Patio 1 - Estante A'),
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666663', 1200, 'Bodega Cubierta C'),
  ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', 12, 'Patio Frontal');

