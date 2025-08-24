import { useEffect } from 'react';
import { useUnifiedStats } from './useUnifiedStats';

export const useLunarCrystalIntegration = () => {
  const { addLunarCrystals } = useUnifiedStats();
  const settings = {
    crystalsPerTask: 25,
    crystalsPerHabit: 50,
    crystalsPerStreak: 10,
  };

  useEffect(() => {
    // Listen for habit completion events
    const handleHabitCompleted = (event: CustomEvent) => {
      const { habitId, streak } = event.detail;
      
      // Base crystals for completing a habit
      let crystalsEarned = settings.crystalsPerHabit;
      
      // Bonus crystals for streak
      if (streak > 1) {
        crystalsEarned += (streak - 1) * settings.crystalsPerStreak;
      }
      
      addLunarCrystals(crystalsEarned, `Habit completed! ${streak > 1 ? `${streak}-day streak bonus!` : ''}`);
    };

    // Listen for task completion events (can be added later)
    const handleTaskCompleted = (event: CustomEvent) => {
      addLunarCrystals(settings.crystalsPerTask, 'Task completed!');
    };

    // Add event listeners
    window.addEventListener('habitCompleted', handleHabitCompleted as EventListener);
    window.addEventListener('taskCompleted', handleTaskCompleted as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('habitCompleted', handleHabitCompleted as EventListener);
      window.removeEventListener('taskCompleted', handleTaskCompleted as EventListener);
    };
  }, [addLunarCrystals]);
};