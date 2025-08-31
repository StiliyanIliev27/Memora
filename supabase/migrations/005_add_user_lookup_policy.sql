-- Add policy to allow users to look up other users by email for connection requests
-- This allows authenticated users to find other users by email to send connection requests
CREATE POLICY "Users can look up other users by email for connections" ON public.users
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        auth.uid() != id
    );

-- Add comment to explain the policy
COMMENT ON POLICY "Users can look up other users by email for connections" ON public.users IS 
'Allows authenticated users to look up other users by email for sending connection requests. Users cannot view their own profile through this policy.';
