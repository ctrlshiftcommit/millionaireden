import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserStats {
  totalHabitsCompleted: number;
  maxStreak: number;
  currentLevel: number;
  totalExp: number;
  crystals: number;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalHabitsCompleted: 0,
    maxStreak: 0,
    currentLevel: 0,
    totalExp: 0,
    crystals: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats({
        totalHabitsCompleted: 0,
        maxStreak: 0,
        currentLevel: 0,
        totalExp: 0,
        crystals: 0
      });
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user experience
      const { data: expData } = await supabase
        .from('user_experience')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Get total habits completed
      const { count: totalCompleted } = await supabase
        .from('habit_completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get max streak (calculate from habit completions)
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('habit_id, completed_date')
        .eq('user_id', user.id)
        .order('completed_date');

      let maxStreak = 0;
      if (completions && completions.length > 0) {
        // Group by habit_id and calculate streaks
        const habitStreaks = new Map<string, number>();
        
        for (const completion of completions) {
          const habitId = completion.habit_id;
          if (!habitStreaks.has(habitId)) {
            habitStreaks.set(habitId, 0);
          }
        }

        // For now, use a simple calculation - this could be improved
        // by properly calculating consecutive day streaks
        const uniqueHabits = new Set(completions.map(c => c.habit_id));
        maxStreak = Math.max(...Array.from(uniqueHabits).map(() => 
          Math.floor(completions.length / uniqueHabits.size)
        ));
      }

      setStats({
        totalHabitsCompleted: totalCompleted || 0,
        maxStreak,
        currentLevel: expData?.current_level || 0,
        totalExp: Number(expData?.total_exp || 0),
        crystals: expData?.lunar_crystals || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
};