
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, TrendingUp } from 'lucide-react';
import { useUnifiedStats } from '@/hooks/useUnifiedStats';
import { format, subDays, parseISO } from 'date-fns';

interface ChartData {
  date: string;
  exp: number;
  lunarCrystals: number;
  diamonds: number;
  formattedDate: string;
}

interface HistoryChartProps {
  className?: string;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [visibleLines, setVisibleLines] = useState({
    exp: true,
    lunarCrystals: true,
    diamonds: true,
  });

  const { getExpProgressData, stats } = useUnifiedStats();

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const expData = await getExpProgressData(days);
      
      // Generate complete date range
      const endDate = new Date();
      const startDate = subDays(endDate, days - 1);
      
      const completeData: ChartData[] = [];
      
      for (let i = 0; i < days; i++) {
        const currentDate = subDays(endDate, days - 1 - i);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        const expEntry = expData.find(entry => entry.date === dateStr);
        
        // For now, we'll simulate crystal and diamond data
        // In a real app, you'd fetch this from the database
        const prevData = completeData[i - 1];
        const expGained = expEntry?.exp || 0;
        const crystalsGained = Math.floor(expGained / 10); // Simulate crystals from exp
        const diamondsGained = Math.floor(expGained / 50); // Simulate diamonds from exp
        
        completeData.push({
          date: dateStr,
          exp: (prevData?.exp || 0) + expGained,
          lunarCrystals: (prevData?.lunarCrystals || 0) + crystalsGained,
          diamonds: (prevData?.diamonds || 0) + diamondsGained,
          formattedDate: format(currentDate, 'MMM dd'),
        });
      }
      
      setChartData(completeData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLineVisibility = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const getWeeklyStats = () => {
    if (chartData.length < 7) return { expGained: 0, crystalsGained: 0, diamondsGained: 0 };
    
    const last7Days = chartData.slice(-7);
    const expGained = last7Days[last7Days.length - 1].exp - last7Days[0].exp;
    const crystalsGained = last7Days[last7Days.length - 1].lunarCrystals - last7Days[0].lunarCrystals;
    const diamondsGained = last7Days[last7Days.length - 1].diamonds - last7Days[0].diamonds;
    
    return { expGained, crystalsGained, diamondsGained };
  };

  const weeklyStats = getWeeklyStats();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Progress History
            </CardTitle>
            <CardDescription>
              Track your EXP, Lunar Crystals, and Diamond progress over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7D
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30D
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">+{weeklyStats.expGained}</p>
            <p className="text-sm text-muted-foreground">EXP this week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">+{weeklyStats.crystalsGained}</p>
            <p className="text-sm text-muted-foreground">Crystals this week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">+{weeklyStats.diamondsGained}</p>
            <p className="text-sm text-muted-foreground">Diamonds this week</p>
          </div>
        </div>

        {/* Line Visibility Controls */}
        <div className="flex gap-4 items-center justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={visibleLines.exp}
              onCheckedChange={() => toggleLineVisibility('exp')}
            />
            <span className="text-sm font-medium text-green-500">EXP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={visibleLines.lunarCrystals}
              onCheckedChange={() => toggleLineVisibility('lunarCrystals')}
            />
            <span className="text-sm font-medium text-blue-400">Lunar Crystals</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={visibleLines.diamonds}
              onCheckedChange={() => toggleLineVisibility('diamonds')}
            />
            <span className="text-sm font-medium text-yellow-400">Diamonds</span>
          </label>
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="crystalsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="diamondsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45, 93%, 58%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(45, 93%, 58%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="formattedDate" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                {visibleLines.exp && (
                  <Area
                    type="monotone"
                    dataKey="exp"
                    stroke="hsl(142, 76%, 36%)"
                    fillOpacity={1}
                    fill="url(#expGradient)"
                    strokeWidth={2}
                    name="EXP"
                  />
                )}
                {visibleLines.lunarCrystals && (
                  <Area
                    type="monotone"
                    dataKey="lunarCrystals"
                    stroke="hsl(217, 91%, 60%)"
                    fillOpacity={1}
                    fill="url(#crystalsGradient)"
                    strokeWidth={2}
                    name="Lunar Crystals"
                  />
                )}
                {visibleLines.diamonds && (
                  <Area
                    type="monotone"
                    dataKey="diamonds"
                    stroke="hsl(45, 93%, 58%)"
                    fillOpacity={1}
                    fill="url(#diamondsGradient)"
                    strokeWidth={2}
                    name="Diamonds"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
