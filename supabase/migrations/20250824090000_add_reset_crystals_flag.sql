-- Add optional flag to control lunar crystal reset during stats reset
-- Drops old single-arg function and creates a new two-arg version

DROP FUNCTION IF EXISTS public.reset_user_stats(uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.reset_user_stats(
  p_user_id uuid,
  p_reset_crystals boolean DEFAULT true
)
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

  -- Reset user experience with optional lunar crystal reset
  UPDATE public.user_experience 
  SET total_exp = 0,
      current_level = 0,
      lunar_crystals = CASE WHEN p_reset_crystals THEN 0 ELSE lunar_crystals END,
      updated_at = now()
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
  VALUES (
    p_user_id,
    'Stats Reset',
    CASE WHEN p_reset_crystals THEN 'All your stats and crystals have been reset to zero.'
         ELSE 'All your stats have been reset to zero (crystals preserved).'
    END,
    'system'
  );
END;
$$;

-- Grant execute permissions only to authenticated users
REVOKE ALL ON FUNCTION public.reset_user_stats(uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_user_stats(uuid, boolean) TO authenticated;