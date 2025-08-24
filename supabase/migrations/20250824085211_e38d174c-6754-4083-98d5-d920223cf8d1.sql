-- Fix security issues by setting proper search_path for all functions

-- Drop and recreate update_updated_at_column with proper security
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate initialize_new_user with proper security
DROP FUNCTION IF EXISTS public.initialize_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.initialize_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create user experience record with zero values
  INSERT INTO public.user_experience (user_id, total_exp, current_level, lunar_crystals)
  VALUES (NEW.id, 0, 0, 0);
  
  -- Create user preferences with defaults
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create initial welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id, 
    'Welcome to Millionaire Den!', 
    'Start your journey by creating your first habit and begin earning EXP and Lunar Crystals.',
    'welcome'
  );
  
  RETURN NEW;
END;
$$;

-- Drop and recreate check_daily_progress_notification with proper security
DROP FUNCTION IF EXISTS public.check_daily_progress_notification(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.check_daily_progress_notification(p_user_id uuid)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_completion_rate DECIMAL;
  total_habits INTEGER;
  completed_habits INTEGER;
  v_uid uuid;
BEGIN
  -- Security check: ensure user can only check their own progress
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF v_uid <> p_user_id THEN
    RAISE EXCEPTION 'Forbidden: can only check your own progress';
  END IF;

  -- Get today's habit completion stats
  SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN hc.completed_date = CURRENT_DATE THEN 1 END) as completed
  INTO total_habits, completed_habits
  FROM public.habits h
  LEFT JOIN public.habit_completions hc ON h.id = hc.habit_id AND hc.user_id = p_user_id
  WHERE h.user_id = p_user_id AND h.is_active = true;
  
  -- Calculate completion rate
  IF total_habits > 0 THEN
    daily_completion_rate := completed_habits::DECIMAL / total_habits::DECIMAL;
    
    -- Send notification if > 50% completed and no notification sent today
    IF daily_completion_rate > 0.5 THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      SELECT p_user_id, 'Great Progress!', 
             'You''ve completed ' || ROUND(daily_completion_rate * 100) || '% of your daily habits!',
             'progress'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.notifications 
        WHERE user_id = p_user_id 
        AND type = 'progress' 
        AND created_at::DATE = CURRENT_DATE
      );
    END IF;
  END IF;
END;
$$;

-- Drop and recreate reset_user_stats with proper security
DROP FUNCTION IF EXISTS public.reset_user_stats(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.reset_user_stats(p_user_id uuid)
RETURNS VOID 
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
  
  -- Clear user achievements
  DELETE FROM public.user_achievements WHERE user_id = p_user_id;
  
  -- Reset all habits completion status
  UPDATE public.habits 
  SET updated_at = now() 
  WHERE user_id = p_user_id;
  
  -- Add reset notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (p_user_id, 'Stats Reset', 'All your stats have been successfully reset to zero.', 'system');
END;
$$;

-- Recreate all triggers with the updated functions
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_experience_updated_at
  BEFORE UPDATE ON public.user_experience
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant execute permissions only to authenticated users for security functions
REVOKE ALL ON FUNCTION public.check_daily_progress_notification(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_user_stats(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_daily_progress_notification(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_user_stats(uuid) TO authenticated;