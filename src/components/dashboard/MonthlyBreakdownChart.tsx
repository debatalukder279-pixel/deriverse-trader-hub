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
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const positiveMonths = data.filter(d => d.pnl >= 0).length;
  const negativeMonths = data.filter(d => d.pnl < 0).length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const entry = data.find(d => d.month === label);
      return (
        <div className="bg-foreground text-background rounded-2xl px-4 py-3 shadow-xl">
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
    <div className="dashboard-card h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Incomes Overview</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              <span className="font-medium">{positiveMonths}</span>
              <span className="text-muted-foreground">Profitable</span>
            </span>
            <span className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              <span className="font-medium">{negativeMonths}</span>
              <span className="text-muted-foreground">Loss</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v: 'pnl' | 'trades') => setView(v)}>
            <SelectTrigger className="w-24 h-9 rounded-xl text-xs bg-muted/50 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pnl">P&L</SelectItem>
              <SelectItem value="trades">Trades</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={formatYAxis}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
            <Bar dataKey={view} radius={[4, 4, 4, 4]} maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={view === 'pnl' 
                    ? (entry.pnl >= 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground)/0.3)')
                    : 'hsl(var(--foreground))'
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
