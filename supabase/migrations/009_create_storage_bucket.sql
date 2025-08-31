-- Create storage bucket for memories
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'memories',
  'memories',
  true,
  52428800, -- 50MB limit
  ARRAY['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own memories" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all memories" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own memories" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own memories" ON storage.objects;

-- Create storage policy for memories bucket
CREATE POLICY "Users can upload their own memories" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'memories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all memories" ON storage.objects
  FOR SELECT USING (bucket_id = 'memories');

CREATE POLICY "Users can update their own memories" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'memories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own memories" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'memories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
