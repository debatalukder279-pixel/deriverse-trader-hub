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
          "transition-all duration-300 ease-out",
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="animate-fade-in">
              {greeting ? (
                <>
                  <p className="text-sm text-muted-foreground mb-0.5">Welcome back</p>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                    {mockUser.name.split(' ')[0]} 👋
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
                  {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 bg-card rounded-xl border border-border/50 w-64 transition-all duration-200 focus-within:border-primary/30 focus-within:shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none shadow-none h-auto p-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0"
                />
              </div>

              {/* Notification */}
              <button className="relative w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center transition-all duration-200 hover:border-border hover:shadow-sm">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </button>

              {/* User Avatar */}
              <Avatar className="h-10 w-10 ring-2 ring-border/50 transition-all duration-200 hover:ring-primary/30 cursor-pointer">
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
