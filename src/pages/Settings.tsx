import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser } from "@/data/mockTrades";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Camera,
  Sun,
  Moon,
  Monitor,
  Check
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Clean and bright' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Match device settings' },
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="dashboard-card p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                    activeSection === section.id
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">Profile Information</h3>
              
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-border">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback className="text-xl">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-foreground">{mockUser.name}</p>
                  <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Alex" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Thompson" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={mockUser.email} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" className="rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="rounded-xl">Save Changes</Button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Market Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of significant market movements</p>
                  </div>
                  <Switch checked={marketAlerts} onCheckedChange={setMarketAlerts} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
                
                <div className="border-t border-border pt-6">
                  <p className="font-medium text-foreground mb-2">Change Password</p>
                  <div className="space-y-4">
                    <Input type="password" placeholder="Current password" className="rounded-xl" />
                    <Input type="password" placeholder="New password" className="rounded-xl" />
                    <Input type="password" placeholder="Confirm new password" className="rounded-xl" />
                    <Button variant="outline" className="rounded-xl">Update Password</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">Appearance</h3>
              <p className="text-sm text-muted-foreground mb-6">Customize how Deriverse looks on your device</p>
              
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <Label className="text-sm font-medium mb-4 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={cn(
                          "relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all",
                          theme === option.id 
                            ? "border-foreground bg-muted/50" 
                            : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                        )}
                      >
                        {theme === option.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                          theme === option.id ? "bg-foreground text-background" : "bg-muted text-foreground"
                        )}>
                          <option.icon className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-foreground">{option.label}</span>
                        <span className="text-xs text-muted-foreground mt-1">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="border-t border-border pt-6">
                  <Label className="text-sm font-medium mb-4 block">Preview</Label>
                  <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-foreground" />
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-foreground/20 rounded mb-2" />
                        <div className="h-2 w-16 bg-foreground/10 rounded" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-16 rounded-xl bg-success/20" />
                      <div className="h-16 rounded-xl bg-destructive/20" />
                      <div className="h-16 rounded-xl bg-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">Language & Region</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Language</Label>
                  <Input defaultValue="English (US)" className="rounded-xl" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input defaultValue="USD ($)" className="rounded-xl" readOnly />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">Billing & Subscription</h3>
              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-foreground">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">$29/month</p>
                  </div>
                  <span className="px-3 py-1 bg-success/20 text-success text-xs font-medium rounded-full">Active</span>
                </div>
                <p className="text-sm text-muted-foreground">Next billing date: March 1, 2026</p>
              </div>
              <Button variant="outline" className="mt-4 rounded-xl">Manage Subscription</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
