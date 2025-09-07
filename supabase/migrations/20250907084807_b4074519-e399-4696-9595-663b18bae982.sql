-- Update reset_user_stats function to clear local storage related data and reset habit streaks
CREATE OR REPLACE FUNCTION public.reset_user_stats(p_user_id uuid, reset_crystals boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  IF reset_crystals THEN
    UPDATE public.user_experience 
    SET total_exp = 0, current_level = 0, lunar_crystals = 0, updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public.user_experience 
    SET total_exp = 0, current_level = 0, updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Clear habit completions (this resets streaks)
  DELETE FROM public.habit_completions WHERE user_id = p_user_id;
  
  -- Clear EXP transactions
  DELETE FROM public.exp_transactions WHERE user_id = p_user_id;
  
  -- Clear level history
  DELETE FROM public.level_history WHERE user_id = p_user_id;
  
  -- Clear reward purchases
  DELETE FROM public.reward_purchases WHERE user_id = p_user_id;
  
  -- Clear user achievements
  DELETE FROM public.user_achievements WHERE user_id = p_user_id;
  
  -- Update all habits to reset any cached data (timestamp update triggers recalculation)
  UPDATE public.habits 
  SET updated_at = now() 
  WHERE user_id = p_user_id;
  
  -- Add reset notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (p_user_id, 'Stats Reset', 'All your stats, streaks, and progress have been successfully reset.', 'system');
END;
$function$;