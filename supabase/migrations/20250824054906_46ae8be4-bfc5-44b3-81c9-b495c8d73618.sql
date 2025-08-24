-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create habits table
CREATE TABLE public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  goal TEXT CHECK (goal IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily',
  exp_reward INTEGER DEFAULT 100 NOT NULL,
  crystal_reward INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create habit completions table
CREATE TABLE public.habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  exp_gained INTEGER DEFAULT 0,
  crystals_gained INTEGER DEFAULT 0,
  streak_at_completion INTEGER DEFAULT 1,
  UNIQUE(habit_id, completed_date)
);

-- Create user experience table
CREATE TABLE public.user_experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_exp BIGINT DEFAULT 0 NOT NULL,
  current_level INTEGER DEFAULT 0 NOT NULL,
  lunar_crystals INTEGER DEFAULT 250 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create exp transactions table
CREATE TABLE public.exp_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('task_completed', 'habit_completed', 'level_up', 'conversion_loss', 'reward_purchase')) NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  source TEXT,
  old_level INTEGER,
  new_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create level history table
CREATE TABLE public.level_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  old_level INTEGER NOT NULL,
  new_level INTEGER NOT NULL,
  exp_at_levelup BIGINT NOT NULL,
  level_up_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  icon TEXT DEFAULT 'Gift',
  category TEXT CHECK (category IN ('entertainment', 'food', 'wellness', 'experiences', 'items')) DEFAULT 'entertainment',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reward purchases table
CREATE TABLE public.reward_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  crystals_spent INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT false
);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_important BOOLEAN DEFAULT false,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'bad', 'terrible')),
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for habits
CREATE POLICY "Users can manage their own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for habit completions
CREATE POLICY "Users can manage their own habit completions" ON public.habit_completions FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user experience
CREATE POLICY "Users can manage their own experience" ON public.user_experience FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for exp transactions
CREATE POLICY "Users can view their own exp transactions" ON public.exp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exp transactions" ON public.exp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for level history
CREATE POLICY "Users can view their own level history" ON public.level_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create level history" ON public.level_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for rewards
CREATE POLICY "Users can manage their own rewards" ON public.rewards FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for reward purchases
CREATE POLICY "Users can manage their own reward purchases" ON public.reward_purchases FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for journal entries
CREATE POLICY "Users can manage their own journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON public.user_experience FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX idx_habit_completions_completed_date ON public.habit_completions(completed_date);
CREATE INDEX idx_exp_transactions_user_id ON public.exp_transactions(user_id);
CREATE INDEX idx_exp_transactions_created_at ON public.exp_transactions(created_at);
CREATE INDEX idx_level_history_user_id ON public.level_history(user_id);
CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_reward_purchases_user_id ON public.reward_purchases(user_id);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);