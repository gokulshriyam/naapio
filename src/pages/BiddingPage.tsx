import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Edit, Eye, X as XIcon, Star, RotateCcw, Plus,
  CheckCircle2, ChevronDown, ChevronUp, Send, MapPin,
  MessageSquare, Shield, Award, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════

const formatBudget = (v: number): string => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1).replace(".0", "")}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1).replace(".0", "")}K`;
  return `₹${v}`;
};

const calcTimeLeft = (deadline: Date | string | number) => {
  const deadlineDate = deadline instanceof Date 
    ? deadline 
    : new Date(deadline);
  
  if (isNaN(deadlineDate.getTime())) {
    return { days: 7, hours: 0, minutes: 0, seconds: 0, total: 604800000 };
  }
  
  const total = deadlineDate.getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
    total,
  };
};

// Contact masking function
const maskContactInfo = (text: string): string => {
  // Mask Indian mobile numbers (with or without +91)
  let masked = text.replace(
    /(\+91[\s\-]?)?[6-9]\d{9}/g,
    '📵 [contact hidden]'
  );
  
  // Mask any 7+ consecutive digit string
  masked = masked.replace(
    /\b\d{7,}\b/g,
    '[number hidden]'
  );
  
  // Mask email addresses
  masked = masked.replace(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    '📵 [email hidden]'
  );
  
  // Mask WhatsApp references with numbers
  masked = masked.replace(
    /whatsapp\s*(me|at|on|:)?\s*(\+91[\s\-]?)?[6-9]\d{9}/gi,
    '📵 [WhatsApp hidden]'
  );
  
  return masked;
};

const daysSince = (d: Date) => Math.floor((Date.now() - d.getTime()) / 86400000);

// ═══════════════════════════════════════
// Type badges
// ═══════════════════════════════════════

const ORDER_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  "New Order": { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-800 dark:text-pink-300" },
  Alteration: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300" },
  "Own Fabric": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300" },
  Customise: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-300" },
};

const TIER_COLORS: Record<string, string> = {
  Gold: "bg-amber-400 text-amber-950",
  Silver: "bg-slate-300 text-slate-800",
  Bronze: "bg-amber-700 text-amber-50",
};

const TIER_BORDER: Record<string, string> = {
  Gold: "border-amber-400/60",
  Silver: "border-slate-300/60",
  Bronze: "border-amber-700/40",
};

// ═══════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════

interface ActiveOrder {
  id: string;
  orderType: string;
  garment: string;
  occasion: string;
  budgetRange: { min: number; max: number };
  deliveryDate: string;
  postedAt: Date;
  bidDeadline: Date;
  status: string;
  bidsReceived: number;
  measurementsSubmitted: boolean;
  rushOrder: boolean;
  inspirationThumb: string;
}

const defaultActiveOrders: ActiveOrder[] = [
  {
    id: "NP-2026-00142",
    orderType: "New Order",
    garment: "Women's · Salwar Kameez · Embroidered",
    occasion: "Festival / Puja",
    budgetRange: { min: 45000, max: 60000 },
    deliveryDate: "2026-04-20",
    postedAt: new Date(Date.now() - 0.5 * 86400000),
    bidDeadline: new Date(Date.now() + 6.5 * 86400000),
    status: "awaiting_bids",
    bidsReceived: 0,
    measurementsSubmitted: false,
    rushOrder: false,
    inspirationThumb: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=80&h=80&fit=crop",
  },
  {
    id: "NP-2026-00098",
    orderType: "New Order",
    garment: "Women's · Lehenga · Party Lehenga",
    occasion: "Party / Night Out",
    budgetRange: { min: 25000, max: 35000 },
    deliveryDate: "2026-04-01",
    postedAt: new Date(Date.now() - 5 * 86400000),
    bidDeadline: new Date(Date.now() + 2 * 86400000),
    status: "bids_received",
    bidsReceived: 8,
    measurementsSubmitted: true,
    rushOrder: false,
    inspirationThumb: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=80&h=80&fit=crop",
  },
];

const mockBids = [
  { id: "BID-001", orderId: "NP-2026-00098", alias: "Artisan Gold-7", realName: "Priya Designs Studio", tier: "Gold", rating: 4.9, reviewCount: 234, completionRate: 97, disputeRate: 1.2, speciality: "Bridal & Embroidered Lehenga", location: "Jayanagar, Bangalore", bidAmount: 31500, deliveryDays: 18, rankScore: 96, badge: "Best Match" as string | null, portfolioImages: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=200&fit=crop", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&h=200&fit=crop", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop"], note: "I specialise in heavily embroidered lehengas. Can match reference exactly." },
  { id: "BID-002", orderId: "NP-2026-00098", alias: "Artisan Gold-3", realName: "Rithika Creations", tier: "Gold", rating: 4.7, reviewCount: 178, completionRate: 94, disputeRate: 2.1, speciality: "Lehenga & Anarkali", location: "Koramangala, Bangalore", bidAmount: 28800, deliveryDays: 22, rankScore: 91, badge: "Best Value" as string | null, portfolioImages: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=200&fit=crop"], note: "15 years experience. Delivery guaranteed or full refund." },
  { id: "BID-003", orderId: "NP-2026-00098", alias: "Artisan Silver-12", realName: "Meera Tailors", tier: "Silver", rating: 4.5, reviewCount: 89, completionRate: 91, disputeRate: 3.4, speciality: "Ethnic Wear", location: "Marathahalli, Bangalore", bidAmount: 26200, deliveryDays: 20, rankScore: 84, badge: null, portfolioImages: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&h=200&fit=crop"], note: "Affordable pricing with quality focus." },
  { id: "BID-004", orderId: "NP-2026-00098", alias: "Artisan Silver-5", realName: "Chennai Craft House", tier: "Silver", rating: 4.3, reviewCount: 67, completionRate: 88, disputeRate: 4.1, speciality: "General Ethnic", location: "HSR Layout, Bangalore", bidAmount: 25500, deliveryDays: 25, rankScore: 79, badge: null, portfolioImages: [], note: "" },
  { id: "BID-005", orderId: "NP-2026-00098", alias: "Artisan Bronze-19", realName: "Lakshmi Stitchery", tier: "Bronze", rating: 4.1, reviewCount: 45, completionRate: 85, disputeRate: 5.2, speciality: "General Tailoring", location: "Electronic City, Bangalore", bidAmount: 25000, deliveryDays: 21, rankScore: 73, badge: null, portfolioImages: [], note: "" },
  { id: "BID-006", orderId: "NP-2026-00098", alias: "Artisan Bronze-8", realName: "Heritage Tailors", tier: "Bronze", rating: 3.9, reviewCount: 34, completionRate: 82, disputeRate: 6.8, speciality: "General Tailoring", location: "Whitefield, Bangalore", bidAmount: 24500, deliveryDays: 28, rankScore: 67, badge: null, portfolioImages: [], note: "" },
  { id: "BID-007", orderId: "NP-2026-00098", alias: "Artisan Bronze-2", realName: "Heritage Tailors", tier: "Bronze", rating: 3.7, reviewCount: 28, completionRate: 79, disputeRate: 8.1, speciality: "Basic Stitching", location: "Hebbal, Bangalore", bidAmount: 25800, deliveryDays: 30, rankScore: 61, badge: null, portfolioImages: [], note: "" },
  { id: "BID-008", orderId: "NP-2026-00098", alias: "Artisan Bronze-14", realName: "Heritage Tailors", tier: "Bronze", rating: 3.5, reviewCount: 19, completionRate: 75, disputeRate: 10.2, speciality: "Basic Stitching", location: "Yelahanka, Bangalore", bidAmount: 25200, deliveryDays: 35, rankScore: 54, badge: null, portfolioImages: [], note: "" },
];

interface PastOrder {
  id: string;
  orderType: string;
  garment: string;
  status: string;
  completedAt?: string;
  artisanAlias?: string;
  finalAmount?: number;
  rating?: number;
  postedAt?: string;
  bidsReceived?: number;
  note?: string;
}

const defaultPastOrders: PastOrder[] = [
  { id: "NP-2025-00034", orderType: "Alteration", garment: "Women's · Saree Blouse", status: "completed", completedAt: "Dec 2025", artisanAlias: "Artisan Gold-7", finalAmount: 1200, rating: 4.8 },
  { id: "NP-2025-00021", orderType: "New Order", garment: "Men's · Kurta · Casual Kurta", status: "expired", postedAt: "Nov 2025", bidsReceived: 0, note: "Bid window closed with no responses" },
];

// ═══════════════════════════════════════
// Countdown Hook
// ═══════════════════════════════════════

function useCountdown(deadline: Date) {
  const [tl, setTl] = useState(() => calcTimeLeft(deadline));
  useEffect(() => {
    const id = setInterval(() => setTl(calcTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return tl;
}

// ═══════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════

const CountdownTimer = ({ deadline, postedAt }: { deadline: Date; postedAt: Date }) => {
  const tl = useCountdown(deadline);
  const elapsed = daysSince(postedAt);
  const pct = Math.min(100, (elapsed / 7) * 100);
  const daysLeft = tl.days;
  const barColor = daysLeft > 3 ? "bg-success" : daysLeft >= 1 ? "bg-warning" : "bg-destructive";

  // Render countdown based on remaining time
  const renderCountdown = () => {
    if (tl.days > 0) {
      return `${tl.days}d ${tl.hours}h ${tl.minutes}m remaining`;
    } else if (tl.hours > 0) {
      return `${tl.hours}h ${tl.minutes}m remaining`;
    } else {
      return `${tl.minutes}m ${tl.seconds}s remaining`;
    }
  };

  return (
    <div className="mt-3">
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1.5 text-xs font-sans text-muted-foreground">
        <span>Posted {elapsed} day{elapsed !== 1 ? "s" : ""} ago</span>
        <span className="font-medium">{renderCountdown()}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// Bidding Room
// ═══════════════════════════════════════

const sortFns: Record<string, (a: typeof mockBids[0], b: typeof mockBids[0]) => number> = {
  Recommended: (a, b) => b.rankScore - a.rankScore,
  Rating: (a, b) => b.rating - a.rating,
  Delivery: (a, b) => a.deliveryDays - b.deliveryDays,
  "Price: Low-High": (a, b) => a.bidAmount - b.bidAmount,
  Nearest: () => 0,
};

const BiddingRoom = ({
  order,
  onAccept,
}: {
  order: ActiveOrder;
  onAccept: (bid: typeof mockBids[0]) => void;
}) => {
  const [sortBy, setSortBy] = useState("Recommended");
  const [showAll, setShowAll] = useState(false);
  const [showRankInfo, setShowRankInfo] = useState(false);
  const [expandedPortfolio, setExpandedPortfolio] = useState<string | null>(null);
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, { text: string; from: string }[]>>({});
  const [chatInput, setChatInput] = useState("");
  const [ignoredBids, setIgnoredBids] = useState<Set<string>>(new Set());
  const [undoTimers, setUndoTimers] = useState<Record<string, NodeJS.Timeout>>({});

  const tl = useCountdown(order.bidDeadline);
  const sorted = [...mockBids].sort(sortFns[sortBy] || sortFns.Recommended);
  const visible = sorted.filter((b) => !ignoredBids.has(b.id));
  const displayed = showAll ? visible : visible.slice(0, 4);
  const hiddenCount = visible.length - 4;

  const handleIgnore = (bidId: string) => {
    setIgnoredBids((prev) => new Set(prev).add(bidId));
    const timer = setTimeout(() => {
      setUndoTimers((prev) => {
        const n = { ...prev };
        delete n[bidId];
        return n;
      });
    }, 5000);
    setUndoTimers((prev) => ({ ...prev, [bidId]: timer }));
  };

  const handleUndo = (bidId: string) => {
    setIgnoredBids((prev) => {
      const n = new Set(prev);
      n.delete(bidId);
      return n;
    });
    if (undoTimers[bidId]) clearTimeout(undoTimers[bidId]);
    setUndoTimers((prev) => {
      const n = { ...prev };
      delete n[bidId];
      return n;
    });
  };

  const handleSendChat = (bidId: string) => {
    if (!chatInput.trim()) return;
    const rawMsg = chatInput.trim();
    const maskedMsg = maskContactInfo(rawMsg);
    const wasContactMasked = rawMsg !== maskedMsg;
    
    setChatMessages((prev) => ({
      ...prev,
      [bidId]: [...(prev[bidId] || []), { text: maskedMsg, from: "you", masked: wasContactMasked }],
    }));
    setChatInput("");
    
    if (wasContactMasked) {
      toast.info("ℹ️ Contact info was hidden — share after selection");
    }
    
    setTimeout(() => {
      setChatMessages((prev) => ({
        ...prev,
        [bidId]: [...(prev[bidId] || []), { text: "Thank you for your message. I'll review your brief and respond shortly.", from: "tailor" }],
      }));
    }, 1000);
  };

  return (
    <div className="border-t border-border pt-5 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-serif font-bold text-foreground">Bidding Room — {order.bidsReceived} tailors have responded</h3>
          <p className="text-xs text-muted-foreground font-sans">Tailor identities are revealed only after you select and confirm payment.</p>
        </div>
        <span className="text-xs font-sans text-muted-foreground shrink-0">{tl.days}d {tl.hours}h remaining to review</span>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-xs font-sans text-muted-foreground">Sort by:</span>
        {Object.keys(sortFns).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1 rounded-full text-xs font-sans transition-colors ${
              sortBy === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s} {sortBy === s && "✓"}
          </button>
        ))}
      </div>

      {/* Ranking info */}
      <button onClick={() => setShowRankInfo(!showRankInfo)} className="flex items-center gap-1 text-xs text-muted-foreground font-sans mb-4 hover:text-foreground">
        <Info className="w-3 h-3" /> How is Recommended order calculated?
        {showRankInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {showRankInfo && (
        <p className="text-xs font-sans text-muted-foreground mb-4 p-3 bg-muted rounded-lg">
          ⭐ Customer ratings (40%) · ✅ Completion rate (30%) · 🛡️ Low dispute rate (20%) · 🏆 Tier (10%). Tailors who perform better rise in ranking — this is how quality artisans grow on Naapio.
        </p>
      )}

      {/* Bid cards */}
      <div className="space-y-4">
        {displayed.map((bid, idx) => {
          const isIgnored = ignoredBids.has(bid.id) && undoTimers[bid.id];

          if (isIgnored) {
            return (
              <div key={bid.id} className="p-4 bg-muted rounded-xl flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-sans">Bid ignored</span>
                <button onClick={() => handleUndo(bid.id)} className="text-xs text-accent font-sans hover:underline">Undo ignore →</button>
              </div>
            );
          }

          return (
            <div
              key={bid.id}
              className={`bg-card rounded-xl border p-4 ${TIER_BORDER[bid.tier] || "border-border"} ${idx < 3 ? "shadow-md" : "shadow-sm"}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-sans ${TIER_COLORS[bid.tier]}`}>
                    #{sorted.indexOf(bid) + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-medium ${TIER_COLORS[bid.tier]}`}>{bid.tier}</span>
                      {bid.badge === "Best Match" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-success text-success-foreground font-sans font-medium">Best Match</span>}
                      {bid.badge === "Best Value" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-info text-primary-foreground font-sans font-medium">Best Value</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-serif font-bold text-accent">{formatBudget(bid.bidAmount)}</p>
                  <p className="text-xs text-muted-foreground font-sans">{bid.deliveryDays} days</p>
                </div>
              </div>

              {/* Middle */}
              <div className="mt-2">
                <p className="font-sans font-semibold text-sm text-foreground">{bid.alias}</p>
                <p className="text-xs text-muted-foreground font-sans italic">{bid.speciality}</p>
                <p className="text-xs text-muted-foreground font-sans flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{bid.location}</p>
              </div>

              {/* Stats — allow wrapping */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs font-sans text-muted-foreground">
                <span>⭐ {bid.rating} ({bid.reviewCount} reviews)</span>
                <span>✅ {bid.completionRate}% completed</span>
                <span>🛡️ {bid.disputeRate}% disputes</span>
              </div>

              {/* Quality bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-sans text-muted-foreground mb-1">
                  <span>Quality Score</span>
                  <span>{bid.rankScore}/100</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${bid.rankScore}%` }} />
                </div>
              </div>

              {/* Note */}
              {bid.note && (
                <div className="mt-3 p-2.5 bg-muted rounded-lg">
                  <p className="text-xs font-sans text-foreground italic">"{bid.note}"</p>
                </div>
              )}

              {/* Portfolio */}
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setExpandedPortfolio(expandedPortfolio === bid.id ? null : bid.id)}
                  className="text-xs font-sans text-accent hover:underline"
                >
                  {expandedPortfolio === bid.id ? "Close Portfolio ↑" : "View Portfolio →"}
                </button>
                {expandedPortfolio === bid.id && (
                  <div className="pt-2">
                    <p className="text-xs font-sans font-medium text-foreground mb-2">Portfolio — {bid.alias}</p>
                    {bid.portfolioImages.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {bid.portfolioImages.map((img, i) => (
                          <img key={i} src={img} alt={`Portfolio ${i + 1}`} className="w-32 h-32 rounded-lg object-cover shrink-0" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground font-sans">Portfolio not yet submitted — this artisan is new to the platform.</p>
                    )}
                    <p className="text-[10px] text-muted-foreground font-sans mt-2">Work samples verified by Naapio quality team.</p>
                  </div>
                )}
              </div>

              {/* Chat */}
              <div className="mt-2">
                <button
                  onClick={() => setExpandedChat(expandedChat === bid.id ? null : bid.id)}
                  className="text-xs font-sans text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  {expandedChat === bid.id ? "Collapse chat ↑" : "Send Message"}
                </button>
                {expandedChat === bid.id && (
                  <div className="mt-2 border border-border rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-muted flex items-center justify-between">
                      <span className="text-xs font-sans font-medium text-foreground">Message {bid.alias}</span>
                      <span className="text-[10px] text-muted-foreground font-sans">Contacts masked until selection</span>
                    </div>
                    {/* Contact masking notice */}
                    <div className="px-3 py-2 bg-warning-light border-b border-warning/20">
                      <p className="text-[10px] text-foreground font-sans">
                        🔒 Contact details are automatically masked. Exchange contacts only after selecting your artisan.
                      </p>
                    </div>
                    <div className="h-40 overflow-y-auto p-3 space-y-2 bg-card">
                      {(!chatMessages[bid.id] || chatMessages[bid.id].length === 0) && (
                        <p className="text-xs text-muted-foreground font-sans text-center py-8">Ask about fabric options, timeline, or previous work.</p>
                      )}
                      {(chatMessages[bid.id] || []).map((m, i) => (
                        <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-sans ${
                            m.from === "you" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                          }`}>
                            {maskContactInfo(m.text)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 p-2 border-t border-border">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="h-8 text-xs"
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat(bid.id)}
                      />
                      <Button size="sm" variant="gold" className="h-8 px-3" onClick={() => handleSendChat(bid.id)}>
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="text-xs text-muted-foreground" onClick={() => handleIgnore(bid.id)}>
                  <XIcon className="w-3 h-3 mr-1" /> Ignore
                </Button>
                <Button size="sm" variant="gold" className="text-xs flex-1" onClick={() => onAccept(bid)}>
                  ✓ Accept This Bid
                </Button>
              </div>
            </div>
          );
        })}

        {!showAll && hiddenCount > 0 && (
          <button onClick={() => setShowAll(true)} className="w-full py-3 text-center text-sm font-sans text-accent hover:underline">
            Show {hiddenCount} more bid{hiddenCount > 1 ? "s" : ""} ↓
          </button>
        )}
        {showAll && hiddenCount > 0 && (
          <button onClick={() => setShowAll(false)} className="w-full py-3 text-center text-sm font-sans text-accent hover:underline">
            Show fewer ↑
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// Main Dashboard
// ═══════════════════════════════════════

const BiddingPage = () => {
  const navigate = useNavigate();

  // Build active orders from mock + localStorage
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(() => {
    const orders = [...defaultActiveOrders];
    try {
      const raw = localStorage.getItem("naapio_last_order");
      if (raw) {
        const lo = JSON.parse(raw);
        const existingId = lo.id || lo.orderId;
        const alreadyExists = orders.some(o => o.id === existingId);
        
        if (!alreadyExists) {
          const postedTimestamp = lo.timestamp || lo.createdAt || lo.postedAt || Date.now();
          const postedDate = new Date(postedTimestamp);
          const bidDeadline = new Date(postedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          // Parse budget range properly
          let budgetRange = { min: 5000, max: 20000 };
          if (lo.budgetRange) {
            if (typeof lo.budgetRange === "string") {
              // Try to parse string format like "₹5K – ₹20K"
              budgetRange = { min: 5000, max: 20000 };
            } else if (Array.isArray(lo.budgetRange) && lo.budgetRange.length === 2) {
              budgetRange = { min: lo.budgetRange[0], max: lo.budgetRange[1] };
            } else if (typeof lo.budgetRange === "object" && lo.budgetRange.min !== undefined) {
              budgetRange = lo.budgetRange;
            }
          }
          
          orders.unshift({
            id: existingId || `NP-${Date.now()}`,
            orderType: lo.orderType || "New Order",
            garment: lo.garment || [lo.gender === "men" ? "Men's" : "Women's", lo.selectedCategory, lo.selectedSubCategory].filter(Boolean).join(' · ') || 'Custom Order',
            occasion: lo.occasion || lo.selectedOccasion || "",
            budgetRange,
            deliveryDate: lo.deliveryDate || "",
            postedAt: postedDate,
            bidDeadline: bidDeadline,
            status: "awaiting_bids",
            bidsReceived: 0,
            measurementsSubmitted: lo.measurementType ? lo.measurementType !== "later" : false,
            rushOrder: lo.isRushOrder || lo.rushOrder || false,
            inspirationThumb: lo.inspirationPhoto || "",
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse saved order:', e);
    }
    return orders;
  });

  const [pastOrders, setPastOrders] = useState<PastOrder[]>(defaultPastOrders);
  const [biddingRoomOpen, setBiddingRoomOpen] = useState<string | null>(null);
  const [whileYouWaitOpen, setWhileYouWaitOpen] = useState<string | null>(null);
  const [closeBidDialog, setCloseBidDialog] = useState<string | null>(null);
  const [acceptBid, setAcceptBid] = useState<typeof mockBids[0] | null>(null);
  const [acceptOrderId, setAcceptOrderId] = useState<string | null>(null);

  const needsMeasurementsBanner = activeOrders.some(
    (o) => !o.measurementsSubmitted && o.status !== "completed" && o.status !== "expired"
  );

  const handleCloseBid = (orderId: string) => {
    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
    setPastOrders((prev) => [
      { id: orderId, orderType: "New Order", garment: activeOrders.find((o) => o.id === orderId)?.garment || "", status: "expired", postedAt: "Mar 2026", bidsReceived: 0, note: "Closed by customer" },
      ...prev,
    ]);
    setCloseBidDialog(null);
    toast.success("Brief closed.");
  };

  const handleAcceptBid = () => {
    if (!acceptBid || !acceptOrderId) return;
    setActiveOrders((prev) =>
      prev.map((o) => (o.id === acceptOrderId ? { ...o, status: "tailor_selected" } : o))
    );
    toast.success(`✓ ${acceptBid.alias} selected! Order milestones are now active.`);

    // Save accepted bid details to localStorage
    localStorage.setItem('naapio_active_order', JSON.stringify({
      orderId: acceptOrderId,
      artisanAlias: acceptBid.alias,
      artisanTier: acceptBid.tier,
      artisanRating: acceptBid.rating,
      artisanCompletionRate: acceptBid.completionRate,
      artisanDisputeRate: acceptBid.disputeRate,
      bidAmount: acceptBid.bidAmount,
      netPayable: acceptBid.bidAmount - 499,
      deliveryDays: acceptBid.deliveryDays,
      acceptedAt: new Date().toISOString(),
    }));
    // TODO: PAYMENT_INTEGRATION — before launch, trigger
    // Razorpay payment here. On success callback:
    // save to naapio_active_order then navigate.

    setAcceptBid(null);
    setAcceptOrderId(null);
    navigate('/dashboard/active-orders');
  };

  const handleReorder = (order: PastOrder | ActiveOrder, mode: "same" | "changes") => {
    const draft = {
      step: mode === "same" ? 3 : 1,
      step2Phase: mode === "same" ? "fabric" : "category",
      step3Phase: mode === "same" ? "colour" : "feel",
      orderType: "new-order",
      gender: order.garment.includes("Men") ? "men" : "women",
      selectedCategory: order.garment.split(" · ")[1] || "",
      selectedSubCategory: order.garment.split(" · ")[2] || "",
      measurementType: "saved",
      isReorder: true,
      reorderMode: mode,
    };
    localStorage.setItem("naapio_wizard_draft", JSON.stringify(draft));
    navigate("/wizard");
  };

  const shareOnWhatsApp = (order: ActiveOrder) => {
    const text = `Check out my custom order on Naapio! Order #${order.id} — ${order.garment}. Track at naapio.lovable.app/order/${order.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-serif font-bold text-foreground">My Orders</h1>
        <Button variant="gold" size="sm" onClick={() => navigate("/start")} className="hidden sm:inline-flex">
          <Plus className="w-4 h-4 mr-1" /> New Order
        </Button>
      </div>

      {/* Measurements Banner */}
      {needsMeasurementsBanner && (
        <div className="mb-5 p-4 bg-warning-light rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">📏</span>
            <div>
              <p className="font-sans font-semibold text-sm text-foreground">Measurements missing on one or more orders</p>
              <p className="text-xs text-muted-foreground font-sans">Tailors cannot finalise bids without your measurements. Submit them now to avoid delays.</p>
            </div>
          </div>
          <Button size="sm" variant="gold" className="shrink-0" onClick={() => navigate("/wizard")}>
            Submit Measurements →
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="w-full grid grid-cols-2 mb-5 h-12">
          <TabsTrigger value="active" className="text-sm font-sans h-12 min-h-[48px]">
            Active Requests <Badge className="ml-2 bg-accent/20 text-accent text-[10px]">{activeOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="past" className="text-sm font-sans h-12 min-h-[48px]">
            Past Requests <Badge className="ml-2 bg-muted text-muted-foreground text-[10px]">{pastOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* ═══ ACTIVE TAB ═══ */}
        <TabsContent value="active">
          {activeOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl mb-4">🧵</span>
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">No active orders yet</h2>
              <p className="text-muted-foreground font-sans text-sm mb-6 max-w-sm mx-auto">
                Post your first brief and get bids from verified artisans in your city.
              </p>
              <Button variant="gold" size="lg" onClick={() => navigate("/start")}>Start Your First Order →</Button>
              <p className="text-xs text-muted-foreground font-sans mt-4">
                ₹499 to post · 7 days to receive bids · Escrow protected
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {activeOrders.map((order) => {
                const statusBorder: Record<string, string> = {
                  awaiting_bids: "border-l-warning",
                  bids_received: "border-l-success",
                  tailor_selected: "border-l-info",
                  in_progress: "border-l-purple-500",
                };
                const statusPill: Record<string, { icon: string; label: string; cls: string }> = {
                  awaiting_bids: { icon: "⏳", label: "Awaiting Bids", cls: "bg-warning-light text-warning" },
                  bids_received: { icon: "🎯", label: `${order.bidsReceived} Bids Received`, cls: "bg-success-light text-success" },
                  tailor_selected: { icon: "✅", label: "Tailor Selected", cls: "bg-info-light text-info" },
                  in_progress: { icon: "🪡", label: "In Progress", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
                };
                const sp = statusPill[order.status] || statusPill.awaiting_bids;
                const badge = ORDER_TYPE_STYLES[order.orderType] || ORDER_TYPE_STYLES["New Order"];

                return (
                  <div key={order.id} className={`bg-card rounded-xl border border-border border-l-4 ${statusBorder[order.status] || ""} p-4`}>
                    {/* Top row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-medium ${badge.bg} ${badge.text}`}>{order.orderType}</span>
                        <span className="text-xs text-muted-foreground font-sans">#{order.id}</span>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-sans font-medium ${sp.cls}`}>
                        {sp.icon} {sp.label}
                      </span>
                    </div>

                    {/* Garment row */}
                    <div className="flex gap-3 mt-3">
                      {order.inspirationThumb ? (
                        <img src={order.inspirationThumb} alt="Inspiration" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">👗</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-semibold text-sm text-foreground truncate">{order.garment}</p>
                        <p className="text-xs text-muted-foreground font-sans">{order.occasion} · Delivery: {order.deliveryDate}</p>
                        <p className="text-xs text-muted-foreground font-sans">{formatBudget(order.budgetRange.min)} – {formatBudget(order.budgetRange.max)}</p>
                        {order.rushOrder && <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning-light text-warning font-sans font-medium mt-1 inline-block">⚡ Rush</span>}
                      </div>
                    </div>

                    {/* Countdown */}
                    {(order.status === "awaiting_bids" || order.status === "bids_received") && (
                      <CountdownTimer deadline={order.bidDeadline} postedAt={order.postedAt} />
                    )}

                    {/* Action row — stack on mobile */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => navigate("/wizard")}>
                        <Edit className="w-3 h-3 mr-1" /> Edit Brief
                      </Button>
                      <Button
                        size="sm"
                        variant={order.bidsReceived > 0 ? "outline-gold" : "outline"}
                        className="text-xs w-full sm:w-auto"
                        disabled={order.bidsReceived === 0}
                        onClick={() => setBiddingRoomOpen(biddingRoomOpen === order.id ? null : order.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" /> View Bids ({order.bidsReceived})
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs text-muted-foreground w-full sm:w-auto" onClick={() => setCloseBidDialog(order.id)}>
                        <XIcon className="w-3 h-3 mr-1" /> Close Bid
                      </Button>
                    </div>

                    {/* While you wait */}
                    {order.status === "awaiting_bids" && (
                      <div className="mt-3">
                        <button
                          onClick={() => setWhileYouWaitOpen(whileYouWaitOpen === order.id ? null : order.id)}
                          className="text-xs font-sans text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          {whileYouWaitOpen === order.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          While you wait
                        </button>
                        {whileYouWaitOpen === order.id && (
                          <div className="mt-2 space-y-2 pl-4">
                            {!order.measurementsSubmitted ? (
                              <button onClick={() => navigate("/wizard")} className="text-xs font-sans text-accent hover:underline block">📏 Submit measurements</button>
                            ) : (
                              <span className="text-xs font-sans text-success block">✓ Measurements submitted</span>
                            )}
                            <button onClick={() => shareOnWhatsApp(order)} className="text-xs font-sans text-accent hover:underline block">📲 Share your brief on WhatsApp</button>
                            <button onClick={() => navigate(`/order/${order.id}`)} className="text-xs font-sans text-accent hover:underline block">📋 Review your brief</button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bidding Room */}
                    {biddingRoomOpen === order.id && order.bidsReceived > 0 && (
                      <BiddingRoom
                        order={order}
                        onAccept={(bid) => {
                          setAcceptBid(bid);
                          setAcceptOrderId(order.id);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ═══ PAST TAB ═══ */}
        <TabsContent value="past">
          {pastOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">📋</span>
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">No past orders</h2>
              <p className="text-muted-foreground font-sans text-sm">Your completed orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-card rounded-xl border border-border border-l-4 p-4 ${
                    order.status === "completed" ? "border-l-success" : "border-l-destructive"
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-medium ${
                        order.status === "completed" ? "bg-success-light text-success" : "bg-destructive/10 text-destructive"
                      }`}>
                        {order.status === "completed" ? "✅ Completed" : "❌ No Bids"}
                      </span>
                      <span className="text-xs text-muted-foreground font-sans">#{order.id}</span>
                    </div>
                  </div>

                  <p className="font-sans font-semibold text-sm text-foreground mt-2">{order.garment}</p>

                  {order.status === "completed" && (
                    <>
                      <p className="text-xs text-muted-foreground font-sans mt-1">
                        Completed {order.completedAt} · {order.artisanAlias} · ₹{order.finalAmount?.toLocaleString("en-IN")}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-sm ${s <= Math.round(order.rating || 0) ? "text-accent" : "text-muted-foreground/30"}`}>★</span>
                        ))}
                        <span className="text-xs text-muted-foreground font-sans ml-1">{order.rating}/5.0</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button size="sm" variant="gold" className="text-xs" onClick={() => handleReorder(order, "same")}>🔄 Reorder Same Design</Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => handleReorder(order, "changes")}>✏️ Reorder with Changes</Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/order/${order.id}`)}>📋 View Details</Button>
                      </div>
                    </>
                  )}

                  {order.status === "expired" && (
                    <>
                      <p className="text-xs text-muted-foreground font-sans mt-1">Posted {order.postedAt} · {order.note}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button size="sm" variant="gold" className="text-xs" onClick={() => navigate("/start")}>↻ Repost Brief</Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-muted-foreground"
                          onClick={() => setPastOrders((prev) => prev.filter((o) => o.id !== order.id))}
                        >
                          🗑 Archive
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate("/start")}
        className="md:hidden fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Close Bid Dialog */}
      <AlertDialog open={!!closeBidDialog} onOpenChange={() => setCloseBidDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this brief?</AlertDialogTitle>
            <AlertDialogDescription>The ₹499 posting fee is non-refundable.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => closeBidDialog && handleCloseBid(closeBidDialog)}>Confirm Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Accept Bid Confirmation */}
      <AlertDialog open={!!acceptBid} onOpenChange={() => { setAcceptBid(null); setAcceptOrderId(null); }}>
        <AlertDialogContent className="max-w-md sm:max-w-md max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Accept {acceptBid?.alias}'s bid?</AlertDialogTitle>
          </AlertDialogHeader>
          {acceptBid && (
            <div className="space-y-4 text-sm font-sans">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Artisan:</span> <span className="font-medium">{acceptBid.alias} ({acceptBid.tier})</span></div>
                <div><span className="text-muted-foreground">Quality:</span> <span className="font-medium">{acceptBid.rankScore}/100</span></div>
                <div><span className="text-muted-foreground">Delivery:</span> <span className="font-medium">{acceptBid.deliveryDays} days</span></div>
              </div>

              {/* Payment Summary Card */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium text-foreground mb-3">Payment Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artisan bid</span>
                    <span className="font-medium">{formatBudget(acceptBid.bidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brief fee (paid)</span>
                    <span className="font-medium text-success">- ₹499</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Amount payable now</span>
                    <span className="font-bold text-lg font-serif text-accent">{formatBudget(acceptBid.bidAmount - 499)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-success-light rounded-lg text-xs">
                <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <p className="text-foreground">Your payment is protected. Funds are only released after your final approval.</p>
              </div>
            </div>
          )}
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptBid} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              Confirm & Proceed to Payment →
            </AlertDialogAction>
          </AlertDialogFooter>
          {/* TODO: PAYMENT_INTEGRATION — before launch, replace navigate() with Razorpay/payment gateway call.
              On payment success callback: navigate to /order/:id
              On payment failure: show error, keep modal open with retry */}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BiddingPage;
