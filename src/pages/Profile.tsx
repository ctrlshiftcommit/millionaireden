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
  Trash2
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHabits } from "@/hooks/useHabits";

const Profile = () => {
  const { habits, achievements, completeHabit, addHabit, deleteHabit, getHabitStats } = useHabits();
  const [activeTab, setActiveTab] = useState("habits");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", description: "", color: "bg-blue-500", goal: "daily" as const });

  const stats = getHabitStats();

  const handleAddHabit = () => {
    if (!newHabit.name.trim()) return;
    addHabit(newHabit);
    setNewHabit({ name: "", description: "", color: "bg-blue-500", goal: "daily" });
    setShowAddHabit(false);
  };

  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"];

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gradient">Profile</h1>
          <Link to="/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* User Profile Card */}
        <Card className="card-elegant p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                MD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Millionaire Den User</h2>
              <p className="text-muted-foreground">Level {stats.level} Achiever</p>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {stats.level + 1}</span>
              <span className="text-primary font-medium">{stats.totalXP} / {(stats.level + 1) * 100} XP</span>
            </div>
            <Progress value={(stats.totalXP % 100)} className="h-3" />
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-elegant p-4 text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{stats.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
          
          <Card className="card-elegant p-4 text-center">
            <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </Card>
          
          <Card className="card-elegant p-4 text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{Math.round(stats.completionRate)}%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </Card>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "habits"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Habits ({habits.length})
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "achievements"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Achievements ({achievements.filter(a => a.unlocked).length})
          </button>
        </div>

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
              <Card key={habit.id} className="card-interactive p-4" onClick={() => completeHabit(habit.id)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{habit.streak}</span>
                      </div>
                    )}
                    <div 
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        habit.isCompleted 
                          ? 'bg-primary border-primary' 
                          : 'border-primary hover:bg-primary/20'
                      }`}
                    >
                      {habit.isCompleted && (
                        <CheckCircle2 className="w-full h-full text-white" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="text-foreground font-medium">
                      {habit.completedDates.length > 0 ? Math.round((habit.completedDates.length / 30) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={habit.completedDates.length > 0 ? (habit.completedDates.length / 30) * 100 : 0} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Achievements</h2>

            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`card-elegant p-4 ${
                achievement.unlocked ? "border-primary/50" : ""
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.unlocked 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Unlocked
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