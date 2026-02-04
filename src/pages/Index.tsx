import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PnLLineChart } from "@/components/dashboard/PnLLineChart";
import { LongShortPieChart } from "@/components/dashboard/LongShortPieChart";
import { TradesTable } from "@/components/dashboard/TradesTable";
import { MonthlyBreakdownChart } from "@/components/dashboard/MonthlyBreakdownChart";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { SymbolDistributionChart } from "@/components/dashboard/SymbolDistributionChart";
import { TradingTimeAnalysis } from "@/components/dashboard/TradingTimeAnalysis";
import { OverallProgressCard } from "@/components/dashboard/OverallProgressCard";
import { FilterControls } from "@/components/dashboard/FilterControls";
import { RiskManagementCard } from "@/components/dashboard/RiskManagementCard";
import { DailyPnLChart } from "@/components/dashboard/DailyPnLChart";
import { WinRateBySymbolChart } from "@/components/dashboard/WinRateBySymbolChart";
import { SessionPerformanceChart } from "@/components/dashboard/SessionPerformanceChart";
import { OrderTypePerformanceChart } from "@/components/dashboard/OrderTypePerformanceChart";
import { FeesBySymbolChart } from "@/components/dashboard/FeesBySymbolChart";
import { CumulativeFeesChart } from "@/components/dashboard/CumulativeFeesChart";
import { PnLDistributionChart } from "@/components/dashboard/PnLDistributionChart";
import { DrawdownChart } from "@/components/dashboard/DrawdownChart";
import {
  mockTrades,
  calculateMetrics,
  calculateRiskMetrics,
  getCumulativePnLData,
  getDailyPnLData,
  getPnLDistribution,
  getLongShortRatio,
  getMonthlyBreakdown,
  getDailyHeatmapData,
  getSymbolDistribution,
  getTimeAnalysisData,
  getSessionPerformance,
  getFeeAnalysis,
  getOrderTypePerformance,
  getWinRateBySymbol,
  getDrawdownData,
  filterTrades,
} from "@/data/mockTrades";
import { Trade } from "@/types/trading";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    symbol: "ALL",
    dateRange: "90d",
    tradeType: "All",
    orderType: "All",
    customStartDate: undefined as Date | undefined,
    customEndDate: undefined as Date | undefined,
  });
  
  const [appliedFilters, setAppliedFilters] = useState({...filters});

  // Load saved notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('deriverse-trade-notes');
    if (savedNotes) {
      const notesMap = JSON.parse(savedNotes);
      setTrades(prev => prev.map(trade => ({
        ...trade,
        notes: notesMap[trade.id] || trade.notes
      })));
    }
  }, []);

  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({...filters});
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      symbol: "ALL",
      dateRange: "90d",
      tradeType: "All",
      orderType: "All",
      customStartDate: undefined,
      customEndDate: undefined,
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const filteredTrades = useMemo(() => {
    return filterTrades(trades, appliedFilters);
  }, [trades, appliedFilters]);

  // All computed data
  const metrics = useMemo(() => calculateMetrics(filteredTrades), [filteredTrades]);
  const riskMetrics = useMemo(() => calculateRiskMetrics(filteredTrades), [filteredTrades]);
  const cumulativePnLData = useMemo(() => getCumulativePnLData(filteredTrades), [filteredTrades]);
  const dailyPnLData = useMemo(() => getDailyPnLData(filteredTrades), [filteredTrades]);
  const pnlDistribution = useMemo(() => getPnLDistribution(filteredTrades), [filteredTrades]);
  const longShortRatio = useMemo(() => getLongShortRatio(filteredTrades), [filteredTrades]);
  const monthlyBreakdown = useMemo(() => getMonthlyBreakdown(filteredTrades), [filteredTrades]);
  const heatmapData = useMemo(() => getDailyHeatmapData(filteredTrades), [filteredTrades]);
  const symbolDistribution = useMemo(() => getSymbolDistribution(filteredTrades), [filteredTrades]);
  const timeAnalysisData = useMemo(() => getTimeAnalysisData(filteredTrades), [filteredTrades]);
  const sessionPerformance = useMemo(() => getSessionPerformance(filteredTrades), [filteredTrades]);
  const feeAnalysis = useMemo(() => getFeeAnalysis(filteredTrades), [filteredTrades]);
  const orderTypePerformance = useMemo(() => getOrderTypePerformance(filteredTrades), [filteredTrades]);
  const winRateBySymbol = useMemo(() => getWinRateBySymbol(filteredTrades), [filteredTrades]);
  const drawdownData = useMemo(() => getDrawdownData(filteredTrades), [filteredTrades]);

  const handleAddNote = (tradeId: string, note: string) => {
    setTrades(prev =>
      prev.map(trade =>
        trade.id === tradeId ? { ...trade, notes: note } : trade
      )
    );
    // Save to localStorage
    const savedNotes = JSON.parse(localStorage.getItem('deriverse-trade-notes') || '{}');
    savedNotes[tradeId] = note;
    localStorage.setItem('deriverse-trade-notes', JSON.stringify(savedNotes));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Type', 'Order Type', 'Entry', 'Exit', 'Quantity', 'P&L', 'Fees', 'Duration (hrs)', 'Status'];
    const rows = filteredTrades.map(trade => {
      const duration = trade.exitDate && trade.date 
        ? ((trade.exitDate.getTime() - trade.date.getTime()) / (1000 * 60 * 60)).toFixed(1)
        : '';
      return [
        format(trade.date, 'yyyy-MM-dd HH:mm'),
        trade.symbol,
        trade.type,
        trade.orderType,
        trade.entryPrice,
        trade.exitPrice || '',
        trade.quantity,
        trade.pnl,
        trade.fees,
        duration,
        trade.status,
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deriverse-trades-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <DashboardLayout title="Trading Dashboard" subtitle="Track your trading performance and analytics" greeting>
      <div className={`space-y-6 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
        
        {/* Filter Controls */}
        <FilterControls
          symbol={filters.symbol}
          dateRange={filters.dateRange}
          tradeType={filters.tradeType}
          orderType={filters.orderType}
          customStartDate={filters.customStartDate}
          customEndDate={filters.customEndDate}
          onSymbolChange={(v) => setFilters(f => ({...f, symbol: v}))}
          onDateRangeChange={(v) => setFilters(f => ({...f, dateRange: v}))}
          onTradeTypeChange={(v) => setFilters(f => ({...f, tradeType: v}))}
          onOrderTypeChange={(v) => setFilters(f => ({...f, orderType: v}))}
          onCustomStartDateChange={(d) => setFilters(f => ({...f, customStartDate: d}))}
          onCustomEndDateChange={(d) => setFilters(f => ({...f, customEndDate: d}))}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Primary KPI Metrics - 8 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
          <MetricCard
            title="Total P&L"
            value={formatCurrency(metrics.totalPnl)}
            icon={DollarSign}
            iconColor={metrics.totalPnl >= 0 ? "green" : "red"}
            change={{ value: Math.abs(metrics.totalPnlPercent), isPositive: metrics.totalPnl >= 0 }}
          />
          <MetricCard
            title="Total Volume"
            value={formatCurrency(metrics.totalVolume)}
            icon={FileText}
            iconColor="blue"
          />
          <MetricCard
            title="Total Fees"
            value={formatCurrency(metrics.totalFees)}
            icon={TrendingDown}
            iconColor="orange"
          />
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate}%`}
            icon={Percent}
            iconColor="purple"
            change={{ value: 0, isPositive: metrics.winRate >= 50 }}
          />
          <MetricCard
            title="Total Trades"
            value={metrics.totalTrades.toLocaleString()}
            icon={Users}
            iconColor="blue"
          />
          <MetricCard
            title="Avg Duration"
            value={`${metrics.avgTradeDuration.toFixed(1)}h`}
            icon={Clock}
            iconColor="purple"
          />
          <MetricCard
            title="Largest Gain"
            value={formatCurrency(metrics.largestGain)}
            icon={ArrowUp}
            iconColor="green"
          />
          <MetricCard
            title="Largest Loss"
            value={formatCurrency(Math.abs(metrics.largestLoss))}
            icon={ArrowDown}
            iconColor="red"
          />
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="widget-card">
            <p className="text-xs text-muted-foreground mb-1">Avg Win</p>
            <p className="text-xl font-bold text-success tabular-nums">{formatCurrency(metrics.avgWin)}</p>
          </div>
          <div className="widget-card">
            <p className="text-xs text-muted-foreground mb-1">Avg Loss</p>
            <p className="text-xl font-bold text-destructive tabular-nums">{formatCurrency(Math.abs(metrics.avgLoss))}</p>
          </div>
          <div className="widget-card">
            <p className="text-xs text-muted-foreground mb-1">P&L Percentage</p>
            <p className={`text-xl font-bold tabular-nums ${metrics.totalPnlPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {metrics.totalPnlPercent >= 0 ? '+' : ''}{metrics.totalPnlPercent.toFixed(2)}%
            </p>
          </div>
          <div className="widget-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Export Data</p>
              <p className="text-sm font-medium text-foreground">{filteredTrades.length} trades</p>
            </div>
            <Button onClick={exportToCSV} size="sm" variant="outline" className="rounded-xl h-9 px-4">
              <Download className="w-4 h-4 mr-1.5" />
              CSV
            </Button>
          </div>
        </div>

        {/* Risk Management */}
        <RiskManagementCard metrics={riskMetrics} />

        {/* Overview Charts - 3 column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LongShortPieChart data={longShortRatio} />
          <PnLLineChart data={cumulativePnLData} />
          <OverallProgressCard winRate={metrics.winRate} />
        </div>

        {/* P&L Analysis - 2 column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DailyPnLChart data={dailyPnLData} />
          <DrawdownChart data={drawdownData} />
        </div>

        {/* Distribution & Symbol Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PnLDistributionChart data={pnlDistribution} />
          <WinRateBySymbolChart data={winRateBySymbol} />
        </div>

        {/* Monthly & Symbol Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MonthlyBreakdownChart data={monthlyBreakdown} />
          <SymbolDistributionChart data={symbolDistribution} />
        </div>

        {/* Time Analysis */}
        <TradingTimeAnalysis data={timeAnalysisData} />

        {/* Session & Order Type Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SessionPerformanceChart data={sessionPerformance} />
          <OrderTypePerformanceChart data={orderTypePerformance} />
        </div>

        {/* Fee Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FeesBySymbolChart data={feeAnalysis.feesBySymbol} />
          <CumulativeFeesChart data={feeAnalysis.cumulativeFeeData} />
        </div>

        {/* Performance Heatmap */}
        <PerformanceHeatmap data={heatmapData} />

        {/* Trades Table */}
        <TradesTable trades={filteredTrades} onAddNote={handleAddNote} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
