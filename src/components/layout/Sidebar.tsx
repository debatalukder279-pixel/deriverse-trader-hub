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
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border/50 transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center transition-transform duration-200 hover:scale-105">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-background">
            <path d="M4 8L8 4M8 4L12 8M8 4V20M12 16L16 20M16 20L20 16M16 20V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <span className="font-bold text-foreground text-lg tracking-tight">Deriverse</span>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {!collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center gap-2 mx-6 mb-6 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Minimize</span>
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground text-sm transition-all duration-200 animate-fade-in",
                isActive && "bg-foreground text-background font-medium shadow-sm",
                !isActive && "hover:bg-muted/80 hover:text-foreground",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className="pt-6">
          {supportItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground text-sm transition-all duration-200",
                  isActive && "bg-foreground text-background font-medium shadow-sm",
                  !isActive && "hover:bg-muted/80 hover:text-foreground",
                  collapsed && "justify-center px-3"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className={cn("px-4 pb-6 mt-auto", collapsed && "flex justify-center")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-200",
                collapsed && "justify-center px-2"
              )}
            >
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback className="bg-muted text-foreground text-sm">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground truncate">{mockUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
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
