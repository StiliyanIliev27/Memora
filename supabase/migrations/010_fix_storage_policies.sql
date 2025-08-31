-- Drop existing storage policies for memories bucket
DROP POLICY IF EXISTS "Users can upload their own memories" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all memories" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own memories" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own memories" ON storage.objects;

-- Create simpler, more permissive policies for memories bucket
CREATE POLICY "Enable insert for authenticated users" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'memories' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Enable select for authenticated users" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'memories' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Enable update for authenticated users" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'memories' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Enable delete for authenticated users" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'memories' AND
    auth.role() = 'authenticated'
  );
