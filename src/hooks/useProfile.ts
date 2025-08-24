import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

interface UserExperience {
  total_exp: number;
  current_level: number;
  lunar_crystals: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userExp, setUserExp] = useState<UserExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserExperience();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        // Create profile if it doesn't exist
        const newProfile = {
          user_id: user.id,
          display_name: user.user_metadata?.display_name || null,
          email: user.email || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          phone_number: user.user_metadata?.phone_number || null
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(createdProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserExperience = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_experience')
        .select('total_exp, current_level, lunar_crystals')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user experience:', error);
        return;
      }

      if (data) {
        setUserExp(data);
      }
    } catch (error) {
      console.error('Error in fetchUserExperience:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload an avatar.",
        variant: "destructive"
      });
      return null;
    }

    try {
      // First, check if the avatars bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        throw new Error('Unable to access storage');
      }

      const avatarsBucket = buckets?.find(bucket => bucket.id === 'avatars');
      if (!avatarsBucket) {
        console.error('Avatars bucket not found');
        throw new Error('Storage bucket not configured');
      }

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading avatar:', { filePath, fileSize: file.size, fileType: file.type });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Upload successful, public URL:', data.publicUrl);

      await updateProfile({ avatar_url: data.publicUrl });
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!"
      });
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    profile,
    userExp,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: () => {
      fetchProfile();
      fetchUserExperience();
    }
  };
};