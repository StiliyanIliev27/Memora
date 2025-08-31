-- Add missing location columns to memories table
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_memories_location_details ON public.memories(country, state, city);

-- Update the get_memories_for_connection function to include new columns
CREATE OR REPLACE FUNCTION get_memories_for_connection(conn_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    location_name TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    memory_type TEXT,
    file_url TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    place_id TEXT,
    country TEXT,
    state TEXT,
    city TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.description,
        m.location_name,
        m.latitude,
        m.longitude,
        m.memory_type,
        m.file_url,
        m.created_by,
        m.created_at,
        m.place_id,
        m.country,
        m.state,
        m.city
    FROM public.memories m
    WHERE m.connection_id = conn_id
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Update the get_memories_for_user function to include new columns
CREATE OR REPLACE FUNCTION get_memories_for_user(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    location_name TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    memory_type TEXT,
    file_url TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    place_id TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    connection_id UUID,
    connection_type TEXT,
    is_personal BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.description,
        m.location_name,
        m.latitude,
        m.longitude,
        m.memory_type,
        m.file_url,
        m.created_by,
        m.created_at,
        m.place_id,
        m.country,
        m.state,
        m.city,
        m.connection_id,
        c.connection_type,
        (m.connection_id IS NULL) as is_personal
    FROM public.memories m
    LEFT JOIN public.connections c ON m.connection_id = c.id
    WHERE m.created_by = user_uuid
    OR (c.user1_id = user_uuid OR c.user2_id = user_uuid)
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;
