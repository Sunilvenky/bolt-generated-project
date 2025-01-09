/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `age` (integer)
      - `mobile` (text)
      - `email` (text)
      - `amount_paid` (numeric)
      - `payment_mode` (text)
      - `number_of_tickets` (integer)
      - `boarding_point` (text)
      - `remarks` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for authenticated users to:
      - Read all bookings
      - Insert new bookings
      - Update existing bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL,
  mobile text NOT NULL,
  email text NOT NULL,
  amount_paid numeric NOT NULL,
  payment_mode text NOT NULL,
  number_of_tickets integer NOT NULL,
  boarding_point text NOT NULL,
  remarks text,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read all bookings
CREATE POLICY "Users can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow authenticated users to insert bookings
CREATE POLICY "Users can insert bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy to allow authenticated users to update bookings
CREATE POLICY "Users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the update function
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at_column();
