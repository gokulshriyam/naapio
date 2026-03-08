import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock, Edit, Eye, X as XIcon, Star, RotateCcw,
  CheckCircle2, Circle, AlertCircle, ChevronRight, Send, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activeRequests, pastRequests } from "@/data/mockData";
import redLehenga from "@/assets/red-lehenga.jpg";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ═══════════════════════════════════════
// Demo state — replace with real data when backend is connected
// ═══════════════════════════════════════

const ORDER_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  "New Order": { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-800 dark:text-pink-300" },
  "Alteration": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300" },
  "Own Fabric": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300" },
  "Customise": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-300" },
};

const ORDER_STAGES = [
  "Awaiting Bids",
  "Bids Received",
  "Tailor Selected",
  "In Progress",
  "Delivered",
] as const;

const STATUS_MESSAGES: Record<string, (o: typeof initialDemoOrder) => string> = {
  "Awaiting Bids": (o) => `Your brief is live. Tailors have ${o.daysRemaining} days to bid.`,
  "Bids Received": (o) => `${o.bidsReceived} tailors have submitted bids. Review and select yours.`,
  "Tailor Selected": () => "Your tailor has been confirmed. Work begins shortly.",
  "In Progress": () => "Your garment is being made. Approve each milestone as it arrives.",
  "Delivered": () => "Your order is complete. Don't forget to leave a review.",
};

// TODO: replace with real bid data from API
const mockBids = [
  { id: "A", name: "Tailor A", tier: "Silver" as const, rating: 4.2, price: 12500, days: 18 },
  { id: "B", name: "Tailor B", tier: "Bronze" as const, rating: 3.8, price: 9800, days: 14 },
  { id: "C", name: "Tailor C", tier: "Gold" as const, rating: 4.7, price: 15200, days: 22 },
];

const TIER_STYLES: Record<string, string> = {
  Gold: "bg-accent/20 text-accent",
  Silver: "bg-slate-200/60 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300",
  Bronze: "bg-amber-700/20 text-amber-800 dark:text-amber-400",
};

type MilestoneStatus = "pending" | "awaiting_approval" | "approved" | "changes_requested";

interface Milestone {
  id: number;
  label: string;
  status: MilestoneStatus;
}

const initialDemoOrder = {
  id: "NP-2026-00142",
  orderType: "New Order",
  garment: "Women's · Lehenga · Bridal Lehenga",
  occasion: "Wedding",
  status: "Bids Received",
  daysRemaining: 5,
  bidsReceived: 3,
  measurementsProvided: false,
  hoursRemainingForMeasurements: 31,
  milestones: [
    { id: 1, label: "Measurement Confirmation", status: "pending" as MilestoneStatus },
    { id: 2, label: "Fabric Approval", status: "pending" as MilestoneStatus },
    { id: 3, label: "Stitching Preview", status: "pending" as MilestoneStatus },
    { id: 4, label: "Final Fitting", status: "pending" as MilestoneStatus },
    { id: 5, label: "Delivery", status: "pending" as MilestoneStatus },
  ],
};

