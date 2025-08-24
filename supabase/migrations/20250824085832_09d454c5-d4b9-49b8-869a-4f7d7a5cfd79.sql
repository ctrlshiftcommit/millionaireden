-- Add example rewards to the database
INSERT INTO public.rewards (user_id, name, description, cost, category, icon) VALUES
-- Entertainment rewards
('00000000-0000-0000-0000-000000000000', 'Movie Night', 'Watch your favorite movie with popcorn', 150, 'entertainment', 'Film'),
('00000000-0000-0000-0000-000000000000', '1 Hour Gaming', 'Guilt-free gaming session', 100, 'entertainment', 'Gamepad2'),
('00000000-0000-0000-0000-000000000000', 'YouTube Marathon', '2 hours of your favorite content', 75, 'entertainment', 'Play'),

-- Food rewards
('00000000-0000-0000-0000-000000000000', 'Fast Food Treat', 'McDonalds, KFC, or Burger King meal', 200, 'entertainment', 'Utensils'),
('00000000-0000-0000-0000-000000000000', 'Pizza Order', 'Order your favorite pizza', 300, 'entertainment', 'Pizza'),
('00000000-0000-0000-0000-000000000000', 'Ice Cream', 'Sweet frozen treat', 75, 'entertainment', 'IceCream'),
('00000000-0000-0000-0000-000000000000', 'Fancy Coffee', 'Starbucks or specialty coffee', 120, 'entertainment', 'Coffee'),

-- Wellness rewards  
('00000000-0000-0000-0000-000000000000', 'Spa Day', 'Relaxing massage or spa treatment', 500, 'entertainment', 'Heart'),
('00000000-0000-0000-0000-000000000000', 'New Book', 'Buy that book youve been wanting', 250, 'entertainment', 'Book'),
('00000000-0000-0000-0000-000000000000', 'Workout Gear', 'New fitness equipment or clothes', 400, 'entertainment', 'Dumbbell'),

-- Experience rewards
('00000000-0000-0000-0000-000000000000', 'Concert Ticket', 'Live music experience', 800, 'entertainment', 'Music'),
('00000000-0000-0000-0000-000000000000', 'Day Trip', 'Visit a new city or attraction', 600, 'entertainment', 'MapPin'),
('00000000-0000-0000-0000-000000000000', 'Shopping Spree', '$50 shopping budget', 350, 'entertainment', 'ShoppingBag');

-- Create quotes table for admin management
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text text NOT NULL,
  author text NOT NULL,
  category text NOT NULL DEFAULT 'Success',
  tags text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active quotes
CREATE POLICY "Anyone can view active quotes" 
ON public.quotes 
FOR SELECT 
USING (is_active = true);

-- Insert some example quotes into the database
INSERT INTO public.quotes (text, author, category, tags) VALUES
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'Success', '{"action", "motivation", "start"}'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'Success', '{"courage", "persistence", "resilience"}'),
('Don''t be afraid to give up the good to go for the great.', 'John D. Rockefeller', 'Success', '{"ambition", "excellence", "growth"}'),
('Discipline is the bridge between goals and accomplishment.', 'Jim Rohn', 'Discipline', '{"goals", "achievement", "consistency"}'),
('The mind is everything. What you think you become.', 'Buddha', 'Growth', '{"mindset", "thoughts", "transformation"}');

-- Add trigger for updated_at on quotes
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();