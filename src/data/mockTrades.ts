import { Trade, Symbol, OrderType, RiskMetrics } from '@/types/trading';

// Generate realistic crypto prices
const generatePrice = (symbol: Symbol, basePrice: number, variance: number): number => {
  if (symbol === 'BONK') {
    return Number((basePrice + (Math.random() - 0.5) * variance).toFixed(8));
  }
  return Number((basePrice + (Math.random() - 0.5) * variance).toFixed(symbol === 'BTC' ? 2 : 4));
};

// Generate a random date within the last n days with realistic time distribution
const randomDate = (daysAgo: number): Date => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  
  // Weight towards trading hours (more trades during NY/London overlap: 13:00-17:00 UTC)
  const hour = Math.random();
  let targetHour: number;
  if (hour < 0.4) {
    // 40% during NY/London overlap (13:00-17:00 UTC)
    targetHour = 13 + Math.floor(Math.random() * 4);
  } else if (hour < 0.7) {
    // 30% during London session (8:00-12:00 UTC)
    targetHour = 8 + Math.floor(Math.random() * 4);
  } else if (hour < 0.9) {
    // 20% during NY session (17:00-21:00 UTC)
    targetHour = 17 + Math.floor(Math.random() * 4);
  } else {
    // 10% during Asian session (0:00-7:00 UTC)
    targetHour = Math.floor(Math.random() * 7);
  }
  
  pastDate.setHours(targetHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return pastDate;
};

// Base prices for realistic data
const basePrices: Record<Symbol, { base: number; variance: number; feeRate: number }> = {
  SOL: { base: 150, variance: 50, feeRate: 0.001 },
  BTC: { base: 65000, variance: 15000, feeRate: 0.0008 },
  ETH: { base: 3500, variance: 800, feeRate: 0.0009 },
  BONK: { base: 0.00002, variance: 0.00001, feeRate: 0.0015 },
};

