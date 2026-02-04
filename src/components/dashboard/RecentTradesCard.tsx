import { Trade } from "@/types/trading";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RecentTradesCardProps {
  trades: Trade[];
}

const symbolColors: Record<string, string> = {
  SOL: "bg-gradient-to-br from-violet-500 to-purple-600",
  BTC: "bg-gradient-to-br from-orange-400 to-amber-500",
  ETH: "bg-gradient-to-br from-blue-400 to-indigo-500",
  BONK: "bg-gradient-to-br from-yellow-400 to-orange-400",
};

export function RecentTradesCard({ trades }: RecentTradesCardProps) {
  const recentTrades = trades.slice(0, 5);

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Trades</h3>
          <p className="text-xs text-muted-foreground">Latest activity</p>
        </div>
      </div>

      <div className="space-y-3">
        {recentTrades.map((trade) => (
          <div key={trade.id} className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold", symbolColors[trade.symbol] || "bg-muted")}>
              {trade.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{trade.symbol}</p>
              <p className="text-xs text-muted-foreground">{format(trade.date, "MMM d, HH:mm")}</p>
            </div>
            <div className="text-right">
              <p className={cn("text-sm font-semibold tabular-nums", trade.pnl >= 0 ? "text-success" : "text-destructive")}>
                {trade.pnl >= 0 ? "+" : ""}{trade.pnl.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
        Show more
      </button>
    </div>
  );
}
