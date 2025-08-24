import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Trophy, 
  Flame, 
  Target, 
  Plus,
  Edit,
  Calendar,
  BarChart3,
  CheckCircle2,
  Settings,
  Trash2,
  TrendingUp,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHabits } from "@/hooks/useHabits";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useNotifications } from "@/hooks/useNotifications";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { useUnifiedStats } from "@/hooks/useUnifiedStats";

const Profile = () => {
  const { habits, achievements, completeHabit, addHabit, deleteHabit, getHabitStats } = useHabits();
  const { progressStats, loading: progressLoading } = useProgressTracking();
  const { checkDailyProgress } = useNotifications();
  const { profile, userExp, loading: profileLoading } = useProfile();
  const { userAchievements, getAchievementProgress } = useAchievements();
  const { stats: unifiedStats } = useUnifiedStats();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", description: "", color: "bg-blue-500", goal: "daily" as const });

  const stats = getHabitStats();
  const achievementProgress = getAchievementProgress(stats);

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;
    await addHabit(newHabit);
    setNewHabit({ name: "", description: "", color: "bg-blue-500", goal: "daily" });
    setShowAddHabit(false);
  };

  const handleCompleteHabit = async (habitId: string) => {
    await completeHabit(habitId);
    // Check if we should trigger progress notifications
    await checkDailyProgress();
  };

  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"];

  return (
    <div className="min-h-screen bg-background pb-20 pt-16 safe-area-inset-top">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gradient animate-slideInUp">Profile</h1>
          <Link to="/settings">
            <Button variant="outline" size="sm" className="hover-glow">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* User Profile Card */}
        <Card className="card-elegant p-6 mb-6 animate-fadeInScale">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 animate-glowPulse">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                {profile?.display_name?.[0] || profile?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {profile?.display_name || profile?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-muted-foreground">
                Level {unifiedStats?.current_level || 0} • {unifiedStats?.lunar_crystals || 0} Crystals
              </p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <Link to="/profile-edit">
              <Button variant="outline" size="sm" className="hover-glow">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {(unifiedStats?.current_level || 0) + 1}</span>
              <span className="text-primary font-medium">
                {unifiedStats?.total_exp || 0} / {((unifiedStats?.current_level || 0) + 1) * 100} XP
              </span>
            </div>
            <Progress 
              value={((unifiedStats?.total_exp || 0) % 100)} 
              className="h-3 animate-streakGlow" 
            />
          </div>
        </Card>

        {/* Progress Stats Cards */}
        {!progressLoading && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.1s' }}>
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">{progressStats.daily.percentage}%</p>
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-xs text-primary">{progressStats.daily.completed}/{progressStats.daily.total}</p>
            </Card>
            
            <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">{progressStats.weekly.percentage}%</p>
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-xs text-primary">{progressStats.weekly.completed}/{progressStats.weekly.total}</p>
            </Card>
            
            <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.3s' }}>
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">{progressStats.monthly.percentage}%</p>
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-xs text-primary">{progressStats.monthly.completed}/{progressStats.monthly.total}</p>
            </Card>
          </div>
        )}

        {/* Legacy Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{unifiedStats?.current_level || 0}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
          
          <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.5s' }}>
            <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </Card>
          
          <Card className="card-elegant p-4 text-center hover-glow animate-slideInUp" style={{ animationDelay: '0.6s' }}>
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{Math.round(stats.completionRate)}%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </Card>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1 animate-fadeInScale">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all smooth-curve ${
              activeTab === "overview"
                ? "bg-background text-foreground shadow-sm animate-glowPulse"
                : "text-muted-foreground hover:text-foreground hover-glow"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all smooth-curve ${
              activeTab === "habits"
                ? "bg-background text-foreground shadow-sm animate-glowPulse"
                : "text-muted-foreground hover:text-foreground hover-glow"
            }`}
          >
            Habits ({habits.length})
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all smooth-curve ${
              activeTab === "achievements"
                ? "bg-background text-foreground shadow-sm animate-glowPulse"
                : "text-muted-foreground hover:text-foreground hover-glow"
            }`}
          >
            Achievements ({userAchievements.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-slideInUp">
            <Card className="card-elegant p-6 hover-glow">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Progress Overview</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Progress</span>
                    <span className="text-primary font-medium">{progressStats.daily.percentage}%</span>
                  </div>
                  <Progress value={progressStats.daily.percentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weekly Progress</span>
                    <span className="text-primary font-medium">{progressStats.weekly.percentage}%</span>
                  </div>
                  <Progress value={progressStats.weekly.percentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Progress</span>
                    <span className="text-primary font-medium">{progressStats.monthly.percentage}%</span>
                  </div>
                  <Progress value={progressStats.monthly.percentage} className="h-2" />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/level-history">
                <Card className="card-interactive p-4 h-24 hover-glow">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BarChart3 className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">View History</p>
                  </div>
                </Card>
              </Link>

              <Link to="/settings">
                <Card className="card-interactive p-4 h-24 hover-glow">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Settings className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">Settings</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )}

        {/* Habits Tab */}
        {activeTab === "habits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">My Habits</h2>
              <Button 
                size="sm" 
                className="gradient-primary text-white"
                onClick={() => setShowAddHabit(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </div>

            {/* Add Habit Form */}
            {showAddHabit && (
              <Card className="card-elegant p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Habit name..."
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                  <Input
                    placeholder="Description (optional)..."
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        className={`w-8 h-8 rounded-full ${color} ${newHabit.color === color ? 'ring-2 ring-primary' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddHabit} size="sm">Save</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddHabit(false)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}

            {habits.map((habit) => (
              <Card key={habit.id} className="card-interactive p-4 hover-glow animate-slideInUp" onClick={() => handleCompleteHabit(habit.id)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 text-primary animate-streakGlow">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{habit.streak}</span>
                      </div>
                    )}
                    <div 
                      className={`w-6 h-6 rounded-full border-2 transition-all smooth-curve hover-glow ${
                        habit.isCompleted 
                          ? 'bg-primary border-primary animate-glowPulse' 
                          : 'border-primary hover:bg-primary/20'
                      }`}
                    >
                      {habit.isCompleted && (
                        <CheckCircle2 className="w-full h-full text-white" />
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHabit(habit.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-destructive hover-glow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="text-foreground font-medium">
                      {habit.completedDates.length > 0 ? Math.round((habit.completedDates.length / 30) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={habit.completedDates.length > 0 ? (habit.completedDates.length / 30) * 100 : 0} className="h-2 animate-streakGlow" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4 animate-slideInUp">
            <h2 className="text-lg font-semibold text-foreground">Achievements</h2>

            {achievementProgress.map((item, index) => (
              <Card 
                key={item.achievement.id} 
                className={`card-elegant p-4 hover-glow animate-slideInUp ${
                  item.isCompleted ? "border-primary/50 animate-glowPulse" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center smooth-curve ${
                    item.isCompleted 
                      ? "bg-primary/20 text-primary animate-glowPulse" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.achievement.description}</p>
                    {!item.isCompleted && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary">{Math.round(item.progress * 100)}%</span>
                        </div>
                        <Progress value={item.progress * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                  {item.isCompleted ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30 animate-fadeInScale">
                      {item.achievement.crystal_reward} Crystals
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {item.achievement.crystal_reward} Crystals
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;