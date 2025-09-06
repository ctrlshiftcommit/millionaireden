import { useCallback } from 'react';

// Sound effect URLs - using data URIs for simple placeholder sounds
const SOUND_EFFECTS = {
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuJzPDjhh0GHWO+7+KNQQ4Hd8n3yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCi',
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuJzPDjhh0GHWO+7+KNQQ4Hd8n3yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCi',
  levelUp: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuJzPDjhh0GHWO+7+KNQQ4Hd8n3yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCi',
  achievement: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuJzPDjhh0GHWO+7+KNQQ4Hd8n3yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCi',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuJzPDjhh0GHWO+7+KNQQ4Hd8n3yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCi',
  notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuJzPDjhh0GHWO+7+KNQQ4Hd8n3yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCiuLy/DdgCUGB2HA8N+NQQ4HdMj0yXkpBC2Ay+/ghSkEB17B8daNPw9QreTx0H8jCi',
} as const;

type SoundEffect = keyof typeof SOUND_EFFECTS;

export const useSoundEffects = () => {
  const playSound = useCallback((soundName: SoundEffect, volume: number = 0.5) => {
    try {
      // Check if sound is enabled in settings
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      if (!settings.sounds) return;

      const audio = new Audio(SOUND_EFFECTS[soundName]);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch(error => {
        console.log('Sound playback failed:', error);
      });
    } catch (error) {
      console.log('Sound effect error:', error);
    }
  }, []);

  const playClick = useCallback(() => playSound('click', 0.3), [playSound]);
  const playSuccess = useCallback(() => playSound('success', 0.6), [playSound]);
  const playLevelUp = useCallback(() => playSound('levelUp', 0.8), [playSound]);
  const playAchievement = useCallback(() => playSound('achievement', 0.7), [playSound]);
  const playError = useCallback(() => playSound('error', 0.5), [playSound]);
  const playNotification = useCallback(() => playSound('notification', 0.4), [playSound]);

  return {
    play: playSound,
    playClick,
    playSuccess,
    playLevelUp,
    playAchievement,
    playError,
    playNotification,
  };
};