
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: 'exp_total' | 'habit_streak' | 'habits_completed' | 'journal_entries' | 'level_reached';
  requirement_value: number;
  crystal_reward: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  crystals_earned: number;
  earned_at: string;
  achievement?: Achievement;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('requirement_value');

      if (achievementsError) throw achievementsError;

      // Fetch user achievements
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (userAchievementsError) throw userAchievementsError;

      setAchievements(achievementsData || []);
      setUserAchievements(userAchievementsData || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async (stats: {
    totalExp: number;
    currentLevel: number;
    habitsCompleted: number;
    journalEntries: number;
    maxStreak: number;
  }) => {
    if (!user) return;

    const unlockedAchievements = achievements.filter(achievement => {
      // Check if already unlocked
      const alreadyUnlocked = userAchievements.some(ua => ua.achievement_id === achievement.id);
      if (alreadyUnlocked) return false;

      // Check if requirements are met
      switch (achievement.requirement_type) {
        case 'exp_total':
          return stats.totalExp >= achievement.requirement_value;
        case 'level_reached':
          return stats.currentLevel >= achievement.requirement_value;
        case 'habits_completed':
          return stats.habitsCompleted >= achievement.requirement_value;
        case 'journal_entries':
          return stats.journalEntries >= achievement.requirement_value;
        case 'habit_streak':
          return stats.maxStreak >= achievement.requirement_value;
        default:
          return false;
      }
    });

    // Award unlocked achievements
    for (const achievement of unlockedAchievements) {
      try {
        const { error } = await supabase
          .from('user_achievements')
          .insert([{
            user_id: user.id,
            achievement_id: achievement.id,
            crystals_earned: achievement.crystal_reward
          }]);

        if (error) throw error;

        toast({
          title: "🎉 Achievement Unlocked!",
          description: `${achievement.name}: +${achievement.crystal_reward} Lunar Crystals!`,
        });
      } catch (error) {
        console.error('Error awarding achievement:', error);
      }
    }

    if (unlockedAchievements.length > 0) {
      await fetchData(); // Refresh data
    }

    return unlockedAchievements;
  };

  const getProgress = (achievement: Achievement, stats: any) => {
    let current = 0;
    switch (achievement.requirement_type) {
      case 'exp_total':
        current = stats?.totalExp || 0;
        break;
      case 'level_reached':
        current = stats?.currentLevel || 0;
        break;
      case 'habits_completed':
        current = stats?.habitsCompleted || 0;
        break;
      case 'journal_entries':
        current = stats?.journalEntries || 0;
        break;
      case 'habit_streak':
        current = stats?.maxStreak || 0;
        break;
    }
    return Math.min(current / achievement.requirement_value, 1);
  };

  return {
    achievements,
    userAchievements,
    loading,
    checkAchievements,
    getProgress,
    refetch: fetchData
  };
};
