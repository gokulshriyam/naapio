import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Download, Star, ShoppingBag, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customer, measurementFields } from "@/data/mockData";
import { toast } from "sonner";

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);

  // Dynamic user data from localStorage
  const [userData, setUserData] = useState<any>(null);
  const [savedMeasurements, setSavedMeasurements] = useState<Record<string, string> | null>(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('naapio_user');
      if (raw) setUserData(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem('naapio_measurements');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.measurements) setSavedMeasurements(parsed.measurements);
      }
    } catch {}
    // Count orders
    let count = 0;
    if (localStorage.getItem('naapio_last_order')) count++;
    if (localStorage.getItem('naapio_active_order')) count++;
    setOrderCount(Math.max(count, customer.totalOrders));
  }, []);

  const displayName = userData?.name && userData.name !== 'Customer' ? userData.name : customer.name;
  const displayPhone = userData?.phone || customer.phone;
  const displayInitials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const memberSince = userData?.loggedInAt
    ? new Date(userData.loggedInAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : customer.memberSince;

  const measurementValues = measurementFields.map((f) =>
    savedMeasurements?.[f] || String(customer.measurements[f as keyof typeof customer.measurements] || '')
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 h-fit">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-3">
              <span className="text-2xl font-serif font-bold text-accent">PS</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-foreground">{customer.name}</h2>
            <p className="text-sm text-muted-foreground font-sans">{customer.city}</p>
            <p className="text-xs text-muted-foreground font-sans mt-1">Member since {customer.memberSince}</p>
          </div>

          <div className="space-y-3 text-sm font-sans">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{customer.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{customer.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="text-foreground">{customer.city}</span></div>
          </div>

          <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1"><ShoppingBag className="w-3.5 h-3.5 text-accent" /></div>
              <p className="text-lg font-serif font-bold text-foreground">{customer.totalOrders}</p>
              <p className="text-[10px] text-muted-foreground font-sans">Orders</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1"><CreditCard className="w-3.5 h-3.5 text-accent" /></div>
              <p className="text-lg font-serif font-bold text-foreground">₹{(customer.totalSpent / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-muted-foreground font-sans">Spent</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1"><Star className="w-3.5 h-3.5 text-accent" /></div>
              <p className="text-lg font-serif font-bold text-foreground">{customer.avgRating}</p>
              <p className="text-[10px] text-muted-foreground font-sans">Avg Rating</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Measurement Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif font-bold text-xl text-foreground">Measurement Card</h2>
                <p className="text-xs text-muted-foreground font-sans mt-1">Last updated: Feb 14, 2026</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("PDF download started")}>
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
                <Button variant={editing ? "gold" : "outline"} size="sm" onClick={() => {
                  if (editing) {
                    const updatedMeasurements: Record<string, string> = {};
                    measurementFields.forEach((field, i) => {
                      const input = document.querySelectorAll('.measurement-input')[i] as HTMLInputElement;
                      if (input) updatedMeasurements[field] = input.value;
                    });
                    if (Object.keys(updatedMeasurements).length > 0) {
                      localStorage.setItem('naapio_measurements', JSON.stringify({
                        savedAt: new Date().toISOString(),
                        measurements: updatedMeasurements,
                        source: 'profile_edit',
                      }));
                    }
                    toast.success("Measurements saved!");
                  }
                  setEditing(!editing);
                }}>
                  {editing ? <><X className="w-3.5 h-3.5" /> Save</> : <><Edit className="w-3.5 h-3.5" /> Edit</>}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {measurementFields.map((field, i) => (
                <div key={field} className="text-center">
                  <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider block mb-1">{field}</label>
                  {editing ? (
                    <Input type="number" defaultValue={measurementValues[i]} className="measurement-input text-center font-sans text-sm h-9" />
                  ) : (
                    <p className="font-sans font-semibold text-foreground text-lg">{measurementValues[i]}"</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-serif font-bold text-xl text-foreground mb-4">Preferences</h2>
            <div className="mb-4">
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-2">Preferred Categories</p>
              <div className="flex flex-wrap gap-2">
                {customer.preferredCategories.map((c) => (
                  <span key={c} className="px-3 py-1 text-sm font-sans bg-primary/10 text-primary rounded-full">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-2">Preferred Fabrics</p>
              <div className="flex flex-wrap gap-2">
                {customer.preferredFabrics.map((f) => (
                  <span key={f} className="px-3 py-1 text-sm font-sans bg-accent/10 text-accent rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
