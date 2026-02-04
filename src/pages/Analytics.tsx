import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { mockTrades, calculateMetrics, mockPortfolio } from "@/data/mockTrades";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Calendar,
} from "lucide-react";

const Analytics = () => {
  const metrics = calculateMetrics(mockTrades);

  // Calculate additional analytics
  const winningTrades = mockTrades.filter(t => t.pnl > 0);
  const losingTrades = mockTrades.filter(t => t.pnl < 0);
  const avgWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
    : 0;
  const avgLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length)
    : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  // Weekly performance data
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (11 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const weekTrades = mockTrades.filter(
      t => t.date >= weekStart && t.date < weekEnd
    );
    const pnl = weekTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    return {
      week: `W${i + 1}`,
      pnl: Number(pnl.toFixed(2)),
    };
  });

  // Symbol performance breakdown
  const symbolPerformance = ['SOL', 'BTC', 'ETH'].map(symbol => {
    const symbolTrades = mockTrades.filter(t => t.symbol === symbol);
    const wins = symbolTrades.filter(t => t.pnl > 0).length;
    const total = symbolTrades.length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const totalPnl = symbolTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    return {
      symbol,
      winRate: Number(winRate.toFixed(1)),
      trades: total,
      pnl: Number(totalPnl.toFixed(2)),
    };
  });

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPositive = value >= 0;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className={`text-lg font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{formatCurrency(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Advanced Analytics" subtitle="Deep dive into your trading performance">
      <div className="space-y-6 animate-fade-in">
        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Average Win"
            value={formatCurrency(avgWin)}
            icon={TrendingUp}
            iconColor="green"
            subtitle="Per winning trade"
          />
          <MetricCard
            title="Average Loss"
            value={formatCurrency(avgLoss)}
            icon={TrendingDown}
            iconColor="red"
            subtitle="Per losing trade"
          />
          <MetricCard
            title="Profit Factor"
            value={profitFactor.toFixed(2)}
            icon={Target}
            iconColor={profitFactor >= 1.5 ? "green" : profitFactor >= 1 ? "blue" : "red"}
            subtitle="Win/Loss ratio"
          />
          <MetricCard
            title="Expectancy"
            value={formatCurrency((avgWin * (metrics.winRate / 100)) - (avgLoss * (1 - metrics.winRate / 100)))}
            icon={Zap}
            iconColor="purple"
            subtitle="Expected per trade"
          />
        </div>

        {/* Weekly Performance Chart */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Weekly Performance</h3>
              <p className="text-sm text-muted-foreground">Last 12 weeks P&L breakdown</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Rolling 12 weeks
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={formatCurrency}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Symbol Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {symbolPerformance.map((item) => (
            <div key={item.symbol} className="dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{item.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{item.trades} trades</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="font-semibold">{item.winRate}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.winRate}%` }}
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Total P&L</span>
                  <span className={`font-bold ${item.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Overview */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Portfolio Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <DollarSign className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">
                ${mockPortfolio.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-foreground">
                ${mockPortfolio.cashBalance.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Cash Balance</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-success">
                +${mockPortfolio.positions.reduce((sum, p) => sum + p.unrealizedPnl, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Unrealized P&L</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-foreground">
                {mockPortfolio.positions.length}
              </p>
              <p className="text-sm text-muted-foreground">Open Positions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
