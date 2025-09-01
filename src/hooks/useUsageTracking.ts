
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type ActionType = 'habit_completion' | 'journal_entry' | 'reward_purchase' | 'login' | 'page_view';

export const useUsageTracking = () => {
  const { user } = useAuth();

  const trackAction = async (actionType: ActionType, metadata?: Record<string, any>) => {
    if (!user) return;

    try {
      // For now, we'll just log to console since usage_tracking table might not be in types
      console.log('Usage tracking:', { actionType, metadata, userId: user.id });
      
      // When the table is available in types, uncomment this:
      // const { error } = await supabase
      //   .from('usage_tracking')
      //   .insert({
      //     user_id: user.id,
      //     action_type: actionType,
      //     metadata: metadata || {}
      //   });

      // if (error) throw error;
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  return { trackAction };
};
