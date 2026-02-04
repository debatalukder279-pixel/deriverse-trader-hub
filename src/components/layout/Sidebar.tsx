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
  ChevronDown,
  User,
  CreditCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockUser } from "@/data/mockTrades";

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

      {/* User Profile Section */}
      <div className={cn("px-3 pb-6 mt-auto", collapsed && "flex justify-center")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full px-3 py-3 rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-all duration-200",
                collapsed && "justify-center px-2"
              )}
            >
              <Avatar className="h-9 w-9 ring-2 ring-white/10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback className="bg-accent/20 text-white text-sm">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
                    <p className="text-[11px] text-sidebar-foreground truncate">{mockUser.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-sidebar-foreground" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
