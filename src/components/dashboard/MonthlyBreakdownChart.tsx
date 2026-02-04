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
import { MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface MonthlyBreakdownChartProps {
  data: Array<{
    month: string;
    pnl: number;
    trades: number;
  }>;
}

export function MonthlyBreakdownChart({ data }: MonthlyBreakdownChartProps) {
  const [view, setView] = useState<'pnl' | 'trades'>('pnl');

  const formatYAxis = (value: number) => {
    if (view === 'pnl') {
      if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
      }
      return `$${value}`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const entry = data.find(d => d.month === label);
      return (
        <div className="bg-foreground text-background rounded-lg px-4 py-3 shadow-lg">
          <p className="text-xs text-background/70 mb-1">{label}</p>
          <p className="text-lg font-bold">
            {view === 'pnl' ? (
              <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
                {value >= 0 ? '+' : ''}${Math.abs(value).toLocaleString()}
              </span>
            ) : (
              `${value} trades`
            )}
          </p>
          {view === 'pnl' && entry && (
            <p className="text-xs text-background/70 mt-1">{entry.trades} trades</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Monthly Performance</h3>
          <p className="section-subtitle">Track your monthly progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v: 'pnl' | 'trades') => setView(v)}>
            <SelectTrigger className="w-28 h-9 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pnl">P&L</SelectItem>
              <SelectItem value="trades">Trades</SelectItem>
            </SelectContent>
          </Select>
          <div className="menu-dots">
            <MoreHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={formatYAxis}
              dx={-5}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
            <Bar dataKey={view} radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={view === 'pnl' 
                    ? (entry.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))')
                    : 'hsl(var(--primary))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
