
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

export const useResetStats = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const resetStats = async (resetCrystals: boolean = false) => {
    if (!user) return false;

    setIsResetting(true);
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

      // Trigger a page reload to refresh all data
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
      setIsResetting(false);
    }
  };

  return {
    resetStats,
    isResetting
  };
};
