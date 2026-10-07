-- ==============================================================================
-- Triadix ERP - Fase 2: Seguridad (Shield), Auditoría Inmutable y RLS
-- ==============================================================================

-- 1. Tabla de Auditoría Inmutable (Zero Trust)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en auditoría (Nadie puede modificar o eliminar, lectura restringida a roles de seguridad)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura de auditoría para security_admin y super_admin"
ON audit_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'security_admin')
    )
);

-- Prevenir modificaciones en la tabla de auditoría a nivel de Base de Datos
CREATE OR REPLACE FUNCTION prevent_audit_modifications()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'La tabla de auditoría es INMUTABLE. No se permiten modificaciones ni eliminaciones.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER make_audit_logs_immutable
    BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_modifications();

-- 2. Función Genérica de Auditoría (Para conectar a otras tablas)
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (action, table_name, record_id, new_data, changed_by)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW)::jsonb, auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (action, table_name, record_id, old_data, new_data, changed_by)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (action, table_name, record_id, old_data, changed_by)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD)::jsonb, auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adjuntar auditoría a sedes y perfiles
CREATE TRIGGER audit_branches_changes
    AFTER INSERT OR UPDATE OR DELETE ON branches
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_profiles_changes
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- 3. Políticas RLS estandarizadas (Zero Trust)

-- Branches (Sedes): Todos los autenticados pueden ver, solo admins mutan
CREATE POLICY "Lectura general de sedes" ON branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Mutación de sedes para super_admin" ON branches FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Profiles (Perfiles): Un usuario ve los perfiles de su sede o todos si es admin
CREATE POLICY "Lectura de perfiles propios y de la misma sede" ON profiles FOR SELECT TO authenticated
USING (
    id = auth.uid() 
    OR branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'security_admin'))
);
CREATE POLICY "Mutación de perfiles para super_admin" ON profiles FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Función de conveniencia para obtener el rol actual (utilizada en backend/frontend para verificaciones rápidas)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS app_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

