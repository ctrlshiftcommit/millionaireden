
-- Create comprehensive database schema for the SaaS product

-- User profiles table (enhanced)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trial')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User experience table (already exists but enhance)
CREATE TABLE IF NOT EXISTS public.user_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  total_exp BIGINT NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 0,
  lunar_crystals INTEGER NOT NULL DEFAULT 0,
  diamonds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habits table (enhance existing)
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  goal TEXT DEFAULT 'daily' CHECK (goal IN ('daily', 'weekly', 'monthly')),
  exp_reward INTEGER NOT NULL DEFAULT 100,
  crystal_reward INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habit completions table (enhance existing)
CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exp_gained INTEGER DEFAULT 0,
  crystals_gained INTEGER DEFAULT 0,
  streak_at_completion INTEGER DEFAULT 1,
  UNIQUE(user_id, habit_id, completed_date)
);

-- Journal entries table (enhance existing)
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('happy', 'sad', 'neutral', 'excited', 'anxious', 'calm', 'angry', 'grateful')),
  tags TEXT[] DEFAULT '{}',
  word_count INTEGER DEFAULT 0,
  is_important BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- EXP transactions table (enhance existing)
CREATE TABLE IF NOT EXISTS public.exp_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('habit_completed', 'achievement_earned', 'purchase', 'conversion_loss', 'bonus', 'penalty')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  source TEXT,
  old_level INTEGER,
  new_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Level history table (enhance existing)
CREATE TABLE IF NOT EXISTS public.level_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  old_level INTEGER NOT NULL,
  new_level INTEGER NOT NULL,
  exp_at_levelup BIGINT NOT NULL,
  level_up_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Achievements table (enhance existing)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Trophy',
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('exp_total', 'habit_streak', 'habits_completed', 'journal_entries', 'level_reached')),
  requirement_value INTEGER NOT NULL,
  crystal_reward INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) NOT NULL,
  crystals_earned INTEGER NOT NULL DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Notifications table (enhance existing)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'achievement', 'level_up', 'reminder')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reward templates table (enhance existing)
CREATE TABLE IF NOT EXISTS public.reward_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'entertainment' CHECK (category IN ('entertainment', 'food', 'shopping', 'experience', 'wellness', 'education')),
  icon TEXT NOT NULL DEFAULT 'Gift',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Custom rewards table (enhance existing)
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  category TEXT DEFAULT 'entertainment' CHECK (category IN ('entertainment', 'food', 'shopping', 'experience', 'wellness', 'education')),
  icon TEXT DEFAULT 'Gift',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reward purchases table (enhance existing)
CREATE TABLE IF NOT EXISTS public.reward_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  reward_id UUID NOT NULL, -- Can reference either reward_templates or rewards
  reward_type TEXT NOT NULL DEFAULT 'template' CHECK (reward_type IN ('template', 'custom')),
  crystals_spent INTEGER NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quotes table (enhance existing)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Success' CHECK (category IN ('Success', 'Motivation', 'Wisdom', 'Productivity', 'Health', 'Happiness')),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences table (enhance existing)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  notification_settings JSONB DEFAULT '{"reminders": true, "achievements": true, "daily_progress": true, "email_notifications": false}'::jsonb,
  ui_settings JSONB DEFAULT '{"theme": "dark", "sound": false, "animations": true, "compact_mode": false}'::jsonb,
  privacy_settings JSONB DEFAULT '{"public_profile": false, "share_progress": false, "analytics_opt_out": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'unpaid', 'trialing')),
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'enterprise')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('habit_completion', 'journal_entry', 'reward_purchase', 'login', 'page_view')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Billing history table
CREATE TABLE IF NOT EXISTS public.billing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_invoice_id TEXT,
  amount_paid INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API keys table for integrations
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '{"read": true, "write": false}'::jsonb,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User experience policies
DROP POLICY IF EXISTS "Users can manage their own experience" ON public.user_experience;
CREATE POLICY "Users can manage their own experience" ON public.user_experience FOR ALL USING (auth.uid() = user_id);

