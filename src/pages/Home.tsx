import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Star, BookOpen, Plus, TrendingUp, Calendar, Zap, Settings } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useLunarCrystals } from "@/hooks/useLunarCrystals";
import { LunarCrystalLogo } from "@/components/LunarCrystalLogo";
import { Link } from "react-router-dom";
import { useUnifiedStats } from "@/hooks/useUnifiedStats";

const Home = () => {
  const { habits, completeHabit, getHabitStats } = useHabits();
  const { crystals } = useLunarCrystals();
  const { getLevelInfo } = useUnifiedStats();
  const stats = getHabitStats();
  const levelInfo = getLevelInfo();
  
 
 
  return (
    <div className="min-h-screen bg-background pt-16 pb-20 safe-area-inset-top animate-slideInUp">
      {/* Compact Stats Strip */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">Millionaire Den</h1>
        </div>
        
        {/* Compact Stats Strip */}
        <div className="flex items-center justify-between bg-card/50 backdrop-blur-md rounded-xl p-3 mb-4 border border-border/30 hover-glow animate-fadeInScale">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center animate-glowPulse">
              <span className="text-sm font-bold text-primary">{levelInfo.level}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{levelInfo.title}</p>
              <p className="text-xs text-muted-foreground">Level {levelInfo.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <LunarCrystalLogo size={14} />
                <span className="text-sm font-bold text-primary">{crystals}</span>
              </div>
              <p className="text-xs text-muted-foreground">Crystals</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">{stats.completedToday}/{stats.totalHabits}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <Card className="card-elegant p-3 mb-4 hover-glow animate-slideInUp">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress to next level</span>
            <span className="text-xs text-primary font-medium">
              {(levelInfo.pointsRequired)}-{levelInfo.nextLevelPoints} XP
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-500 animate-streakGlow"
              style={{ 
                width: `${Math.min(100, Math.max(0, (levelInfo.progress || 0) * 100))}%` 
              }}
            />
          </div>
        </Card>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="card-elegant p-3 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <Flame className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </Card>

          <Card className="card-elegant p-3 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.completedToday}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </Card>

          <Card className="card-elegant p-3 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{Math.round(stats.completionRate)}%</p>
            <p className="text-xs text-muted-foreground">Success</p>
          </Card>
        </div>
      </div>

      <div className="px-4">
        {/* Daily Progress */}
        <Card className="card-elegant p-6 mb-6 hover-glow animate-fadeInScale">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today's Progress</h2>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary animate-glowPulse" />
              <span className="text-lg font-bold text-primary">+{stats.completedToday * 20} XP</span>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <Progress value={stats.completionRate} className="h-3 animate-streakGlow" />
            <p className="text-sm text-muted-foreground">
              {stats.completedToday} of {stats.totalHabits} habits completed today
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/profile" className="flex-1">
              <Button variant="outline" className="w-full hover-glow">
                <Calendar className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </Link>
            <Link to="/motivation">
              <Button className="gradient-primary text-white hover-glow">
                <Star className="w-4 h-4 mr-2" />
                Get Motivated
              </Button>
            </Link>
          </div>
        </Card>

        {/* Today's Habits */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Today's Habits</h2>
            <Link to="/profile">
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </Link>
          </div>

          {habits.slice(0, 4).map((habit, index) => (
            <Card 
              key={habit.id} 
              className="card-interactive p-4 hover-glow animate-slideInUp group"
              onClick={() => completeHabit(habit.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                  <div>
                    <p className="font-medium text-foreground">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {habit.streak > 0 && (
                    <div className="flex items-center gap-1 text-primary animate-streakGlow">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">{habit.streak}</span>
                    </div>
                  )}
                  <div 
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 smooth-curve hover-glow ${
                      habit.isCompleted 
                        ? 'bg-primary border-primary animate-glowPulse' 
                        : 'border-primary hover:bg-primary/20'
                    }`}
                  >
                    {habit.isCompleted && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/journal">
              <Card className="card-interactive p-4 h-24 hover-glow animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BookOpen className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">New Journal</p>
                </div>
              </Card>
            </Link>

            <Link to="/level-history">
              <Card className="card-interactive p-4 h-24 hover-glow animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Trophy className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">Level History</p>
                </div>
              </Card>
            </Link>

            <Link to="/settings">
              <Card className="card-interactive p-4 h-24 hover-glow animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Settings className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">Settings</p>
                </div>
              </Card>
            </Link>

            <Link to="/motivation">
              <Card className="card-interactive p-4 h-24 hover-glow animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Star className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">Daily Quote</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;