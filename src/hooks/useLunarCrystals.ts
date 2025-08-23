import { useState, useEffect } from 'react';

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

const levelTitles = [
  { level: 1, title: 'Peasant', pointsRequired: 0 },
  { level: 2, title: 'Apprentice', pointsRequired: 100 },
  { level: 3, title: 'Squire', pointsRequired: 300 },
  { level: 4, title: 'Warrior', pointsRequired: 700 },
  { level: 5, title: 'Knight', pointsRequired: 1500 },
  { level: 6, title: 'Champion', pointsRequired: 3000 },
  { level: 7, title: 'Hero', pointsRequired: 6000 },
  { level: 8, title: 'Legend', pointsRequired: 12000 },
  { level: 9, title: 'Master', pointsRequired: 25000 },
  { level: 10, title: 'Grandmaster', pointsRequired: 50000 },
];

export const useLunarCrystals = () => {
  const [crystals, setCrystals] = useState(250); // Starting crystals
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [settings, setSettings] = useState({
    crystalsPerTask: 25,
    crystalsPerHabit: 50,
    crystalsPerStreak: 10, // bonus per streak day
  });

  useEffect(() => {
    // Load from localStorage
    const savedCrystals = localStorage.getItem('millionaire-den-crystals');
    const savedRewards = localStorage.getItem('millionaire-den-rewards');
    const savedSettings = localStorage.getItem('millionaire-den-crystal-settings');

    if (savedCrystals) {
      setCrystals(parseInt(savedCrystals));
    }

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
    // Save to localStorage
    localStorage.setItem('millionaire-den-crystals', crystals.toString());
  }, [crystals]);

  useEffect(() => {
    localStorage.setItem('millionaire-den-rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('millionaire-den-crystal-settings', JSON.stringify(settings));
  }, [settings]);

  const earnCrystals = (amount: number, reason: string = 'Task completed') => {
    setCrystals(prev => prev + amount);
    // Could add notification here
  };

  const spendCrystals = (amount: number): boolean => {
    if (crystals >= amount) {
      setCrystals(prev => prev - amount);
      return true;
    }
    return false;
  };

  const purchaseReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.purchased) return false;

    if (spendCrystals(reward.cost)) {
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
    let currentLevel = levelTitles[0];
    let nextLevel = levelTitles[1];

    for (let i = 0; i < levelTitles.length - 1; i++) {
      if (crystals >= levelTitles[i].pointsRequired && crystals < levelTitles[i + 1].pointsRequired) {
        currentLevel = levelTitles[i];
        nextLevel = levelTitles[i + 1];
        break;
      } else if (crystals >= levelTitles[levelTitles.length - 1].pointsRequired) {
        currentLevel = levelTitles[levelTitles.length - 1];
        nextLevel = levelTitles[levelTitles.length - 1]; // Max level
        break;
      }
    }

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      pointsRequired: currentLevel.pointsRequired,
      nextLevelPoints: nextLevel.pointsRequired,
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