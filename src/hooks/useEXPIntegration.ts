import { useEffect } from 'react';
import { useEXPSystem } from './useEXPSystem';
import { useLunarCrystals } from './useLunarCrystals';

export const useEXPIntegration = () => {
  const { addEXP } = useEXPSystem();
  const { earnCrystals, settings } = useLunarCrystals();

  useEffect(() => {
    // Listen for habit completion events
    const handleHabitCompleted = (event: CustomEvent) => {
      const { habitId, streak, expGained = 100 } = event.detail;
      
      // Add EXP first
      const leveledUp = addEXP(expGained, `Habit completion: ${habitId}`);
      
      // Then handle crystal earning (no longer automatic from habits)
      // Users need to convert EXP to crystals manually in the Shop
      
      if (leveledUp) {
        // Show level up notification or celebration
        console.log('Level up!');
      }
    };

    // Listen for task completion events
    const handleTaskCompleted = (event: CustomEvent) => {
      const { taskId, expGained = 50 } = event.detail;
      
      const leveledUp = addEXP(expGained, `Task completion: ${taskId}`);
      
      if (leveledUp) {
        console.log('Level up!');
      }
    };

    // Add event listeners
    window.addEventListener('habitCompleted', handleHabitCompleted as EventListener);
    window.addEventListener('taskCompleted', handleTaskCompleted as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('habitCompleted', handleHabitCompleted as EventListener);
      window.removeEventListener('taskCompleted', handleTaskCompleted as EventListener);
    };
  }, [addEXP, earnCrystals, settings]);

  return null; // This hook only provides side effects
};