-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  specs TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  brand TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies - products are readable by everyone, but only admins can modify
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create admin profiles table
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admin profiles are only viewable by the user themselves
CREATE POLICY "Users can view their own admin profile" 
ON public.admin_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only authenticated users can insert their own profile
CREATE POLICY "Users can insert their own admin profile" 
ON public.admin_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Products can only be modified by admins
CREATE POLICY "Only admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Function to handle new user signup and create admin profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (user_id, email, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    -- Make the first user an admin, others regular users
    NOT EXISTS (SELECT 1 FROM public.admin_profiles)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create admin profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates on products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products data
INSERT INTO public.products (title, specs, price, brand, images) VALUES
  ('Nishat Product 1', '', 2750, 'Nishat', ARRAY['1.jpg']),
  ('Nishat Product 2', '', 2750, 'Nishat', ARRAY['2.jpg']),
  ('Nishat Product 3', '', 2750, 'Nishat', ARRAY['3.jpg']),
  ('Nishat Product 4', '', 2750, 'Nishat', ARRAY['4.jpg']),
  ('Nishat Product 5', '', 2750, 'Nishat', ARRAY['5.jpg']),
  ('Nishat Product 6', '', 2750, 'Nishat', ARRAY['6.jpg']),
  ('Nishat Product 7', '', 2750, 'Nishat', ARRAY['7.jpg']),
  ('Nishat Product 8', '', 2750, 'Nishat', ARRAY['8.jpg']),
  ('Nishat Product 9', '', 2750, 'Nishat', ARRAY['9.jpg']),
  ('Junaid Jamshaid Product 10', '', 1850, 'Junaid Jamshaid', ARRAY['10.jpg']),
  ('Junaid Jamshaid Product 11', '', 1850, 'Junaid Jamshaid', ARRAY['11.jpg']),
  ('Junaid Jamshaid Product 12', '', 1850, 'Junaid Jamshaid', ARRAY['12.jpg']),
  ('Junaid Jamshaid Product 13', '', 1850, 'Junaid Jamshaid', ARRAY['13.jpg']),
  ('Junaid Jamshaid Product 14', '', 1850, 'Junaid Jamshaid', ARRAY['14.jpg']),
  ('Junaid Jamshaid Product 15', '', 1850, 'Junaid Jamshaid', ARRAY['15.jpg']),
  ('Junaid Jamshaid Product 16', '', 1850, 'Junaid Jamshaid', ARRAY['16.jpg']),
  ('Junaid Jamshaid Product 17', '', 1850, 'Junaid Jamshaid', ARRAY['17.jpg']),
  ('Junaid Jamshaid Product 18', '', 1850, 'Junaid Jamshaid', ARRAY['18.jpg']),
  ('Junaid Jamshaid Product 19', '', 1850, 'Junaid Jamshaid', ARRAY['19.jpg']),
  ('Junaid Jamshaid Product 20', '', 1850, 'Junaid Jamshaid', ARRAY['20.jpg']),
  ('Junaid Jamshaid Product 21', '', 1850, 'Junaid Jamshaid', ARRAY['21.jpg']),
  ('Junaid Jamshaid Product 22', '', 1850, 'Junaid Jamshaid', ARRAY['22.jpg']),
  ('Junaid Jamshaid Product 23', '', 1850, 'Junaid Jamshaid', ARRAY['23.jpg']),
  ('Junaid Jamshaid Product 24', '', 1850, 'Junaid Jamshaid', ARRAY['24.jpg']),
  ('Junaid Jamshaid Product 25', '', 1850, 'Junaid Jamshaid', ARRAY['25.jpg']),
  ('Junaid Jamshaid Product 26', '', 1850, 'Junaid Jamshaid', ARRAY['26.jpg']),
  ('Junaid Jamshaid Product 27', '', 1850, 'Junaid Jamshaid', ARRAY['27.jpg']),
  ('Junaid Jamshaid Product 28', '', 1850, 'Junaid Jamshaid', ARRAY['28.jpg']),
  ('Beechtree Product 29', '', 2650, 'Beechtree', ARRAY['29.jpg']),
  ('Beechtree Product 30', '', 2650, 'Beechtree', ARRAY['30.jpg']),
  ('Beechtree Product 31', '', 2650, 'Beechtree', ARRAY['31.jpg']),
  ('Beechtree Product 32', '', 2650, 'Beechtree', ARRAY['32.jpg']);