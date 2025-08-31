-- Run this SQL in your Supabase SQL Editor

-- Create memory_files table for multiple files per memory
CREATE TABLE IF NOT EXISTS public.memory_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video', 'note')),
    file_size INTEGER NOT NULL, -- in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memory_files_memory_id ON public.memory_files(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_files_created_by ON public.memory_files(created_by);
CREATE INDEX IF NOT EXISTS idx_memory_files_file_type ON public.memory_files(file_type);

-- Create deletion_requests table
CREATE TABLE IF NOT EXISTS public.deletion_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE,
    file_id UUID REFERENCES public.memory_files(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('memory', 'file')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    message TEXT, -- optional message from requester
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    responder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Ensure either memory_id or file_id is provided, but not both
    CONSTRAINT deletion_request_target CHECK (
        (memory_id IS NOT NULL AND file_id IS NULL) OR 
        (memory_id IS NULL AND file_id IS NOT NULL)
    )
);

-- Create indexes for deletion requests
CREATE INDEX IF NOT EXISTS idx_deletion_requests_memory_id ON public.deletion_requests(memory_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_file_id ON public.deletion_requests(file_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_requester_id ON public.deletion_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON public.deletion_requests(status);

-- Add RLS policies for memory_files
ALTER TABLE public.memory_files ENABLE ROW LEVEL SECURITY;

-- Users can view files for memories they have access to
CREATE POLICY "Users can view memory files" ON public.memory_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.memories m
            WHERE m.id = memory_files.memory_id
            AND (
                m.created_by = auth.uid() OR
                (m.connection_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.connections c
                    WHERE c.id = m.connection_id
                    AND c.status = 'accepted'
                    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
                ))
            )
        )
    );

-- Users can insert files for memories they created or have access to
CREATE POLICY "Users can insert memory files" ON public.memory_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.memories m
            WHERE m.id = memory_files.memory_id
            AND (
                m.created_by = auth.uid() OR
                (m.connection_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.connections c
                    WHERE c.id = m.connection_id
                    AND c.status = 'accepted'
                    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
                ))
            )
        )
    );

-- Users can update files they created
CREATE POLICY "Users can update their memory files" ON public.memory_files
    FOR UPDATE USING (created_by = auth.uid());

-- Users can delete files they created
CREATE POLICY "Users can delete their memory files" ON public.memory_files
    FOR DELETE USING (created_by = auth.uid());

-- Add RLS policies for deletion_requests
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Users can view deletion requests they're involved in
CREATE POLICY "Users can view relevant deletion requests" ON public.deletion_requests
    FOR SELECT USING (
        requester_id = auth.uid() OR
        responder_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.memories m
            WHERE m.id = deletion_requests.memory_id
            AND m.created_by = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.memory_files mf
            WHERE mf.id = deletion_requests.file_id
            AND mf.created_by = auth.uid()
        )
    );

-- Users can create deletion requests
CREATE POLICY "Users can create deletion requests" ON public.deletion_requests
    FOR INSERT WITH CHECK (requester_id = auth.uid());

-- Users can update deletion requests they're involved in
CREATE POLICY "Users can update relevant deletion requests" ON public.deletion_requests
    FOR UPDATE USING (
        requester_id = auth.uid() OR
        responder_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.memories m
            WHERE m.id = deletion_requests.memory_id
            AND m.created_by = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.memory_files mf
            WHERE mf.id = deletion_requests.file_id
            AND mf.created_by = auth.uid()
        )
    );

-- Function to get memory files
CREATE OR REPLACE FUNCTION get_memory_files(memory_uuid UUID)
RETURNS TABLE (
    id UUID,
    memory_id UUID,
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.memory_id,
        mf.file_url,
        mf.file_name,
        mf.file_type,
        mf.file_size,
        mf.created_at,
        mf.created_by
    FROM public.memory_files mf
    WHERE mf.memory_id = memory_uuid
    ORDER BY mf.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get deletion requests for a connection
CREATE OR REPLACE FUNCTION get_deletion_requests_for_connection(connection_uuid UUID)
RETURNS TABLE (
    id UUID,
    memory_id UUID,
    file_id UUID,
    requester_id UUID,
    request_type TEXT,
    status TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    responder_id UUID,
    memory_title TEXT,
    file_name TEXT,
    requester_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dr.id,
        dr.memory_id,
        dr.file_id,
        dr.requester_id,
        dr.request_type,
        dr.status,
        dr.message,
        dr.created_at,
        dr.responded_at,
        dr.responder_id,
        m.title as memory_title,
        mf.file_name,
        u.name as requester_name
    FROM public.deletion_requests dr
    LEFT JOIN public.memories m ON m.id = dr.memory_id
    LEFT JOIN public.memory_files mf ON mf.id = dr.file_id
    LEFT JOIN public.users u ON u.id = dr.requester_id
    WHERE dr.status = 'pending'
    AND (
        (dr.memory_id IS NOT NULL AND m.connection_id = connection_uuid) OR
        (dr.file_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.memory_files mf2
            JOIN public.memories m2 ON m2.id = mf2.memory_id
            WHERE mf2.id = dr.file_id AND m2.connection_id = connection_uuid
        ))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
