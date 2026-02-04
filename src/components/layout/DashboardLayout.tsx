import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser } from "@/data/mockTrades";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  greeting?: boolean;
}

export function DashboardLayout({ children, title, subtitle, greeting }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main
        className={cn(
          "transition-all duration-300 ease-out min-h-screen",
          sidebarCollapsed ? "ml-[80px]" : "ml-[260px]"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="animate-fade-in">
              {greeting ? (
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Earnings
                </h1>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
                  {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-card rounded-2xl w-72 transition-all duration-200 focus-within:shadow-md">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none shadow-none h-auto p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>

              {/* Notification */}
              <button className="relative w-11 h-11 rounded-2xl bg-card flex items-center justify-center transition-all duration-200 hover:shadow-md">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full" />
              </button>

              {/* User Avatar */}
              <Avatar className="h-11 w-11 ring-2 ring-border transition-all duration-200 hover:ring-primary/30 cursor-pointer">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback className="bg-muted text-foreground font-medium text-sm">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-8 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
