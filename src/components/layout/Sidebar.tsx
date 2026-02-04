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
  FileText,
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
  { icon: FileText, label: "Finances", path: "/finances" },
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
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center transition-transform duration-200 hover:scale-105">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <span className="font-semibold text-white text-base tracking-tight">Deriverse</span>
            <p className="text-[11px] text-sidebar-foreground">Trading Dashboard</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {!collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center gap-2 mx-5 mb-4 text-sidebar-foreground hover:text-white transition-colors duration-200 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Minimize</span>
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
        )}
        
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "sidebar-item animate-fade-in",
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider px-3 mb-3 mt-8">
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
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="upgrade-card animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Upgrade Pro</p>
                <p className="text-[11px] text-white/70">Unlock all features</p>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full bg-white text-sidebar-background hover:bg-white/90 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              Upgrade $30
            </Button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className={cn("px-3 pb-6", collapsed && "flex justify-center")}>
        <button
          className={cn(
            "sidebar-item w-full",
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
