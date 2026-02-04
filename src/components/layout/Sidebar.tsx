import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Wallet,
  Bell as BellIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: TrendingUp, label: "Statistics", path: "/analytics" },
  { icon: Wallet, label: "Finances", path: "/finances" },
];

const supportItems = [
  { icon: HelpCircle, label: "Help & Center", path: "/help" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-6">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-white text-lg tracking-tight">DERIVERSE</span>
              <p className="text-[11px] text-sidebar-muted">Trading Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      {!collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-5 py-2 text-sidebar-foreground hover:text-white transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Minimize</span>
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <p className="text-[11px] font-semibold text-sidebar-muted uppercase tracking-wider px-4 mb-3">
            Main Menu
          </p>
        )}
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <p className="text-[11px] font-semibold text-sidebar-muted uppercase tracking-wider px-4 mb-3 mt-8">
            Help & Support
          </p>
        )}

        {supportItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="upgrade-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Upgrade Pro</p>
                <p className="text-[11px] text-white/70">Unlock all features</p>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold rounded-xl"
            >
              Upgrade $30
            </Button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className={cn(
        "px-3 pb-6",
        collapsed && "flex justify-center"
      )}>
        <button
          className={cn(
            "sidebar-item w-full text-sidebar-foreground hover:text-white",
            collapsed && "justify-center px-3"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
