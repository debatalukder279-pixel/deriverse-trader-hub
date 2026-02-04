import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
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
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border/40">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                {greeting ? (
                  <>
                    <h1 className="text-2xl font-bold text-foreground">
                      Welcome Back, {mockUser.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-muted rounded-xl w-64">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Anything"
                  className="bg-transparent border-none shadow-none h-auto p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>

              {/* Icons */}
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-muted">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Button>

              <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-xl hover:bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              </Button>

              {/* User */}
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-foreground">{mockUser.name}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
