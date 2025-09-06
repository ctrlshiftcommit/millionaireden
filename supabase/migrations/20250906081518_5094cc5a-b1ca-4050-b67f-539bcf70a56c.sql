-- Add missing subscription fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier text DEFAULT 'free',
ADD COLUMN subscription_status text DEFAULT 'active', 
ADD COLUMN trial_ends_at timestamp with time zone DEFAULT NULL;

-- Update the reset_user_stats function to support crystal reset parameter
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
$function$;