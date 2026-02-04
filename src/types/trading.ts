export type TradeType = 'Long' | 'Short';
export type TradeStatus = 'Closed' | 'Open';
export type Symbol = 'SOL' | 'BTC' | 'ETH' | 'BONK';
export type OrderType = 'Market' | 'Limit' | 'Stop';

export interface Trade {
  id: string;
  symbol: Symbol;
  type: TradeType;
  orderType: OrderType;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  pnl: number;
  fees: number;
  date: Date;
  exitDate: Date | null;
  notes: string;
  status: TradeStatus;
}

export interface User {
  id: string;
  email: string;
  name: string;
  joinDate: Date;
  avatar?: string;
}

export interface Portfolio {
  userId: string;
  totalValue: number;
  cashBalance: number;
  positions: Position[];
}

export interface Position {
  symbol: Symbol;
  quantity: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
}

export interface FilterState {
  symbol: Symbol | 'ALL';
  dateRange: '7d' | '30d' | '90d' | 'custom';
  customStartDate?: Date;
  customEndDate?: Date;
  tradeType: TradeType | 'All';
  orderType: OrderType | 'All';
}

export interface DashboardMetrics {
  totalPnl: number;
  totalPnlPercent: number;
  winRate: number;
  totalTrades: number;
  totalVolume: number;
  totalFees: number;
  avgTradeDuration: number;
  largestGain: number;
  largestLoss: number;
  avgWin: number;
  avgLoss: number;
}

export interface RiskMetrics {
  maxDrawdown: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  profitFactor: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  currentStreak: number;
  currentStreakType: 'win' | 'loss' | 'none';
}
