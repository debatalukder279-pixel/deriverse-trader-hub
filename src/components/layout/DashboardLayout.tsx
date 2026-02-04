import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Bell, Search } from "lucide-react";
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
          "transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        )}
      >
        {/* Top Header - Simplified */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              {greeting ? (
                <>
                  <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                    {mockUser.name.split(' ')[0]} 👋
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
                  {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Search - Cleaner */}
              <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 bg-card rounded-2xl border border-border/50 w-72">
                <Search className="h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none shadow-none h-auto p-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0"
                />
              </div>

              {/* Notification */}
              <Button variant="ghost" size="icon" className="relative w-11 h-11 rounded-2xl hover:bg-card">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>

              {/* User Avatar */}
              <Avatar className="h-11 w-11 border-2 border-border/50">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback className="bg-muted text-foreground font-medium">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content - Better spacing */}
        <div className="px-8 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