const BiddingPage = () => {
  const navigate = useNavigate();
  const [timers, setTimers] = useState(activeRequests.map((r) => ({ ...r.countdown, minutes: 0, seconds: 0 })));

  // Load last order from localStorage
  const savedOrder = localStorage.getItem("naapio_last_order");
  const lastOrder = savedOrder ? JSON.parse(savedOrder) : null;

  // Demo state
  const [demoOrder, setDemoOrder] = useState(() => {
    if (lastOrder) {
      return {
        ...initialDemoOrder,
        id: lastOrder.orderId,
        orderType: lastOrder.orderType || initialDemoOrder.orderType,
        garment: lastOrder.garment || initialDemoOrder.garment,
        occasion: lastOrder.occasion || initialDemoOrder.occasion,
      };
    }
    return initialDemoOrder;
  });
  const [milestones, setMilestones] = useState<Milestone[]>(initialDemoOrder.milestones);
  const [changeNotes, setChangeNotes] = useState<Record<number, string>>({});
  const [confirmBid, setConfirmBid] = useState<typeof mockBids[0] | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          let s = t.seconds - 1;
          let m = t.minutes;
          let h = t.hours;
          let d = t.days;
          if (s < 0) { s = 59; m--; }
          if (m < 0) { m = 59; h--; }
          if (h < 0) { h = 23; d--; }
          if (d < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          return { days: d, hours: h, minutes: m, seconds: s };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveMilestone = (id: number) => {
    setMilestones((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) return { ...m, status: "approved" as MilestoneStatus };
        if (m.id === id + 1) return { ...m, status: "awaiting_approval" as MilestoneStatus };
        return m;
      });
      return updated;
    });
  };

  const handleRequestChanges = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: "changes_requested" as MilestoneStatus } : m)
    );
  };

  const handleConfirmTailor = () => {
    if (!confirmBid) return;
    setDemoOrder((prev) => ({ ...prev, status: "Tailor Selected" }));
    setConfirmBid(null);
  };

  const currentStageIdx = ORDER_STAGES.indexOf(demoOrder.status as typeof ORDER_STAGES[number]);

  const badgeStyle = ORDER_TYPE_STYLES[demoOrder.orderType] || ORDER_TYPE_STYLES["New Order"];

  return (
    <div className="max-w-4xl space-y-6">
      {/* ══════ Measurements Reminder Banner ══════ */}
      {!demoOrder.measurementsProvided && (
        <div className="bg-destructive text-destructive-foreground rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">⏱</span>
            <div>
              <h3 className="font-sans font-semibold text-sm">Measurements not submitted</h3>
              <p className="font-sans text-sm opacity-90">
                Bids will not be finalised until your measurements are submitted. {demoOrder.hoursRemainingForMeasurements} hours remaining.
              </p>
            </div>
          </div>
          {/* TODO: deep-link to measurements sub-step */}
          <Button
            variant="outline"
            size="sm"
            className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 shrink-0"
            onClick={() => navigate("/wizard")}
          >
            Submit Measurements <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ══════ Order Status Stepper ══════ */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4 overflow-x-auto">
          {ORDER_STAGES.map((stage, i) => {
            const isCompleted = i < currentStageIdx;
            const isCurrent = i === currentStageIdx;
            return (
              <div key={stage} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center text-center min-w-[80px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-bold mb-1 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-accent text-accent-foreground ring-2 ring-accent/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-sans leading-tight ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {stage}
                  </span>
                </div>
                {i < ORDER_STAGES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mt-[-14px] ${isCompleted ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm font-sans text-muted-foreground text-center">
          {STATUS_MESSAGES[demoOrder.status]?.(demoOrder)}
        </p>
      </div>

      {/* ══════ Order Summary Card ══════ */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <img src={redLehenga} alt={demoOrder.garment} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-sans font-medium mb-2 ${badgeStyle.bg} ${badgeStyle.text}`}>
              {demoOrder.orderType}
            </span>
            <h3 className="font-sans font-semibold text-foreground">{demoOrder.garment}</h3>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">Order #{demoOrder.id}</p>
          </div>
        </div>
      </div>

      {/* ══════ Bid Panel ══════ */}
      {demoOrder.status === "Bids Received" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">Tailor Bids</h2>
            <p className="text-sm text-muted-foreground font-sans">Tailor identities are hidden until you select one</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {/* TODO: replace with real bid data from API */}
            {mockBids.map((bid) => (
              <div key={bid.id} className="bg-card rounded-2xl border border-border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-foreground">{bid.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${TIER_STYLES[bid.tier]}`}>
                    {bid.tier}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="font-sans text-sm text-foreground">{bid.rating}</span>
                </div>
                <div className="font-sans text-sm text-muted-foreground space-y-1">
                  <p>Price: <span className="font-medium text-foreground">₹{bid.price.toLocaleString("en-IN")}</span></p>
                  <p>Delivery: <span className="font-medium text-foreground">{bid.days} days</span></p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setConfirmBid(bid)}
                >
                  Select This Tailor
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Tailor Dialog */}
      <AlertDialog open={!!confirmBid} onOpenChange={(open) => !open && setConfirmBid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {confirmBid?.name} for ₹{confirmBid?.price.toLocaleString("en-IN")}?</AlertDialogTitle>
            <AlertDialogDescription>
              Once confirmed, the tailor will begin work and other bids will be declined.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTailor}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══════ Existing Active Requests ══════ */}
      <h2 className="font-sans font-semibold text-foreground text-lg">Active Requests</h2>
      <div className="space-y-4">
        {activeRequests.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              <img src={redLehenga} alt={req.category} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-sans font-semibold text-foreground">{req.category}</h3>
                    <p className="text-sm text-muted-foreground font-sans">₹{req.budgetMin.toLocaleString("en-IN")} – ₹{req.budgetMax.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-sans font-medium ${req.status === "bids_received" ? "bg-success-light text-success" : "bg-info-light text-info"}`}>
                    {req.statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground mb-4">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="animate-countdown font-medium text-foreground">
                    {timers[i]?.days}d {timers[i]?.hours}h {timers[i]?.minutes}m {timers[i]?.seconds}s remaining
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm"><Edit className="w-3.5 h-3.5" /> Edit Bid</Button>
                  <Button
                    variant={req.bidsCount > 0 ? "gold" : "outline"}
                    size="sm"
                    disabled={req.bidsCount === 0}
                    onClick={() => navigate("/dashboard/view-bids")}
                  >
                    <Eye className="w-3.5 h-3.5" /> View Bids {req.bidsCount > 0 && `(${req.bidsCount})`}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <XIcon className="w-3.5 h-3.5" /> Close Bid
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══════ Past Requests ══════ */}
      <h2 className="font-sans font-semibold text-foreground text-lg">Past Requests</h2>
      {pastRequests.map((req) => (
        <div key={req.id} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-200 to-pink-100 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-sans font-semibold text-foreground">{req.category}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{req.vendorName} • {req.completedDate}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-sans font-medium bg-success-light text-success">{req.statusLabel}</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-sans text-sm font-medium text-foreground">{req.rating}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Edit className="w-3.5 h-3.5" /> Edit</Button>
                <Button variant="outline" size="sm"><Clock className="w-3.5 h-3.5" /> History</Button>
                <Button variant="gold" size="sm"><RotateCcw className="w-3.5 h-3.5" /> Repeat</Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ══════ 5-Milestone Tracker ══════ */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-foreground">Order Milestones</h2>
          <p className="text-sm text-muted-foreground font-sans">Your tailor uploads proof at each stage — you approve before work continues</p>
        </div>

        {/* TODO: remove demo button when backend connected */}
        <button
          onClick={() =>
            setMilestones((prev) =>
              prev.map((m) => m.id === 1 && m.status === "pending" ? { ...m, status: "awaiting_approval" } : m)
            )
          }
          className="text-xs text-muted-foreground underline font-sans"
        >
          Demo: Simulate M1 Upload
        </button>

        {/* Desktop: horizontal / Mobile: vertical */}
        {/* Vertical timeline (works for both, responsive) */}
        <div className="relative space-y-0">
          {milestones.map((m, i) => {
            const isLast = i === milestones.length - 1;

            const nodeColor =
              m.status === "approved" ? "bg-green-500 text-white" :
              m.status === "awaiting_approval" ? "bg-amber-500 text-white" :
              m.status === "changes_requested" ? "bg-destructive text-destructive-foreground" :
              "bg-muted text-muted-foreground";

            const lineColor =
              m.status === "approved" ? "bg-green-500" :
              m.status === "awaiting_approval" ? "bg-amber-500" :
              "bg-border border-dashed";

            const labelColor =
              m.status === "approved" ? "text-green-600 dark:text-green-400" :
              m.status === "awaiting_approval" ? "text-amber-600 dark:text-amber-400 font-bold" :
              m.status === "changes_requested" ? "text-destructive font-bold" :
              "text-muted-foreground";

            return (
              <div key={m.id} className="flex gap-4">
                {/* Node + connector line */}
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${nodeColor} ${m.status === "awaiting_approval" ? "animate-pulse" : ""}`}>
                    {m.status === "approved" && <CheckCircle2 className="w-5 h-5" />}
                    {m.status === "changes_requested" && <XIcon className="w-5 h-5" />}
                    {m.status === "awaiting_approval" && <AlertCircle className="w-5 h-5" />}
                    {m.status === "pending" && <Circle className="w-5 h-5" />}
                  </div>
                  {!isLast && <div className={`w-0.5 flex-1 min-h-[40px] ${lineColor}`} />}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <span className={`font-sans text-sm ${labelColor}`}>
                    M{m.id} — {m.label}
                  </span>

                  {m.status === "approved" && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-sans mt-1">Approved ✓</p>
                  )}

                  {m.status === "changes_requested" && (
                    <p className="text-xs text-destructive font-sans mt-1">Changes requested — awaiting tailor update</p>
                  )}

                  {m.status === "awaiting_approval" && (
                    <div className="mt-3 bg-card rounded-xl border border-border p-4 space-y-3">
                      <div className="bg-muted rounded-lg p-4 text-center text-sm text-muted-foreground font-sans">
                        Tailor has uploaded proof — tap to view
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApproveMilestone(m.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (changeNotes[m.id]?.trim()) {
                              handleRequestChanges(m.id);
                            }
                          }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Request Changes
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Describe what needs to change"
                          value={changeNotes[m.id] || ""}
                          onChange={(e) => setChangeNotes((prev) => ({ ...prev, [m.id]: e.target.value }))}
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!changeNotes[m.id]?.trim()}
                          onClick={() => handleRequestChanges(m.id)}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════ New Order Button ══════ */}
      <div className="pt-4">
        <Button variant="outline" onClick={() => navigate("/start")} className="gap-2">
          <Plus className="w-4 h-4" /> Start a New Order
        </Button>
      </div>
    </div>
  );
};

export default BiddingPage;
