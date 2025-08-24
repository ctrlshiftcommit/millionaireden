import { useState, useEffect } from 'react';

export interface LevelInfo {
  level: number;
  title: string;
  description: string;
  pointsRequired: number;
  nextLevelPoints: number;
  progress: number;
}

export interface EXPTransaction {
  id: string;
  timestamp: string;
  type: 'task_completed' | 'habit_completed' | 'level_up' | 'conversion_loss';
  amount: number;
  description: string;
  source?: string;
}

const levelTitles = [
  { level: 0, title: 'Novice', pointsRequired: 0, description: 'Just starting your journey.' },
  { level: 1, title: 'Peasant', pointsRequired: 1000, description: 'Just a commoner, struggling to survive.' },
  { level: 2, title: 'Servant', pointsRequired: 5000, description: 'Doing others\' bidding, but learning discipline.' },
  { level: 3, title: 'Recruit', pointsRequired: 12000, description: 'A fresh fighter with basic combat knowledge.' },
  { level: 4, title: 'Soldier', pointsRequired: 20000, description: 'Trained and battle-ready, part of a greater force.' },
  { level: 5, title: 'Mercenary', pointsRequired: 30000, description: 'A seasoned warrior fighting for coin and glory.' },
  { level: 6, title: 'Knight', pointsRequired: 42000, description: 'Honorable, skilled, and a recognized fighter.' },
  { level: 7, title: 'Slayer', pointsRequired: 55000, description: 'Feared in battle, taking down foes with ruthless efficiency.' },
  { level: 8, title: 'Warlord', pointsRequired: 69000, description: 'Commands warriors, leads conquests, and inspires fear.' },
  { level: 9, title: 'Champion', pointsRequired: 84000, description: 'A master combatant, known far and wide.' },
  { level: 10, title: 'Elite Warrior', pointsRequired: 100000, description: 'The absolute peak, an unstoppable force in battle.' },
];

export const useEXPSystem = () => {
  const [totalEXP, setTotalEXP] = useState(0);
  const [expTransactions, setExpTransactions] = useState<EXPTransaction[]>([]);
  const [levelHistory, setLevelHistory] = useState<Array<{
    timestamp: string;
    oldLevel: number;
    newLevel: number;
    expAtLevelUp: number;
  }>>([]);

  useEffect(() => {
    // Load from localStorage
    const savedEXP = localStorage.getItem('millionaire-den-total-exp');
    const savedTransactions = localStorage.getItem('millionaire-den-exp-transactions');
    const savedLevelHistory = localStorage.getItem('millionaire-den-level-history');

    if (savedEXP) {
      setTotalEXP(parseInt(savedEXP));
    }

    if (savedTransactions) {
      setExpTransactions(JSON.parse(savedTransactions));
    }

    if (savedLevelHistory) {
      setLevelHistory(JSON.parse(savedLevelHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('millionaire-den-total-exp', totalEXP.toString());
  }, [totalEXP]);

  useEffect(() => {
    localStorage.setItem('millionaire-den-exp-transactions', JSON.stringify(expTransactions));
  }, [expTransactions]);

  useEffect(() => {
    localStorage.setItem('millionaire-den-level-history', JSON.stringify(levelHistory));
  }, [levelHistory]);

  const getLevelInfo = (exp: number = totalEXP): LevelInfo => {
    let currentLevel = levelTitles[0];
    let nextLevel = levelTitles[1] || levelTitles[levelTitles.length - 1];

    for (let i = 0; i < levelTitles.length - 1; i++) {
      if (exp >= levelTitles[i].pointsRequired && exp < levelTitles[i + 1].pointsRequired) {
        currentLevel = levelTitles[i];
        nextLevel = levelTitles[i + 1];
        break;
      } else if (exp >= levelTitles[levelTitles.length - 1].pointsRequired) {
        currentLevel = levelTitles[levelTitles.length - 1];
        nextLevel = levelTitles[levelTitles.length - 1]; // Max level
        break;
      }
    }

    const progress = currentLevel.level === levelTitles[levelTitles.length - 1].level 
      ? 100 
      : ((exp - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100;

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      description: currentLevel.description,
      pointsRequired: currentLevel.pointsRequired,
      nextLevelPoints: nextLevel.pointsRequired,
      progress: Math.max(0, Math.min(100, progress)),
    };
  };

  const addEXP = (amount: number, source: string = 'Unknown') => {
    const oldLevel = getLevelInfo().level;
    const newTotalEXP = totalEXP + amount;
    const newLevel = getLevelInfo(newTotalEXP).level;

    setTotalEXP(newTotalEXP);

    // Add transaction
    const transaction: EXPTransaction = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'task_completed',
      amount,
      description: `Gained ${amount} EXP from ${source}`,
      source,
    };

    setExpTransactions(prev => [transaction, ...prev]);

    // Check for level up
    if (newLevel > oldLevel) {
      const levelUpTransaction: EXPTransaction = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
        type: 'level_up',
        amount: 0,
        description: `Level up! Reached Level ${newLevel}: ${getLevelInfo(newTotalEXP).title}`,
      };

      setExpTransactions(prev => [levelUpTransaction, ...prev]);
      
      setLevelHistory(prev => [
        {
          timestamp: new Date().toISOString(),
          oldLevel,
          newLevel,
          expAtLevelUp: newTotalEXP,
        },
        ...prev
      ]);
    }

    return newLevel > oldLevel;
  };

  const removeEXP = (amount: number, reason: string = 'Conversion'): boolean => {
    if (totalEXP >= amount) {
      const oldLevel = getLevelInfo().level;
      const newTotalEXP = totalEXP - amount;
      const newLevel = getLevelInfo(newTotalEXP).level;

      setTotalEXP(newTotalEXP);

      const transaction: EXPTransaction = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'conversion_loss',
        amount: -amount,
        description: `Lost ${amount} EXP from ${reason}`,
      };

      setExpTransactions(prev => [transaction, ...prev]);

      // Track level down if it happens
      if (newLevel < oldLevel) {
        setLevelHistory(prev => [
          {
            timestamp: new Date().toISOString(),
            oldLevel,
            newLevel,
            expAtLevelUp: newTotalEXP,
          },
          ...prev
        ]);
      }

      return true;
    }
    return false;
  };

  const getExpProgressData = (days: number = 30) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const relevantTransactions = expTransactions.filter(t => 
      new Date(t.timestamp) >= startDate && 
      (t.type === 'task_completed' || t.type === 'habit_completed')
    );

    // Group by day
    const dailyData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayTransactions = relevantTransactions.filter(t => {
        const tDate = new Date(t.timestamp);
        return tDate >= dayStart && tDate <= dayEnd;
      });

      const totalEXP = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      dailyData.push({
        date: dayStart.toISOString().split('T')[0],
        exp: totalEXP,
      });
    }

    return dailyData;
  };

  return {
    totalEXP,
    expTransactions: expTransactions.slice(0, 100), // Limit for performance
    levelHistory: levelHistory.slice(0, 50), // Limit for performance
    getLevelInfo,
    addEXP,
    removeEXP,
    getExpProgressData,
    levelTitles,
  };
};