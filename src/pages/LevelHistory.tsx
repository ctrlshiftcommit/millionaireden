
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HistoryChart } from '@/components/HistoryChart';
import { ResetStatsDialog } from '@/components/ResetStatsDialog';
import { useUnifiedStats } from '@/hooks/useUnifiedStats';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy, Star, RotateCcw, TrendingUp, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

const LevelHistory = () => {
  const { stats, loading, getLevelInfo, getLevelHistory, getRecentExpTransactions } = useUnifiedStats();
  const { userAchievements } = useAchievements();
  const [levelHistory, setLevelHistory] = useState<any[]>([]);
  const [expTransactions, setExpTransactions] = useState<any[]>([]);
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    const [levelData, expData] = await Promise.all([
      getLevelHistory(10),
      getRecentExpTransactions(15)
    ]);
    setLevelHistory(levelData);
    setExpTransactions(expData);
  };

  const levelInfo = getLevelInfo();

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Progress History
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your journey and celebrate your achievements
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowResetDialog(true)}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Stats
        </Button>
      </div>

      {/* Current Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total_exp?.toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">Total EXP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Star className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.lunar_crystals || 0}</p>
                <p className="text-sm text-muted-foreground">Lunar Crystals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{levelInfo.level}</p>
                <p className="text-sm text-muted-foreground">{levelInfo.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <HistoryChart className="col-span-full" />

      {/* Level History & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Level History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Level History
            </CardTitle>
            <CardDescription>
              Your level progression over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {levelHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No level ups yet. Complete more habits to gain EXP!
              </p>
            ) : (
              <div className="space-y-3">
                {levelHistory.map((level, index) => (
                  <div key={level.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Lv. {level.new_level}
                      </Badge>
                      <div>
                        <p className="font-medium">Level {level.old_level} → {level.new_level}</p>
                        <p className="text-xs text-muted-foreground">
                          {level.exp_at_levelup.toLocaleString()} EXP
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(level.level_up_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent EXP Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest EXP transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {expTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No recent activity. Start completing habits!
              </p>
            ) : (
              <div className="space-y-3">
                {expTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={transaction.amount > 0 ? "default" : "destructive"}
                        className={transaction.amount > 0 ? "bg-green-500/10 text-green-400" : ""}
                      >
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} EXP
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(transaction.created_at), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Recent Achievements
          </CardTitle>
          <CardDescription>
            Your latest unlocked achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userAchievements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No achievements yet. Keep building habits to unlock them!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userAchievements.slice(0, 6).map((userAchievement) => (
                <div key={userAchievement.id} className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{userAchievement.achievement?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        +{userAchievement.crystals_earned} crystals
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userAchievement.achievement?.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(userAchievement.earned_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Stats Dialog */}
      <ResetStatsDialog 
        open={showResetDialog} 
        onOpenChange={setShowResetDialog} 
      />
    </div>
  );
};

export default LevelHistory;
