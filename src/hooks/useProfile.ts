
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
  subscription_tier: 'free' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'cancelled' | 'expired' | 'trial';
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
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

      if (data) {
        // Ensure all required fields are present with defaults
        const profileData: Profile = {
          id: data.id,
          user_id: data.user_id,
          display_name: data.display_name,
          email: data.email || user.email,
          avatar_url: data.avatar_url,
          phone_number: data.phone_number,
        subscription_tier: data.subscription_tier as 'free' | 'premium' | 'enterprise' || 'free',
        subscription_status: data.subscription_status as 'active' | 'cancelled' | 'expired' | 'trial' || 'active',
          trial_ends_at: data.trial_ends_at,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setProfile(profileData);
      } else {
        await createProfile();
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          email: user.email,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || null,
          subscription_tier: 'free',
          subscription_status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      
      const profileData: Profile = {
        id: data.id,
        user_id: data.user_id,
        display_name: data.display_name,
        email: data.email,
        avatar_url: data.avatar_url,
        phone_number: data.phone_number,
        subscription_tier: data.subscription_tier as 'free' | 'premium' | 'enterprise' || 'free',
        subscription_status: data.subscription_status as 'active' | 'cancelled' | 'expired' | 'trial' || 'active',
        trial_ends_at: data.trial_ends_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      setProfile(profileData);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile.",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return false;

    try {
      // If email is being updated, also update auth user
      if (updates.email && updates.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        });
        
        if (authError) {
          toast({
            title: "Info",
            description: "Email update requires verification. Check your new email for confirmation.",
          });
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProfile: Profile = {
        id: data.id,
        user_id: data.user_id,
        display_name: data.display_name,
        email: data.email,
        avatar_url: data.avatar_url,
        phone_number: data.phone_number,
        subscription_tier: data.subscription_tier as 'free' | 'premium' | 'enterprise' || 'free',
        subscription_status: data.subscription_status as 'active' | 'cancelled' | 'expired' | 'trial' || 'active',
        trial_ends_at: data.trial_ends_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return false;

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file.",
          variant: "destructive"
        });
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB.",
          variant: "destructive"
        });
        return false;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });
      return true;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile
  };
};
