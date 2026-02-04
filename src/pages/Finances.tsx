import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const Finances = () => {
  return (
    <DashboardLayout title="Finances" subtitle="Track your trading finances and P&L">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
                <p className="text-2xl font-bold text-foreground">$24,563.00</p>
                <p className="text-xs text-success mt-2">+12.5% from last month</p>
              </div>
              <div className="metric-icon-box metric-icon-box-blue">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Deposits</p>
                <p className="text-2xl font-bold text-foreground">$15,000.00</p>
                <p className="text-xs text-muted-foreground mt-2">3 deposits this month</p>
              </div>
              <div className="metric-icon-box metric-icon-box-green">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Withdrawals</p>
                <p className="text-2xl font-bold text-foreground">$3,200.00</p>
                <p className="text-xs text-muted-foreground mt-2">1 withdrawal this month</p>
              </div>
              <div className="metric-icon-box metric-icon-box-orange">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Net P&L</p>
                <p className="text-2xl font-bold text-success">+$12,763.00</p>
                <p className="text-xs text-success mt-2">85% profit rate</p>
              </div>
              <div className="metric-icon-box metric-icon-box-purple">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <Card className="dashboard-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Deposit", amount: "+$5,000.00", date: "Jan 15, 2024", status: "Completed" },
                { type: "Withdrawal", amount: "-$1,200.00", date: "Jan 10, 2024", status: "Completed" },
                { type: "Trading Profit", amount: "+$2,340.00", date: "Jan 8, 2024", status: "Credited" },
                { type: "Deposit", amount: "+$3,000.00", date: "Jan 5, 2024", status: "Completed" },
                { type: "Trading Loss", amount: "-$450.00", date: "Jan 3, 2024", status: "Debited" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.amount.startsWith("+") ? "bg-success/10" : "bg-destructive/10"
                    }`}>
                      {transaction.amount.startsWith("+") ? (
                        <TrendingUp className={`w-4 h-4 text-success`} />
                      ) : (
                        <TrendingDown className={`w-4 h-4 text-destructive`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.type}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      transaction.amount.startsWith("+") ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Finances;
