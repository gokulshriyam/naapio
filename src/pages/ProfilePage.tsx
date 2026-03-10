import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Download, Star, ShoppingBag, CreditCard, X, Check, ChevronDown, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { customer } from "@/data/mockData";
import { toast } from "sonner";

// Garment emoji helper
const garmentEmoji = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('blouse')) return '👚';
  if (n.includes('lehenga') || n.includes('chaniya')) return '👗';
  if (n.includes('saree') || n.includes('nauvari')) return '🥻';
  if (n.includes('gown') || n.includes('mermaid')) return '👗';
  if (n.includes('sherwani') || n.includes('bandhgala')) return '🤵';
  if (n.includes('kurta') || n.includes('kurti')) return '👔';
  if (n.includes('salwar') || n.includes('anarkali')) return '👘';
  if (n.includes('suit') || n.includes('blazer')) return '🧥';
  if (n.includes('trouser') || n.includes('chinos')) return '👖';
  if (n.includes('shirt')) return '👔';
  return '🧵';
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [editingGarment, setEditingGarment] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  // Dynamic user data from localStorage
  const [userData, setUserData] = useState<any>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [measurementProfile, setMeasurementProfile] = useState<any>({ measurements: {} });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('naapio_user');
      if (raw) setUserData(JSON.parse(raw));
    } catch {}
    // Count orders
    let count = 0;
    if (localStorage.getItem('naapio_last_order')) count++;
    if (localStorage.getItem('naapio_active_order')) count++;
    setOrderCount(Math.max(count, customer.totalOrders));
    // Load measurement profile
    try {
      const raw = localStorage.getItem('naapio_measurement_profile');
      if (raw) setMeasurementProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const displayName = userData?.name && userData.name !== 'Customer' ? userData.name : customer.name;
  const displayPhone = userData?.phone || customer.phone;
  const displayInitials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const memberSince = userData?.loggedInAt
    ? new Date(userData.loggedInAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : customer.memberSince;

  const garmentEntries = Object.entries(measurementProfile.measurements || {}) as [string, any][];

  const handleStartEdit = (garmentKey: string, values: Record<string, string>) => {
    setEditingGarment(garmentKey);
    setEditValues({ ...values });
  };

  const handleSaveEdit = (garmentKey: string) => {
    const profile = JSON.parse(localStorage.getItem('naapio_measurement_profile') || '{"measurements":{}}');
    if (profile.measurements[garmentKey]) {
      profile.measurements[garmentKey].values = { ...editValues };
      profile.measurements[garmentKey].source = 'manual_edit';
      profile.measurements[garmentKey].updatedAt = new Date().toISOString();
    }
    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem('naapio_measurement_profile', JSON.stringify(profile));
    setMeasurementProfile(profile);
    setEditingGarment(null);
    setEditValues({});
    toast.success("Measurements updated!");
  };

  const sourceBadge = (source: string) => {
    if (source === 'M1_confirmed') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success font-sans font-medium">M1 Confirmed</span>;
    if (source === 'wizard') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-sans font-medium">From wizard</span>;
    if (source === 'manual_edit') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-sans font-medium">Edited</span>;
    return null;
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 h-fit">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-3">
              <span className="text-2xl font-serif font-bold text-accent">{displayInitials}</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground font-sans">{customer.city}</p>
            <p className="text-xs text-muted-foreground font-sans mt-1">Member since {memberSince}</p>
          </div>

          <div className="space-y-3 text-sm font-sans">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{customer.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{displayPhone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="text-foreground">{customer.city}</span></div>
          </div>

          <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1"><ShoppingBag className="w-3.5 h-3.5 text-accent" /></div>
              <p className="text-lg font-serif font-bold text-foreground">{orderCount}</p>
              <p className="text-[10px] text-muted-foreground font-sans">Orders</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1"><Star className="w-3.5 h-3.5 text-accent" /></div>
              <p className="text-lg font-serif font-bold text-foreground">{customer.avgRating}</p>
              <p className="text-[10px] text-muted-foreground font-sans">Avg Rating</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* ═══ My Measurement Profile ═══ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-serif font-bold text-xl text-foreground">My Measurement Profile</h2>
                <p className="text-xs text-muted-foreground font-sans mt-1">Updated after each completed order. Future orders pre-fill from here.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("PDF download — coming soon")}>
                <Download className="w-3.5 h-3.5" /> PDF
              </Button>
            </div>

            {garmentEntries.length === 0 ? (
              /* Empty state */
              <div className="text-center py-12">
                <Ruler className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-sans font-semibold text-foreground mb-1">No measurements saved yet</p>
                <p className="text-sm text-muted-foreground font-sans mb-6">
                  Your measurements will appear here after your first order or after completing Step 2e in the wizard.
                </p>
                <Button variant="gold" onClick={() => navigate('/start')}>Start an Order →</Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="mt-4">
                {garmentEntries.map(([garmentKey, entry]) => {
                  const values = entry.values || {};
                  const fieldKeys = Object.keys(values);
                  const isEditing = editingGarment === garmentKey;

                  return (
                    <AccordionItem key={garmentKey} value={garmentKey} className="border-b border-border">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                          <span className="text-lg">{garmentEmoji(garmentKey)}</span>
                          <span className="font-sans font-semibold text-sm text-foreground truncate">{garmentKey}</span>
                          <div className="ml-auto flex items-center gap-2 shrink-0">
                            {sourceBadge(entry.source)}
                            <span className="text-[10px] text-muted-foreground font-sans hidden sm:inline">
                              {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {entry.source === 'M1_confirmed' && entry.orderId && (
                          <div className="mb-4 p-3 rounded-xl bg-success/5 border border-success/15">
                            <p className="text-xs font-sans text-success flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Artisan-verified at Milestone 1 — Order #{entry.orderId}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end mb-3">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingGarment(null); setEditValues({}); }}>
                                <X className="w-3.5 h-3.5" /> Cancel
                              </Button>
                              <Button variant="gold" size="sm" onClick={() => handleSaveEdit(garmentKey)}>
                                <Check className="w-3.5 h-3.5" /> Save
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleStartEdit(garmentKey, values)}>
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {fieldKeys.map(fk => (
                            <div key={fk} className="text-center">
                              <label className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider block mb-1">{fk}</label>
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={editValues[fk] || ''}
                                  onChange={e => setEditValues({ ...editValues, [fk]: e.target.value })}
                                  className="text-center font-sans text-sm h-9"
                                />
                              ) : (
                                <p className="font-sans font-semibold text-foreground text-lg">
                                  {values[fk]}{values[fk] ? '"' : '—'}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}

            {/* TODO: PDF_EXPORT — generate measurement PDF per garment for customer to use offline */}

            <p className="text-[10px] text-muted-foreground font-sans mt-6">
              Your measurements are stored locally on this device under Naapio's{' '}
              <a href="/privacy" target="_blank" className="text-accent underline">Privacy Policy</a>{' '}
              and DPDP Act 2023. Request deletion in Settings.
            </p>
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
