-- Fix reset_user_stats function with better error handling and table operations
DROP FUNCTION IF EXISTS public.reset_user_stats(uuid, boolean) CASCADE;

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
  v_experience_exists boolean;
BEGIN
  -- Security check: ensure user can only reset their own stats
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF v_uid <> p_user_id THEN
    RAISE EXCEPTION 'Forbidden: can only reset your own stats';
  END IF;

  -- Check if user_experience record exists
  SELECT EXISTS(SELECT 1 FROM public.user_experience WHERE user_id = p_user_id) INTO v_experience_exists;

  -- Reset user experience with optional lunar crystal reset
  IF v_experience_exists THEN
    -- Update existing record
    UPDATE public.user_experience 
    SET total_exp = 0,
        current_level = 0,
        lunar_crystals = CASE WHEN p_reset_crystals THEN 0 ELSE lunar_crystals END,
        updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Insert new record
    INSERT INTO public.user_experience (user_id, total_exp, current_level, lunar_crystals, updated_at)
    VALUES (p_user_id, 0, 0, CASE WHEN p_reset_crystals THEN 0 ELSE 250 END, now());
  END IF;
  
  -- Clear habit completions (with error handling)
  BEGIN
    DELETE FROM public.habit_completions WHERE user_id = p_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to clear habit completions: %', SQLERRM;
  END;
  
  -- Clear EXP transactions (with error handling)
  BEGIN
    DELETE FROM public.exp_transactions WHERE user_id = p_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to clear exp transactions: %', SQLERRM;
  END;
  
  -- Clear level history (with error handling)
  BEGIN
    DELETE FROM public.level_history WHERE user_id = p_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to clear level history: %', SQLERRM;
  END;
  
  -- Clear reward purchases (with error handling)
  BEGIN
    DELETE FROM public.reward_purchases WHERE user_id = p_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to clear reward purchases: %', SQLERRM;
  END;
  
  -- Clear user achievements (with error handling)
  BEGIN
    DELETE FROM public.user_achievements WHERE user_id = p_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to clear user achievements: %', SQLERRM;
  END;
  
  -- Reset all habits completion status (with error handling)
  BEGIN
    UPDATE public.habits 
    SET updated_at = now() 
    WHERE user_id = p_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to update habits: %', SQLERRM;
  END;
  
  -- Add reset notification (only if notifications table exists and user has access)
  BEGIN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      p_user_id,
      'Stats Reset',
      CASE WHEN p_reset_crystals THEN 'All your stats and crystals have been reset to zero.'
           ELSE 'All your stats have been reset to zero (crystals preserved).'
      END,
      'system'
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- If notification insertion fails, just log it but don't fail the whole operation
      RAISE NOTICE 'Failed to insert notification: %', SQLERRM;
  END;
END;
$$;

-- Grant execute permissions only to authenticated users
REVOKE ALL ON FUNCTION public.reset_user_stats(uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_user_stats(uuid, boolean) TO authenticated;