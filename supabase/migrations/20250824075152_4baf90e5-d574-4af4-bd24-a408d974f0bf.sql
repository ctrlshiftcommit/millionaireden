-- Update user_experience table defaults to ensure new users start with zero
ALTER TABLE public.user_experience ALTER COLUMN total_exp SET DEFAULT 0;
ALTER TABLE public.user_experience ALTER COLUMN current_level SET DEFAULT 0;
ALTER TABLE public.user_experience ALTER COLUMN lunar_crystals SET DEFAULT 0;

-- Function to reset user stats (for the reset stats feature)
CREATE OR REPLACE FUNCTION public.reset_user_stats(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Reset user experience
  UPDATE public.user_experience 
  SET total_exp = 0, current_level = 0, lunar_crystals = 0, updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Clear habit completions
  DELETE FROM public.habit_completions WHERE user_id = p_user_id;
  
  -- Clear EXP transactions
  DELETE FROM public.exp_transactions WHERE user_id = p_user_id;
  
  -- Clear level history
  DELETE FROM public.level_history WHERE user_id = p_user_id;
  
  -- Clear reward purchases
  DELETE FROM public.reward_purchases WHERE user_id = p_user_id;
  
  -- Reset all habits completion status
  UPDATE public.habits 
  SET updated_at = now() 
  WHERE user_id = p_user_id;
  
  -- Add reset notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (p_user_id, 'Stats Reset', 'All your stats have been successfully reset to zero.', 'system');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;