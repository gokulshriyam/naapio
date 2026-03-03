import { useState } from "react";
import { Bell } from "lucide-react";
import { notifications } from "@/data/mockData";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-sans font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-sans font-semibold text-foreground text-sm">Notifications</h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${n.unread ? "bg-gold-light/30" : ""}`}>
                  <p className="font-sans text-sm font-medium text-foreground">{n.title}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">{n.description}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
