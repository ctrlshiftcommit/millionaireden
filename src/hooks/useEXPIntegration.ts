import { useEffect } from 'react';
import { useUnifiedStats } from './useUnifiedStats';

export const useEXPIntegration = () => {
  const { addEXP } = useUnifiedStats();

  useEffect(() => {
    // Listen for habit completion events
    const handleHabitCompleted = async (event: CustomEvent) => {
      const { habitId, expGained = 100 } = event.detail;
      const leveledUp = await addEXP(expGained, `Habit completion: ${habitId}`);
      if (leveledUp) {
        console.log('Level up!');
      }
    };

    // Listen for task completion events
    const handleTaskCompleted = async (event: CustomEvent) => {
      const { taskId, expGained = 50 } = event.detail;
      const leveledUp = await addEXP(expGained, `Task completion: ${taskId}`);
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
  }, [addEXP]);

  return null; // This hook only provides side effects
};