/*
  # Create files table and storage

  1. New Tables
    - `files`
      - `id` (uuid, primary key)
      - `name` (text)
      - `size` (bigint)
      - `type` (text)
      - `url` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Storage
    - Create `files` bucket for file storage
    - Enable RLS on the bucket
    - Add policies for authenticated users

  3. Security
    - Enable RLS on `files` table
    - Add policies for authenticated users to:
      - Insert their own files
      - Read their own files
      - Delete their own files
*/

-- Create the files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  size bigint NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own files"
  ON files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own files"
  ON files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('files', 'files')
ON CONFLICT DO NOTHING;

-- Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view their own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text);