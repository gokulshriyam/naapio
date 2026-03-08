import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Lock, ArrowLeft, Star, Play, Package, Scissors, Video, Ruler, Truck, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { customer } from "@/data/mockData";
import redLehenga from "@/assets/red-lehenga.jpg";
import royalSilkImg from "@/assets/fabrics/royalsilk.jpg";
import brocadeGoldImg from "@/assets/fabrics/brocadegold.jpg";
import velvetNavyImg from "@/assets/fabrics/velvetnavy.jpg";
import virtualTrialCover from "@/assets/virtualtrialcover.jpg";

const MEASUREMENT_FIELDS = [
  "Chest","Waist","Hips","Shoulder Width","Sleeve Length","Back Length",
  "Front Length","Neck","Bicep","Forearm","Wrist","Thigh","Knee","Calf",
  "Ankle","Torso","Cross Back","Cross Front","Armhole","Rise","Inseam",
];

const MILESTONES = [
  { id: 1, title: "Fit & Measurement Confirmation", icon: Ruler },
  { id: 2, title: "Fabric Approval", icon: Scissors },
  { id: 3, title: "Stitching in Progress", icon: Scissors },
  { id: 4, title: "Virtual Trial", icon: Video },
  { id: 5, title: "Final Approval & Dispatch", icon: Package },
];

