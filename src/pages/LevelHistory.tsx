
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, TrendingUp, Calendar, Award, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnifiedStats } from "@/hooks/useUnifiedStats";
import { LunarCrystalLogo } from "@/components/LunarCrystalLogo";
import { HistoryChart } from "@/components/HistoryChart";
import { ResetStatsDialog } from "@/components/ResetStatsDialog";
import { useState, useEffect } from "react";

const LevelHistory = () => {
  const { stats, getLevelInfo, getExpProgressData, getLevelHistory, getRecentExpTransactions } = useUnifiedStats();
  const [chartData, setChartData] = useState<Array<{ date: string; exp: number; lunarCrystals: number; diamonds: number }>>([]);
  const [levelHistory, setLevelHistory] = useState<Array<{ id: string; old_level: number; new_level: number; exp_at_levelup: number; level_up_at: string }>>([]);
  const [transactions, setTransactions] = useState<Array<{ id: string; created_at: string; amount: number; description: string; type: string }>>([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState({
    exp: true,
    lunarCrystals: true,
    diamonds: false // No diamonds in current system, but prepared for future
  });
  
  const levelInfo = getLevelInfo();
  const crystals = stats?.lunar_crystals || 0;

  useEffect(() => {
    const fetchData = async () => {
      const [expData, historyData, transactionData] = await Promise.all([
        getExpProgressData(30),
        getLevelHistory(50),
        getRecentExpTransactions(15)
      ]);
      
      // Transform exp progress data to include lunar crystals over time
      const transformedData = expData.map((day, index) => {
        // Simulate crystal accumulation (this would need actual crystal transaction tracking)
        const crystalEstimate = Math.floor(day.exp / 10); // Rough estimate
        return {
          date: day.date,
          exp: day.exp,
          lunarCrystals: crystalEstimate,
          diamonds: 0 // Placeholder for future diamond system
        };
      });
      
      setChartData(transformedData);
      setLevelHistory(historyData);
      setTransactions(transactionData);
    };

    fetchData();
  }, [stats]);

  // Calculate summary stats
  const weeklyExpGain = chartData.slice(-7).reduce((sum, day) => sum + day.exp, 0);
  const weeklyLunarGain = chartData.slice(-7).reduce((sum, day) => sum + day.lunarCrystals, 0);
  const monthlyExpGain = chartData.reduce((sum, day) => sum + day.exp, 0);

  const toggleLineVisibility = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-14 pb-20 safe-area-inset-top">
      {/* Header */}
      <div 
        className="relative px-4 pt-6 pb-8 bg-gradient-to-br from-primary/20 via-background to-background"
      >
        <div className="relative z-10">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4 text-foreground/80 hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                <span className="text-2xl font-bold text-primary">{levelInfo.level}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{levelInfo.title}</h1>
                <p className="text-muted-foreground">Level {levelInfo.level}</p>
              </div>
            </div>
            <p className="text-foreground/80 mb-4">{levelInfo.description}</p>
          </div>

          {/* Current Stats Summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center bg-background/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-center gap-1 mb-2">
                <LunarCrystalLogo size={20} />
                <span className="text-lg font-bold text-primary">{crystals}</span>
              </div>
              <p className="text-xs text-muted-foreground">Lunar Crystals</p>
            </Card>
            
            <Card className="p-4 text-center bg-background/50 backdrop-blur-sm border-border/50">
              <p className="text-lg font-bold text-foreground">{(stats?.total_exp || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total EXP</p>
            </Card>

            <Card className="p-4 text-center bg-background/50 backdrop-blur-sm border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setResetDialogOpen(true)}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive p-2 h-auto"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Reset Stats</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">+{weeklyExpGain}</p>
            <p className="text-xs text-muted-foreground">EXP This Week</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">+{weeklyLunarGain}</p>
            <p className="text-xs text-muted-foreground">Crystals This Week</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{monthlyExpGain}</p>
            <p className="text-xs text-muted-foreground">Monthly Total</p>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Progress History</h2>
            </div>
            
            {/* Chart Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLineVisibility('exp')}
                  className={`text-xs ${visibleLines.exp ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {visibleLines.exp ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                  EXP
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLineVisibility('lunarCrystals')}
                  className={`text-xs ${visibleLines.lunarCrystals ? 'text-blue-500' : 'text-muted-foreground'}`}
                >
                  {visibleLines.lunarCrystals ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                  Crystals
                </Button>
              </div>
            </div>
          </div>
          
          <HistoryChart data={chartData} visibleLines={visibleLines} />
        </Card>

        {/* Level History */}
        {levelHistory.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Level History</h2>
            </div>
            
            <div className="space-y-3">
              {levelHistory.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Level {entry.old_level} → Level {entry.new_level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.level_up_at).toLocaleDateString()} at {entry.exp_at_levelup.toLocaleString()} EXP
                    </p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    +{entry.new_level - entry.old_level}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          
          <div className="space-y-3">
            {transactions.slice(0, 15).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()} at {' '}
                    {new Date(transaction.created_at).toLocaleTimeString()}
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

      <ResetStatsDialog 
        open={resetDialogOpen} 
        onOpenChange={setResetDialogOpen} 
      />
    </div>
  );
};

export default LevelHistory;
