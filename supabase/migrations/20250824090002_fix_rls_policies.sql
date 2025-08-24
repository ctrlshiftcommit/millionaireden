-- Fix RLS policies to ensure reset_user_stats function works properly

-- Ensure user_experience table has proper policies for all operations
DROP POLICY IF EXISTS "Users can manage their own experience" ON public.user_experience;
CREATE POLICY "Users can manage their own experience" ON public.user_experience FOR ALL USING (auth.uid() = user_id);

-- Ensure habit_completions table has proper policies for all operations
DROP POLICY IF EXISTS "Users can manage their own habit completions" ON public.habit_completions;
CREATE POLICY "Users can manage their own habit completions" ON public.habit_completions FOR ALL USING (auth.uid() = user_id);

-- Ensure exp_transactions table has proper policies for all operations
DROP POLICY IF EXISTS "Users can view their own exp transactions" ON public.exp_transactions;
DROP POLICY IF EXISTS "Users can create exp transactions" ON public.exp_transactions;
CREATE POLICY "Users can manage their own exp transactions" ON public.exp_transactions FOR ALL USING (auth.uid() = user_id);

-- Ensure level_history table has proper policies for all operations
DROP POLICY IF EXISTS "Users can view their own level history" ON public.level_history;
DROP POLICY IF EXISTS "Users can create level history" ON public.level_history;
CREATE POLICY "Users can manage their own level history" ON public.level_history FOR ALL USING (auth.uid() = user_id);

-- Ensure reward_purchases table has proper policies for all operations
DROP POLICY IF EXISTS "Users can manage their own reward purchases" ON public.reward_purchases;
CREATE POLICY "Users can manage their own reward purchases" ON public.reward_purchases FOR ALL USING (auth.uid() = user_id);

-- Ensure user_achievements table has proper policies for all operations
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
CREATE POLICY "Users can manage their own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Ensure habits table has proper policies for all operations
DROP POLICY IF EXISTS "Users can manage their own habits" ON public.habits;
CREATE POLICY "Users can manage their own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- Ensure notifications table has proper policies for all operations
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);