import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useResetStats = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const resetStats = async (resetCrystals: boolean = true) => {
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
      console.log('Attempting to reset stats with params:', {
        p_user_id: user.id,
        p_reset_crystals: resetCrystals
      });

      const { error, data } = await supabase.rpc('reset_user_stats', {
        p_user_id: user.id,
        p_reset_crystals: resetCrystals
      });

      console.log('Reset stats response:', { error, data });

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific error types
        let errorMessage = "There was an error resetting your stats. Please try again.";
        
        if (error.message?.includes('Not authenticated')) {
          errorMessage = "You are not authenticated. Please log in again.";
        } else if (error.message?.includes('Forbidden')) {
          errorMessage = "You can only reset your own stats.";
        } else if (error.message?.includes('function') && error.message?.includes('not found')) {
          errorMessage = "Reset function not available. Please contact support.";
        } else if (error.message) {
          errorMessage = `Reset failed: ${error.message}`;
        }
        
        throw new Error(errorMessage);
      }

      toast({
        title: "Stats Reset Successfully",
        description: "All your progress has been reset to zero. You can start fresh!",
      });

      // Force a page reload to refresh all the hooks and data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting stats:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast({
        title: "Reset Failed",
        description: errorMessage,
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