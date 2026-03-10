import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Inbox, Tag, Package, Wallet, User, LogOut, ArrowLeftRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockVendor } from "../data/vendorMockData";
import VendorNotificationBell from "../components/VendorNotificationBell";
import vendorAvatar from "@/assets/vendor-avatar.jpg";

const navItems = [
  { label: 'Leads', icon: Inbox, path: '/vendor' },
  { label: 'My Bids', icon: Tag, path: '/vendor/bids' },
  { label: 'Active Orders', icon: Package, path: '/vendor/orders' },
  { label: 'Wallet', icon: Wallet, path: '/vendor/wallet' },
  { label: 'Profile', icon: User, path: '/vendor/profile' },
];

const VendorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const vendor = (() => {
    try { return JSON.parse(localStorage.getItem('naapio_vendor') || '{}'); }
    catch { return {}; }
  })();

  const vendorDisplayName = vendor.name && vendor.name !== 'Artisan'
    ? vendor.name
    : mockVendor.realName;

  useEffect(() => {
    if (!vendor.role) navigate('/for-tailors');
  }, [vendor.role, navigate]);

  if (!vendor.role) return null;

  const initials = vendorDisplayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  const isActive = (path: string) => {
    if (path === '/vendor') return location.pathname === '/vendor';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 z-30">
        {/* Logo + notification */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-foreground cursor-pointer" onClick={() => navigate('/')}>
                Naapio
              </span>
              <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Artisan Portal
              </span>
            </div>
            <VendorNotificationBell />
          </div>
        </div>

        {/* Vendor avatar + stats */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={vendorAvatar} alt="Priya Designs Studio" className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-sm text-foreground truncate">{vendorDisplayName}</p>
              <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950">
                {mockVendor.tier} Tier
              </span>
            </div>
          </div>
          {/* Compact stats row */}
          <div className="flex items-center gap-3 mt-3 text-[10px] font-sans text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {mockVendor.rating}
            </span>
            <span>📦 {mockVendor.ordersCompleted} orders</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors",
                isActive(item.path)
                  ? "bg-accent/15 text-accent font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Switch to Customer
          </button>
          <button
            onClick={() => { localStorage.removeItem('naapio_vendor'); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border flex items-center justify-around h-16 px-1">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg text-[10px] font-sans transition-colors min-w-[44px] min-h-[44px] justify-center",
              isActive(item.path)
                ? "text-accent font-semibold"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
        {/* Notification in mobile tab bar */}
        <div className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center">
          <VendorNotificationBell />
        </div>
      </nav>
    </div>
  );
};

export default VendorLayout;
