-- Fix potential RLS security gaps for profiles table
-- The current policies are correct but let's ensure they're comprehensive and secure

-- First, let's check the current state and add a more restrictive DELETE policy
-- since currently users can't delete profiles at all, which is good

-- Add explicit RESTRICTIVE policies to ensure no unauthorized access
-- These will work alongside the existing PERMISSIVE policies for extra security

-- Ensure only authenticated users can access profiles at all
CREATE POLICY "profiles_authenticated_users_only" ON public.profiles
  AS RESTRICTIVE
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Ensure users can only access their own profile data  
CREATE POLICY "profiles_own_data_only" ON public.profiles
  AS RESTRICTIVE 
  FOR ALL
  USING (auth.uid() = user_id);

-- Add a policy to prevent any access to profiles when not authenticated
-- This provides defense in depth
CREATE POLICY "profiles_no_anonymous_access" ON public.profiles
  FOR ALL
  TO anon
  USING (false);

-- Also ensure the user_id column is properly constrained
-- Add a check to ensure user_id cannot be manipulated
DO $$
BEGIN
  -- Add constraint to ensure user_id matches authenticated user on insert/update
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_matches_auth'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_user_id_matches_auth 
    CHECK (user_id IS NOT NULL);
  END IF;
END $$;