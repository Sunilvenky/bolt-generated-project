/*
  # Create storage buckets for trips and profiles

  1. New Storage Buckets
    - `trips` bucket for storing trip images
    - `profiles` bucket for storing profile avatars
  2. Security
    - Enable public access for both buckets
    - Add policies for authenticated users to manage their files
*/

-- Create the trips bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('trips', 'trips', true)
ON CONFLICT (id) DO NOTHING;

-- Create the profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload trip images
CREATE POLICY "Users can upload trip images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trips');

-- Policy to allow public to view trip images
CREATE POLICY "Public can view trip images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'trips');

-- Policy to allow authenticated users to upload profile images
CREATE POLICY "Users can upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- Policy to allow public to view profile images
CREATE POLICY "Public can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');