-- Habits policies
DROP POLICY IF EXISTS "Users can manage their own habits" ON public.habits;
CREATE POLICY "Users can manage their own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- Habit completions policies
DROP POLICY IF EXISTS "Users can manage their own habit completions" ON public.habit_completions;
CREATE POLICY "Users can manage their own habit completions" ON public.habit_completions FOR ALL USING (auth.uid() = user_id);

-- Journal entries policies
DROP POLICY IF EXISTS "Users can manage their own journal entries" ON public.journal_entries;
CREATE POLICY "Users can manage their own journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public journal entries are viewable" ON public.journal_entries;
CREATE POLICY "Public journal entries are viewable" ON public.journal_entries FOR SELECT USING (is_public = true);

-- EXP transactions policies
DROP POLICY IF EXISTS "Users can view their own exp transactions" ON public.exp_transactions;
CREATE POLICY "Users can view their own exp transactions" ON public.exp_transactions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create exp transactions" ON public.exp_transactions;
CREATE POLICY "Users can create exp transactions" ON public.exp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Level history policies
DROP POLICY IF EXISTS "Users can view their own level history" ON public.level_history;
CREATE POLICY "Users can view their own level history" ON public.level_history FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create level history" ON public.level_history;
CREATE POLICY "Users can create level history" ON public.level_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "Anyone can view active achievements" ON public.achievements;
CREATE POLICY "Anyone can view active achievements" ON public.achievements FOR SELECT USING (is_active = true);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reward templates policies
DROP POLICY IF EXISTS "Anyone can view active reward templates" ON public.reward_templates;
CREATE POLICY "Anyone can view active reward templates" ON public.reward_templates FOR SELECT USING (is_active = true);

-- Custom rewards policies
DROP POLICY IF EXISTS "Users can manage their own rewards" ON public.rewards;
CREATE POLICY "Users can manage their own rewards" ON public.rewards FOR ALL USING (auth.uid() = user_id);

-- Reward purchases policies
DROP POLICY IF EXISTS "Users can manage their own reward purchases" ON public.reward_purchases;
CREATE POLICY "Users can manage their own reward purchases" ON public.reward_purchases FOR ALL USING (auth.uid() = user_id);

-- Quotes policies
DROP POLICY IF EXISTS "Anyone can view active quotes" ON public.quotes;
CREATE POLICY "Anyone can view active quotes" ON public.quotes FOR SELECT USING (is_active = true);

