import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useEXPSystem } from "@/hooks/useEXPSystem";
import { useLunarCrystals } from "@/hooks/useLunarCrystals";
import { LunarCrystalLogo } from "@/components/LunarCrystalLogo";

const LevelHistory = () => {
  const { totalEXP, getLevelInfo, levelHistory, expTransactions, getExpProgressData } = useEXPSystem();
  const { crystals } = useLunarCrystals();
  const levelInfo = getLevelInfo();
  const progressData = getExpProgressData(30);

  return (
    <div className="min-h-screen bg-background pt-14 pb-20 safe-area-inset-top">
      {/* Header with current level background */}
      <div 
        className="relative px-4 pt-6 pb-8 bg-cover bg-center"
        style={{
          backgroundImage: levelInfo.level >= 1 
            ? `url('/api/placeholder/400/200')` 
            : 'linear-gradient(135deg, hsl(0 85% 58% / 0.1) 0%, hsl(0 0% 6%) 100%)',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="relative z-10">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4 text-foreground/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{levelInfo.level}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{levelInfo.title}</h1>
                <p className="text-muted-foreground">Level {levelInfo.level}</p>
              </div>
            </div>
            <p className="text-foreground/80 mb-4">{levelInfo.description}</p>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="card-elegant p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <LunarCrystalLogo size={20} />
                <span className="text-lg font-bold text-primary">{crystals}</span>
              </div>
              <p className="text-xs text-muted-foreground">Lunar Crystals</p>
            </Card>
            
            <Card className="card-elegant p-4 text-center">
              <p className="text-lg font-bold text-foreground">{totalEXP.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total EXP</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2">
        {/* EXP Progress Chart */}
        <Card className="card-elegant p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">EXP Progress (Last 30 Days)</h2>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {levelInfo.level + 1}</span>
              <span className="text-primary font-medium">
                {totalEXP} / {levelInfo.nextLevelPoints} EXP
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary rounded-full h-3 transition-all duration-300"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
          </div>

          {/* EXP Progress Chart - Last 7 Days */}
          <div className="grid grid-cols-7 gap-1 mt-4">
            {progressData.slice(-7).map((day, index) => {
              const maxExp = Math.max(...progressData.slice(-7).map(d => d.exp), 100);
              return (
                <div key={day.date} className="text-center">
                  <div 
                    className="w-full bg-muted rounded mb-1 flex items-end justify-center relative"
                    style={{ height: '60px' }}
                  >
                    <div 
                      className="bg-gradient-to-t from-primary to-primary-glow rounded w-full transition-all duration-300 relative group"
                      style={{ 
                        height: `${Math.max(4, (day.exp / maxExp) * 56)}px`
                      }}
                    >
                      {day.exp > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded px-1 text-xs font-medium">
                          {day.exp}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                  <p className="text-xs text-primary font-bold">
                    {day.exp}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Monthly Progress Overview */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-3">Monthly Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">
                  {progressData.reduce((sum, day) => sum + day.exp, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total EXP This Month</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">
                  {Math.round(progressData.reduce((sum, day) => sum + day.exp, 0) / progressData.length)}
                </p>
                <p className="text-xs text-muted-foreground">Daily Average</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Level History */}
        {levelHistory.length > 0 && (
          <Card className="card-elegant p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Level History</h2>
            </div>
            
            <div className="space-y-3">
              {levelHistory.slice(0, 10).map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Level {entry.oldLevel} → Level {entry.newLevel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString()} at {entry.expAtLevelUp.toLocaleString()} EXP
                    </p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    +{entry.newLevel - entry.oldLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent EXP Transactions */}
        <Card className="card-elegant p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          
          <div className="space-y-3">
            {expTransactions.slice(0, 15).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.timestamp).toLocaleDateString()} at {' '}
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <Badge 
                  variant={transaction.amount > 0 ? "default" : "destructive"}
                  className="ml-2"
                >
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} EXP
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LevelHistory;