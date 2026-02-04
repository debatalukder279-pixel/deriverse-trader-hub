import { Trade, Symbol } from '@/types/trading';

// Generate realistic crypto prices
const generatePrice = (symbol: Symbol, basePrice: number, variance: number): number => {
  return Number((basePrice + (Math.random() - 0.5) * variance).toFixed(symbol === 'BTC' ? 2 : 4));
};

// Generate a random date within the last n days
const randomDate = (daysAgo: number): Date => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return pastDate;
};

// Base prices for realistic data
const basePrices: Record<Symbol, { base: number; variance: number }> = {
  SOL: { base: 150, variance: 50 },
  BTC: { base: 65000, variance: 15000 },
  ETH: { base: 3500, variance: 800 },
};

// Generate 50+ sample trades
const generateTrades = (): Trade[] => {
  const trades: Trade[] = [];
  const symbols: Symbol[] = ['SOL', 'BTC', 'ETH'];
  const types: ('Long' | 'Short')[] = ['Long', 'Short'];

  for (let i = 0; i < 58; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const { base, variance } = basePrices[symbol];
    
    const entryPrice = generatePrice(symbol, base, variance);
    const priceChange = (Math.random() - 0.4) * (variance * 0.15);
    const exitPrice = generatePrice(symbol, entryPrice + priceChange, variance * 0.05);
    
    const quantity = symbol === 'BTC' 
      ? Number((Math.random() * 0.5 + 0.1).toFixed(4))
      : symbol === 'ETH'
        ? Number((Math.random() * 3 + 0.5).toFixed(3))
        : Number((Math.random() * 50 + 10).toFixed(2));

    let pnl: number;
    if (type === 'Long') {
      pnl = (exitPrice - entryPrice) * quantity;
    } else {
      pnl = (entryPrice - exitPrice) * quantity;
    }
    pnl = Number(pnl.toFixed(2));

    const volume = entryPrice * quantity;
    const fees = Number((volume * 0.001).toFixed(2));

    const entryDate = randomDate(90);
    const tradeDuration = Math.random() * 72 + 0.5;
    const exitDate = new Date(entryDate.getTime() + tradeDuration * 60 * 60 * 1000);

    trades.push({
      id: `trade-${i + 1}`,
      symbol,
      type,
      entryPrice,
      exitPrice,
      quantity,
      pnl,
      fees,
      date: entryDate,
      exitDate,
      notes: '',
      status: 'Closed',
    });
  }

  return trades.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const mockTrades: Trade[] = generateTrades();

export const mockUser = {
  id: 'user-1',
  email: 'alex@deriverse.io',
  name: 'Alex Thompson',
  joinDate: new Date('2024-01-15'),
  avatar: undefined,
};

export const mockPortfolio = {
  userId: 'user-1',
  totalValue: 125430.50,
  cashBalance: 25430.50,
  positions: [
    { symbol: 'SOL' as Symbol, quantity: 150, avgEntryPrice: 142.50, currentPrice: 155.80, unrealizedPnl: 1995.00 },
    { symbol: 'BTC' as Symbol, quantity: 0.85, avgEntryPrice: 62500, currentPrice: 67200, unrealizedPnl: 3995.00 },
    { symbol: 'ETH' as Symbol, quantity: 12.5, avgEntryPrice: 3200, currentPrice: 3450, unrealizedPnl: 3125.00 },
  ],
};

// Calculate metrics from trades
export const calculateMetrics = (trades: Trade[]) => {
  const closedTrades = trades.filter(t => t.status === 'Closed');
  
  const totalPnl = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = closedTrades.filter(t => t.pnl > 0).length;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;
  const totalVolume = closedTrades.reduce((sum, t) => sum + (t.entryPrice * t.quantity), 0);
  const totalFees = closedTrades.reduce((sum, t) => sum + t.fees, 0);
  
  const avgTradeDuration = closedTrades.reduce((sum, t) => {
    if (t.exitDate && t.date) {
      return sum + (t.exitDate.getTime() - t.date.getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0) / closedTrades.length;

  return {
    totalPnl: Number(totalPnl.toFixed(2)),
    winRate: Number(winRate.toFixed(1)),
    totalTrades: closedTrades.length,
    totalVolume: Number(totalVolume.toFixed(2)),
    totalFees: Number(totalFees.toFixed(2)),
    avgTradeDuration: Number(avgTradeDuration.toFixed(1)),
  };
};

// Get cumulative P&L data for chart
export const getCumulativePnLData = (trades: Trade[]) => {
  const sortedTrades = [...trades]
    .filter(t => t.status === 'Closed')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let cumulative = 0;
  return sortedTrades.map(trade => {
    cumulative += trade.pnl;
    return {
      date: trade.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: Number(cumulative.toFixed(2)),
      fullDate: trade.date,
    };
  });
};

// Get P&L by symbol for bar chart
export const getPnLBySymbol = (trades: Trade[]) => {
  const bySymbol: Record<Symbol, number> = { SOL: 0, BTC: 0, ETH: 0 };
  
  trades
    .filter(t => t.status === 'Closed')
    .forEach(trade => {
      bySymbol[trade.symbol] += trade.pnl;
    });

  return Object.entries(bySymbol).map(([symbol, pnl]) => ({
    symbol,
    pnl: Number(pnl.toFixed(2)),
    fill: symbol === 'SOL' ? 'hsl(var(--chart-1))' : symbol === 'BTC' ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-6))',
  }));
};

// Get Long vs Short ratio for pie chart
export const getLongShortRatio = (trades: Trade[]) => {
  const closedTrades = trades.filter(t => t.status === 'Closed');
  const longTrades = closedTrades.filter(t => t.type === 'Long').length;
  const shortTrades = closedTrades.filter(t => t.type === 'Short').length;

  return [
    { name: 'Long', value: longTrades, fill: 'hsl(var(--chart-3))' },
    { name: 'Short', value: shortTrades, fill: 'hsl(var(--chart-4))' },
  ];
};

// Get drawdown data for area chart
export const getDrawdownData = (trades: Trade[]) => {
  const sortedTrades = [...trades]
    .filter(t => t.status === 'Closed')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let cumulative = 0;
  let peak = 0;
  
  return sortedTrades.map(trade => {
    cumulative += trade.pnl;
    peak = Math.max(peak, cumulative);
    const drawdown = peak > 0 ? ((peak - cumulative) / peak) * 100 : 0;
    
    return {
      date: trade.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      drawdown: Number(drawdown.toFixed(2)),
      fullDate: trade.date,
    };
  });
};

// Get monthly breakdown data
export const getMonthlyBreakdown = (trades: Trade[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last6Months: Array<{ month: string; pnl: number; trades: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[date.getMonth()];
    
    const monthTrades = trades.filter(t => {
      const tradeDate = new Date(t.date);
      return tradeDate.getMonth() === date.getMonth() && 
             tradeDate.getFullYear() === date.getFullYear();
    });

    const pnl = monthTrades.reduce((sum, t) => sum + t.pnl, 0);

    last6Months.push({
      month: monthName,
      pnl: Number(pnl.toFixed(2)),
      trades: monthTrades.length,
    });
  }

  return last6Months;
};

// Get daily heatmap data
export const getDailyHeatmapData = (trades: Trade[]) => {
  const dailyData: Array<{ date: Date; pnl: number; trades: number }> = [];
  const now = new Date();
  
  // Generate data for the last 90 days
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dayTrades = trades.filter(t => {
      const tradeDate = new Date(t.date);
      tradeDate.setHours(0, 0, 0, 0);
      return tradeDate.getTime() === date.getTime();
    });

    const pnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    dailyData.push({
      date: new Date(date),
      pnl: Number(pnl.toFixed(2)),
      trades: dayTrades.length,
    });
  }

  return dailyData;
};

// Get symbol distribution data
export const getSymbolDistribution = (trades: Trade[]) => {
  const symbols: Symbol[] = ['SOL', 'BTC', 'ETH'];
  
  return symbols.map(symbol => {
    const symbolTrades = trades.filter(t => t.symbol === symbol);
    const winningTrades = symbolTrades.filter(t => t.pnl > 0).length;
    const totalPnl = symbolTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    return {
      symbol,
      trades: symbolTrades.length,
      pnl: Number(totalPnl.toFixed(2)),
      winRate: symbolTrades.length > 0 ? (winningTrades / symbolTrades.length) * 100 : 0,
    };
  });
};

// Filter trades based on filter state
export const filterTrades = (trades: Trade[], filters: {
  symbol: string;
  dateRange: string;
  tradeType: string;
  customStartDate?: Date;
  customEndDate?: Date;
}): Trade[] => {
  let filtered = [...trades];

  if (filters.symbol !== 'ALL') {
    filtered = filtered.filter(t => t.symbol === filters.symbol);
  }

  const now = new Date();
  let startDate: Date;
  
  switch (filters.dateRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'custom':
      if (filters.customStartDate) {
        startDate = filters.customStartDate;
      } else {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      break;
    default:
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }

  filtered = filtered.filter(t => t.date >= startDate);

  if (filters.dateRange === 'custom' && filters.customEndDate) {
    filtered = filtered.filter(t => t.date <= filters.customEndDate!);
  }

  if (filters.tradeType !== 'All') {
    filtered = filtered.filter(t => t.type === filters.tradeType);
  }

  return filtered;
};
