import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Lock, HelpCircle, LogOut, Trash2, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({ bids: true, milestones: true, chat: true, promo: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-foreground">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "bids" as const, label: "Bid updates", desc: "Get notified when vendors bid on your requests" },
              { key: "milestones" as const, label: "Milestone alerts", desc: "Updates on order progress and approvals needed" },
              { key: "chat" as const, label: "Chat messages", desc: "New messages from your accepted vendors" },
              { key: "promo" as const, label: "Promotional", desc: "Offers, new features, and seasonal campaigns" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-sans font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground font-sans">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-foreground">Privacy Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
              <h3 className="font-sans font-semibold text-foreground text-sm mb-1">Request Measurement Data Deletion</h3>
              <p className="text-xs text-muted-foreground font-sans mb-3">
                Under DPDP Act 2023, you can request deletion of all your measurement data. This will be processed within 72 hours.
              </p>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-3.5 h-3.5" /> Request Deletion
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Preparing your data download...")}>
              <Download className="w-3.5 h-3.5" /> Download my data
            </Button>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-foreground">Account Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">Change Password</label>
              <div className="flex gap-2">
                <Input type="password" placeholder="Current password" className="font-sans" />
                <Input type="password" placeholder="New password" className="font-sans" />
                <Button variant="default" size="sm">Update</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">Linked Mobile</label>
              <p className="text-sm text-muted-foreground font-sans">+91 98XXXXXX45</p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <HelpCircle className="w-4 h-4" /> Help & Support
          </Button>
          <Button variant="ghost" className="text-destructive gap-2">
            <LogOut className="w-4 h-4" /> Log out
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-foreground mb-4">Confirm Data Deletion</h3>
            <p className="text-sm text-muted-foreground font-sans mb-4">
              Under the <strong>Digital Personal Data Protection Act, 2023</strong>, your measurement data will be permanently deleted within <strong>72 hours</strong> of this request.
            </p>
            <p className="text-sm text-muted-foreground font-sans mb-6">
              This action cannot be undone. You will need to re-enter your measurements for future orders.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => { setShowDeleteModal(false); toast.success("Data deletion request submitted. Processing within 72 hours."); }}>
                Confirm Deletion
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
