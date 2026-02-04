import { TrendingUp } from "lucide-react";

interface HeroBalanceCardProps {
  totalPnl: number;
  pnlPercent: number;
  winRate: number;
}

export function HeroBalanceCard({ totalPnl, pnlPercent, winRate }: HeroBalanceCardProps) {
  const isPositive = totalPnl >= 0;
  
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 p-6 text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 opacity-10">
        <svg width="200" height="120" viewBox="0 0 200 120">
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              d={`M${160 + i * 8} 20 Q${170 + i * 8} 60 ${160 + i * 8} 100`}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="relative flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="opacity-20"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${winRate * 2.64} 264`}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--success))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs opacity-70">~</span>
            <span className="text-lg font-bold">{winRate}%</span>
          </div>
        </div>

        {/* Balance Info */}
        <div className="flex-1">
          <p className="text-sm opacity-70 mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold tracking-tight tabular-nums">
            {isPositive ? '+' : '-'}${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              <TrendingUp className="w-3 h-3" />
              {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
            </span>
            <span className="text-xs opacity-50">from trading</span>
          </div>
        </div>
      </div>
    </div>
  );
}
