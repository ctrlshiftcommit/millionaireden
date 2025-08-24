import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useResetStats = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const resetStats = async () => {
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
        p_user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Stats Reset Successfully",
        description: "All your progress has been reset to zero. You can start fresh!",
      });

      // Force a page reload to refresh all the hooks and data
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