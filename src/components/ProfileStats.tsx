
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Flame, 
  Target, 
  Calendar,
  Clock,
  BarChart3,
  Star,
  Gem
} from "lucide-react";

interface ProfileStatsProps {
  stats: {
    longestStreak: number;
    completionRate: number;
    totalHabits: number;
    level: number;
    totalExp: number;
    lunarCrystals: number;
    diamonds: number;
  };
  levelInfo: {
    level: number;
    progress: number;
    nextLevelPoints: number;
  };
  progressStats: {
    daily: { percentage: number; completed: number; total: number };
    weekly: { percentage: number; completed: number; total: number };
    monthly: { percentage: number; completed: number; total: number };
  };
}

export const ProfileStats = ({ stats, levelInfo, progressStats }: ProfileStatsProps) => {
  return (
    <>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{stats.level}</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </Card>
        
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{stats.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </Card>
        
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{Math.round(stats.completionRate)}%</p>
          <p className="text-xs text-muted-foreground">Success Rate</p>
        </Card>
        
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <Star className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{stats.totalExp}</p>
          <p className="text-xs text-muted-foreground">Total EXP</p>
        </Card>
      </div>

      {/* Currency Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <Gem className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{stats.lunarCrystals}</p>
          <p className="text-xs text-muted-foreground">Lunar Crystals</p>
        </Card>
        
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <Gem className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{stats.diamonds}</p>
          <p className="text-xs text-muted-foreground">Diamonds</p>
        </Card>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.6s' }}>
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{progressStats.daily.percentage}%</p>
          <p className="text-xs text-muted-foreground">Today</p>
          <Badge variant="outline" className="text-xs mt-1">
            {progressStats.daily.completed}/{progressStats.daily.total}
          </Badge>
        </Card>
        
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.7s' }}>
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{progressStats.weekly.percentage}%</p>
          <p className="text-xs text-muted-foreground">This Week</p>
          <Badge variant="outline" className="text-xs mt-1">
            {progressStats.weekly.completed}/{progressStats.weekly.total}
          </Badge>
        </Card>
        
        <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.8s' }}>
          <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{progressStats.monthly.percentage}%</p>
          <p className="text-xs text-muted-foreground">This Month</p>
          <Badge variant="outline" className="text-xs mt-1">
            {progressStats.monthly.completed}/{progressStats.monthly.total}
          </Badge>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="card-elegant p-4 mb-6 hover-glow animate-fadeInScale">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Level {levelInfo.level} Progress
            </span>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Next: Level {levelInfo.level + 1}
            </Badge>
          </div>
          
          <Progress 
            value={(levelInfo.progress || 0) * 100} 
            className="h-3 animate-streakGlow" 
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.totalExp} EXP</span>
            <span>{levelInfo.nextLevelPoints} EXP needed</span>
          </div>
        </div>
      </Card>
    </>
  );
};
