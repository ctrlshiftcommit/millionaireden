import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ProgressStats {
  daily: {
    completed: number;
    total: number;
    percentage: number;
  };
  weekly: {
    completed: number;
    total: number;
    percentage: number;
  };
  monthly: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export const useProgressTracking = () => {
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    daily: { completed: 0, total: 0, percentage: 0 },
    weekly: { completed: 0, total: 0, percentage: 0 },
    monthly: { completed: 0, total: 0, percentage: 0 }
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const calculateProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get all active habits for the user
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (habitsError) throw habitsError;

      const totalHabits = habits?.length || 0;

      if (totalHabits === 0) {
        setProgressStats({
          daily: { completed: 0, total: 0, percentage: 0 },
          weekly: { completed: 0, total: 0, percentage: 0 },
          monthly: { completed: 0, total: 0, percentage: 0 }
        });
        return;
      }

      // Calculate date ranges
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get habit completions for different periods
      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id, completed_date')
        .eq('user_id', user.id)
        .gte('completed_date', startOfMonth.toISOString().split('T')[0]);

      if (completionsError) throw completionsError;

      // Calculate daily progress
      const dailyCompletions = completions?.filter(c => 
        c.completed_date === today.toISOString().split('T')[0]
      ) || [];
      const dailyCompleted = new Set(dailyCompletions.map(c => c.habit_id)).size;
      const dailyPercentage = totalHabits > 0 ? Math.round((dailyCompleted / totalHabits) * 100) : 0;

      // Calculate weekly progress
      const weeklyCompletions = completions?.filter(c => {
        const completionDate = new Date(c.completed_date);
        return completionDate >= startOfWeek;
      }) || [];
      
      // Count unique habit completions for the week
      const weeklyHabitCompletions = new Set(
        weeklyCompletions.map(c => `${c.habit_id}-${c.completed_date}`)
      ).size;
      const daysInWeek = Math.min(7, Math.ceil((today.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const weeklyTotal = totalHabits * daysInWeek;
      const weeklyPercentage = weeklyTotal > 0 ? Math.round((weeklyHabitCompletions / weeklyTotal) * 100) : 0;

      // Calculate monthly progress
      const monthlyCompletions = completions || [];
      const monthlyHabitCompletions = new Set(
        monthlyCompletions.map(c => `${c.habit_id}-${c.completed_date}`)
      ).size;
      const daysInMonth = Math.min(31, today.getDate());
      const monthlyTotal = totalHabits * daysInMonth;
      const monthlyPercentage = monthlyTotal > 0 ? Math.round((monthlyHabitCompletions / monthlyTotal) * 100) : 0;

      setProgressStats({
        daily: { 
          completed: dailyCompleted, 
          total: totalHabits, 
          percentage: dailyPercentage 
        },
        weekly: { 
          completed: weeklyHabitCompletions, 
          total: weeklyTotal, 
          percentage: weeklyPercentage 
        },
        monthly: { 
          completed: monthlyHabitCompletions, 
          total: monthlyTotal, 
          percentage: monthlyPercentage 
        }
      });

    } catch (error) {
      console.error('Error calculating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('progress_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'habit_completions',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          calculateProgress();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'habits',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          calculateProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Calculate progress on mount and user change
  useEffect(() => {
    if (user) {
      calculateProgress();
    } else {
      setProgressStats({
        daily: { completed: 0, total: 0, percentage: 0 },
        weekly: { completed: 0, total: 0, percentage: 0 },
        monthly: { completed: 0, total: 0, percentage: 0 }
      });
    }
  }, [user]);

  return {
    progressStats,
    loading,
    calculateProgress
  };
};