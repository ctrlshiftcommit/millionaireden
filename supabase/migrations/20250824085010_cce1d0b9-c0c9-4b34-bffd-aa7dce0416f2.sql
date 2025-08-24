-- Reset all user stats to 0
UPDATE public.user_experience 
SET total_exp = 0, current_level = 0, lunar_crystals = 0, updated_at = now();

-- Clear all habit completions 
DELETE FROM public.habit_completions;

-- Clear all EXP transactions
DELETE FROM public.exp_transactions;

-- Clear all level history
DELETE FROM public.level_history;

-- Clear all reward purchases
DELETE FROM public.reward_purchases;

-- Add phone number to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text;

-- Create achievements table for admin management
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Trophy',
  requirement_type text NOT NULL, -- 'habit_streak', 'total_habits', 'exp_earned', etc.
  requirement_value integer NOT NULL,
  crystal_reward integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active achievements
CREATE POLICY "Anyone can view active achievements" 
ON public.achievements 
FOR SELECT 
USING (is_active = true);

-- Create user_achievements table to track which users have earned which achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  crystals_earned integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view their own achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own achievements (when earned)
CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert some default achievements
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value, crystal_reward) VALUES
('First Steps', 'Complete your first habit', 'Target', 'habits_completed', 1, 50),
('Consistent', 'Maintain a 7-day streak', 'Flame', 'max_streak', 7, 100),
('Dedicated', 'Maintain a 30-day streak', 'Trophy', 'max_streak', 30, 500),
('Habit Master', 'Complete 100 habits total', 'Crown', 'total_completed', 100, 1000),
('Level Up', 'Reach level 5', 'Star', 'level_reached', 5, 200);

-- Create trigger for updated_at on achievements
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();