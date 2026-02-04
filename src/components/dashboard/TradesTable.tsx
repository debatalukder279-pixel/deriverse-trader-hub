import { useState } from "react";
import { Trade } from "@/types/trading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { MessageSquarePlus, Download, ChevronLeft, ChevronRight, Filter, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TradesTableProps {
  trades: Trade[];
  onAddNote: (tradeId: string, note: string) => void;
}

const ITEMS_PER_PAGE = 8;

export function TradesTable({ trades, onAddNote }: TradesTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [noteText, setNoteText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(trades.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTrades = trades.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'BTC') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatPnL = (pnl: number) => {
    return `$${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleSaveNote = () => {
    if (selectedTrade && noteText.trim()) {
      onAddNote(selectedTrade.id, noteText);
      setNoteText("");
      setSelectedTrade(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Type', 'Entry', 'Exit', 'Quantity', 'P&L', 'Fees', 'Status'];
    const rows = trades.map(trade => [
      format(trade.date, 'yyyy-MM-dd HH:mm'),
      trade.symbol,
      trade.type,
      trade.entryPrice,
      trade.exitPrice || '',
      trade.quantity,
      trade.pnl,
      trade.fees,
      trade.status,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deriverse-trades-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const symbolColors: Record<string, string> = {
    SOL: 'bg-purple-100 text-purple-600',
    BTC: 'bg-orange-100 text-orange-600',
    ETH: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <h3 className="section-title">Recent Trades</h3>
          <p className="section-subtitle">{trades.length} total trades</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm" className="rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="menu-dots">
            <MoreHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="trade-table">
          <thead>
            <tr className="border-b border-border/40">
              <th>No</th>
              <th>ID</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Entry / Exit</th>
              <th>Date</th>
              <th>Status</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.map((trade, index) => (
              <tr key={trade.id} className="animate-fade-in">
                <td className="text-muted-foreground font-medium">
                  {startIndex + index + 1}
                </td>
                <td className="text-muted-foreground">
                  #{trade.id.split('-')[1]?.padStart(6, '0') || trade.id}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar className={cn("h-8 w-8", symbolColors[trade.symbol])}>
                      <AvatarFallback className="text-xs font-semibold bg-transparent">
                        {trade.symbol.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{trade.symbol}</span>
                  </div>
                </td>
                <td>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-3",
                      trade.type === 'Long' ? 'badge-long' : 'badge-short'
                    )}
                  >
                    {trade.type}
                  </Badge>
                </td>
                <td className="tabular-nums text-muted-foreground">
                  {formatPrice(trade.entryPrice, trade.symbol)} → {trade.exitPrice ? formatPrice(trade.exitPrice, trade.symbol) : '-'}
                </td>
                <td className="text-muted-foreground">
                  {format(trade.date, 'dd/MM/yyyy')}
                  <span className="ml-2 text-xs">{format(trade.date, 'HH:mm')}</span>
                </td>
                <td>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "rounded-full px-3",
                      trade.pnl >= 0 ? 'badge-paid' : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {trade.pnl >= 0 ? 'Profit' : 'Loss'}
                  </Badge>
                </td>
                <td className={cn("tabular-nums font-semibold", trade.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                  {trade.pnl >= 0 ? '+' : '-'}{formatPnL(trade.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, trades.length)} of {trades.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="rounded-xl w-9"
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
