import { useState, useMemo } from "react";
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
import { MessageSquarePlus, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TradesTableProps {
  trades: Trade[];
  onAddNote: (tradeId: string, note: string) => void;
}

const ITEMS_PER_PAGE = 20;

type SortField = 'date' | 'symbol' | 'type' | 'orderType' | 'pnl' | 'fees' | 'quantity';
type SortDirection = 'asc' | 'desc';

export function TradesTable({ trades, onAddNote }: TradesTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [noteText, setNoteText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedTrades = useMemo(() => {
    return [...trades].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'orderType':
          comparison = a.orderType.localeCompare(b.orderType);
          break;
        case 'pnl':
          comparison = a.pnl - b.pnl;
          break;
        case 'fees':
          comparison = a.fees - b.fees;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [trades, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedTrades.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTrades = sortedTrades.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1" /> 
      : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'BTC') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (symbol === 'BONK') {
      return `$${price.toFixed(8)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatPnL = (pnl: number) => {
    return `$${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDuration = (trade: Trade) => {
    if (!trade.exitDate || !trade.date) return '-';
    const hours = (trade.exitDate.getTime() - trade.date.getTime()) / (1000 * 60 * 60);
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
  };

  const handleSaveNote = () => {
    if (selectedTrade && noteText.trim()) {
      onAddNote(selectedTrade.id, noteText);
      setNoteText("");
      setSelectedTrade(null);
    }
  };

  const symbolColors: Record<string, string> = {
    SOL: 'bg-purple-100 text-purple-600',
    BTC: 'bg-orange-100 text-orange-600',
    ETH: 'bg-blue-100 text-blue-600',
    BONK: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Trade History</h3>
          <p className="text-xs text-muted-foreground">{trades.length} total trades</p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="trade-table">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-[10px]">No</th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('date')} className="flex items-center hover:text-foreground transition-colors">
                  Date <SortIcon field="date" />
                </button>
              </th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('symbol')} className="flex items-center hover:text-foreground transition-colors">
                  Symbol <SortIcon field="symbol" />
                </button>
              </th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('type')} className="flex items-center hover:text-foreground transition-colors">
                  Type <SortIcon field="type" />
                </button>
              </th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('orderType')} className="flex items-center hover:text-foreground transition-colors">
                  Order <SortIcon field="orderType" />
                </button>
              </th>
              <th className="text-[10px]">Entry / Exit</th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('quantity')} className="flex items-center hover:text-foreground transition-colors">
                  Size <SortIcon field="quantity" />
                </button>
              </th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('pnl')} className="flex items-center hover:text-foreground transition-colors">
                  P&L <SortIcon field="pnl" />
                </button>
              </th>
              <th className="text-[10px]">P&L %</th>
              <th className="text-[10px]">
                <button onClick={() => handleSort('fees')} className="flex items-center hover:text-foreground transition-colors">
                  Fees <SortIcon field="fees" />
                </button>
              </th>
              <th className="text-[10px]">Duration</th>
              <th className="text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.map((trade, index) => {
              const pnlPercent = trade.entryPrice && trade.quantity 
                ? (trade.pnl / (trade.entryPrice * trade.quantity)) * 100 
                : 0;
              
              return (
                <tr key={trade.id} className="animate-fade-in hover:bg-muted/30 cursor-pointer">
                  <td className="text-muted-foreground font-medium text-xs py-3 px-3">
                    {startIndex + index + 1}
                  </td>
                  <td className="text-muted-foreground text-xs py-3 px-3">
                    <div>
                      {format(trade.date, 'dd/MM/yyyy')}
                      <span className="ml-1.5 text-[10px]">{format(trade.date, 'HH:mm')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar className={cn("h-6 w-6", symbolColors[trade.symbol])}>
                        <AvatarFallback className="text-[10px] font-semibold bg-transparent">
                          {trade.symbol.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground text-xs">{trade.symbol}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-1.5 text-[10px]",
                        trade.type === 'Long' ? 'badge-long' : 'badge-short'
                      )}
                    >
                      {trade.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="secondary" className="rounded-full px-1.5 text-[10px]">
                      {trade.orderType}
                    </Badge>
                  </td>
                  <td className="tabular-nums text-muted-foreground text-[10px] py-3 px-3">
                    {formatPrice(trade.entryPrice, trade.symbol)} → {trade.exitPrice ? formatPrice(trade.exitPrice, trade.symbol) : '-'}
                  </td>
                  <td className="tabular-nums text-muted-foreground text-xs py-3 px-3">
                    {trade.symbol === 'BONK' ? trade.quantity.toLocaleString() : trade.quantity}
                  </td>
                  <td className={cn("tabular-nums font-semibold text-xs py-3 px-3", trade.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                    {trade.pnl >= 0 ? '+' : '-'}{formatPnL(trade.pnl)}
                  </td>
                  <td className={cn("tabular-nums text-[10px] py-3 px-3", trade.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                    {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                  </td>
                  <td className="tabular-nums text-muted-foreground text-[10px] py-3 px-3">
                    ${trade.fees.toFixed(2)}
                  </td>
                  <td className="text-muted-foreground text-[10px] py-3 px-3">
                    {formatDuration(trade)}
                  </td>
                  <td className="py-3 px-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setSelectedTrade(trade);
                            setNoteText(trade.notes || "");
                          }}
                        >
                          <MessageSquarePlus className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Note - {trade.symbol} {trade.type}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-sm text-muted-foreground">
                            <p>Entry: {formatPrice(trade.entryPrice, trade.symbol)} | Exit: {trade.exitPrice ? formatPrice(trade.exitPrice, trade.symbol) : '-'}</p>
                            <p>P&L: <span className={trade.pnl >= 0 ? 'text-success' : 'text-destructive'}>{formatPnL(trade.pnl)}</span></p>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, trades.length)} of {trades.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg h-7 w-7 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="rounded-lg h-7 w-7 p-0 text-xs"
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
              className="rounded-lg h-7 w-7 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
