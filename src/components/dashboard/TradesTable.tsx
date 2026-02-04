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
import { MessageSquarePlus, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface TradesTableProps {
  trades: Trade[];
  onAddNote: (tradeId: string, note: string) => void;
}

const ITEMS_PER_PAGE = 10;

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
    return `$${price.toFixed(4)}`;
  };

  const formatPnL = (pnl: number) => {
    const formatted = `$${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return pnl >= 0 ? `+${formatted}` : `-${formatted}`;
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

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Trade History</h3>
          <p className="text-sm text-muted-foreground">{trades.length} trades total</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="trade-table">
          <thead>
            <tr className="border-b border-border">
              <th>Date</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Qty</th>
              <th>P&L</th>
              <th>Fees</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.map((trade) => (
              <tr key={trade.id} className="animate-fade-in">
                <td className="text-muted-foreground">
                  {format(trade.date, 'MMM d, yyyy')}
                  <span className="block text-xs">{format(trade.date, 'HH:mm')}</span>
                </td>
                <td>
                  <span className="font-semibold text-foreground">{trade.symbol}</span>
                </td>
                <td>
                  <Badge
                    variant="outline"
                    className={cn(
                      trade.type === 'Long' ? 'badge-long' : 'badge-short'
                    )}
                  >
                    {trade.type}
                  </Badge>
                </td>
                <td className="tabular-nums">{formatPrice(trade.entryPrice, trade.symbol)}</td>
                <td className="tabular-nums">
                  {trade.exitPrice ? formatPrice(trade.exitPrice, trade.symbol) : '-'}
                </td>
                <td className="tabular-nums">{trade.quantity}</td>
                <td className={cn("tabular-nums font-semibold", trade.pnl >= 0 ? 'text-profit' : 'text-loss')}>
                  {formatPnL(trade.pnl)}
                </td>
                <td className="tabular-nums text-muted-foreground">${trade.fees.toFixed(2)}</td>
                <td>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {trade.status}
                  </Badge>
                </td>
                <td>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedTrade(trade);
                          setNoteText(trade.notes);
                        }}
                      >
                        <MessageSquarePlus className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Note to Trade</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-secondary rounded-lg">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold">{trade.symbol}</span>
                            <Badge variant="outline" className={trade.type === 'Long' ? 'badge-long' : 'badge-short'}>
                              {trade.type}
                            </Badge>
                            <span className={trade.pnl >= 0 ? 'text-profit' : 'text-loss'}>
                              {formatPnL(trade.pnl)}
                            </span>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Add your notes, reflections, or lessons learned..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="min-h-[120px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setSelectedTrade(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveNote}>
                            Save Note
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, trades.length)} of {trades.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
