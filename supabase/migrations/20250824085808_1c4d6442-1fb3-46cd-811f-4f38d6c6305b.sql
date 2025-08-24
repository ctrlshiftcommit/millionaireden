-- Add example rewards to the database
INSERT INTO public.rewards (user_id, name, description, cost, category, icon) VALUES
-- Entertainment rewards
('00000000-0000-0000-0000-000000000000', 'Movie Night', 'Watch your favorite movie with popcorn', 150, 'entertainment', 'Film'),
('00000000-0000-0000-0000-000000000000', '1 Hour Gaming', 'Guilt-free gaming session', 100, 'entertainment', 'Gamepad2'),
('00000000-0000-0000-0000-000000000000', 'YouTube Marathon', '2 hours of your favorite content', 75, 'entertainment', 'Play'),

-- Food rewards
('00000000-0000-0000-0000-000000000000', 'Fast Food Treat', 'McDonald\'s, KFC, or Burger King meal', 200, 'entertainment', 'Utensils'),
('00000000-0000-0000-0000-000000000000', 'Pizza Order', 'Order your favorite pizza', 300, 'entertainment', 'Pizza'),
('00000000-0000-0000-0000-000000000000', 'Ice Cream', 'Sweet frozen treat', 75, 'entertainment', 'IceCream'),
('00000000-0000-0000-0000-000000000000', 'Fancy Coffee', 'Starbucks or specialty coffee', 120, 'entertainment', 'Coffee'),

-- Wellness rewards  
('00000000-0000-0000-0000-000000000000', 'Spa Day', 'Relaxing massage or spa treatment', 500, 'entertainment', 'Heart'),
('00000000-0000-0000-0000-000000000000', 'New Book', 'Buy that book you\'ve been wanting', 250, 'entertainment', 'Book'),
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

-- Insert existing quotes into the database
INSERT INTO public.quotes (text, author, category, tags) VALUES
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'Success', '{"action", "motivation", "start"}'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'Success', '{"courage", "persistence", "resilience"}'),
('Don''t be afraid to give up the good to go for the great.', 'John D. Rockefeller', 'Success', '{"ambition", "excellence", "growth"}'),
('You have the right to perform your actions, but you are not entitled to the fruits of the actions.', 'Bhagavad Gita', 'Discipline', '{"duty", "detachment", "action"}'),
('What does not kill me makes me stronger.', 'Friedrich Nietzsche', 'Growth', '{"strength", "adversity", "resilience"}'),
('The mind is everything. What you think you become.', 'Buddha', 'Growth', '{"mindset", "thoughts", "transformation"}'),
('Discipline is the bridge between goals and accomplishment.', 'Jim Rohn', 'Discipline', '{"goals", "achievement", "consistency"}'),
('I have not failed. I''ve just found 10,000 ways that won''t work.', 'Thomas Edison', 'Failure', '{"learning", "persistence", "innovation"}'),
('Failure is simply the opportunity to begin again, this time more intelligently.', 'Henry Ford', 'Failure', '{"opportunity", "wisdom", "restart"}'),
('The only real mistake is the one from which we learn nothing.', 'Henry Ford', 'Failure', '{"learning", "mistakes", "growth"}'),
('The wound is the place where the Light enters you.', 'Rumi', 'Sadness', '{"healing", "transformation", "light"}'),
('Even the darkest night will end and the sun will rise.', 'Victor Hugo', 'Sadness', '{"hope", "endurance", "dawn"}'),
('Tears are words that need to be written.', 'Paulo Coelho', 'Sadness', '{"emotion", "expression", "healing"}'),
('Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.', 'Buddha', 'Anger', '{"release", "harm", "suffering"}'),
('Peace cannot be kept by force; it can only be achieved by understanding.', 'Albert Einstein', 'Peace', '{"understanding", "force", "harmony"}'),
('The best fighter is never angry.', 'Lao Tzu', 'Peace', '{"control", "calm", "strength"}'),
('Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.', 'Lao Tzu', 'Love', '{"strength", "courage", "connection"}'),
('The greatest thing you''ll ever learn is just to love and be loved in return.', 'Eden Ahbez', 'Love', '{"reciprocity", "learning", "fulfillment"}'),
('Love is not about how much you say ''I love you'', but how much you prove that it''s true.', 'Unknown', 'Love', '{"actions", "proof", "authenticity"}'),
('You have power over your mind - not outside events. Realize this, and you will find strength.', 'Marcus Aurelius', 'Peace', '{"control", "mindset", "stoicism"}'),
('No man is free who is not master of himself.', 'Epictetus', 'Discipline', '{"freedom", "self-control", "mastery"}'),
('The happiness of your life depends upon the quality of your thoughts.', 'Marcus Aurelius', 'Growth', '{"happiness", "thoughts", "quality"}'),
('Set thy heart upon thy work, but never on its reward.', 'Bhagavad Gita', 'Discipline', '{"focus", "detachment", "work"}'),
('When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.', 'Bhagavad Gita', 'Peace', '{"meditation", "stability", "focus"}'),
('Your limitation—it''s only your imagination.', 'Unknown', 'Success', '{"limitations", "imagination", "potential"}'),
('Great things never come from comfort zones.', 'Unknown', 'Growth', '{"comfort", "challenge", "greatness"}'),
('Dream it. Wish it. Do it.', 'Unknown', 'Success', '{"dreams", "action", "execution"}');

-- Add trigger for updated_at on quotes
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();