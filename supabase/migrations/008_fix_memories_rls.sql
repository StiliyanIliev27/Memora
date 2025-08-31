-- Drop existing memories policies
DROP POLICY IF EXISTS "Users can view memories from their connections" ON public.memories;
DROP POLICY IF EXISTS "Users can create memories in their connections" ON public.memories;
DROP POLICY IF EXISTS "Users can update memories they created" ON public.memories;
DROP POLICY IF EXISTS "Users can delete memories they created" ON public.memories;

-- Create new policies that allow personal memories
CREATE POLICY "Users can view memories from their connections or their own" ON public.memories
    FOR SELECT USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.connections 
            WHERE id = connection_id 
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can create memories in their connections or personal" ON public.memories
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND
        (connection_id IS NULL OR
         EXISTS (
            SELECT 1 FROM public.connections 
            WHERE id = connection_id 
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
            AND status = 'accepted'
        ))
    );

CREATE POLICY "Users can update memories they created" ON public.memories
    FOR UPDATE USING (
        auth.uid() = created_by
    );

CREATE POLICY "Users can delete memories they created" ON public.memories
    FOR DELETE USING (
        auth.uid() = created_by
    );
