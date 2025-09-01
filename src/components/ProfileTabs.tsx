
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  Plus,
  CheckCircle2,
  Flame,
  Trash2,
  TrendingUp,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  habits: any[];
  userAchievements: any[];
  achievementProgress: any[];
  progressStats: any;
  showAddHabit: boolean;
  setShowAddHabit: (show: boolean) => void;
  newHabit: any;
  setNewHabit: (habit: any) => void;
  handleAddHabit: () => void;
  handleCompleteHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  colors: string[];
}

export const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
  habits, 
  userAchievements, 
  achievementProgress,
  progressStats,
  showAddHabit,
  setShowAddHabit,
  newHabit,
  setNewHabit,
  handleAddHabit,
  handleCompleteHabit,
  deleteHabit,
  colors
}: ProfileTabsProps) => {
  return (
    <>
      {/* Enhanced Tabs */}
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
          Habits
          {habits.length > 0 && (
            <Badge className="ml-2 bg-primary/20 text-primary text-xs">
              {habits.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all smooth-curve ${
            activeTab === "achievements"
              ? "bg-background text-foreground shadow-sm animate-glowPulse"
              : "text-muted-foreground hover:text-foreground hover-glow"
          }`}
        >
          Awards
          {userAchievements.length > 0 && (
            <Badge className="ml-2 bg-primary/20 text-primary text-xs">
              {userAchievements.length}
            </Badge>
          )}
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
            <Card key={habit.id} className="card-interactive p-4 hover-glow animate-slideInUp group" onClick={() => handleCompleteHabit(habit.id)}>
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

          {achievementProgress.map((item: any, index: number) => (
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
    </>
  );
};
