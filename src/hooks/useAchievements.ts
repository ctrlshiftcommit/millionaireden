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
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  crystals_earned: number;
  achievement: Achievement;
}

interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  isCompleted: boolean;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
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

  const checkAchievements = async (stats: {
    totalCompleted?: number;
    maxStreak?: number;
    level?: number;
    totalExp?: number;
  }) => {
    if (!user) return;

    for (const achievement of achievements) {
      // Skip if user already has this achievement
      if (userAchievements.some(ua => ua.achievement_id === achievement.id)) {
        continue;
      }

      let shouldEarn = false;

      switch (achievement.requirement_type) {
        case 'habits_completed':
          shouldEarn = (stats.totalCompleted || 0) >= achievement.requirement_value;
          break;
        case 'max_streak':
          shouldEarn = (stats.maxStreak || 0) >= achievement.requirement_value;
          break;
        case 'level_reached':
          shouldEarn = (stats.level || 0) >= achievement.requirement_value;
          break;
        case 'total_completed':
          shouldEarn = (stats.totalCompleted || 0) >= achievement.requirement_value;
          break;
      }

      if (shouldEarn) {
        await earnAchievement(achievement);
      }
    }
  };

  const earnAchievement = async (achievement: Achievement) => {
    if (!user) return;

    try {
      // Record the achievement
      const { error: achievementError } = await supabase
        .from('user_achievements')
        .insert([{
          user_id: user.id,
          achievement_id: achievement.id,
          crystals_earned: achievement.crystal_reward
        }]);

      if (achievementError) throw achievementError;

      // Add crystals to user's balance - fetch current amount first
      const { data: currentExp, error: fetchError } = await supabase
        .from('user_experience')
        .select('lunar_crystals')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current crystals:', fetchError);
      } else {
        const { error: crystalError } = await supabase
          .from('user_experience')
          .update({
            lunar_crystals: currentExp.lunar_crystals + achievement.crystal_reward
          })
          .eq('user_id', user.id);

        if (crystalError) {
          console.error('Error adding crystals:', crystalError);
        }
      }

      // Show success notification
      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievement.name} - Earned ${achievement.crystal_reward} Lunar Crystals!`,
      });

      // Refresh user achievements
      await fetchUserAchievements();

    } catch (error) {
      console.error('Error earning achievement:', error);
    }
  };

  const getAchievementProgress = (stats: {
    totalCompleted?: number;
    maxStreak?: number;
    level?: number;
    totalExp?: number;
  }): AchievementProgress[] => {
    return achievements.map(achievement => {
      const isCompleted = userAchievements.some(ua => ua.achievement_id === achievement.id);
      
      let progress = 0;
      switch (achievement.requirement_type) {
        case 'habits_completed':
        case 'total_completed':
          progress = Math.min((stats.totalCompleted || 0) / achievement.requirement_value, 1);
          break;
        case 'max_streak':
          progress = Math.min((stats.maxStreak || 0) / achievement.requirement_value, 1);
          break;
        case 'level_reached':
          progress = Math.min((stats.level || 0) / achievement.requirement_value, 1);
          break;
      }

      return {
        achievement,
        progress: isCompleted ? 1 : progress,
        isCompleted
      };
    });
  };

  return {
    achievements,
    userAchievements,
    loading,
    checkAchievements,
    getAchievementProgress,
    refetch: () => {
      fetchAchievements();
      fetchUserAchievements();
    }
  };
};