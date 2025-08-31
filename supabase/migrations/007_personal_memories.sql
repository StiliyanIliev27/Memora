-- Allow personal memories by making connection_id optional
ALTER TABLE public.memories 
ALTER COLUMN connection_id DROP NOT NULL;

-- Add a check constraint to ensure either connection_id or created_by is set
ALTER TABLE public.memories 
ADD CONSTRAINT memories_connection_or_personal 
CHECK (connection_id IS NOT NULL OR created_by IS NOT NULL);

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_memories_for_user(uuid);

-- Recreate the function with the new return type including is_personal
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
