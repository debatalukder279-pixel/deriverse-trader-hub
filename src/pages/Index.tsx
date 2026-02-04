import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeroBalanceCard } from "@/components/dashboard/HeroBalanceCard";
import { QuickStatCard } from "@/components/dashboard/QuickStatCard";
import { RecentTradesCard } from "@/components/dashboard/RecentTradesCard";
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
import { TimeOfDayHeatmap } from "@/components/dashboard/TimeOfDayHeatmap";
import { FeeCompositionChart } from "@/components/dashboard/FeeCompositionChart";
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
  getHourDayHeatmapData,
  filterTrades,
} from "@/data/mockTrades";
import { Trade } from "@/types/trading";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Receipt,
  Target,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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
  const hourDayHeatmapData = useMemo(() => getHourDayHeatmapData(filteredTrades), [filteredTrades]);

  const handleAddNote = (tradeId: string, note: string) => {
    setTrades(prev =>
      prev.map(trade =>
        trade.id === tradeId ? { ...trade, notes: note } : trade
      )
    );
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
    <DashboardLayout title="Trading Dashboard" subtitle="Track your trading performance" greeting>
      <div className={`space-y-8 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
        
        {/* Top Section - Hero + Recent Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hero Balance + Quick Stats */}
          <div className="lg:col-span-2 space-y-6">
            <HeroBalanceCard 
              totalPnl={metrics.totalPnl}
              pnlPercent={metrics.totalPnlPercent}
              winRate={metrics.winRate}
            />
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickStatCard
                icon={Wallet}
                value={formatCurrency(metrics.totalVolume)}
                label="Total Volume"
              />
              <QuickStatCard
                icon={Receipt}
                value={formatCurrency(metrics.totalFees)}
                label="Total Fees"
                variant="warning"
              />
              <QuickStatCard
                icon={ArrowUpRight}
                value={formatCurrency(metrics.largestGain)}
                label="Largest Win"
                variant="success"
              />
              <QuickStatCard
                icon={ArrowDownRight}
                value={formatCurrency(Math.abs(metrics.largestLoss))}
                label="Largest Loss"
                variant="destructive"
              />
            </div>
          </div>

          {/* Right Column - Recent Trades */}
          <div className="lg:col-span-1">
            <RecentTradesCard trades={filteredTrades} />
          </div>
        </div>

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

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlyBreakdownChart data={monthlyBreakdown} />
          </div>
          <OverallProgressCard winRate={metrics.winRate} />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="widget-card">
            <p className="text-xs text-muted-foreground mb-2">Average Win</p>
            <p className="text-2xl font-bold text-success tabular-nums">{formatCurrency(metrics.avgWin)}</p>
          </div>
          <div className="widget-card">
            <p className="text-xs text-muted-foreground mb-2">Average Loss</p>
            <p className="text-2xl font-bold text-destructive tabular-nums">{formatCurrency(Math.abs(metrics.avgLoss))}</p>
          </div>
          <div className="widget-card">
            <p className="text-xs text-muted-foreground mb-2">Total Trades</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">{metrics.totalTrades}</p>
          </div>
          <div className="widget-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Export</p>
              <p className="text-sm font-medium text-foreground">{filteredTrades.length} trades</p>
            </div>
            <Button onClick={exportToCSV} size="sm" variant="outline" className="rounded-xl h-10 px-4">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Risk Management */}
        <RiskManagementCard metrics={riskMetrics} />

        {/* Charts Grid - Clean 2 column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PnLLineChart data={cumulativePnLData} />
          <LongShortPieChart data={longShortRatio} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyPnLChart data={dailyPnLData} />
          <DrawdownChart data={drawdownData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PnLDistributionChart data={pnlDistribution} />
          <WinRateBySymbolChart data={winRateBySymbol} />
        </div>

        <SymbolDistributionChart data={symbolDistribution} />

        {/* Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingTimeAnalysis data={timeAnalysisData} />
          <TimeOfDayHeatmap data={hourDayHeatmapData} />
        </div>

        {/* Session & Order Type Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionPerformanceChart data={sessionPerformance} />
          <OrderTypePerformanceChart data={orderTypePerformance} />
        </div>

        {/* Fee Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeeCompositionChart data={feeAnalysis.feeComposition} />
          <FeesBySymbolChart data={feeAnalysis.feesBySymbol} />
        </div>

        <CumulativeFeesChart data={feeAnalysis.cumulativeFeeData} />

        {/* Performance Heatmap */}
        <PerformanceHeatmap data={heatmapData} />

        {/* Trades Table */}
        <TradesTable trades={filteredTrades} onAddNote={handleAddNote} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
