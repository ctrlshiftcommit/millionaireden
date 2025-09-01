
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useResetStats = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const resetStats = async (resetCrystals: boolean = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to reset stats.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('reset_user_stats', {
        p_user_id: user.id,
        reset_crystals: resetCrystals
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your stats have been reset successfully.",
      });
      
      // Refresh the page to update all components
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error resetting stats:', error);
      toast({
        title: "Error",
        description: "Failed to reset stats. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    resetStats,
    loading
  };
};
