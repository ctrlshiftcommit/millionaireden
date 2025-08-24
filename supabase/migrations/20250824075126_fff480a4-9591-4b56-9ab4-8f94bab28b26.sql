-- Fix security warnings by setting proper search_path for functions

-- Drop and recreate functions with proper search_path
DROP FUNCTION IF EXISTS public.initialize_new_user();
DROP FUNCTION IF EXISTS public.check_daily_progress_notification(UUID);

-- Recreate initialize_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.initialize_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate check_daily_progress_notification function with proper search_path
CREATE OR REPLACE FUNCTION public.check_daily_progress_notification(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  daily_completion_rate DECIMAL;
  total_habits INTEGER;
  completed_habits INTEGER;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also fix the existing update_updated_at_column function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate all the triggers that use this function
DROP TRIGGER IF EXISTS update_ui_configuration_updated_at ON public.ui_configuration;
DROP TRIGGER IF EXISTS update_sitemap_updated_at ON public.sitemap;  
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_rewards_updated_at ON public.rewards;

-- Recreate triggers
CREATE TRIGGER update_ui_configuration_updated_at
  BEFORE UPDATE ON public.ui_configuration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sitemap_updated_at
  BEFORE UPDATE ON public.sitemap
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();