-- User preferences policies
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view their own usage" ON public.usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own usage" ON public.usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Billing history policies
CREATE POLICY "Users can view their own billing history" ON public.billing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own billing history" ON public.billing_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- API keys policies
CREATE POLICY "Users can manage their own API keys" ON public.api_keys FOR ALL USING (auth.uid() = user_id);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_experience_updated_at ON public.user_experience;
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON public.user_experience FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON public.journal_entries;
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_achievements_updated_at ON public.achievements;
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reward_templates_updated_at ON public.reward_templates;
CREATE TRIGGER update_reward_templates_updated_at BEFORE UPDATE ON public.reward_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_rewards_updated_at ON public.rewards;
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON public.quotes;
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enhanced user initialization function
CREATE OR REPLACE FUNCTION public.initialize_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user experience record with zero values
  INSERT INTO public.user_experience (user_id, total_exp, current_level, lunar_crystals, diamonds)
  VALUES (NEW.id, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user preferences with defaults
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create subscription record
  INSERT INTO public.subscriptions (user_id, status, tier)
  VALUES (NEW.id, 'active', 'free')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create initial welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id, 
    'Welcome to Millionaire Den!', 
    'Start your journey by creating your first habit and begin earning EXP and Lunar Crystals.',
    'info'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_new_user();

-- Enhanced reset user stats function
CREATE OR REPLACE FUNCTION public.reset_user_stats(p_user_id uuid, reset_crystals boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid;
BEGIN
  -- Security check: ensure user can only reset their own stats
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF v_uid <> p_user_id THEN
    RAISE EXCEPTION 'Forbidden: can only reset your own stats';
  END IF;

  -- Reset user experience (conditionally reset crystals)
  IF reset_crystals THEN
    UPDATE public.user_experience 
    SET total_exp = 0, current_level = 0, lunar_crystals = 0, diamonds = 0, updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public.user_experience 
    SET total_exp = 0, current_level = 0, diamonds = 0, updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Clear habit completions
  DELETE FROM public.habit_completions WHERE user_id = p_user_id;
  
  -- Clear EXP transactions
  DELETE FROM public.exp_transactions WHERE user_id = p_user_id;
  
  -- Clear level history
  DELETE FROM public.level_history WHERE user_id = p_user_id;
  
  -- Clear reward purchases
  DELETE FROM public.reward_purchases WHERE user_id = p_user_id;
  
  -- Clear user achievements
  DELETE FROM public.user_achievements WHERE user_id = p_user_id;
  
  -- Reset all habits completion status
  UPDATE public.habits 
  SET updated_at = now() 
  WHERE user_id = p_user_id;
  
  -- Add reset notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (p_user_id, 'Stats Reset', 'Your stats have been successfully reset.', 'info');
END;
$$;

-- Insert sample data for achievements
INSERT INTO public.achievements (name, description, requirement_type, requirement_value, crystal_reward, icon) VALUES
('First Steps', 'Complete your first habit', 'habits_completed', 1, 50, 'Star'),
('Getting Started', 'Reach 100 EXP', 'exp_total', 100, 25, 'Trophy'),
('Habit Former', 'Complete 10 habits', 'habits_completed', 10, 100, 'Target'),
('Experienced', 'Reach 1000 EXP', 'exp_total', 1000, 150, 'Award'),
('Streak Master', 'Maintain a 7-day streak', 'habit_streak', 7, 200, 'Flame'),
('Level Up', 'Reach Level 5', 'level_reached', 5, 300, 'Crown'),
('Dedication', 'Complete 50 habits', 'habits_completed', 50, 500, 'Medal'),
('Journal Starter', 'Write your first journal entry', 'journal_entries', 1, 25, 'BookOpen'),
('Reflective', 'Write 10 journal entries', 'journal_entries', 10, 100, 'Book'),
('Master', 'Reach Level 10', 'level_reached', 10, 1000, 'Diamond')
ON CONFLICT (name) DO NOTHING;

-- Insert sample reward templates
INSERT INTO public.reward_templates (name, description, cost, category, icon) VALUES
('Coffee Break', 'Enjoy a premium coffee', 50, 'food', 'Coffee'),
('Movie Night', 'Watch your favorite movie', 100, 'entertainment', 'Film'),
('Workout Gear', 'Buy new workout equipment', 200, 'wellness', 'Dumbbell'),
('Book Purchase', 'Buy a new book', 150, 'education', 'Book'),
('Spa Day', 'Relax with a spa treatment', 300, 'wellness', 'Sparkles'),
('Gaming Session', 'Extended gaming time', 75, 'entertainment', 'Gamepad2'),
('Shopping Spree', 'Small shopping reward', 250, 'shopping', 'ShoppingBag'),
('Restaurant Visit', 'Dinner at your favorite place', 400, 'food', 'UtensilsCrossed'),
('Concert Ticket', 'Live music experience', 500, 'experience', 'Music'),
('Weekend Getaway', 'Short vacation trip', 1000, 'experience', 'Plane')
ON CONFLICT (name) DO NOTHING;

-- Insert sample quotes
INSERT INTO public.quotes (text, author, category, tags) VALUES
('The only way to do great work is to love what you do.', 'Steve Jobs', 'Success', ARRAY['work', 'passion']),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'Motivation', ARRAY['courage', 'persistence']),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'Wisdom', ARRAY['dreams', 'future']),
('It is during our darkest moments that we must focus to see the light.', 'Aristotle', 'Motivation', ARRAY['hope', 'perseverance']),
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'Productivity', ARRAY['action', 'start']),
('Your limitation—it''s only your imagination.', 'Unknown', 'Motivation', ARRAY['limits', 'imagination']),
('Health is a state of complete harmony of the body, mind and spirit.', 'B.K.S. Iyengar', 'Health', ARRAY['wellness', 'balance']),
('Happiness is not something ready made. It comes from your own actions.', 'Dalai Lama', 'Happiness', ARRAY['joy', 'actions'])
ON CONFLICT (text) DO NOTHING;
