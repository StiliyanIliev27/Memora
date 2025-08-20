-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Connections table policies
CREATE POLICY "Users can view connections they are part of" ON public.connections
    FOR SELECT USING (
        auth.uid() = user1_id OR 
        auth.uid() = user2_id
    );

CREATE POLICY "Users can create connections" ON public.connections
    FOR INSERT WITH CHECK (
        auth.uid() = user1_id OR 
        auth.uid() = user2_id
    );

CREATE POLICY "Users can update connections they are part of" ON public.connections
    FOR UPDATE USING (
        auth.uid() = user1_id OR 
        auth.uid() = user2_id
    );

CREATE POLICY "Users can delete connections they are part of" ON public.connections
    FOR DELETE USING (
        auth.uid() = user1_id OR 
        auth.uid() = user2_id
    );

-- Memories table policies
CREATE POLICY "Users can view memories from their connections" ON public.memories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.connections 
            WHERE id = connection_id 
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can create memories in their connections" ON public.memories
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND
        EXISTS (
            SELECT 1 FROM public.connections 
            WHERE id = connection_id 
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can update memories they created" ON public.memories
    FOR UPDATE USING (
        auth.uid() = created_by AND
        EXISTS (
            SELECT 1 FROM public.connections 
            WHERE id = connection_id 
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can delete memories they created" ON public.memories
    FOR DELETE USING (
        auth.uid() = created_by AND
        EXISTS (
            SELECT 1 FROM public.connections 
            WHERE id = connection_id 
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
            AND status = 'accepted'
        )
    );
