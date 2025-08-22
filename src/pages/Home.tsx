import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Star, BookOpen } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Millionaire Den
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back, Champion</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="card-elegant p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-xl font-bold text-foreground">12</p>
            </div>
          </div>
        </Card>

        <Card className="card-elegant p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-xl font-bold text-foreground">7 days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Progress */}
      <Card className="card-elegant p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Daily Progress</h2>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">850 XP</span>
          </div>
        </div>
        <Progress value={75} className="mb-3" />
        <p className="text-sm text-muted-foreground">3 of 4 habits completed today</p>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        
        <Card className="card-elegant p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Morning Workout</p>
                <p className="text-sm text-muted-foreground">Complete your daily exercise</p>
              </div>
            </div>
            <button className="w-6 h-6 rounded-full border-2 border-primary hover:bg-primary/20 transition-colors" />
          </div>
        </Card>

        <Card className="card-elegant p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Journal Entry</p>
                <p className="text-sm text-muted-foreground">Reflect on your day</p>
              </div>
            </div>
            <button className="w-6 h-6 rounded-full border-2 border-primary hover:bg-primary/20 transition-colors" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;