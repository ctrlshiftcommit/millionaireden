
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type ActionType = 'habit_completion' | 'journal_entry' | 'reward_purchase' | 'login' | 'page_view';

export const useUsageTracking = () => {
  const { user } = useAuth();

  const trackAction = async (action: ActionType, metadata?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('usage_tracking')
        .insert([{
          user_id: user.id,
          action_type: action,
          metadata
        }]);

      if (error) {
        console.error('Error tracking usage:', error);
      }
    } catch (error) {
      console.error('Error in trackAction:', error);
    }
  };

  return { trackAction };
};
