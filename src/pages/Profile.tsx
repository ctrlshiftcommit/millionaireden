import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Settings
} from "lucide-react";
import { useState } from "react";

const habits = [
  { name: "Morning Workout", streak: 7, completion: 85, color: "bg-green-500" },
  { name: "Meditation", streak: 12, completion: 92, color: "bg-blue-500" },
  { name: "Reading", streak: 5, completion: 75, color: "bg-purple-500" },
  { name: "Journaling", streak: 3, completion: 60, color: "bg-orange-500" },
];

const achievements = [
  { name: "First Steps", description: "Complete your first habit", unlocked: true },
  { name: "Week Warrior", description: "7-day streak achieved", unlocked: true },
  { name: "Consistency King", description: "30-day streak", unlocked: false },
  { name: "Century Club", description: "100 journal entries", unlocked: false },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("habits");

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <header className="pt-8 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* User Profile Card */}
      <Card className="card-elegant p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              MD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Millionaire Den User</h2>
            <p className="text-muted-foreground">Level 12 Achiever</p>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level 13</span>
            <span className="text-primary font-medium">850 / 1000 XP</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="card-elegant p-4 text-center">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </Card>
        
        <Card className="card-elegant p-4 text-center">
          <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">7</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </Card>
        
        <Card className="card-elegant p-4 text-center">
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">24</p>
          <p className="text-xs text-muted-foreground">Habits</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("habits")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "habits"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Habits
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "achievements"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Achievements
        </button>
      </div>

      {/* Habits Tab */}
      {activeTab === "habits" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">My Habits</h2>
            <Button size="sm" className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>

          {habits.map((habit, index) => (
            <Card key={index} className="card-elegant p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                <h3 className="font-medium text-foreground flex-1">{habit.name}</h3>
                <div className="flex items-center gap-1 text-primary">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{habit.streak}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly Completion</span>
                  <span className="text-foreground font-medium">{habit.completion}%</span>
                </div>
                <Progress value={habit.completion} className="h-2" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Achievements</h2>

          {achievements.map((achievement, index) => (
            <Card key={index} className={`card-elegant p-4 ${
              achievement.unlocked ? "border-primary/50" : ""
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="default" className="bg-primary/20 text-primary">
                    Unlocked
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;