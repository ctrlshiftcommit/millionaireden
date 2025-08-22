import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Star, BookOpen, Plus, TrendingUp, Calendar, Zap } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { Link } from "react-router-dom";

const Home = () => {
  const { habits, completeHabit, getHabitStats } = useHabits();
  const stats = getHabitStats();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="gradient-hero px-4 pt-8 pb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3 animate-float">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center glow-effect">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Millionaire Den</h1>
          </div>
          <p className="text-muted-foreground text-lg">Transform your life, one habit at a time</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="glass-effect px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-primary">Level {stats.level}</span>
            </div>
            <div className="glass-effect px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-foreground">{stats.totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="card-elegant p-4 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>

          <Card className="card-elegant p-4 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.completedToday}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </Card>

          <Card className="card-elegant p-4 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{Math.round(stats.completionRate)}%</p>
            <p className="text-xs text-muted-foreground">Success</p>
          </Card>
        </div>
      </div>

      <div className="px-4">
        {/* Daily Progress */}
        <Card className="card-elegant p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today's Progress</h2>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-primary">+{stats.completedToday * 20} XP</span>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <Progress value={stats.completionRate} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {stats.completedToday} of {stats.totalHabits} habits completed today
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/profile" className="flex-1">
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </Link>
            <Link to="/motivation">
              <Button className="gradient-primary text-white">
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

          {habits.slice(0, 4).map((habit) => (
            <Card 
              key={habit.id} 
              className="card-interactive p-4"
              onClick={() => completeHabit(habit.id)}
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
                    <div className="flex items-center gap-1 text-primary">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">{habit.streak}</span>
                    </div>
                  )}
                  <div 
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      habit.isCompleted 
                        ? 'bg-primary border-primary' 
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
              <Card className="card-interactive p-4 h-24">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BookOpen className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">New Journal</p>
                </div>
              </Card>
            </Link>

            <Link to="/motivation">
              <Card className="card-interactive p-4 h-24">
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