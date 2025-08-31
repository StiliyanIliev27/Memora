-- Enhance memories table with better location handling
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS place_id TEXT,

-- Function to get memories for a specific connection
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
    FROM public.memories m
    WHERE m.connection_id = conn_id
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get all memories for a user (across all connections)
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
    connection_id UUID,
    connection_type TEXT
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
        m.connection_id,
        c.connection_type
    FROM public.memories m
    JOIN public.connections c ON m.connection_id = c.id
    WHERE (c.user1_id = user_uuid OR c.user2_id = user_uuid)
    AND c.status = 'accepted'
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;
