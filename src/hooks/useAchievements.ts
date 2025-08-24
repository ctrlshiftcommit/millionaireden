import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
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
  earned_at: string;
  crystals_earned: number;
  achievement: Achievement;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
    if (user) {
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('requirement_value');

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = async (stats: {
    totalHabitsCompleted: number;
    maxStreak: number;
    currentLevel: number;
  }) => {
    if (!user) return;

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const hasAchievement = userAchievements.some(ua => ua.achievement_id === achievement.id);
      if (hasAchievement) continue;

      let shouldUnlock = false;

      switch (achievement.requirement_type) {
        case 'habits_completed':
        case 'total_completed':
          shouldUnlock = stats.totalHabitsCompleted >= achievement.requirement_value;
          break;
        case 'max_streak':
          shouldUnlock = stats.maxStreak >= achievement.requirement_value;
          break;
        case 'level_reached':
          shouldUnlock = stats.currentLevel >= achievement.requirement_value;
          break;
      }

      if (shouldUnlock) {
        await unlockAchievement(achievement);
      }
    }
  };

  const unlockAchievement = async (achievement: Achievement) => {
    if (!user) return;

    try {
      // Insert user achievement
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievement.id,
          crystals_earned: achievement.crystal_reward
        });

      if (insertError) throw insertError;

      // Award crystals to user
      const { error: updateError } = await supabase.rpc('increment_crystals', {
        p_user_id: user.id,
        p_amount: achievement.crystal_reward
      });

      if (updateError) throw updateError;

      // Show achievement notification
      toast({
        title: `🏆 Achievement Unlocked!`,
        description: `${achievement.name} - You earned ${achievement.crystal_reward} crystals!`,
      });

      // Refresh user achievements
      await fetchUserAchievements();
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const getAchievementProgress = (achievement: Achievement, stats: any) => {
    switch (achievement.requirement_type) {
      case 'habits_completed':
      case 'total_completed':
        return Math.min((stats.totalHabitsCompleted / achievement.requirement_value) * 100, 100);
      case 'max_streak':
        return Math.min((stats.maxStreak / achievement.requirement_value) * 100, 100);
      case 'level_reached':
        return Math.min((stats.currentLevel / achievement.requirement_value) * 100, 100);
      default:
        return 0;
    }
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  return {
    achievements,
    userAchievements,
    loading,
    checkAndUnlockAchievements,
    getAchievementProgress,
    isAchievementUnlocked,
    refetch: fetchUserAchievements
  };
};