import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { mockTrades } from "@/data/mockTrades";
import { Trade, Symbol, TradeType, OrderType } from "@/types/trading";
import { Plus, Search, Calendar, Edit2, Trash2 } from "lucide-react";

const Journal = () => {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSymbol, setFilterSymbol] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const [formData, setFormData] = useState({
    symbol: "SOL" as Symbol,
    type: "Long" as TradeType,
    orderType: "Market" as OrderType,
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  const filteredTrades = useMemo(() => {
    let result = [...trades];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (trade) =>
          trade.symbol.toLowerCase().includes(query) ||
          trade.notes.toLowerCase().includes(query) ||
          trade.type.toLowerCase().includes(query)
      );
    }

    if (filterSymbol !== "ALL") {
      result = result.filter((trade) => trade.symbol === filterSymbol);
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [trades, searchQuery, filterSymbol]);

  const resetForm = () => {
    setFormData({
      symbol: "SOL",
      type: "Long",
      orderType: "Market",
      entryPrice: "",
      exitPrice: "",
      quantity: "",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    });
    setEditingTrade(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : null;
    const quantity = parseFloat(formData.quantity);

    let pnl = 0;
    if (exitPrice) {
      pnl =
        formData.type === "Long"
          ? (exitPrice - entryPrice) * quantity
          : (entryPrice - exitPrice) * quantity;
    }

    const fees = entryPrice * quantity * 0.001;

    if (editingTrade) {
      setTrades((prev) =>
        prev.map((trade) =>
          trade.id === editingTrade.id
            ? {
                ...trade,
                symbol: formData.symbol,
                type: formData.type,
                entryPrice,
                exitPrice,
                quantity,
                pnl,
                fees,
                date: new Date(formData.date),
                notes: formData.notes,
                status: exitPrice ? "Closed" : "Open",
              }
            : trade
        )
      );
    } else {
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        symbol: formData.symbol,
        type: formData.type,
        orderType: formData.orderType,
        entryPrice,
        exitPrice,
        quantity,
        pnl,
        fees,
        date: new Date(formData.date),
        exitDate: exitPrice ? new Date() : null,
        notes: formData.notes,
        status: exitPrice ? "Closed" : "Open",
      };
      setTrades((prev) => [newTrade, ...prev]);
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormData({
      symbol: trade.symbol,
      type: trade.type,
      orderType: trade.orderType,
      entryPrice: trade.entryPrice.toString(),
      exitPrice: trade.exitPrice?.toString() || "",
      quantity: trade.quantity.toString(),
      date: format(trade.date, "yyyy-MM-dd"),
      notes: trade.notes,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (tradeId: string) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== tradeId));
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === "BTC") {
      return `$${price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatPnL = (pnl: number) => {
    const formatted = `$${Math.abs(pnl).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    return pnl >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <DashboardLayout title="Trading Journal" subtitle="Record and reflect on your trades">
      <div className="space-y-6 animate-fade-in">
        {/* Header with Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSymbol} onValueChange={setFilterSymbol}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BONK">BONK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="btn-filter">
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTrade ? "Edit Trade" : "Add New Trade"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Select
                      value={formData.symbol}
                      onValueChange={(value: Symbol) =>
                        setFormData((prev) => ({ ...prev, symbol: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="BONK">BONK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: TradeType) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Long">Long</SelectItem>
                        <SelectItem value="Short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Entry Price</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      value={formData.entryPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, entryPrice: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Exit Price (optional)</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      value={formData.exitPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, exitPrice: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, date: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes / Reflections</Label>
                  <Textarea
                    placeholder="What was your strategy? What did you learn?"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTrade ? "Update Trade" : "Add Trade"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Journal Cards */}
        <div className="grid gap-4">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className={cn(
                "dashboard-card hover:shadow-card-hover transition-all duration-200",
                "border-l-4",
                trade.pnl >= 0 ? "border-l-success" : "border-l-destructive"
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Trade Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg",
                        trade.pnl >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {trade.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {trade.symbol}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            trade.type === "Long" ? "badge-long" : "badge-short"
                          )}
                        >
                          {trade.type}
                        </Badge>
                        <Badge variant="secondary">
                          {trade.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(trade.date, "MMM d, yyyy 'at' HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Details */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry</p>
                    <p className="font-medium tabular-nums">
                      {formatPrice(trade.entryPrice, trade.symbol)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exit</p>
                    <p className="font-medium tabular-nums">
                      {trade.exitPrice
                        ? formatPrice(trade.exitPrice, trade.symbol)
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium tabular-nums">{trade.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">P&L</p>
                    <p
                      className={cn(
                        "font-bold tabular-nums",
                        trade.pnl >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {formatPnL(trade.pnl)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(trade)}
                    className="h-9 w-9"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(trade.id)}
                    className="h-9 w-9 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Notes */}
              {trade.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Notes: </span>
                    {trade.notes}
                  </p>
                </div>
              )}
            </div>
          ))}

          {filteredTrades.length === 0 && (
            <div className="dashboard-card text-center py-12">
              <p className="text-muted-foreground">No trades found</p>
              <Button
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Trade
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Journal;
