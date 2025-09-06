import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useUnifiedStats } from './useUnifiedStats';
import { useToast } from './use-toast';

export interface UserData {
  profile: any;
  stats: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserData = (): UserData => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { stats, loading: statsLoading, refetch: refetchStats } = useUnifiedStats();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(profileLoading || statsLoading);
  }, [profileLoading, statsLoading]);

  const refetch = async () => {
    try {
      setError(null);
      await Promise.all([refetchProfile(), refetchStats()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync user data';
      setError(errorMessage);
      toast({
        title: "Sync Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return {
    profile,
    stats,
    loading,
    error,
    refetch
  };
};