import { useState, useEffect } from 'react';

export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  streak: number;
  completedDates: string[];
  goal: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  lastCompleted?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  requirement: {
    type: 'streak' | 'completion' | 'total';
    value: number;
    habitId?: string;
  };
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Workout',
    description: 'Start the day with 30 minutes of exercise',
    color: 'bg-green-500',
    streak: 7,
    completedDates: [],
    goal: 'daily',
    isCompleted: false,
  },
  {
    id: '2',
    name: 'Meditation',
    description: 'Practice mindfulness for 10 minutes',
    color: 'bg-blue-500',
    streak: 12,
    completedDates: [],
    goal: 'daily',
    isCompleted: false,
  },
  {
    id: '3',
    name: 'Reading',
    description: 'Read for at least 20 minutes',
    color: 'bg-purple-500',
    streak: 5,
    completedDates: [],
    goal: 'daily',
    isCompleted: false,
  },
  {
    id: '4',
    name: 'Journaling',
    description: 'Write down thoughts and reflections',
    color: 'bg-orange-500',
    streak: 3,
    completedDates: [],
    goal: 'daily',
    isCompleted: false,
  },
];

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first habit',
    unlocked: true,
    icon: 'Trophy',
    requirement: { type: 'completion', value: 1 }
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: '7-day streak achieved',
    unlocked: true,
    icon: 'Flame',
    requirement: { type: 'streak', value: 7 }
  },
  {
    id: '3',
    name: 'Consistency King',
    description: '30-day streak',
    unlocked: false,
    icon: 'Crown',
    requirement: { type: 'streak', value: 30 }
  },
  {
    id: '4',
    name: 'Century Club',
    description: '100 total completions',
    unlocked: false,
    icon: 'Star',
    requirement: { type: 'total', value: 100 }
  },
  {
    id: '5',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 days straight',
    unlocked: false,
    icon: 'CheckCircle',
    requirement: { type: 'streak', value: 7 }
  }
];

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalXP, setTotalXP] = useState(850);
  const [level, setLevel] = useState(12);

  useEffect(() => {
    // Load from localStorage or use defaults
    const savedHabits = localStorage.getItem('millionaire-den-habits');
    const savedAchievements = localStorage.getItem('millionaire-den-achievements');
    const savedXP = localStorage.getItem('millionaire-den-xp');
    const savedLevel = localStorage.getItem('millionaire-den-level');

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(defaultHabits);
    }

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(defaultAchievements);
    }

    if (savedXP) {
      setTotalXP(parseInt(savedXP));
    }

    if (savedLevel) {
      setLevel(parseInt(savedLevel));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever habits change
    localStorage.setItem('millionaire-den-habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    // Save to localStorage whenever achievements change
    localStorage.setItem('millionaire-den-achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    // Save XP and level
    localStorage.setItem('millionaire-den-xp', totalXP.toString());
    localStorage.setItem('millionaire-den-level', level.toString());
  }, [totalXP, level]);

  const completeHabit = (habitId: string) => {
    const today = new Date().toDateString();
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const alreadyCompleted = habit.completedDates.includes(today);
        
        if (alreadyCompleted) {
          // Uncomplete habit
          return {
            ...habit,
            isCompleted: false,
            completedDates: habit.completedDates.filter(date => date !== today),
            streak: Math.max(0, habit.streak - 1)
          };
        } else {
          // Complete habit
          const newCompletedDates = [...habit.completedDates, today];
          const newStreak = calculateStreak(newCompletedDates);
          
          // Add XP and trigger crystal earning
          addXP(20);
          
          // Trigger custom event for lunar crystals
          window.dispatchEvent(new CustomEvent('habitCompleted', { 
            detail: { habitId, streak: newStreak } 
          }));
          
          return {
            ...habit,
            isCompleted: true,
            completedDates: newCompletedDates,
            streak: newStreak,
            lastCompleted: today
          };
        }
      }
      return habit;
    }));

    // Check for achievements
    checkAchievements();
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'isCompleted'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      completedDates: [],
      isCompleted: false,
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 1;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffTime = current.getTime() - next.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const addXP = (amount: number) => {
    setTotalXP(prev => {
      const newXP = prev + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      setLevel(newLevel);
      return newXP;
    });
  };

  const checkAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      const shouldUnlock = checkAchievementRequirement(achievement.requirement);
      
      if (shouldUnlock) {
        addXP(50); // Bonus XP for achievements
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      
      return achievement;
    }));
  };

  const checkAchievementRequirement = (requirement: Achievement['requirement']): boolean => {
    switch (requirement.type) {
      case 'completion':
        return habits.some(habit => habit.completedDates.length >= requirement.value);
      
      case 'streak':
        return habits.some(habit => habit.streak >= requirement.value);
      
      case 'total':
        const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
        return totalCompletions >= requirement.value;
      
      default:
        return false;
    }
  };

  const getHabitStats = () => {
    const today = new Date().toDateString();
    const completedToday = habits.filter(habit => habit.completedDates.includes(today)).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    
    return {
      completedToday,
      totalHabits,
      completionRate,
      longestStreak,
      totalXP,
      level
    };
  };

  return {
    habits,
    achievements,
    totalXP,
    level,
    completeHabit,
    addHabit,
    deleteHabit,
    getHabitStats,
  };
};