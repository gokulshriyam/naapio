import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, User, Settings, LogOut, Sparkles } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Active Orders", icon: ShoppingBag, path: "/dashboard/active-orders" },
  { label: "Profile", icon: User, path: "/dashboard/profile" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard" || location.pathname === "/dashboard/view-bids" || location.pathname === "/dashboard/chat";
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-serif font-bold text-foreground">Naapio</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-sans font-bold text-accent">P</span>
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-foreground">Priya</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-sans text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-foreground">Naapio</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-sm font-sans font-bold text-accent">P</span>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex border-b border-border bg-card overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-sans transition-all ${
                isActive(item.path) ? "text-primary font-medium border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
