import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { ProfilePicture, ProfilePictureUpload, ProfilePictureUpdate } from '@/types/profile';

export const useProfilePictures = () => {
  const [profilePictures, setProfilePictures] = useState<ProfilePicture[]>([]);
  const [primaryPicture, setPrimaryPicture] = useState<ProfilePicture | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfilePictures();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfilePictures = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profile_pictures')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profile pictures:', error);
        return;
      }

      setProfilePictures(data || []);
      const primary = data?.find(pic => pic.is_primary) || null;
      setPrimaryPicture(primary);
    } catch (error) {
      console.error('Error in fetchProfilePictures:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<ProfilePicture | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload a profile picture.",
        variant: "destructive"
      });
      return null;
    }

    setUploading(true);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      }

      // Create file metadata
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Create database record first
      const pictureData = {
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        storage_url: '', // Will be updated after upload
        public_url: '', // Will be updated after upload
        upload_status: 'uploading' as const
      };

      const { data: newPicture, error: insertError } = await supabase
        .from('profile_pictures')
        .insert([pictureData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        // Update record with error
        await supabase
          .from('profile_pictures')
          .update({ 
            upload_status: 'failed', 
            error_message: uploadError.message 
          })
          .eq('id', newPicture.id);

        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update record with success
      const { data: updatedPicture, error: updateError } = await supabase
        .from('profile_pictures')
        .update({
          storage_url: urlData.publicUrl,
          public_url: urlData.publicUrl,
          upload_status: 'completed',
          is_active: true,
          is_primary: !primaryPicture // Make primary if no primary picture exists
        })
        .eq('id', newPicture.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Refresh the list
      await fetchProfilePictures();

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully!"
      });

      return updatedPicture;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryPictureById = async (pictureId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profile_pictures')
        .update({ is_primary: true })
        .eq('id', pictureId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchProfilePictures();
      
      toast({
        title: "Success",
        description: "Primary profile picture updated!"
      });

      return true;
    } catch (error) {
      console.error('Error setting primary picture:', error);
      toast({
        title: "Error",
        description: "Failed to update primary picture. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteProfilePicture = async (pictureId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const picture = profilePictures.find(p => p.id === pictureId);
      if (!picture) {
        throw new Error('Picture not found');
      }

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([picture.file_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('profile_pictures')
        .delete()
        .eq('id', pictureId)
        .eq('user_id', user.id);

      if (dbError) {
        throw dbError;
      }

      await fetchProfilePictures();
      
      toast({
        title: "Success",
        description: "Profile picture deleted successfully!"
      });

      return true;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to delete profile picture. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProfilePicture = async (pictureId: string, updates: ProfilePictureUpdate): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profile_pictures')
        .update(updates)
        .eq('id', pictureId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchProfilePictures();
      return true;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return false;
    }
  };

  return {
    profilePictures,
    primaryPicture,
    loading,
    uploading,
    uploadProfilePicture,
    setPrimaryPictureById,
    deleteProfilePicture,
    updateProfilePicture,
    refetch: fetchProfilePictures
  };
};