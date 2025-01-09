/*
  # Create Trip Events Table

  1. New Tables
    - `trip_events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `description` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `trip_events` table
    - Add policies for authenticated users to manage their events
*/

CREATE TABLE IF NOT EXISTS trip_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  description text,
  status text DEFAULT 'Planning',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trip_events ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read all events
CREATE POLICY "Users can read all events"
  ON trip_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow authenticated users to insert events
CREATE POLICY "Users can insert events"
  ON trip_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy to allow authenticated users to update events
CREATE POLICY "Users can update events"
  ON trip_events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_trip_events_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the update function
CREATE TRIGGER update_trip_events_updated_at
  BEFORE UPDATE ON trip_events
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_events_updated_at_column();
