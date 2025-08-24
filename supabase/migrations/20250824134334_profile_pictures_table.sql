-- Create profile pictures table for better avatar management
CREATE TABLE public.profile_pictures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  upload_status TEXT CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_profile_pictures_user_id ON public.profile_pictures(user_id);
CREATE INDEX idx_profile_pictures_active ON public.profile_pictures(is_active);
CREATE INDEX idx_profile_pictures_primary ON public.profile_pictures(is_primary);

-- Create function to ensure only one primary picture per user
CREATE OR REPLACE FUNCTION ensure_single_primary_picture()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new record is being set as primary, unset all other primary pictures for this user
  IF NEW.is_primary = true THEN
    UPDATE public.profile_pictures 
    SET is_primary = false, updated_at = now()
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single primary picture per user
CREATE TRIGGER trigger_ensure_single_primary_picture
  BEFORE INSERT OR UPDATE ON public.profile_pictures
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_picture();

-- Create function to update profile avatar_url when primary picture changes
CREATE OR REPLACE FUNCTION update_profile_avatar_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profiles table avatar_url when a picture becomes primary
  IF NEW.is_primary = true THEN
    UPDATE public.profiles 
    SET avatar_url = NEW.public_url, updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  -- Clear avatar_url if primary picture is deactivated
  IF OLD.is_primary = true AND NEW.is_primary = false THEN
    UPDATE public.profiles 
    SET avatar_url = NULL, updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync profile avatar_url with primary picture
CREATE TRIGGER trigger_update_profile_avatar_url
  AFTER INSERT OR UPDATE ON public.profile_pictures
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_avatar_url();

-- Create RLS policies for profile_pictures table
ALTER TABLE public.profile_pictures ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile pictures
CREATE POLICY "Users can view their own profile pictures"
ON public.profile_pictures
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own profile pictures
CREATE POLICY "Users can insert their own profile pictures"
ON public.profile_pictures
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
ON public.profile_pictures
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures"
ON public.profile_pictures
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to clean up old profile pictures
CREATE OR REPLACE FUNCTION cleanup_old_profile_pictures()
RETURNS void AS $$
BEGIN
  -- Delete profile pictures that are not primary and older than 30 days
  DELETE FROM public.profile_pictures 
  WHERE is_primary = false 
    AND created_at < now() - INTERVAL '30 days'
    AND upload_status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Add comment to explain the table purpose
COMMENT ON TABLE public.profile_pictures IS 'Stores user profile pictures with upload history and management capabilities';
COMMENT ON COLUMN public.profile_pictures.is_primary IS 'Indicates if this is the user''s primary/active avatar';
COMMENT ON COLUMN public.profile_pictures.upload_status IS 'Tracks the upload process status';