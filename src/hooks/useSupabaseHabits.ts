import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useSoundEffects } from './useSoundEffects';

export interface SupabaseHabit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  exp_reward: number;
  crystal_reward: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  goal: string;
  streak?: number;
  isCompleted?: boolean;
  completedDates?: string[];
}

export const useSupabaseHabits = () => {
  const [habits, setHabits] = useState<SupabaseHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { play } = useSoundEffects();

  const fetchHabits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id, completed_date')
        .eq('user_id', user.id);

      if (completionsError) throw completionsError;

      // Process habits with completion data
      const processedHabits = habitsData.map(habit => {
        const habitCompletions = completionsData.filter(c => c.habit_id === habit.id);
        const completedDates = habitCompletions.map(c => c.completed_date);
        const isCompleted = completedDates.includes(today);
        const streak = calculateStreak(completedDates);

        return {
          ...habit,
          streak,
          isCompleted,
          completedDates
        };
      });

      setHabits(processedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = completedDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if completed today or yesterday
    let checkDate = new Date(today);
    if (sortedDates[0] && sortedDates[0].getTime() === today.getTime()) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      if (sortedDates[0] && sortedDates[0].getTime() === checkDate.getTime()) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        return 0;
      }
    }
    
    // Count consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      if (sortedDates[i].getTime() === checkDate.getTime()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const addHabit = async (habitData: { name: string; description: string; color: string; goal: string }) => {
    if (!user || !habitData.name.trim()) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habitData.name.trim(),
          description: habitData.description.trim() || null,
          color: habitData.color,
          goal: habitData.goal,
          exp_reward: 100,
          crystal_reward: 0
        });

      if (error) throw error;

      play('success');
      toast({
        title: "Success",
        description: "Habit added successfully!",
      });

      await fetchHabits();
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      play('error');
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive"
      });
      return false;
    }
  };

  const completeHabit = async (habitId: string) => {
    if (!user) return false;

    try {
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === habitId);
      
      if (!habit) return false;

      if (habit.isCompleted) {
        // Uncomplete habit
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('habit_id', habitId)
          .eq('completed_date', today);

        if (error) throw error;
        
        play('click');
        toast({
          title: "Habit Uncompleted",
          description: `${habit.name} unmarked for today`,
        });
      } else {
        // Complete habit
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            user_id: user.id,
            habit_id: habitId,
            completed_date: today,
            exp_gained: habit.exp_reward,
            crystals_gained: habit.crystal_reward,
            streak_at_completion: (habit.streak || 0) + 1
          });

        if (error) throw error;

        play('success');
        toast({
          title: "Habit Completed!",
          description: `${habit.name} completed! +${habit.exp_reward} EXP`,
        });

        // Trigger achievement check
        window.dispatchEvent(new CustomEvent('habitCompleted', {
          detail: { habitId, expGained: habit.exp_reward }
        }));
      }

      await fetchHabits();
      return true;
    } catch (error) {
      console.error('Error completing habit:', error);
      play('error');
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (error) throw error;

      play('click');
      toast({
        title: "Habit Deleted",
        description: "Habit has been removed",
      });

      await fetchHabits();
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      play('error');
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive"
      });
      return false;
    }
  };

  const getHabitStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => habit.isCompleted).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak || 0), 0);
    
    return {
      completedToday,
      totalHabits,
      completionRate,
      longestStreak,
    };
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  // Clear localStorage data when component mounts to avoid conflicts
  useEffect(() => {
    localStorage.removeItem('millionaire-den-habits');
    localStorage.removeItem('millionaire-den-achievements');
    localStorage.removeItem('millionaire-den-xp');
    localStorage.removeItem('millionaire-den-level');
  }, []);

  return {
    habits,
    loading,
    addHabit,
    completeHabit,
    deleteHabit,
    getHabitStats,
    refetch: fetchHabits
  };
};