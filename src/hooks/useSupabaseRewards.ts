import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface RewardTemplate {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  icon: string;
  is_active: boolean;
}

interface UserReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  icon: string;
  is_active: boolean;
}

interface RewardPurchase {
  id: string;
  reward_id: string;
  crystals_spent: number;
  is_used: boolean;
  used_at?: string;
  purchased_at: string;
}

export const useSupabaseRewards = () => {
  const [rewardTemplates, setRewardTemplates] = useState<RewardTemplate[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [purchases, setPurchases] = useState<RewardPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch reward templates
      const { data: templates, error: templatesError } = await supabase
        .from('reward_templates')
        .select('*')
        .eq('is_active', true)
        .order('cost', { ascending: true });

      if (templatesError) throw templatesError;

      // Fetch user's custom rewards
      const { data: rewards, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('cost', { ascending: true });

      if (rewardsError) throw rewardsError;

      // Fetch user's purchases
      const { data: userPurchases, error: purchasesError } = await supabase
        .from('reward_purchases')
        .select('*')
        .eq('user_id', user?.id)
        .order('purchased_at', { ascending: false });

      if (purchasesError) throw purchasesError;

      setRewardTemplates(templates || []);
      setUserRewards(rewards || []);
      setPurchases(userPurchases || []);
    } catch (error) {
      console.error('Error fetching rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseReward = async (reward: RewardTemplate | UserReward, crystalsAmount: number): Promise<boolean> => {
    if (!user) return false;

    try {
      // Record the purchase
      const { error: purchaseError } = await supabase
        .from('reward_purchases')
        .insert([{
          user_id: user.id,
          reward_id: reward.id,
          crystals_spent: crystalsAmount,
          is_used: false
        }]);

      if (purchaseError) throw purchaseError;

      toast({
        title: "🎁 Reward Purchased!",
        description: `You bought "${reward.name}" for ${crystalsAmount} crystals!`,
      });

      // Refresh purchases
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error purchasing reward:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase reward. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const useReward = async (purchaseId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('reward_purchases')
        .update({
          is_used: true,
          used_at: new Date().toISOString()
        })
        .eq('id', purchaseId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "✅ Reward Used!",
        description: "Enjoy your reward!",
      });

      // Refresh purchases
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error using reward:', error);
      toast({
        title: "Error",
        description: "Failed to mark reward as used.",
        variant: "destructive"
      });
      return false;
    }
  };

  const addCustomReward = async (rewardData: Omit<UserReward, 'id' | 'is_active'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('rewards')
        .insert([{
          user_id: user.id,
          ...rewardData,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Custom Reward Added",
        description: `"${rewardData.name}" has been added to your rewards!`,
      });

      // Refresh data
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error adding custom reward:', error);
      toast({
        title: "Error",
        description: "Failed to add custom reward. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCustomReward = async (rewardId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('rewards')
        .update({ is_active: false })
        .eq('id', rewardId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Reward Deleted",
        description: "Custom reward has been deleted.",
      });

      // Refresh data
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: "Error",
        description: "Failed to delete reward. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getAvailableRewards = (): (RewardTemplate | UserReward)[] => {
    return [...rewardTemplates, ...userRewards];
  };

  const getPurchasedRewards = () => {
    return purchases;
  };

  const getUnusedRewards = () => {
    return purchases.filter(purchase => !purchase.is_used);
  };

  const getUsedRewards = () => {
    return purchases.filter(purchase => purchase.is_used);
  };

  return {
    rewardTemplates,
    userRewards,
    purchases,
    loading,
    purchaseReward,
    useReward,
    addCustomReward,
    deleteCustomReward,
    getAvailableRewards,
    getPurchasedRewards,
    getUnusedRewards,
    getUsedRewards,
    refetch: fetchData
  };
};