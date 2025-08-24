-- Create template rewards table for system-wide rewards that users can choose from
CREATE TABLE IF NOT EXISTS public.reward_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  cost integer NOT NULL,
  category text NOT NULL DEFAULT 'entertainment',
  icon text NOT NULL DEFAULT 'Gift',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on reward_templates
ALTER TABLE public.reward_templates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active reward templates
CREATE POLICY "Anyone can view active reward templates" 
ON public.reward_templates 
FOR SELECT 
USING (is_active = true);

-- Insert example reward templates
INSERT INTO public.reward_templates (name, description, cost, category, icon) VALUES
-- Entertainment rewards
('Movie Night', 'Watch your favorite movie with popcorn', 150, 'entertainment', 'Film'),
('1 Hour Gaming', 'Guilt-free gaming session', 100, 'entertainment', 'Gamepad2'),
('YouTube Marathon', '2 hours of your favorite content', 75, 'entertainment', 'Play'),

-- Food rewards
('Fast Food Treat', 'McDonalds, KFC, or Burger King meal', 200, 'entertainment', 'Utensils'),
('Pizza Order', 'Order your favorite pizza', 300, 'entertainment', 'Pizza'),
('Ice Cream', 'Sweet frozen treat', 75, 'entertainment', 'IceCream'),
('Fancy Coffee', 'Starbucks or specialty coffee', 120, 'entertainment', 'Coffee'),

-- Wellness rewards  
('Spa Day', 'Relaxing massage or spa treatment', 500, 'entertainment', 'Heart'),
('New Book', 'Buy that book youve been wanting', 250, 'entertainment', 'Book'),
('Workout Gear', 'New fitness equipment or clothes', 400, 'entertainment', 'Dumbbell'),

-- Experience rewards
('Concert Ticket', 'Live music experience', 800, 'entertainment', 'Music'),
('Day Trip', 'Visit a new city or attraction', 600, 'entertainment', 'MapPin'),
('Shopping Spree', '$50 shopping budget', 350, 'entertainment', 'ShoppingBag');

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

-- Insert example quotes into the database
INSERT INTO public.quotes (text, author, category, tags) VALUES
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'Success', '{"action", "motivation", "start"}'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'Success', '{"courage", "persistence", "resilience"}'),
('Don''t be afraid to give up the good to go for the great.', 'John D. Rockefeller', 'Success', '{"ambition", "excellence", "growth"}'),
('Discipline is the bridge between goals and accomplishment.', 'Jim Rohn', 'Discipline', '{"goals", "achievement", "consistency"}'),
('The mind is everything. What you think you become.', 'Buddha', 'Growth', '{"mindset", "thoughts", "transformation"}'),
('What does not kill me makes me stronger.', 'Friedrich Nietzsche', 'Growth', '{"strength", "adversity", "resilience"}'),
('You have power over your mind - not outside events. Realize this, and you will find strength.', 'Marcus Aurelius', 'Peace', '{"control", "mindset", "stoicism"}'),
('No man is free who is not master of himself.', 'Epictetus', 'Discipline', '{"freedom", "self-control", "mastery"}');

-- Add triggers for updated_at
CREATE TRIGGER update_reward_templates_updated_at
  BEFORE UPDATE ON public.reward_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();