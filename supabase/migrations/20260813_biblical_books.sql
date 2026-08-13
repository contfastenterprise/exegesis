-- Create table for Biblical Books
CREATE TABLE IF NOT EXISTS public.biblical_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_url TEXT,
    file_url TEXT,
    author TEXT,
    publisher TEXT,
    category TEXT,
    audience TEXT,
    age_range TEXT,
    quarter INTEGER,
    year INTEGER,
    lesson_count INTEGER,
    file_type TEXT,
    file_size BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.biblical_books ENABLE ROW LEVEL SECURITY;

-- Policies for biblical_books
-- Public can read active books
CREATE POLICY "Public can view active biblical books" 
ON public.biblical_books 
FOR SELECT 
USING (is_active = true);

-- Authenticated users (admins) can read all books
CREATE POLICY "Admins can view all biblical books" 
ON public.biblical_books 
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users (admins) can insert, update, delete
CREATE POLICY "Admins can insert biblical books" 
ON public.biblical_books 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update biblical books" 
ON public.biblical_books 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admins can delete biblical books" 
ON public.biblical_books 
FOR DELETE 
TO authenticated 
USING (true);

-- Create storage bucket for biblical books
INSERT INTO storage.buckets (id, name, public) 
VALUES ('biblical-books', 'biblical-books', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for biblical-books bucket
-- Allow public to read objects
CREATE POLICY "Public can read biblical-books bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'biblical-books');

-- Allow authenticated users to upload, update, delete
CREATE POLICY "Admins can insert objects to biblical-books" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'biblical-books');

CREATE POLICY "Admins can update objects in biblical-books" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'biblical-books') 
WITH CHECK (bucket_id = 'biblical-books');

CREATE POLICY "Admins can delete objects from biblical-books" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'biblical-books');

-- Function and Trigger to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER biblical_books_updated_at
BEFORE UPDATE ON public.biblical_books
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
