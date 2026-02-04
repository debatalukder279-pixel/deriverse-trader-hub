import { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

interface TimeAnalysisData {
  hourlyData: Array<{ hour: number; pnl: number; trades: number; winRate: number }>;
  dailyData: Array<{ day: string; pnl: number; trades: number; winRate: number }>;
}

interface TradingTimeAnalysisProps {
  data: TimeAnalysisData;
}

export function TradingTimeAnalysis({ data }: TradingTimeAnalysisProps) {
  const [view, setView] = useState<'hourly' | 'daily'>('daily');

  const chartData = useMemo(() => {
    if (view === 'hourly') {
      return data.hourlyData.map(item => ({
        name: `${item.hour.toString().padStart(2, '0')}:00`,
        pnl: item.pnl,
        trades: item.trades,
        winRate: item.winRate,
      }));
    }
    return data.dailyData;
  }, [data, view]);

  const bestPeriod = useMemo(() => {
    const sorted = [...(view === 'hourly' ? data.hourlyData : data.dailyData)]
      .filter(d => d.trades > 0)
      .sort((a, b) => b.pnl - a.pnl);
    return sorted[0];
  }, [data, view]);

  const worstPeriod = useMemo(() => {
    const sorted = [...(view === 'hourly' ? data.hourlyData : data.dailyData)]
      .filter(d => d.trades > 0)
      .sort((a, b) => a.pnl - b.pnl);
    return sorted[0];
  }, [data, view]);

  const formatCurrency = (value: number) => {
    return value >= 0 ? `+$${value.toFixed(0)}` : `-$${Math.abs(value).toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className={cn(
            "font-bold",
            data.pnl >= 0 ? "text-success" : "text-destructive"
          )}>
            {formatCurrency(data.pnl)}
          </p>
          <p className="text-sm text-muted-foreground">{data.trades} trades</p>
          <p className="text-sm text-muted-foreground">{data.winRate.toFixed(0)}% win rate</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Trading Time Analysis</h3>
          <p className="section-subtitle">Performance by time of day and day of week</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setView('daily')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === 'daily' 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Daily
            </button>
            <button
              onClick={() => setView('hourly')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === 'hourly' 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Hourly
            </button>
          </div>
          <div className="menu-dots">
            <MoreHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="mt-4 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey={view === 'hourly' ? 'name' : 'day'} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              interval={view === 'hourly' ? 3 : 0}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={view === 'hourly' ? 20 : 40}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best/Worst Period Summary */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Best {view === 'hourly' ? 'Hour' : 'Day'}</p>
          <p className="font-semibold text-foreground">
            {view === 'hourly' 
              ? bestPeriod ? `${(bestPeriod as any).hour?.toString().padStart(2, '0')}:00` : '-'
              : (bestPeriod as any)?.day || '-'
            }
          </p>
          <p className="text-sm text-success font-medium">
            {bestPeriod ? formatCurrency(bestPeriod.pnl) : '-'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Worst {view === 'hourly' ? 'Hour' : 'Day'}</p>
          <p className="font-semibold text-foreground">
            {view === 'hourly' 
              ? worstPeriod ? `${(worstPeriod as any).hour?.toString().padStart(2, '0')}:00` : '-'
              : (worstPeriod as any)?.day || '-'
            }
          </p>
          <p className="text-sm text-destructive font-medium">
            {worstPeriod ? formatCurrency(worstPeriod.pnl) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
