
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

type RequirementType = 'exp_total' | 'habit_streak' | 'habits_completed' | 'level_reached' | 'journal_entries';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: RequirementType;
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
  achievement: Achievement;
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
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [achievementsRes, userAchievementsRes] = await Promise.all([
        supabase.from('achievements').select('*').eq('is_active', true),
        supabase
          .from('user_achievements')
          .select(`
            *,
            achievement:achievements(*)
          `)
          .eq('user_id', user.id)
      ]);

      if (achievementsRes.data) {
        const typedAchievements = achievementsRes.data.map(a => ({
          ...a,
          requirement_type: a.requirement_type as RequirementType
        }));
        setAchievements(typedAchievements);
      }
      
      if (userAchievementsRes.data) {
        const typedUserAchievements = userAchievementsRes.data.map(ua => ({
          ...ua,
          achievement: {
            ...ua.achievement,
            requirement_type: ua.achievement.requirement_type as RequirementType
          }
        })) as UserAchievement[];
        setUserAchievements(typedUserAchievements);
      }
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

    const unlockedAchievements = userAchievements.map(ua => ua.achievement_id);
    const newAchievements: Achievement[] = [];

    for (const achievement of achievements) {
      if (unlockedAchievements.includes(achievement.id)) continue;

      let isUnlocked = false;
      switch (achievement.requirement_type) {
        case 'exp_total':
          isUnlocked = stats.totalExp >= achievement.requirement_value;
          break;
        case 'level_reached':
          isUnlocked = stats.currentLevel >= achievement.requirement_value;
          break;
        case 'habits_completed':
          isUnlocked = stats.habitsCompleted >= achievement.requirement_value;
          break;
        case 'journal_entries':
          isUnlocked = stats.journalEntries >= achievement.requirement_value;
          break;
        case 'habit_streak':
          isUnlocked = stats.maxStreak >= achievement.requirement_value;
          break;
      }

      if (isUnlocked) {
        newAchievements.push(achievement);
      }
    }

    for (const achievement of newAchievements) {
      try {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: achievement.id,
            crystals_earned: achievement.crystal_reward
          });

        if (!error) {
          toast({
            title: "Achievement Unlocked!",
            description: `${achievement.name} - ${achievement.crystal_reward} Lunar Crystals earned!`,
          });
        }
      } catch (error) {
        console.error('Error awarding achievement:', error);
      }
    }

    if (newAchievements.length > 0) {
      await fetchData();
    }

    return newAchievements;
  };

  const getProgress = (achievement: Achievement, stats: any) => {
    switch (achievement.requirement_type) {
      case 'exp_total':
        return Math.min(stats.totalExp / achievement.requirement_value, 1);
      case 'level_reached':
        return Math.min(stats.currentLevel / achievement.requirement_value, 1);
      case 'habits_completed':
        return Math.min(stats.habitsCompleted / achievement.requirement_value, 1);
      case 'journal_entries':
        return Math.min(stats.journalEntries / achievement.requirement_value, 1);
      case 'habit_streak':
        return Math.min(stats.maxStreak / achievement.requirement_value, 1);
      default:
        return 0;
    }
  };

  const getAchievementProgress = (stats: any) => {
    return achievements.map(achievement => ({
      achievement,
      progress: getProgress(achievement, stats),
      isCompleted: userAchievements.some(ua => ua.achievement_id === achievement.id)
    }));
  };

  return {
    achievements,
    userAchievements,
    loading,
    checkAchievements,
    getProgress,
    getAchievementProgress,
    refetch: fetchData
  };
};
