
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartData {
  date: string;
  exp: number;
  lunarCrystals: number;
  diamonds: number;
}

interface HistoryChartProps {
  data: ChartData[];
  visibleLines: {
    exp: boolean;
    lunarCrystals: boolean;
    diamonds: boolean;
  };
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, visibleLines }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString();
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium mb-2">{date}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="text-foreground font-medium">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="lunarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(220 60% 50%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(220 60% 50%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="diamondGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(45 100% 50%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(45 100% 50%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            stroke="hsl(var(--border))"
          />
          
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            stroke="hsl(var(--border))"
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {visibleLines.exp && (
            <Area
              type="monotone"
              dataKey="exp"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#expGradient)"
              name="EXP"
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          )}
          
          {visibleLines.lunarCrystals && (
            <Area
              type="monotone"
              dataKey="lunarCrystals"
              stroke="hsl(220 60% 50%)"
              strokeWidth={3}
              fill="url(#lunarGradient)"
              name="Lunar Crystals"
              dot={{ r: 4, fill: "hsl(220 60% 50%)" }}
              activeDot={{ r: 6, fill: "hsl(220 60% 50%)" }}
            />
          )}
          
          {visibleLines.diamonds && (
            <Area
              type="monotone"
              dataKey="diamonds"
              stroke="hsl(45 100% 50%)"
              strokeWidth={3}
              fill="url(#diamondGradient)"
              name="Diamonds"
              dot={{ r: 4, fill: "hsl(45 100% 50%)" }}
              activeDot={{ r: 6, fill: "hsl(45 100% 50%)" }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
