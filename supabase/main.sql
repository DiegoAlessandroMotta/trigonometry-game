-- Crear la tabla de estudiantes
CREATE TABLE estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE REFERENCES auth.users(id),  -- Relación con el sistema de auth de Supabase
    nombre_usuario TEXT NOT NULL UNIQUE,
    edad INTEGER CHECK (edad > 0),
    genero TEXT CHECK (genero IN ('M', 'F')),
    es_anonimo BOOLEAN NOT NULL DEFAULT true,  -- Indica si el estudiante está autenticado o no
    puntos_totales INTEGER NOT NULL DEFAULT 0 CHECK (puntos_totales >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
); 

-- Crear la tabla de minijuegos disponibles
CREATE TABLE minijuegos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear la tabla de sesiones de minijuegos
CREATE TABLE sesiones_minijuego (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    minijuego_id UUID NOT NULL REFERENCES minijuegos(id),
    duracion_sesion INTEGER NOT NULL CHECK (duracion_sesion >= 0),
    puntuacion_juego INTEGER NOT NULL CHECK (puntuacion_juego >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear la tabla de sesiones interactivas
CREATE TABLE sesiones_interactivas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID NOT NULL REFERENCES estudiantes (id),
    duracion_total_sesion INTEGER NOT NULL CHECK (duracion_total_sesion >= 0),
    puntuacion_prueba INTEGER NOT NULL CHECK (puntuacion_prueba >= 0),
    fecha_sesion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE ('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE ('utc'::text, NOW()) NOT NULL
);

-- Tabla de relación entre sesiones interactivas y minijuegos
CREATE TABLE sesiones_interactivas_minijuegos (
    sesion_interactiva_id UUID REFERENCES sesiones_interactivas (id) ON DELETE CASCADE,
    sesion_minijuego_id UUID REFERENCES sesiones_minijuego (id) ON DELETE CASCADE,
    PRIMARY KEY (
        sesion_interactiva_id,
        sesion_minijuego_id
    )
);

-- Función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar el timestamp en estudiantes
CREATE TRIGGER update_estudiantes_updated_at
    BEFORE UPDATE ON estudiantes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para actualizar el timestamp en minijuegos
CREATE TRIGGER update_minijuegos_updated_at
    BEFORE UPDATE ON minijuegos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para actualizar el timestamp en sesiones_minijuego
CREATE TRIGGER update_sesiones_minijuego_updated_at
    BEFORE UPDATE ON sesiones_minijuego
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Función para actualizar puntos_totales del estudiante
CREATE OR REPLACE FUNCTION actualizar_puntos_totales()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE estudiantes e
    SET puntos_totales = puntos_totales + NEW.puntuacion_juego
    FROM sesiones_interactivas si
    WHERE si.estudiante_id = e.id
    AND EXISTS (
        SELECT 1 
        FROM sesiones_interactivas_minijuegos sim 
        WHERE sim.sesion_interactiva_id = si.id 
        AND sim.sesion_minijuego_id = NEW.id
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar puntos_totales cuando se inserta una nueva sesión de minijuego
CREATE TRIGGER actualizar_puntos_estudiante
    AFTER INSERT ON sesiones_minijuego
    FOR EACH ROW
    EXECUTE PROCEDURE actualizar_puntos_totales();

-- Políticas de seguridad Row Level Security (RLS)
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_interactivas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_minijuego ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_interactivas_minijuegos ENABLE ROW LEVEL SECURITY;
ALTER TABLE minijuegos ENABLE ROW LEVEL SECURITY;


-- Política para estudiantes: los usuarios autenticados solo pueden ver y editar sus propios datos
CREATE POLICY "Usuarios pueden ver sus propios datos" ON estudiantes
    FOR ALL
    USING (auth.uid() = auth_id OR es_anonimo = true);

-- Política para sesiones: los usuarios pueden ver sus propias sesiones
CREATE POLICY "Usuarios pueden ver sus propias sesiones" ON sesiones_interactivas
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM estudiantes e
            WHERE e.id = estudiante_id
            AND (e.auth_id = auth.uid() OR e.es_anonimo = true)
        )
    );

-- Política para minijuegos: visible para todos
CREATE POLICY "Minijuegos visibles para todos" ON sesiones_minijuego
    FOR ALL
    USING (true);

-- Política para la relación: accesible si tiene acceso a la sesión interactiva
CREATE POLICY "Acceso a relaciones de sesiones" ON sesiones_interactivas_minijuegos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM sesiones_interactivas si
            JOIN estudiantes e ON e.id = si.estudiante_id
            WHERE si.id = sesion_interactiva_id
            AND (e.auth_id = auth.uid() OR e.es_anonimo = true)
        )
    );

-- Política para minijuegos disponibles
CREATE POLICY "Minijuegos disponibles visibles para todos" ON minijuegos
    FOR SELECT
    USING (true);

CREATE POLICY "Solo administradores pueden modificar minijuegos" ON minijuegos
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');
