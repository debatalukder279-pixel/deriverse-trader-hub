import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PnLLineChart } from "@/components/dashboard/PnLLineChart";
import { LongShortPieChart } from "@/components/dashboard/LongShortPieChart";
import { TradesTable } from "@/components/dashboard/TradesTable";
import { MonthlyBreakdownChart } from "@/components/dashboard/MonthlyBreakdownChart";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { SymbolDistributionChart } from "@/components/dashboard/SymbolDistributionChart";
import {
  mockTrades,
  calculateMetrics,
  getCumulativePnLData,
  getLongShortRatio,
  getMonthlyBreakdown,
  getDailyHeatmapData,
  getSymbolDistribution,
  filterTrades,
} from "@/data/mockTrades";
import { Trade } from "@/types/trading";
import {
  Users,
  DollarSign,
  TrendingUp,
  FileText,
} from "lucide-react";

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [appliedFilters] = useState({
    symbol: "ALL",
    dateRange: "90d",
    tradeType: "All",
    customStartDate: undefined as Date | undefined,
    customEndDate: undefined as Date | undefined,
  });

  const filteredTrades = useMemo(() => {
    return filterTrades(trades, appliedFilters);
  }, [trades, appliedFilters]);

  const metrics = useMemo(() => calculateMetrics(filteredTrades), [filteredTrades]);
  const cumulativePnLData = useMemo(() => getCumulativePnLData(filteredTrades), [filteredTrades]);
  const longShortRatio = useMemo(() => getLongShortRatio(filteredTrades), [filteredTrades]);
  const monthlyBreakdown = useMemo(() => getMonthlyBreakdown(filteredTrades), [filteredTrades]);
  const heatmapData = useMemo(() => getDailyHeatmapData(filteredTrades), [filteredTrades]);
  const symbolDistribution = useMemo(() => getSymbolDistribution(filteredTrades), [filteredTrades]);

  const handleAddNote = (tradeId: string, note: string) => {
    setTrades(prev =>
      prev.map(trade =>
        trade.id === tradeId ? { ...trade, notes: note } : trade
      )
    );
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(3)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <DashboardLayout title="Trading Dashboard" subtitle="Track your trading performance and analytics" greeting>
      <div className="space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Trades"
            value={metrics.totalTrades.toLocaleString()}
            icon={Users}
            iconColor="purple"
            change={{ value: 6.5, isPositive: true }}
          />
          <MetricCard
            title="Revenue"
            value={formatCurrency(metrics.totalPnl)}
            icon={DollarSign}
            iconColor="green"
            change={{ value: 0.1, isPositive: metrics.totalPnl >= 0 }}
          />
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate}%`}
            icon={TrendingUp}
            iconColor="orange"
            change={{ value: 0.2, isPositive: metrics.winRate >= 50 }}
          />
          <MetricCard
            title="Volume"
            value={formatCurrency(metrics.totalVolume).replace('$', '')}
            icon={FileText}
            iconColor="blue"
            change={{ value: 11.5, isPositive: true }}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LongShortPieChart data={longShortRatio} />
          <PnLLineChart data={cumulativePnLData} />
        </div>

        {/* Charts Row 2 - New Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MonthlyBreakdownChart data={monthlyBreakdown} />
          <SymbolDistributionChart data={symbolDistribution} />
        </div>

        {/* Performance Heatmap - Full Width */}
        <PerformanceHeatmap data={heatmapData} />

        {/* Trades Table */}
        <TradesTable trades={filteredTrades} onAddNote={handleAddNote} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