const TIER_COLORS: Record<string, string> = {
  Gold: "bg-amber-400 text-amber-950",
  Silver: "bg-slate-300 text-slate-800",
  Bronze: "bg-amber-700 text-amber-50",
};

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const ActiveOrdersPage = () => {
  const navigate = useNavigate();
  const [activeMilestone, setActiveMilestone] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // ── Dynamic order data from localStorage ──
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('naapio_active_order');
      if (raw) setActiveOrder(JSON.parse(raw));
      const raw2 = localStorage.getItem('naapio_last_order');
      if (raw2) setLastOrder(JSON.parse(raw2));
    } catch {}
    setTimeout(() => setLoading(false), 300);
  }, []);

  // Derived display values
  const orderId = activeOrder?.orderId || lastOrder?.orderId || lastOrder?.id || 'NP-2026-00001';
  const garmentLabel = lastOrder
    ? [lastOrder.gender, lastOrder.selectedCategory, lastOrder.selectedSubCategory].filter(Boolean).join(' · ')
    : 'Custom Garment';
  const artisanLabel = activeOrder?.artisanAlias || 'Your Artisan';
  const artisanTier = activeOrder?.artisanTier || 'Gold';
  const artisanRating = activeOrder?.artisanRating || '4.8';
  const artisanCompletionRate = activeOrder?.artisanCompletionRate || 'N/A';
  const artisanDisputeRate = activeOrder?.artisanDisputeRate || 'N/A';
  const bidAmount = activeOrder?.bidAmount || 0;
  const netPayable = activeOrder?.netPayable || 0;
  const deliveryDays = activeOrder?.deliveryDays || 18;

  // Artisan initials
  const artisanInitials = artisanLabel.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  // M1 state — pre-fill from profile
  const profileMeasurements = Object.values(customer.measurements);
  const initialMeasurements: Record<string, string> = {};
  MEASUREMENT_FIELDS.forEach((f, i) => {
    initialMeasurements[f] = String(profileMeasurements[i] || "");
  });
  const [measurements, setMeasurements] = useState<Record<string, string>>(initialMeasurements);
  const [dpdp1, setDpdp1] = useState(false);
  const [dpdp2, setDpdp2] = useState(false);

  // Smart pre-fill from wizard measurements
  const hasSavedMeasurements = !!localStorage.getItem('naapio_measurements');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('naapio_measurements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.measurements) {
          const prefilled: Record<string, string> = {};
          MEASUREMENT_FIELDS.forEach(f => {
            prefilled[f] = parsed.measurements[f] || String(initialMeasurements[f] || '');
          });
          setMeasurements(prefilled);
        }
      }
    } catch {}
  }, []);

  // M2 state
  const [selectedSwatches, setSelectedSwatches] = useState<Set<string>>(new Set());

  // M3 state
  const [stitchProgress, setStitchProgress] = useState(0);

  // M4 state
  const [trialChecks, setTrialChecks] = useState<Record<string, boolean>>({});

  // M5 state
  const [shippingForm, setShippingForm] = useState({ name: "", addr1: "", addr2: "", city: "", state: "", pincode: "", phone: "" });
  const [dispatched, setDispatched] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [review, setReview] = useState({ quality: 0, communication: 0, timeliness: 0, value: 0, text: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // M3 auto-advance
  useEffect(() => {
    if (activeMilestone !== 3) return;
    setStitchProgress(0);
    const interval = setInterval(() => {
      setStitchProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setActiveMilestone(4);
    }, 5000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [activeMilestone]);

  const advance = (next: number) => {
    toast.success(`Milestone ${next - 1} completed!`);
    setActiveMilestone(next);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const m1Valid = MEASUREMENT_FIELDS.every((f) => measurements[f]?.trim()) && dpdp1 && dpdp2;
  const m4Valid = MEASUREMENT_FIELDS.every((f) => trialChecks[f]);
  const m5ShipValid = Object.entries(shippingForm).every(([k, v]) => k === "addr2" || v.trim());

  const progressPercent = ((activeMilestone - 1) / 5) * 100;

  // Estimated delivery date
  const deliveryDate = activeOrder?.acceptedAt
    ? new Date(new Date(activeOrder.acceptedAt).getTime() + deliveryDays * 86400000).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'TBD';

  if (loading) {
    return (
      <div className="max-w-4xl animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-6" />
        <div className="h-8 w-64 bg-muted rounded mb-2" />
        <div className="h-4 w-48 bg-muted rounded mb-6" />
        <div className="h-2 w-full bg-muted rounded mb-8" />
        <div className="flex gap-4 mb-8">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-muted" />
              {i < 5 && <div className="w-8 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl" ref={contentRef}>
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-accent font-sans font-medium text-sm mb-6 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> ← My Orders
      </button>

      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Track Order <span className="text-accent">#{orderId}</span></h1>
      <p className="text-muted-foreground font-sans mb-6">{garmentLabel} • {artisanLabel}</p>

      {/* Top progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-sans text-muted-foreground mb-2">
          <span>Milestone {Math.min(activeMilestone, 5)} of 5</span>
          <span>{Math.round(progressPercent)}% complete</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Milestone indicators — scroll on small screens */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
        {MILESTONES.map((ms, i) => {
          const completed = ms.id < activeMilestone;
          const active = ms.id === activeMilestone;
          const locked = ms.id > activeMilestone;
          return (
            <div key={ms.id} className="flex items-center gap-1 flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all ${
                completed ? "bg-success text-success-foreground" : active ? "bg-accent text-accent-foreground ring-4 ring-accent/20" : "bg-muted text-muted-foreground"
              }`}>
                {completed ? <Check className="w-4 h-4" /> : locked ? <Lock className="w-3.5 h-3.5" /> : ms.id}
              </div>
              {i < MILESTONES.length - 1 && (
                <div className={`w-4 sm:w-8 h-0.5 ${completed ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Artisan confirmation panel */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-sans shrink-0 ${TIER_COLORS[artisanTier] || 'bg-muted text-muted-foreground'}`}>
          {artisanInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-bold text-foreground text-sm">{artisanLabel}</p>
          <p className="text-xs font-sans text-muted-foreground">
            {artisanTier} Artisan · ⭐ {artisanRating} · ✅ {artisanCompletionRate}% · 🛡️ {artisanDisputeRate}%
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-serif font-bold text-foreground">₹{bidAmount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] font-sans text-muted-foreground flex items-center gap-1 justify-end">
            <Shield className="w-3 h-3" /> Escrow protected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar order card — not sticky on mobile */}
        <div className="bg-card rounded-2xl border border-border p-5 h-fit md:sticky md:top-24">
          <img src={redLehenga} alt="Order" className="w-full h-40 object-cover rounded-xl mb-4" />
          <div className="space-y-2 text-sm font-sans">
            <div className="flex justify-between"><span className="text-muted-foreground">Order</span><span className="font-medium text-foreground">#{orderId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Garment</span><span className="font-medium text-foreground truncate ml-2">{garmentLabel}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Artisan</span><span className="font-medium text-foreground">{artisanLabel}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-info-light text-info">IN PROGRESS</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-foreground">{deliveryDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bid</span><span className="font-serif font-bold text-lg text-foreground">₹{bidAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Net Payable</span><span className="font-serif font-bold text-accent">₹{netPayable.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-success-light rounded-full text-success text-xs font-sans font-medium">
            <Check className="w-3 h-3" /> ₹{bidAmount.toLocaleString('en-IN')} in Escrow
          </div>
          <Button variant="default" className="w-full mt-4" size="sm" onClick={() => navigate("/dashboard/chat")}>💬 Chat with {artisanLabel}</Button>
        </div>

        {/* Milestone content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* ========== MILESTONE 1 ========== */}
            {activeMilestone === 1 && (
              <motion.div key="m1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">Fit & Measurement Confirmation</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">Enter your 21-point measurements (in inches) so the tailor can begin.</p>

                {/* Measurement pre-fill banner */}
                {hasSavedMeasurements ? (
                  <div className="mb-6 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40">
                    <p className="text-sm font-sans text-foreground">📏 We've pre-filled your measurements from your wizard submission. Review and confirm everything looks correct before approving.</p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                    <p className="text-sm font-sans text-foreground">📏 Please enter your measurements carefully — your artisan will cut fabric based on these values.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {MEASUREMENT_FIELDS.map((f) => (
                    <div key={f}>
                      <Label className="text-xs font-sans text-muted-foreground">{f}</Label>
                      <Input
                        type="number"
                        placeholder="in"
                        value={measurements[f] || ""}
                        onChange={(e) => setMeasurements({ ...measurements, [f]: e.target.value })}
                        className="mt-1 h-9 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6 p-4 bg-secondary rounded-xl">
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">DPDP Act 2023 Consent</p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox checked={dpdp1} onCheckedChange={(v) => setDpdp1(!!v)} />
                    <span className="text-xs font-sans text-foreground leading-relaxed">I consent to my measurement data being stored securely and shared only with my accepted vendor per Naapio's Privacy Policy (DPDP Act 2023)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox checked={dpdp2} onCheckedChange={(v) => setDpdp2(!!v)} />
                    <span className="text-xs font-sans text-foreground leading-relaxed">I understand my data will be deleted upon request within 72 hours</span>
                  </label>
                </div>
                <Button variant="gold" disabled={!m1Valid} onClick={() => advance(2)} className="w-full sm:w-auto">
                  Confirm Measurements
                </Button>
              </motion.div>
            )}

            {/* ========== MILESTONE 2 ========== */}
            {activeMilestone === 2 && (
              <motion.div key="m2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">Fabric Approval</h2>
                <p className="text-sm text-muted-foreground font-sans mb-6">Your tailor has sent 3 fabric swatches for your approval.</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { name: "Royal Silk #1", image: royalSilkImg },
                    { name: "Brocade Gold", image: brocadeGoldImg },
                    { name: "Velvet Navy", image: velvetNavyImg },
                  ].map((s) => {
                    const isSelected = selectedSwatches.has(s.name);
                    return (
                      <div key={s.name} className="text-center cursor-pointer" onClick={() => {
                        const next = new Set(selectedSwatches);
                        if (next.has(s.name)) next.delete(s.name); else next.add(s.name);
                        setSelectedSwatches(next);
                      }}>
                        <div className={`rounded-xl overflow-hidden shadow-md hover:scale-105 transition-all relative ${isSelected ? "ring-3 ring-accent" : ""}`} style={{ aspectRatio: '1 / 1' }}>
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover object-center" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                              <Check className="w-4 h-4 text-accent-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-sans text-muted-foreground mt-2 block">{s.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 bg-secondary rounded-xl mb-6">
                  <p className="text-sm font-sans text-foreground italic">"I've selected these three fabrics based on your preferences. The Royal Silk has the best drape for your garment."</p>
                  <p className="text-xs text-muted-foreground font-sans mt-1">— {artisanLabel}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast.info("Alteration request sent to tailor.")}>Request Change</Button>
                  <Button variant="gold" size="sm" disabled={selectedSwatches.size === 0} onClick={() => advance(3)}>Approve Fabric</Button>
                </div>
              </motion.div>
            )}

            {/* ========== MILESTONE 3 ========== */}
            {activeMilestone === 3 && (
              <motion.div key="m3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">Stitching in Progress</h2>
                <p className="text-sm text-muted-foreground font-sans mb-6">No action required — sit back while your garment is crafted.</p>
                <div className="p-8 bg-card border border-border rounded-2xl text-center space-y-6">
                  <Scissors className="w-12 h-12 mx-auto text-accent animate-pulse" />
                  <p className="font-sans text-foreground font-medium">Your garment is being stitched by the artisan.</p>
                  <Progress value={stitchProgress} className="h-3 max-w-md mx-auto" />
                  <p className="text-xs text-muted-foreground font-sans">Estimated completion in a few moments…</p>
                </div>
              </motion.div>
            )}

            {/* ========== MILESTONE 4 ========== */}
            {activeMilestone === 4 && (
              <motion.div key="m4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">Virtual Trial</h2>
                <p className="text-sm text-muted-foreground font-sans mb-6">Review the garment on a mannequin and verify each measurement checkpoint.</p>
                <div className="aspect-video rounded-2xl overflow-hidden relative mb-6 cursor-pointer border border-border group">
                  <img src={virtualTrialCover} alt="Virtual trial" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center">
                      <Play className="w-7 h-7 text-accent-foreground ml-1" />
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 text-xs font-sans text-white/80 bg-black/50 px-2 py-1 rounded">Recorded: Today, 10:00 AM</span>
                </div>
                <p className="text-sm font-sans font-semibold text-foreground mb-3">Measurement Checkpoints</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {MEASUREMENT_FIELDS.map((f, i) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Checkbox checked={!!trialChecks[f]} onCheckedChange={(v) => setTrialChecks({ ...trialChecks, [f]: !!v })} />
                      <span className="text-xs font-sans text-foreground">{f}: {profileMeasurements[i]}"</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast.info("Alteration request sent.")}>Request Alteration</Button>
                  <Button variant="gold" size="sm" disabled={!m4Valid} onClick={() => advance(5)}>Approve Trial</Button>
                </div>
              </motion.div>
            )}

            {/* ========== MILESTONE 5 ========== */}
            {activeMilestone === 5 && (
              <motion.div key="m5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">Final Approval & Dispatch</h2>

                {reviewSubmitted ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 bg-success-light rounded-2xl text-center mt-6">
                    <Check className="w-14 h-14 mx-auto text-success mb-4" />
                    <h3 className="font-serif font-bold text-xl text-foreground mb-2">Thank You!</h3>
                    <p className="text-sm font-sans text-muted-foreground">Your review has been submitted. We appreciate your feedback.</p>
                  </motion.div>
                ) : delivered ? (
                  <div className="mt-4 space-y-5">
                    <p className="text-sm font-sans text-muted-foreground">Rate your experience with {artisanLabel}.</p>
                    {(["Quality","Communication","Timeliness","Value for Money"] as const).map((cat) => {
                      const rKey = (cat === "Value for Money" ? "value" : cat.toLowerCase()) as keyof typeof review;
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm font-sans text-foreground w-36">{cat}</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`w-5 h-5 cursor-pointer transition-colors ${s <= (review[rKey] as number) ? "fill-accent text-accent" : "text-border hover:text-accent/40"}`}
                                onClick={() => setReview({ ...review, [rKey]: s })} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    <Textarea placeholder="Additional comments…" value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} className="font-sans" />
                    <Button variant="gold" onClick={() => { setReviewSubmitted(true); toast.success("Review submitted!"); }}>Submit Review</Button>
                  </div>
                ) : dispatched ? (
                  <div className="mt-4 space-y-4">
                    <div className="p-6 bg-success-light rounded-2xl text-center">
                      <Truck className="w-10 h-10 mx-auto text-success mb-3" />
                      <p className="font-sans font-semibold text-foreground">Your garment will be dispatched soon!</p>
                    </div>
                    <div>
                      <Label className="text-xs font-sans text-muted-foreground">AWB Tracking Number</Label>
                      <Input value="DTDC1234567890" readOnly className="mt-1 bg-muted font-mono text-sm" />
                    </div>
                    <Button variant="gold" onClick={() => { setDelivered(true); toast.success("Marked as delivered!"); }}>Mark as Delivered</Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground font-sans mb-4">Confirm your shipping address for dispatch.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {([
                        ["name","Full Name"],["addr1","Address Line 1"],["addr2","Address Line 2 (optional)"],
                        ["city","City"],["state","State"],["pincode","Pincode"],["phone","Phone"],
                      ] as const).map(([k, label]) => (
                        <div key={k} className={k === "addr1" || k === "addr2" ? "sm:col-span-2" : ""}>
                          <Label className="text-xs font-sans text-muted-foreground">{label}</Label>
                          <Input value={shippingForm[k]} onChange={(e) => setShippingForm({ ...shippingForm, [k]: e.target.value })} className="mt-1 h-9 text-sm" />
                        </div>
                      ))}
                    </div>
                    <Button variant="gold" disabled={!m5ShipValid} onClick={() => { setDispatched(true); toast.success("Dispatch confirmed!"); }}>Confirm Dispatch</Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completed milestones summary */}
      {activeMilestone > 1 && (
        <div className="mt-10 space-y-2">
          <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-3">Completed Milestones</p>
          {MILESTONES.filter((ms) => ms.id < activeMilestone).map((ms) => (
            <div key={ms.id} className="flex items-center gap-3 p-3 bg-success-light/50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center"><Check className="w-4 h-4 text-success-foreground" /></div>
              <span className="text-sm font-sans text-foreground font-medium">{ms.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveOrdersPage;
