import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FilterControls } from "@/components/dashboard/FilterControls";
import { PnLLineChart } from "@/components/dashboard/PnLLineChart";
import { PnLBarChart } from "@/components/dashboard/PnLBarChart";
import { LongShortPieChart } from "@/components/dashboard/LongShortPieChart";
import { DrawdownChart } from "@/components/dashboard/DrawdownChart";
import { TradesTable } from "@/components/dashboard/TradesTable";
import {
  mockTrades,
  calculateMetrics,
  getCumulativePnLData,
  getPnLBySymbol,
  getLongShortRatio,
  getDrawdownData,
  filterTrades,
} from "@/data/mockTrades";
import { Trade } from "@/types/trading";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Activity,
  Coins,
  Clock,
} from "lucide-react";

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [filters, setFilters] = useState({
    symbol: "ALL",
    dateRange: "90d",
    tradeType: "All",
    customStartDate: undefined as Date | undefined,
    customEndDate: undefined as Date | undefined,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const filteredTrades = useMemo(() => {
    return filterTrades(trades, appliedFilters);
  }, [trades, appliedFilters]);

  const metrics = useMemo(() => calculateMetrics(filteredTrades), [filteredTrades]);
  const cumulativePnLData = useMemo(() => getCumulativePnLData(filteredTrades), [filteredTrades]);
  const pnlBySymbol = useMemo(() => getPnLBySymbol(filteredTrades), [filteredTrades]);
  const longShortRatio = useMemo(() => getLongShortRatio(filteredTrades), [filteredTrades]);
  const drawdownData = useMemo(() => getDrawdownData(filteredTrades), [filteredTrades]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      symbol: "ALL",
      dateRange: "90d",
      tradeType: "All",
      customStartDate: undefined,
      customEndDate: undefined,
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

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
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPnL = (value: number) => {
    const formatted = formatCurrency(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted.slice(1)}`;
  };

  return (
    <DashboardLayout title="Trading Dashboard" subtitle="Real-time analytics & performance">
      <div className="space-y-6 animate-fade-in">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Total P&L"
            value={formatPnL(metrics.totalPnl)}
            icon={DollarSign}
            variant={metrics.totalPnl >= 0 ? "profit" : "loss"}
            change={{ value: 12.5, isPositive: metrics.totalPnl >= 0 }}
          />
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate}%`}
            icon={TrendingUp}
            variant={metrics.winRate >= 50 ? "profit" : "loss"}
            progress={metrics.winRate}
          />
          <MetricCard
            title="Total Trades"
            value={metrics.totalTrades.toString()}
            icon={BarChart3}
            variant="neutral"
            subtitle="Closed positions"
          />
          <MetricCard
            title="Trading Volume"
            value={formatCurrency(metrics.totalVolume)}
            icon={Activity}
            variant="neutral"
            change={{ value: 8.3, isPositive: true }}
          />
          <MetricCard
            title="Total Fees"
            value={formatCurrency(metrics.totalFees)}
            icon={Coins}
            variant="neutral"
            subtitle="Exchange fees"
          />
          <MetricCard
            title="Avg Duration"
            value={`${metrics.avgTradeDuration}h`}
            icon={Clock}
            variant="neutral"
            subtitle="Per trade"
          />
        </div>

        {/* Filter Controls */}
        <FilterControls
          symbol={filters.symbol}
          dateRange={filters.dateRange}
          tradeType={filters.tradeType}
          customStartDate={filters.customStartDate}
          customEndDate={filters.customEndDate}
          onSymbolChange={(value) => setFilters(prev => ({ ...prev, symbol: value }))}
          onDateRangeChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
          onTradeTypeChange={(value) => setFilters(prev => ({ ...prev, tradeType: value }))}
          onCustomStartDateChange={(date) => setFilters(prev => ({ ...prev, customStartDate: date }))}
          onCustomEndDateChange={(date) => setFilters(prev => ({ ...prev, customEndDate: date }))}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PnLLineChart data={cumulativePnLData} />
          <PnLBarChart data={pnlBySymbol} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LongShortPieChart data={longShortRatio} />
          <DrawdownChart data={drawdownData} />
        </div>

        {/* Trades Table */}
        <TradesTable trades={filteredTrades} onAddNote={handleAddNote} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
