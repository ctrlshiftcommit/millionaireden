
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing';
  tier: 'free' | 'premium' | 'enterprise';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      // Since subscriptions table might not be in types yet, we'll use a workaround
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Create a mock subscription object based on profile data
      const mockSubscription: Subscription = {
        id: 'mock-sub-id',
        user_id: user.id,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        status: data.subscription_status as Subscription['status'] || 'active',
        tier: data.subscription_tier as Subscription['tier'] || 'free',
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionTier = async (tier: Subscription['tier']) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('user_id', user.id);

      if (error) throw error;

      if (subscription) {
        setSubscription({ ...subscription, tier });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating subscription tier:', error);
      return false;
    }
  };

  return {
    subscription,
    loading,
    updateSubscriptionTier,
    refetch: fetchSubscription
  };
};
