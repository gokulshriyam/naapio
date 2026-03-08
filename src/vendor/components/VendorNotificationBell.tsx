import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, PartyPopper, MessageSquare, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const mockNotifications = [
  { id: 'N1', type: 'outbid', title: 'You were outbid', body: 'A vendor bid ₹29,500 on NP-2026-00098. Current rank: #2.', time: '5 min ago', read: false, link: '/vendor/bids' },
  { id: 'N2', type: 'bid_accepted', title: 'Bid accepted! 🎉', body: 'Sneha accepted your bid on NP-2026-00098 (Lehenga). Order is now active.', time: '1 hr ago', read: false, link: '/vendor/orders' },
  { id: 'N3', type: 'message', title: 'New message from Priya', body: 'Can you confirm the sleeve length one more time?', time: '2 hr ago', read: true, link: '/vendor/bids' },
  { id: 'N4', type: 'bid_expired', title: 'Bid window closed', body: 'Brief NP-2026-00034 closed. Your bid was not selected.', time: 'Yesterday', read: true, link: '/vendor/bids' },
  { id: 'N5', type: 'milestone', title: 'Customer approved M2', body: 'Sneha approved the fabric for order NP-2026-00098. Proceed to stitching.', time: 'Yesterday', read: true, link: '/vendor/orders' },
];

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  outbid: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  bid_accepted: { icon: PartyPopper, color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  message: { icon: MessageSquare, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  bid_expired: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
  milestone: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
};

const NotificationList = ({ notifications, onMarkAllRead, onClick, unreadCount }: {
  notifications: typeof mockNotifications;
  onMarkAllRead: () => void;
  onClick: (n: typeof mockNotifications[0]) => void;
  unreadCount: number;
}) => (
  <>
    <div className="flex items-center justify-between p-4 border-b border-border">
      <h3 className="font-sans font-semibold text-foreground text-sm">Notifications</h3>
      {unreadCount > 0 && (
        <button onClick={onMarkAllRead} className="text-[10px] font-sans text-accent hover:underline">
          Mark all as read
        </button>
      )}
    </div>
    <div className="overflow-y-auto" style={{ maxHeight: 'min(400px, calc(100vh - 80px))' }}>
      {notifications.map(n => {
        const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.message;
        const Icon = cfg.icon;
        return (
          <button
            key={n.id}
            onClick={() => onClick(n)}
            className={cn(
              "w-full text-left flex gap-3 p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors min-h-[44px]",
              !n.read && "bg-accent/5"
            )}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", cfg.bg)}>
              <Icon className={cn("w-4 h-4", cfg.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={cn("text-xs font-sans font-semibold truncate", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />}
              </div>
              <p className="text-[11px] font-sans text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
              <p className="text-[10px] font-sans text-muted-foreground mt-0.5">{n.time}</p>
            </div>
          </button>
        );
      })}
    </div>
  </>
);

const VendorNotificationBell = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClick = (n: typeof mockNotifications[0]) => {
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    setOpen(false);
    navigate(n.link);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-sans font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0",
              isMobile ? "bg-black/40 z-[199]" : "z-40"
            )}
            onClick={() => setOpen(false)}
          />

          {isMobile ? (
            /* Mobile: bottom sheet */
            <div className="fixed bottom-0 left-0 right-0 z-[200] bg-card border-t border-border rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto">
              <div className="mx-auto mt-3 mb-1 h-1.5 w-12 rounded-full bg-muted" />
              <NotificationList
                notifications={notifications}
                onMarkAllRead={markAllRead}
                onClick={handleClick}
                unreadCount={unreadCount}
              />
            </div>
          ) : (
            /* Desktop: dropdown */
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-[200] overflow-hidden">
              <NotificationList
                notifications={notifications}
                onMarkAllRead={markAllRead}
                onClick={handleClick}
                unreadCount={unreadCount}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorNotificationBell;