// Generate 200+ sample trades
const generateTrades = (): Trade[] => {
  const trades: Trade[] = [];
  const symbols: Symbol[] = ['SOL', 'BTC', 'ETH', 'BONK'];
  const types: ('Long' | 'Short')[] = ['Long', 'Short'];
  const orderTypes: OrderType[] = ['Market', 'Limit', 'Stop'];

  // Symbol distribution weights
  const symbolWeights = { SOL: 0.35, BTC: 0.25, ETH: 0.25, BONK: 0.15 };
  
  for (let i = 0; i < 220; i++) {
    // Weighted symbol selection
    const rand = Math.random();
    let symbol: Symbol;
    if (rand < symbolWeights.SOL) {
      symbol = 'SOL';
    } else if (rand < symbolWeights.SOL + symbolWeights.BTC) {
      symbol = 'BTC';
    } else if (rand < symbolWeights.SOL + symbolWeights.BTC + symbolWeights.ETH) {
      symbol = 'ETH';
    } else {
      symbol = 'BONK';
    }
    
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Order type distribution: 50% Market, 35% Limit, 15% Stop
    const orderRand = Math.random();
    const orderType: OrderType = orderRand < 0.5 ? 'Market' : orderRand < 0.85 ? 'Limit' : 'Stop';
    
    const { base, variance, feeRate } = basePrices[symbol];
    
    const entryPrice = generatePrice(symbol, base, variance);
    
    // Different volatility patterns per symbol
    let priceChangeMultiplier: number;
    if (symbol === 'BONK') {
      priceChangeMultiplier = 0.25; // Very high volatility
    } else if (symbol === 'SOL') {
      priceChangeMultiplier = 0.15; // High volatility
    } else if (symbol === 'ETH') {
      priceChangeMultiplier = 0.1; // Medium volatility
    } else {
      priceChangeMultiplier = 0.08; // Lower volatility for BTC
    }
    
    // Slight positive bias for wins (55% win rate target)
    const priceChange = (Math.random() - 0.45) * (variance * priceChangeMultiplier);
    const exitPrice = generatePrice(symbol, entryPrice + priceChange, variance * 0.02);
    
    // Quantity based on symbol
    let quantity: number;
    if (symbol === 'BTC') {
      quantity = Number((Math.random() * 0.5 + 0.1).toFixed(4));
    } else if (symbol === 'ETH') {
      quantity = Number((Math.random() * 3 + 0.5).toFixed(3));
    } else if (symbol === 'BONK') {
      quantity = Number((Math.random() * 50000000 + 10000000).toFixed(0));
    } else {
      quantity = Number((Math.random() * 50 + 10).toFixed(2));
    }

    let pnl: number;
    if (type === 'Long') {
      pnl = (exitPrice - entryPrice) * quantity;
    } else {
      pnl = (entryPrice - exitPrice) * quantity;
    }
    pnl = Number(pnl.toFixed(2));

    const volume = entryPrice * quantity;
    const fees = Number((volume * feeRate).toFixed(2));

    const entryDate = randomDate(90);
    // Trade duration: 30 min to 72 hours, weighted towards shorter durations
    const tradeDuration = Math.pow(Math.random(), 2) * 72 + 0.5;
    const exitDate = new Date(entryDate.getTime() + tradeDuration * 60 * 60 * 1000);

    trades.push({
      id: `trade-${i + 1}`,
      symbol,
      type,
      orderType,
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
    { symbol: 'BONK' as Symbol, quantity: 100000000, avgEntryPrice: 0.000018, currentPrice: 0.000022, unrealizedPnl: 400.00 },
  ],
};

// Calculate metrics from trades
export const calculateMetrics = (trades: Trade[]) => {
  const closedTrades = trades.filter(t => t.status === 'Closed');
  
  const totalPnl = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalVolume = closedTrades.reduce((sum, t) => sum + (t.entryPrice * t.quantity), 0);
  const totalPnlPercent = totalVolume > 0 ? (totalPnl / totalVolume) * 100 : 0;
  
  const winningTrades = closedTrades.filter(t => t.pnl > 0);
  const losingTrades = closedTrades.filter(t => t.pnl < 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  const totalFees = closedTrades.reduce((sum, t) => sum + t.fees, 0);
  
  const avgTradeDuration = closedTrades.reduce((sum, t) => {
    if (t.exitDate && t.date) {
      return sum + (t.exitDate.getTime() - t.date.getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0) / (closedTrades.length || 1);

  // Largest gain and loss
  const largestGain = winningTrades.length > 0 
    ? Math.max(...winningTrades.map(t => t.pnl)) 
    : 0;
  const largestLoss = losingTrades.length > 0 
    ? Math.min(...losingTrades.map(t => t.pnl)) 
    : 0;

  // Average win and loss
  const avgWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
    : 0;
  const avgLoss = losingTrades.length > 0 
    ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length 
    : 0;

  return {
    totalPnl: Number(totalPnl.toFixed(2)),
    totalPnlPercent: Number(totalPnlPercent.toFixed(2)),
    winRate: Number(winRate.toFixed(1)),
    totalTrades: closedTrades.length,
    totalVolume: Number(totalVolume.toFixed(2)),
    totalFees: Number(totalFees.toFixed(2)),
    avgTradeDuration: Number(avgTradeDuration.toFixed(1)),
    largestGain: Number(largestGain.toFixed(2)),
    largestLoss: Number(largestLoss.toFixed(2)),
    avgWin: Number(avgWin.toFixed(2)),
    avgLoss: Number(avgLoss.toFixed(2)),
  };
};

// Calculate risk metrics
export const calculateRiskMetrics = (trades: Trade[]): RiskMetrics => {
  const closedTrades = [...trades]
    .filter(t => t.status === 'Closed')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (closedTrades.length === 0) {
    return {
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      sharpeRatio: 0,
      profitFactor: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      currentStreak: 0,
      currentStreakType: 'none',
    };
  }

  // Calculate max drawdown
  let cumulative = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;

  closedTrades.forEach(trade => {
    cumulative += trade.pnl;
    if (cumulative > peak) {
      peak = cumulative;
    }
    const drawdown = peak - cumulative;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = peak > 0 ? (drawdown / peak) * 100 : 0;
    }
  });

  // Calculate Sharpe Ratio (simplified: avg return / std deviation)
  const returns = closedTrades.map(t => t.pnl);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized

  // Calculate Profit Factor
  const grossProfit = closedTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(closedTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  // Calculate consecutive wins/losses
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentConsecutiveWins = 0;
  let currentConsecutiveLosses = 0;

  closedTrades.forEach(trade => {
    if (trade.pnl > 0) {
      currentConsecutiveWins++;
      currentConsecutiveLosses = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, currentConsecutiveWins);
    } else if (trade.pnl < 0) {
      currentConsecutiveLosses++;
      currentConsecutiveWins = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentConsecutiveLosses);
    }
  });

  // Current streak (from most recent trades)
  const reversedTrades = [...closedTrades].reverse();
  let currentStreak = 0;
  let currentStreakType: 'win' | 'loss' | 'none' = 'none';

  for (const trade of reversedTrades) {
    if (trade.pnl > 0) {
      if (currentStreakType === 'none' || currentStreakType === 'win') {
        currentStreak++;
        currentStreakType = 'win';
      } else {
        break;
      }
    } else if (trade.pnl < 0) {
      if (currentStreakType === 'none' || currentStreakType === 'loss') {
        currentStreak++;
        currentStreakType = 'loss';
      } else {
        break;
      }
    }
  }

  return {
    maxDrawdown: Number(maxDrawdown.toFixed(2)),
    maxDrawdownPercent: Number(maxDrawdownPercent.toFixed(2)),
    sharpeRatio: Number(sharpeRatio.toFixed(2)),
    profitFactor: profitFactor === Infinity ? 999 : Number(profitFactor.toFixed(2)),
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
    currentStreak,
    currentStreakType,
  };
};

// Get cumulative P&L data for chart
export const getCumulativePnLData = (trades: Trade[]) => {
  const sortedTrades = [...trades]
    .filter(t => t.status === 'Closed')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let cumulative = 0;
  let peak = 0;
  
  return sortedTrades.map(trade => {
    cumulative += trade.pnl;
    peak = Math.max(peak, cumulative);
    const drawdown = peak - cumulative;
    
    return {
      date: trade.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: Number(cumulative.toFixed(2)),
      peak: Number(peak.toFixed(2)),
      drawdown: Number(drawdown.toFixed(2)),
      fullDate: trade.date,
    };
  });
};

// Get daily P&L data for bar chart
export const getDailyPnLData = (trades: Trade[]) => {
  const dailyMap = new Map<string, { pnl: number; date: Date }>();
  
  trades
    .filter(t => t.status === 'Closed')
    .forEach(trade => {
      const dateKey = trade.date.toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey);
      if (existing) {
        existing.pnl += trade.pnl;
      } else {
        dailyMap.set(dateKey, { pnl: trade.pnl, date: trade.date });
      }
    });

  return Array.from(dailyMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([dateKey, data]) => ({
      date: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: Number(data.pnl.toFixed(2)),
      fullDate: data.date,
    }));
};

// Get P&L distribution histogram data
export const getPnLDistribution = (trades: Trade[]) => {
  const pnls = trades.filter(t => t.status === 'Closed').map(t => t.pnl);
  if (pnls.length === 0) return [];

  const min = Math.min(...pnls);
  const max = Math.max(...pnls);
  const range = max - min;
  const binCount = 10;
  const binSize = range / binCount;

  const bins: Array<{ range: string; count: number; isProfit: boolean }> = [];
  
  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    const count = pnls.filter(p => p >= binStart && (i === binCount - 1 ? p <= binEnd : p < binEnd)).length;
    
    bins.push({
      range: `${binStart.toFixed(0)} - ${binEnd.toFixed(0)}`,
      count,
      isProfit: (binStart + binEnd) / 2 >= 0,
    });
  }

  return bins;
};

// Get P&L by symbol for bar chart
export const getPnLBySymbol = (trades: Trade[]) => {
  const bySymbol: Record<Symbol, number> = { SOL: 0, BTC: 0, ETH: 0, BONK: 0 };
  
  trades
    .filter(t => t.status === 'Closed')
    .forEach(trade => {
      bySymbol[trade.symbol] += trade.pnl;
    });

  return Object.entries(bySymbol).map(([symbol, pnl]) => ({
    symbol,
    pnl: Number(pnl.toFixed(2)),
    fill: symbol === 'SOL' ? 'hsl(var(--chart-1))' : 
          symbol === 'BTC' ? 'hsl(var(--chart-5))' : 
          symbol === 'ETH' ? 'hsl(var(--chart-6))' : 'hsl(var(--chart-2))',
  }));
};

// Get win rate by symbol
export const getWinRateBySymbol = (trades: Trade[]) => {
  const symbols: Symbol[] = ['SOL', 'BTC', 'ETH', 'BONK'];
  
  return symbols.map(symbol => {
    const symbolTrades = trades.filter(t => t.symbol === symbol && t.status === 'Closed');
    const wins = symbolTrades.filter(t => t.pnl > 0).length;
    const winRate = symbolTrades.length > 0 ? (wins / symbolTrades.length) * 100 : 0;
    
    return {
      symbol,
      winRate: Number(winRate.toFixed(1)),
      trades: symbolTrades.length,
    };
  });
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
      runningMax: Number(peak.toFixed(2)),
      cumulative: Number(cumulative.toFixed(2)),
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
  const symbols: Symbol[] = ['SOL', 'BTC', 'ETH', 'BONK'];
  
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

// Get time-based analysis data
export const getTimeAnalysisData = (trades: Trade[]) => {
  // Hourly analysis (24 hours)
  const hourlyData: Array<{ hour: number; pnl: number; trades: number; winRate: number }> = [];
  for (let h = 0; h < 24; h++) {
    const hourTrades = trades.filter(t => t.date.getHours() === h);
    const wins = hourTrades.filter(t => t.pnl > 0).length;
    const pnl = hourTrades.reduce((sum, t) => sum + t.pnl, 0);
    hourlyData.push({
      hour: h,
      pnl: Number(pnl.toFixed(2)),
      trades: hourTrades.length,
      winRate: hourTrades.length > 0 ? (wins / hourTrades.length) * 100 : 0,
    });
  }

  // Daily analysis (7 days)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData: Array<{ day: string; pnl: number; trades: number; winRate: number }> = [];
  for (let d = 0; d < 7; d++) {
    const dayTrades = trades.filter(t => t.date.getDay() === d);
    const wins = dayTrades.filter(t => t.pnl > 0).length;
    const pnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    dailyData.push({
      day: dayNames[d],
      pnl: Number(pnl.toFixed(2)),
      trades: dayTrades.length,
      winRate: dayTrades.length > 0 ? (wins / dayTrades.length) * 100 : 0,
    });
  }

  return { hourlyData, dailyData };
};

// Get session-based performance
export const getSessionPerformance = (trades: Trade[]) => {
  const sessions = [
    { name: 'Asian', start: 0, end: 7 },
    { name: 'London', start: 8, end: 12 },
    { name: 'NY/London', start: 13, end: 16 },
    { name: 'New York', start: 17, end: 21 },
    { name: 'Off-hours', start: 22, end: 23 },
  ];

  return sessions.map(session => {
    const sessionTrades = trades.filter(t => {
      const hour = t.date.getHours();
      if (session.name === 'Off-hours') {
        return hour >= 22 || hour <= 23;
      }
      return hour >= session.start && hour <= session.end;
    });

    const wins = sessionTrades.filter(t => t.pnl > 0).length;
    const pnl = sessionTrades.reduce((sum, t) => sum + t.pnl, 0);

    return {
      session: session.name,
      pnl: Number(pnl.toFixed(2)),
      trades: sessionTrades.length,
      winRate: sessionTrades.length > 0 ? Number(((wins / sessionTrades.length) * 100).toFixed(1)) : 0,
    };
  });
};

// Get fee analysis data
export const getFeeAnalysis = (trades: Trade[]) => {
  const closedTrades = trades.filter(t => t.status === 'Closed');
  
  // Fees by symbol
  const feesBySymbol = (['SOL', 'BTC', 'ETH', 'BONK'] as Symbol[]).map(symbol => {
    const symbolTrades = closedTrades.filter(t => t.symbol === symbol);
    const totalFees = symbolTrades.reduce((sum, t) => sum + t.fees, 0);
    return {
      symbol,
      fees: Number(totalFees.toFixed(2)),
    };
  });

  // Fee composition by symbol (maker/taker/withdrawal)
  const feeComposition = (['SOL', 'BTC', 'ETH', 'BONK'] as Symbol[]).map(symbol => {
    const symbolTrades = closedTrades.filter(t => t.symbol === symbol);
    const totalFees = symbolTrades.reduce((sum, t) => sum + t.fees, 0);
    // Simulate fee breakdown: ~60% taker, ~35% maker, ~5% withdrawal
    const takerFees = Number((totalFees * 0.60).toFixed(2));
    const makerFees = Number((totalFees * 0.35).toFixed(2));
    const withdrawalFees = Number((totalFees * 0.05).toFixed(2));
    return {
      symbol,
      makerFees,
      takerFees,
      withdrawalFees,
      totalFees: Number(totalFees.toFixed(2)),
    };
  });

  // Cumulative fees over time
  const sortedTrades = [...closedTrades].sort((a, b) => a.date.getTime() - b.date.getTime());
  let cumulativeFees = 0;
  const cumulativeFeeData = sortedTrades.map(trade => {
    cumulativeFees += trade.fees;
    return {
      date: trade.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fees: Number(cumulativeFees.toFixed(2)),
      fullDate: trade.date,
    };
  });

  return { feesBySymbol, feeComposition, cumulativeFeeData };
};

// Get hour-by-day heatmap data
export const getHourDayHeatmapData = (trades: Trade[]) => {
  const data: Array<{ hour: number; day: number; pnl: number; trades: number }> = [];
  
  // Initialize all hour-day combinations
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({ hour, day, pnl: 0, trades: 0 });
    }
  }
  
  // Aggregate trades by hour and day
  trades.filter(t => t.status === 'Closed').forEach(trade => {
    const hour = trade.date.getHours();
    const day = trade.date.getDay();
    const index = day * 24 + hour;
    data[index].pnl += trade.pnl;
    data[index].trades += 1;
  });
  
  // Round pnl values
  data.forEach(item => {
    item.pnl = Number(item.pnl.toFixed(2));
  });
  
  return data;
};

// Get performance by order type
export const getOrderTypePerformance = (trades: Trade[]) => {
  const orderTypes: OrderType[] = ['Market', 'Limit', 'Stop'];
  
  return orderTypes.map(orderType => {
    const orderTrades = trades.filter(t => t.orderType === orderType && t.status === 'Closed');
    const wins = orderTrades.filter(t => t.pnl > 0).length;
    const pnl = orderTrades.reduce((sum, t) => sum + t.pnl, 0);
    const avgPnl = orderTrades.length > 0 ? pnl / orderTrades.length : 0;

    return {
      orderType,
      trades: orderTrades.length,
      pnl: Number(pnl.toFixed(2)),
      avgPnl: Number(avgPnl.toFixed(2)),
      winRate: orderTrades.length > 0 ? Number(((wins / orderTrades.length) * 100).toFixed(1)) : 0,
    };
  });
};

// Filter trades based on filter state
export const filterTrades = (trades: Trade[], filters: {
  symbol: string;
  dateRange: string;
  tradeType: string;
  orderType?: string;
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

  if (filters.orderType && filters.orderType !== 'All') {
    filtered = filtered.filter(t => t.orderType === filters.orderType);
  }

  return filtered;
};
