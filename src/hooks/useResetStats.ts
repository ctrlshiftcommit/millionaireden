
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useResetStats = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const resetStats = async (resetCrystals: boolean = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to reset stats.",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.rpc('reset_user_stats', {
        p_user_id: user.id,
        reset_crystals: resetCrystals
      });

      if (error) throw error;

      toast({
        title: "Stats Reset Successfully",
        description: resetCrystals 
          ? "All your progress including Lunar Crystals has been reset to zero."
          : "Your progress has been reset, but Lunar Crystals were preserved.",
      });

      // Force a page reload to refresh all hooks and data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting stats:', error);
      toast({
        title: "Reset Failed",
        description: "There was an error resetting your stats. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return {
    resetStats,
    isResetting
  };
};
