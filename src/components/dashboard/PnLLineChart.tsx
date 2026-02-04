import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MoreHorizontal } from "lucide-react";

interface PnLLineChartProps {
  data: Array<{
    date: string;
    pnl: number;
  }>;
}

export function PnLLineChart({ data }: PnLLineChartProps) {
  const formatYAxis = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return `${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPositive = value >= 0;
      return (
        <div className="bg-foreground text-background rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-success' : 'bg-destructive'}`} />
            <span className="text-sm font-semibold">${Math.abs(value).toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, index } = props;
    const maxValue = Math.max(...data.map(d => d.pnl));
    if (payload.pnl === maxValue) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={5} fill="hsl(var(--primary))" />
          <circle cx={cx} cy={cy} r={2.5} fill="white" />
        </g>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sales Analytics</h3>
          <p className="text-xs text-muted-foreground">Cumulative P&L over time</p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={formatYAxis}
              dx={-8}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
