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
    // Show dot only for specific highlighted point (e.g., highest value)
    const maxValue = Math.max(...data.map(d => d.pnl));
    if (payload.pnl === maxValue) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={6} fill="hsl(var(--primary))" />
          <circle cx={cx} cy={cy} r={3} fill="white" />
        </g>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Sales Analytics</h3>
          <p className="section-subtitle">Cumulative P&L over time</p>
        </div>
        <div className="menu-dots">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={formatYAxis}
              dx={-10}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
