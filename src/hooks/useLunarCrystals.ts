import { useState, useEffect } from 'react';
import { useUnifiedStats } from './useUnifiedStats';

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'entertainment' | 'food' | 'wellness' | 'experiences' | 'items';
  purchased: boolean;
  purchasedAt?: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  pointsRequired: number;
  nextLevelPoints: number;
}

const defaultRewards: Reward[] = [
  {
    id: '1',
    name: '30min YouTube Break',
    description: 'Guilt-free entertainment time',
    cost: 50,
    icon: 'Play',
    category: 'entertainment',
    purchased: false,
  },
  {
    id: '2',
    name: 'Favorite Snack',
    description: 'Treat yourself to something delicious',
    cost: 75,
    icon: 'Cookie',
    category: 'food',
    purchased: false,
  },
  {
    id: '3',
    name: 'Relaxing Bath',
    description: 'Spa-like experience at home',
    cost: 100,
    icon: 'Waves',
    category: 'wellness',
    purchased: false,
  },
  {
    id: '4',
    name: 'Movie Night',
    description: 'Watch your favorite movie',
    cost: 150,
    icon: 'Film',
    category: 'entertainment',
    purchased: false,
  },
  {
    id: '5',
    name: 'Coffee Shop Visit',
    description: 'Work from your favorite cafe',
    cost: 200,
    icon: 'Coffee',
    category: 'experiences',
    purchased: false,
  },
];

export const useLunarCrystals = () => {
  const { stats, addLunarCrystals, spendLunarCrystals, getLevelInfo: getUnifiedLevelInfo } = useUnifiedStats();
  const crystals = stats?.lunar_crystals || 0;
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [settings, setSettings] = useState({
    crystalsPerTask: 25,
    crystalsPerHabit: 50,
    crystalsPerStreak: 10, // bonus per streak day
    expToLunarCrystalRate: 100, // 100 EXP = 1 Crystal
  });
  const [levelHistory, setLevelHistory] = useState<Array<{
    timestamp: string;
    oldLevel: number;
    newLevel: number;
    expAtLevelUp: number;
  }>>([]);
  const [transactionHistory, setTransactionHistory] = useState<Array<{
    timestamp: string;
    type: 'reward_used' | 'exp_to_crystals' | 'task_completed' | 'level_up';
    amount: number;
    description: string;
    expAmount?: number;
  }>>([]);

  useEffect(() => {
    // Load from localStorage
    const savedRewards = localStorage.getItem('millionaire-den-rewards');
    const savedSettings = localStorage.getItem('millionaire-den-crystal-settings');

    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    } else {
      setRewards(defaultRewards);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('millionaire-den-rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('millionaire-den-crystal-settings', JSON.stringify(settings));
  }, [settings]);

  const earnCrystals = (amount: number, reason: string = 'Task completed') => {
    addLunarCrystals(amount, reason);
    // Could add notification here
  };

  const spendCrystals = (amount: number): boolean => {
    // Delegate to unified stats (Supabase)
    // Note: This is async in unified stats; here we expose sync-like result via promise resolution
    // For compatibility, we optimistically return false and let callers update UI after action
    console.warn('spendCrystals is now handled via Supabase. Use spendLunarCrystals from useUnifiedStats if you need promises.');
    return false;
  };

  const purchaseReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.purchased) return false;

    // Use Supabase-backed spending
    // We cannot await here since the legacy API is sync; assume success path is handled elsewhere if needed
    if (crystals >= reward.cost) {
      spendLunarCrystals(reward.cost, 'Reward purchase');
      setRewards(prev => prev.map(r => 
        r.id === rewardId 
          ? { ...r, purchased: true, purchasedAt: new Date().toISOString() }
          : r
      ));
      return true;
    }
    return false;
  };

  const addReward = (rewardData: Omit<Reward, 'id' | 'purchased'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: Date.now().toString(),
      purchased: false,
    };
    setRewards(prev => [...prev, newReward]);
  };

  const updateReward = (rewardId: string, updates: Partial<Reward>) => {
    setRewards(prev => prev.map(r => 
      r.id === rewardId ? { ...r, ...updates } : r
    ));
  };

  const deleteReward = (rewardId: string) => {
    setRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  const resetPurchasedRewards = () => {
    setRewards(prev => prev.map(r => ({ ...r, purchased: false, purchasedAt: undefined })));
  };

  const getLevelInfo = (): LevelInfo => {
    const info = getUnifiedLevelInfo();
    return {
      level: info.level,
      title: info.title,
      pointsRequired: info.pointsRequired,
      nextLevelPoints: info.nextLevelPoints,
    };
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    crystals,
    rewards,
    settings,
    earnCrystals,
    spendCrystals,
    purchaseReward,
    addReward,
    updateReward,
    deleteReward,
    resetPurchasedRewards,
    getLevelInfo,
    updateSettings,
  };
};