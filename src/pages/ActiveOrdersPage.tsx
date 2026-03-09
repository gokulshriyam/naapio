import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Lock, ArrowLeft, Star, Play, Package, Scissors, Video, Ruler, Truck, Shield,
  Copy, ExternalLink, MessageSquare, AlertTriangle, ChevronDown, ChevronUp,
  Paperclip, FileText, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import redLehenga from "@/assets/red-lehenga.jpg";
import virtualTrialCover from "@/assets/virtualtrialcover.jpg";

import { resolveGarmentConfig, type GarmentMeasurementConfig, type MeasurementField } from "@/data/measurementConfig";

// MEASUREMENT_CONFIG, resolveGarmentConfig, types
// are now imported from @/data/measurementConfig


// ═══════════════════════════════════════
// Size Reference Tables
// ═══════════════════════════════════════

const WOMEN_SIZES = [
  { size: 'XS', chest: '31–32"', waist: '24–25"', hips: '34–35"', eu: '34', us: '2', uk: '6' },
  { size: 'S', chest: '33–34"', waist: '26–27"', hips: '36–37"', eu: '36', us: '4', uk: '8' },
  { size: 'M', chest: '35–36"', waist: '28–29"', hips: '38–39"', eu: '38', us: '6', uk: '10' },
  { size: 'L', chest: '37–39"', waist: '30–32"', hips: '40–42"', eu: '40', us: '8', uk: '12' },
  { size: 'XL', chest: '40–42"', waist: '33–35"', hips: '43–45"', eu: '42', us: '10', uk: '14' },
  { size: 'XXL', chest: '43–45"', waist: '36–38"', hips: '46–48"', eu: '44', us: '12', uk: '16' },
  { size: 'XXXL', chest: '46–48"', waist: '39–41"', hips: '49–51"', eu: '46', us: '14', uk: '18' },
];

const MEN_SIZES = [
  { size: 'XS', chest: '34–35"', waist: '28–29"', shoulder: '16"', eu: '44', usuk: '34' },
  { size: 'S', chest: '36–37"', waist: '30–31"', shoulder: '17"', eu: '46', usuk: '36' },
  { size: 'M', chest: '38–39"', waist: '32–33"', shoulder: '18"', eu: '48', usuk: '38' },
  { size: 'L', chest: '40–41"', waist: '34–35"', shoulder: '19"', eu: '50', usuk: '40' },
  { size: 'XL', chest: '42–43"', waist: '36–37"', shoulder: '20"', eu: '52', usuk: '42' },
  { size: 'XXL', chest: '44–45"', waist: '38–39"', shoulder: '21"', eu: '54', usuk: '44' },
  { size: 'XXXL', chest: '46–48"', waist: '40–42"', shoulder: '22"', eu: '56', usuk: '46' },
];

// ═══════════════════════════════════════
// Tip emoji helper
// ═══════════════════════════════════════

const getTipEmoji = (field: string): string => {
  const f = field.toLowerCase();
  if (f.includes('chest') || f.includes('bust')) return '📏';
  if (f.includes('waist')) return '〰️';
  if (f.includes('shoulder')) return '🫱';
  if (f.includes('length') || f.includes('height')) return '📐';
  if (f.includes('sleeve') || f.includes('bicep')) return '💪';
  if (f.includes('hip') || f.includes('ankle') || f.includes('thigh') || f.includes('knee')) return '🧍';
  return '📏';
};

// ═══════════════════════════════════════
// Constants
// ═══════════════════════════════════════

const MILESTONES = [
  { id: 1, title: "Measurements", icon: Ruler },
  { id: 2, title: "Fabric Approval", icon: Scissors },
  { id: 3, title: "Stitching", icon: Scissors },
  { id: 4, title: "Fitting Video", icon: Video },
  { id: 5, title: "Delivery", icon: Package },
];

const TIER_COLORS: Record<string, string> = {
  Gold: "bg-amber-400 text-amber-950",
  Silver: "bg-slate-300 text-slate-800",
  Bronze: "bg-amber-700 text-amber-50",
};

const TIER_BORDER_COLORS: Record<string, string> = {
  Gold: "border-amber-400",
  Silver: "border-slate-300",
  Bronze: "border-amber-700",
};

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const stitchStages = [
  { icon: '✂️', label: 'Pattern marked & cut', detail: 'Fabric cut precisely to your measurements', day: 'Day 1' },
  { icon: '🪡', label: 'Stitching begun', detail: 'Main seams joined, garment taking shape', day: 'Day 2–3' },
  { icon: '🧵', label: 'Assembly & detailing', detail: 'Lining, finishing, embellishment applied', day: 'Day 4–6' },
  { icon: '✅', label: 'Quality check complete', detail: 'Final inspection done, ready for your review', day: 'Day 7' },
];

const stitchQuotes = [
  "Every great outfit starts with a precise cut.",
  "The needle and thread are working their magic.",
  "The details make the difference.",
  "Almost ready. Worth the wait.",
];

const fabricOptions = [
  {
    id: 'F1', name: 'Royal Silk — Deep Crimson', type: 'Pure Silk', weight: 'Heavy (180 GSM)',
    drape: 'Excellent', priceTag: 'Premium',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    note: 'Best match for your colour preference. Premium drape for the occasion.',
  },
  {
    id: 'F2', name: 'Georgette — Jewel Burgundy', type: 'Georgette', weight: 'Medium (120 GSM)',
    drape: 'Good', priceTag: 'Mid-range',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=200&fit=crop',
    note: 'Lighter option, good for embroidery. Comfortable for long events.',
  },
  {
    id: 'F3', name: 'Velvet — Midnight Ruby', type: 'Velvet', weight: 'Heavy (220 GSM)',
    drape: 'Structured', priceTag: 'Luxury',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    note: 'Luxurious texture. Ideal for rich embellishment work.',
  },
];

// ═══════════════════════════════════════
// Contact masking
// ═══════════════════════════════════════
const maskContactInfo = (text: string): string => {
  let masked = text.replace(/(\+91[\s-]?)?[6-9]\d{9}/g, '📵 [contact hidden]');
  masked = masked.replace(/\b\d{7,}\b/g, '[number hidden]');
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '📵 [email hidden]');
  return masked;
};

type ChatMessage = {
  id: string;
  text?: string;
  from: 'you' | 'artisan' | 'system';
  masked?: boolean;
  status: 'sent' | 'delivered' | 'read';
  timestamp: number;
  attachment?: {
    type: 'image' | 'video' | 'file';
    name: string;
    url: string; // TODO: FILE_STORAGE — replace with CDN URL
    size?: string;
  };
  changeRequest?: {
    id: string;
    description: string;
    amount: number;
    status: 'pending' | 'accepted' | 'declined';
  };
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// ═══════════════════════════════════════
// Dispute Modal (inline)
// ═══════════════════════════════════════

const DISPUTE_REASONS = [
  "Measurements not followed",
  "Fabric different from approved",
  "Quality issues",
  "Delivery delay",
  "Artisan unresponsive",
  "Other",
];

const DisputeModalInline = ({ open, onClose, orderId }: { open: boolean; onClose: () => void; orderId: string }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = reason.length > 0 && description.length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    toast.success(`Dispute raised. Case #${orderId}-D01. Our team will contact you within 24 hours.`);
    setReason(''); setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Raise a Dispute — #{orderId}</DialogTitle>
          <DialogDescription className="font-sans">
            Naapio will review and respond within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="font-sans text-sm">Reason</Label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans"
            >
              <option value="">Select a reason</option>
              {DISPUTE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <Label className="font-sans text-sm">Describe the issue</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail (min 20 characters)..."
              className="mt-1 font-sans min-h-[100px]"
            />
            {description.length > 0 && description.length < 20 && (
              <p className="text-xs text-destructive font-sans mt-1">Minimum 20 characters required</p>
            )}
          </div>
          <div>
            <Label className="font-sans text-sm">Upload evidence (photos / screenshots)</Label>
            <input type="file" accept="image/*" multiple className="mt-1 text-sm font-sans" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
            Submit Dispute
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ═══════════════════════════════════════
// Component
// ═══════════════════════════════════════

const ActiveOrdersPage = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeMilestone, setActiveMilestone] = useState(1);
  const [disputeOpen, setDisputeOpen] = useState(false);

  // Data from localStorage
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [allActiveOrders, setAllActiveOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Multi-order array support
      const rawArr = localStorage.getItem('naapio_active_orders');
      const orders = rawArr ? JSON.parse(rawArr) : [];
      setAllActiveOrders(orders);

      // Single-order compat
      const raw = localStorage.getItem('naapio_active_order');
      if (raw) setActiveOrder(JSON.parse(raw));
      const raw2 = localStorage.getItem('naapio_last_order');
      if (raw2) setLastOrder(JSON.parse(raw2));

      // If multi-order, pre-select the most recent
      if (orders.length > 1) {
        const mostRecent = orders[orders.length - 1];
        setSelectedOrderId(mostRecent.orderId);
        setActiveOrder(mostRecent);
      }
    } catch {}
    setTimeout(() => setLoading(false), 300);
  }, []);

  // Derived
  const orderId = activeOrder?.orderId || lastOrder?.orderId || lastOrder?.id || 'NP-2026-00001';
  const garmentLabel = lastOrder
    ? [lastOrder.gender === 'men' ? "Men's" : "Women's", lastOrder.selectedCategory, lastOrder.selectedSubCategory].filter(Boolean).join(' · ')
    : 'Custom Garment';
  const artisanRealName = activeOrder?.artisanRealName || 'Your Artisan';
  const artisanTier = activeOrder?.artisanTier || 'Gold';
  const artisanRating = activeOrder?.artisanRating || '4.8';
  const artisanCompletionRate = activeOrder?.artisanCompletionRate || 'N/A';
  const artisanDisputeRate = activeOrder?.artisanDisputeRate || 'N/A';
  const bidAmount = activeOrder?.bidAmount || 0;
  const netPayable = activeOrder?.netPayable || 0;
  const deliveryDays = activeOrder?.deliveryDays || 18;
  const gender = lastOrder?.gender || 'women';

  const artisanInitials = artisanRealName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  const garmentConfig = resolveGarmentConfig(
    lastOrder?.selectedCategory || '',
    lastOrder?.selectedSubCategory || '',
    gender
  );
  const garmentFields = garmentConfig.fields;

  // ── M1 state ──
  // Check measurement profile FIRST, then fall back to wizard session
  const resolvedGarmentName = lastOrder?.selectedSubCategory || lastOrder?.selectedCategory || '';
  const { savedMeasurements, prefillSource } = (() => {
    try {
      const profile = JSON.parse(localStorage.getItem('naapio_measurement_profile') || '{"measurements":{}}');
      const profileEntry = profile.measurements?.[resolvedGarmentName];
      if (profileEntry && profileEntry.values && Object.keys(profileEntry.values).length > 0) {
        return { savedMeasurements: profileEntry.values, prefillSource: `From Profile: ${profileEntry.source}` };
      }
    } catch {}
    try {
      const s = localStorage.getItem('naapio_measurements');
      const parsed = s ? JSON.parse(s) : {};
      if (parsed.measurements && Object.keys(parsed.measurements).length > 0) {
        return { savedMeasurements: parsed.measurements, prefillSource: 'From wizard' };
      }
    } catch {}
    return { savedMeasurements: {} as Record<string, string>, prefillSource: '' };
  })();
  const hasPrefill = Object.keys(savedMeasurements).length > 0;

  const initialM: Record<string, string> = {};
  garmentFields.forEach(f => { initialM[f.field] = savedMeasurements[f.field] || ''; });
  const [measurements, setMeasurements] = useState<Record<string, string>>(initialM);
  const [heightUnit, setHeightUnit] = useState<'ftin' | 'cm'>('ftin');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [dpdp1, setDpdp1] = useState(false);
  const [dpdp2, setDpdp2] = useState(false);
  const [m1Locked, setM1Locked] = useState(false);

  // Reinitialise measurements when garmentFields change (after lastOrder loads)
  useEffect(() => {
    if (garmentFields.length > 0 && !m1Locked) {
      const m: Record<string, string> = {};
      garmentFields.forEach(f => { m[f.field] = savedMeasurements[f.field] || ''; });
      setMeasurements(m);
    }
  }, [garmentFields.length]);

  // M1 tip modal
  const [tipField, setTipField] = useState<MeasurementField | null>(null);

  // M1 size chart
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // ── M2 state ──
  const [selectedFabrics, setSelectedFabrics] = useState<Set<string>>(new Set());
  const [fabricChangeRequest, setFabricChangeRequest] = useState(false);
  const [fabricChangeText, setFabricChangeText] = useState('');

  // ── M3 state ──
  const [stitchStage, setStitchStage] = useState(0);

  // ── M4 state ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});
  const [m4AlterationOpen, setM4AlterationOpen] = useState(false);
  const [m4AlterationText, setM4AlterationText] = useState('');

  // ── M5 state ──
  const [m5Phase, setM5Phase] = useState<'address' | 'awb' | 'review'>('address');
  const [shippingForm, setShippingForm] = useState({
    name: '', addr1: '', addr2: '', city: '', state: '', pincode: '',
    phone: (() => { try { return JSON.parse(localStorage.getItem('naapio_user') || '{}').phone || ''; } catch { return ''; } })(),
  });
  const [review, setReview] = useState({ quality: 0, communication: 0, timeliness: 0, value: 0, comment: '' });
  const [orderComplete, setOrderComplete] = useState(false);
  const [m5MarkedDelivered, setM5MarkedDelivered] = useState(false);

  // ── Chat state ──
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatFileRef = useRef<HTMLInputElement | null>(null);

  // M3 auto-advance
  useEffect(() => {
    if (activeMilestone !== 3) return;
    setStitchStage(0);
    const iv = setInterval(() => {
      setStitchStage(prev => {
        if (prev >= 3) {
          clearInterval(iv);
          setTimeout(() => advance(4), 1500);
          return 3;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(iv);
  }, [activeMilestone]);

  const advance = (next: number) => {
    toast.success(`Milestone ${next - 1} completed!`);
    setActiveMilestone(next);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Validation
  const m1Valid = (() => {
    if (garmentConfig.noMeasurementNeeded) return true;
    const allFilled = garmentFields.every(f => measurements[f.field]?.trim());
    const heightOk = !garmentConfig.heightRequired || (heightUnit === 'ftin' ? (heightFt.trim() && heightIn.trim()) : heightCm.trim());
    return allFilled && heightOk && dpdp1 && dpdp2;
  })();

  const confirmedMeasurements = (() => {
    try {
      return JSON.parse(localStorage.getItem('naapio_confirmed_measurements') || '{}').measurements || {};
    } catch { return {}; }
  })();
  const confirmedKeys = Object.keys(confirmedMeasurements);
  const verifiedCount = Object.values(verifiedFields).filter(Boolean).length;
  const totalVerifyCount = confirmedKeys.length;

  const m5ShipValid = ['name', 'addr1', 'city', 'state', 'pincode', 'phone'].every(k => (shippingForm as any)[k]?.trim());

  const progressPercent = ((activeMilestone - 1) / 5) * 100;

  const deliveryDate = activeOrder?.acceptedAt
    ? new Date(new Date(activeOrder.acceptedAt).getTime() + deliveryDays * 86400000).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'TBD';

  const awbNumber = `DTDC${new Date().getFullYear()}${orderId?.slice(-5) || '00001'}`;

  const handleM1Confirm = () => {
    const confirmedAt = new Date().toISOString();
    const heightDisplay = garmentConfig.heightRequired
      ? (heightUnit === 'ftin' ? `${heightFt}'${heightIn}"` : `${heightCm} cm`)
      : undefined;
    const finalMeasurements = heightDisplay ? { Height: heightDisplay, ...measurements } : { ...measurements };
    localStorage.setItem('naapio_confirmed_measurements', JSON.stringify({
      orderId, garment: garmentLabel, confirmedAt, measurements: finalMeasurements, dpdpConsentAt: confirmedAt, consentGiven: true,
    }));
    // Also update measurement profile
    const garmentKey = resolvedGarmentName || garmentLabel;
    const profile = JSON.parse(localStorage.getItem('naapio_measurement_profile') || '{"measurements":{}}');
    profile.measurements[garmentKey] = {
      updatedAt: confirmedAt,
      source: 'M1_confirmed',
      orderId: orderId,
      values: { ...finalMeasurements },
    };
    profile.lastUpdated = confirmedAt;
    localStorage.setItem('naapio_measurement_profile', JSON.stringify(profile));
    setM1Locked(true);
    advance(2);
    toast.success(`Measurements confirmed ✓ — ${artisanRealName} has been notified.`);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const rawMsg = chatInput.trim();
    const masked = m5Phase === 'review' ? rawMsg : maskContactInfo(rawMsg);
    const wasContactMasked = rawMsg !== masked;
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    
    const userMsg: ChatMessage = { id: msgId, text: masked, from: 'you', masked: wasContactMasked, status: 'sent', timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Status progression
    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' as const } : m));
    }, 600);
    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' as const } : m));
    }, 2000);

    if (wasContactMasked) {
      toast.info("ℹ️ Contact info was hidden — share after delivery");
      const sysMsg: ChatMessage = {
        id: `sys-${Date.now()}`, from: 'system', status: 'read', timestamp: Date.now(),
        text: '🔒 Naapio blocked a contact detail in this message. For security, phone numbers, emails, and WhatsApp links cannot be shared until your order is confirmed and delivered. This keeps both parties protected.',
      };
      setChatMessages(prev => [...prev, sysMsg]);
    }

    // Auto-reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`, text: 'Thank you for your message. I\'ll review and respond shortly.',
        from: 'artisan', status: 'read', timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  const handleChatFileAttach = (file: File) => {
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const attachType: 'image' | 'video' | 'file' = isImage ? 'image' : isVideo ? 'video' : 'file';
    const msgId = `att-${Date.now()}`;
    const msg: ChatMessage = {
      id: msgId, from: 'you', status: 'sent', timestamp: Date.now(),
      attachment: { type: attachType, name: file.name, url, size: formatFileSize(file.size) },
    };
    setChatMessages(prev => [...prev, msg]);
    setTimeout(() => { setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' as const } : m)); }, 600);
    setTimeout(() => { setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' as const } : m)); }, 2000);
  };

  const handleChangeRequestResponse = (messageId: string, response: 'accepted' | 'declined') => {
    setChatMessages(prev => prev.map(m => {
      if (m.id === messageId && m.changeRequest) {
        return { ...m, changeRequest: { ...m.changeRequest, status: response } };
      }
      return m;
    }));
    if (response === 'accepted') {
      const msg = chatMessages.find(m => m.id === messageId);
      const extra = msg?.changeRequest?.amount || 0;
      try {
        const order = JSON.parse(localStorage.getItem('naapio_active_order') || '{}');
        order.bidAmount = (order.bidAmount || 0) + extra;
        order.netPayable = (order.netPayable || 0) + extra;
        order.changeRequests = [...(order.changeRequests || []), { description: msg?.changeRequest?.description, amount: extra, acceptedAt: new Date().toISOString() }];
        localStorage.setItem('naapio_active_order', JSON.stringify(order));
        setActiveOrder(order);
      } catch {}
      toast.success(`₹${extra.toLocaleString('en-IN')} change request accepted. Payment confirmed.`);
      // TODO: PAYMENT_INTEGRATION — trigger Razorpay for `extra` amount here
    } else {
      toast.info('Change request declined. Artisan has been notified.');
    }
  };


  const handleSubmitReview = () => {
    const avg = (review.quality + review.communication + review.timeliness + review.value) / 4;
    const history = JSON.parse(localStorage.getItem('naapio_order_history') || '[]');
    history.push({
      orderId, garmentLabel, artisanRealName, artisanTier,
      finalAmount: bidAmount,
      rating: Math.round(avg * 10) / 10,
      completedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'completed',
    });
    localStorage.setItem('naapio_order_history', JSON.stringify(history));
    setOrderComplete(true);
  };

  // ═══════════════════════════════════════
  // Loading state
  // ═══════════════════════════════════════

  if (!loading && !activeOrder && !lastOrder) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 flex flex-col items-center gap-4">
        <span className="text-6xl">🧵</span>
        <h2 className="text-xl font-serif font-bold text-foreground">No active order yet</h2>
        <p className="text-sm text-muted-foreground font-sans max-w-xs">
          Accept a bid from your dashboard to start tracking your order here.
        </p>
        <Button variant="gold" onClick={() => navigate('/dashboard')}>← Back to My Orders</Button>
      </div>
    );
  }

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

  // ═══════════════════════════════════════
  // Order Complete celebration
  // ═══════════════════════════════════════

  if (orderComplete) {
    const avg = (review.quality + review.communication + review.timeliness + review.value) / 4;
    return (
      <div className="max-w-lg mx-auto text-center py-12 relative overflow-hidden">
        {/* CSS confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ['#e11d48', '#f59e0b', '#10b981', '#6366f1', '#ec4899'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
          <div className="w-20 h-20 rounded-full bg-success mx-auto flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-success-foreground" />
          </div>
        </motion.div>

        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">🎉 Your order is complete!</h1>
        <p className="text-muted-foreground font-sans mb-1">{garmentLabel} crafted by {artisanRealName}</p>
        <p className="text-muted-foreground font-sans mb-4">⭐ You rated: {(Math.round(avg * 10) / 10).toFixed(1)}/5.0</p>
        <p className="text-sm text-muted-foreground font-sans mb-8">Thank you for your review. {artisanRealName}'s profile has been updated.</p>

        <div className="space-y-3">
          <Button variant="gold" className="w-full" onClick={() => {
            localStorage.setItem('naapio_wizard_draft', JSON.stringify({ isReorder: true }));
            navigate('/wizard');
          }}>
            🔄 Reorder this design →
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
            ← Back to My Orders
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // Main render
  // ═══════════════════════════════════════

  return (
    <div className="max-w-4xl" ref={contentRef}>
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-accent font-sans font-medium text-sm mb-6 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> My Orders
      </button>

      {/* Multi-order selector */}
      {allActiveOrders.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {allActiveOrders.map((o: any) => (
            <button
              key={o.orderId}
              onClick={() => {
                setSelectedOrderId(o.orderId);
                setActiveOrder(o);
                setActiveMilestone(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-sans whitespace-nowrap border transition-all ${
                (selectedOrderId || activeOrder?.orderId) === o.orderId
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-card text-muted-foreground border-border hover:border-accent/50'
              }`}
            >
              {o.orderId}
            </button>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Track Order <span className="text-accent">#{orderId}</span></h1>
      <p className="text-muted-foreground font-sans mb-6">{garmentLabel} • {artisanRealName}</p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-sans text-muted-foreground mb-2">
          <span>Milestone {Math.min(activeMilestone, 5)} of 5</span>
          <span>{Math.round(progressPercent)}% complete</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Milestone indicators */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
        {MILESTONES.map((ms, i) => {
          const completed = ms.id < activeMilestone;
          const active = ms.id === activeMilestone;
          return (
            <div key={ms.id} className="flex items-center gap-1 flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all ${
                completed ? "bg-success text-success-foreground" : active ? "bg-accent text-accent-foreground ring-4 ring-accent/20" : "bg-muted text-muted-foreground"
              }`}>
                {completed ? <Check className="w-4 h-4" /> : ms.id > activeMilestone ? <Lock className="w-3.5 h-3.5" /> : ms.id}
              </div>
              {i < MILESTONES.length - 1 && (
                <div className={`w-4 sm:w-8 h-0.5 ${completed ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ ARTISAN PANEL (Section 10) ═══ */}
      <div className={`mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-l-4 ${TIER_BORDER_COLORS[artisanTier] || 'border-accent'} border border-amber-200 dark:border-amber-800/40`}>
        <div className="flex items-center gap-4">
          <div className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center text-sm font-bold font-sans shrink-0 ${TIER_COLORS[artisanTier] || 'bg-muted text-muted-foreground'}`}>
            {artisanInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans font-semibold text-foreground">{artisanRealName}</p>
            <p className="text-xs font-sans text-muted-foreground">{artisanTier} Verified Artisan</p>
            <p className="text-xs font-sans text-muted-foreground mt-0.5">
              ⭐ {artisanRating} · ✅ {artisanCompletionRate}% · 🛡️ {artisanDisputeRate}%
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif font-bold text-foreground">₹{bidAmount.toLocaleString('en-IN')}</p>
            <p className="text-[10px] font-sans text-success flex items-center gap-1 justify-end">
              🔒 Escrow protected
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setChatOpen(!chatOpen)}>
            💬 Message {artisanRealName}
          </Button>
          <button
            onClick={() => {
              const demoRequest: ChatMessage = {
                id: 'cr-' + Date.now(),
                from: 'artisan',
                status: 'read',
                timestamp: Date.now(),
                changeRequest: {
                  id: 'cr-demo-1',
                  description: 'Add mirror work embellishment to dupatta border (as discussed)',
                  amount: 4500,
                  status: 'pending',
                },
              };
              setChatMessages(prev => [...prev, demoRequest]);
              setChatOpen(true);
            }}
            className="text-[10px] font-sans text-muted-foreground underline"
          >
            [Demo] Simulate Change Request
          </button>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="mt-3 border border-border rounded-xl overflow-hidden">
            {/* Chat header */}
            <div className="px-3 py-2 bg-muted border-b border-border flex items-center justify-between">
              <span className="text-xs font-sans font-medium text-foreground">{artisanRealName}</span>
              <span className="text-[10px] text-muted-foreground font-sans">Last seen 3 min ago</span>
            </div>
            {m5Phase !== 'review' && (
              <div className="px-3 py-2 bg-warning-light border-b border-warning/20">
                <p className="text-[10px] text-foreground font-sans">🔒 Contact details are masked until order is delivered.</p>
              </div>
            )}
            <div className="h-40 overflow-y-auto p-3 space-y-2 bg-card">
              {chatMessages.length === 0 && <p className="text-xs text-muted-foreground font-sans text-center py-8">Ask about progress, timeline, or changes.</p>}
              {chatMessages.map((m) => {
                if (m.changeRequest) {
                  const cr = m.changeRequest;
                  return (
                    <div key={m.id} className="mx-0 my-2 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">📋</span>
                        <div>
                          <p className="text-xs font-sans font-semibold text-foreground uppercase tracking-wide">Change Request from Artisan</p>
                          <p className="text-sm font-sans text-foreground mt-1">{cr.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-sans">Additional cost</p>
                          <p className="text-lg font-serif font-bold text-accent">+₹{cr.amount.toLocaleString('en-IN')}</p>
                        </div>
                        {cr.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs border-destructive/40 text-destructive"
                              onClick={() => handleChangeRequestResponse(m.id, 'declined')}>
                              Decline
                            </Button>
                            <Button size="sm" variant="gold" className="text-xs"
                              onClick={() => handleChangeRequestResponse(m.id, 'accepted')}>
                              Accept & Pay ₹{cr.amount.toLocaleString('en-IN')} →
                            </Button>
                          </div>
                        )}
                        {cr.status === 'accepted' && (
                          <span className="text-xs font-sans text-success font-medium bg-success-light px-3 py-1.5 rounded-full">✓ Accepted & Paid</span>
                        )}
                        {cr.status === 'declined' && (
                          <span className="text-xs font-sans text-muted-foreground bg-muted px-3 py-1.5 rounded-full">Declined</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-sans">
                        🔒 Payment is escrow-protected. Funds release only after your final approval.
                      </p>
                      {/* TODO: PAYMENT_INTEGRATION — replace handleChangeRequestResponse with Razorpay trigger */}
                      {/* TODO: ARTISAN_PORTAL — in production, vendor raises this card from their portal */}
                    </div>
                  );
                }
                if (m.from === 'system') {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="text-[10px] font-sans text-muted-foreground italic bg-muted px-3 py-1.5 rounded-full inline-block max-w-[90%]">
                        {m.text}
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-sans ${m.from === 'you' ? 'bg-accent text-accent-foreground' : 'bg-muted text-foreground'}`}>
                      {m.attachment ? (
                        m.attachment.type === 'image' ? (
                          <img src={m.attachment.url} alt={m.attachment.name} className="max-w-[160px] rounded-lg" />
                        ) : m.attachment.type === 'video' ? (
                          <div className="flex items-center gap-2"><Video className="w-4 h-4" /><span>{m.attachment.name}</span><span className="opacity-60">▶ Play</span></div>
                        ) : (
                          <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>{m.attachment.name}</span>{m.attachment.size && <span className="opacity-60">{m.attachment.size}</span>}</div>
                        )
                      ) : (
                        m.text
                      )}
                    </div>
                    {m.from === 'you' && (
                      <span className="ml-1 self-end text-[10px] leading-none">
                        {m.status === 'sent' && <span className="text-muted-foreground">✓</span>}
                        {m.status === 'delivered' && <span className="text-muted-foreground">✓✓</span>}
                        {m.status === 'read' && <span className="text-blue-500">✓✓</span>}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 p-2 border-t border-border">
              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                className="hidden"
                ref={chatFileRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleChatFileAttach(file);
                  e.target.value = '';
                }}
              />
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0" onClick={() => chatFileRef.current?.click()}>
                <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
              <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="h-8 text-xs" onKeyDown={e => e.key === 'Enter' && handleSendChat()} />
              <Button size="sm" variant="gold" className="h-8 px-3" onClick={handleSendChat}>
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar order card */}
        <div className="bg-card rounded-2xl border border-border p-5 h-fit md:sticky md:top-24">
          <img src={redLehenga} alt="Order" className="w-full h-40 object-cover rounded-xl mb-4" />
          <div className="space-y-2 text-sm font-sans">
            <div className="flex justify-between"><span className="text-muted-foreground">Order</span><span className="font-medium text-foreground">#{orderId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Garment</span><span className="font-medium text-foreground truncate ml-2">{garmentLabel}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Artisan</span><span className="font-medium text-foreground">{artisanRealName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-info-light text-info">IN PROGRESS</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-foreground">{deliveryDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bid</span><span className="font-serif font-bold text-lg text-foreground">₹{bidAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Net Payable</span><span className="font-serif font-bold text-accent">₹{netPayable.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-success-light rounded-full text-success text-xs font-sans font-medium">
            <Check className="w-3 h-3" /> ₹{bidAmount.toLocaleString('en-IN')} in Escrow
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setDisputeOpen(true)}
              className="flex items-center gap-2 text-xs font-sans text-destructive hover:text-destructive/80 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Raise a Dispute
            </button>
          </div>
        </div>

        {/* Milestone content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">

            {/* ═══════ MILESTONE 1 — MEASUREMENTS ═══════ */}
            {activeMilestone === 1 && (
              <motion.div key="m1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M1 — Fit & Measurement Confirmation</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">{artisanRealName} needs your measurements to begin.</p>

                {garmentConfig.noMeasurementNeeded ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-info-light border border-info/20">
                      <p className="text-sm font-sans text-foreground">{garmentConfig.noMeasurementMessage}</p>
                    </div>
                    <Button variant="gold" onClick={() => advance(2)}>No measurements required → Proceed</Button>
                  </div>
                ) : (
                  <>
                    {/* Pre-fill banner */}
                    {hasPrefill ? (
                      <div className="mb-6 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40">
                        <p className="text-sm font-sans text-foreground">
                          📏 {prefillSource.startsWith('From Profile') 
                            ? `We found existing measurements for ${resolvedGarmentName} from your profile. Pre-filled for confirmation.`
                            : "We've pre-filled measurements from your wizard submission. Please review and confirm everything is correct."}
                        </p>
                        {prefillSource && <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-sans">{prefillSource}</span>}
                      </div>
                    ) : (
                      <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                        <p className="text-sm font-sans text-foreground">📏 Please enter your measurements carefully. Your artisan will cut fabric based on these values.</p>
                      </div>
                    )}

                    {/* Standard size chart (Section 3) */}
                    {garmentConfig.supportsStandard && (
                      <Collapsible open={sizeChartOpen} onOpenChange={setSizeChartOpen} className="mb-6">
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-sans text-accent hover:underline mb-2">
                          📐 View standard size chart {sizeChartOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="overflow-x-auto border border-border rounded-xl">
                            {gender === 'men' ? (
                              <table className="w-full text-xs font-sans">
                                <thead><tr className="bg-muted"><th className="p-2 text-left">Size</th><th className="p-2">Chest</th><th className="p-2">Waist</th><th className="p-2">Shoulder</th><th className="p-2">EU</th><th className="p-2">US/UK</th></tr></thead>
                                <tbody>{MEN_SIZES.map(s => <tr key={s.size} className="border-t border-border"><td className="p-2 font-medium">{s.size}</td><td className="p-2 text-center">{s.chest}</td><td className="p-2 text-center">{s.waist}</td><td className="p-2 text-center">{s.shoulder}</td><td className="p-2 text-center">{s.eu}</td><td className="p-2 text-center">{s.usuk}</td></tr>)}</tbody>
                              </table>
                            ) : (
                              <table className="w-full text-xs font-sans">
                                <thead><tr className="bg-muted"><th className="p-2 text-left">Size</th><th className="p-2">Chest</th><th className="p-2">Waist</th><th className="p-2">Hips</th><th className="p-2">EU</th><th className="p-2">US</th><th className="p-2">UK</th></tr></thead>
                                <tbody>{WOMEN_SIZES.map(s => <tr key={s.size} className="border-t border-border"><td className="p-2 font-medium">{s.size}</td><td className="p-2 text-center">{s.chest}</td><td className="p-2 text-center">{s.waist}</td><td className="p-2 text-center">{s.hips}</td><td className="p-2 text-center">{s.eu}</td><td className="p-2 text-center">{s.us}</td><td className="p-2 text-center">{s.uk}</td></tr>)}</tbody>
                              </table>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-sans mt-2">Standard sizes are for reference only. Your artisan works to the exact measurements you confirm below.</p>
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                    {/* Height field with ft/in ↔ cm toggle */}
                    {garmentConfig.heightRequired && (
                      <div className="mb-4 p-3 rounded-xl bg-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-sans font-semibold text-foreground">Your Height (required for length calibration)</Label>
                          <div className="flex rounded-full border border-border overflow-hidden">
                            <button
                              type="button"
                              onClick={() => { setHeightUnit('ftin'); setHeightCm(''); }}
                              className={`px-3 py-1 text-xs font-sans font-medium transition-colors ${heightUnit === 'ftin' ? 'bg-accent text-accent-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                            >ft / in</button>
                            <button
                              type="button"
                              onClick={() => { setHeightUnit('cm'); setHeightFt(''); setHeightIn(''); }}
                              className={`px-3 py-1 text-xs font-sans font-medium transition-colors ${heightUnit === 'cm' ? 'bg-accent text-accent-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                            >cm</button>
                          </div>
                        </div>
                        {heightUnit === 'ftin' ? (
                          <div className="flex items-center gap-2">
                            <Input type="number" min="1" max="8" placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="w-[60px] h-9 text-sm" readOnly={m1Locked} />
                            <span className="text-xs text-muted-foreground font-sans">ft</span>
                            <Input type="number" min="0" max="11" placeholder="6" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="w-[60px] h-9 text-sm" readOnly={m1Locked} />
                            <span className="text-xs text-muted-foreground font-sans">in</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input type="number" min="50" max="250" placeholder="168" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="w-[100px] h-9 text-sm" readOnly={m1Locked} />
                            <span className="text-xs text-muted-foreground font-sans">cm</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Measurement form */}
                    <div className="space-y-3 mb-6">
                      {garmentFields.map(f => {
                        const prefilled = savedMeasurements[f.field];
                        return (
                          <div key={f.field} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-sans font-semibold text-foreground">{f.field}</span>
                                {prefilled && <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-sans">From wizard ✓</span>}
                              </div>
                              <p className="text-xs text-muted-foreground font-sans">{f.description}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Input
                                type="number"
                                placeholder="e.g. 36"
                                value={measurements[f.field] || ''}
                                onChange={e => setMeasurements({ ...measurements, [f.field]: e.target.value })}
                                className="w-20 h-9 text-sm"
                                readOnly={m1Locked}
                              />
                              <span className="text-xs text-muted-foreground font-sans">inches</span>
                            </div>
                            <button onClick={() => setTipField(f)} className="text-xs font-sans text-accent hover:underline shrink-0 mt-2">▶ How to measure</button>
                          </div>
                        );
                      })}
                    </div>

                    {/* DPDP Consent */}
                    <div className="space-y-3 mb-6 p-4 bg-secondary rounded-xl">
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">DPDP Act 2023 Consent</p>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox checked={dpdp1} onCheckedChange={v => setDpdp1(!!v)} />
                        <span className="text-xs font-sans text-foreground leading-relaxed">
                          I confirm these measurements are accurate and consent to sharing them with {artisanRealName} for this garment order only.
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox checked={dpdp2} onCheckedChange={v => setDpdp2(!!v)} />
                        <span className="text-xs font-sans text-foreground leading-relaxed">
                          I acknowledge my measurement data is stored securely under Naapio's{' '}
                          <a href="/privacy" target="_blank" className="text-accent underline">Privacy Policy</a>{' '}
                          and the Digital Personal Data Protection Act, 2023.
                        </span>
                      </label>
                    </div>

                    <Button variant="gold" disabled={!m1Valid} onClick={handleM1Confirm} className="w-full sm:w-auto">
                      Confirm Measurements & Proceed →
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {/* ═══════ MILESTONE 2 — FABRIC APPROVAL ═══════ */}
            {activeMilestone === 2 && (
              <motion.div key="m2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M2 — Fabric Approval</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">{artisanRealName} has selected fabric options based on your preferences. Review and approve.</p>

                {/* Brief preferences reference */}
                <Collapsible className="mb-6">
                  <CollapsibleTrigger className="text-xs font-sans text-accent hover:underline flex items-center gap-1">
                    Your fabric preferences from brief <ChevronDown className="w-3 h-3" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs font-sans text-foreground">
                      {lastOrder?.fabricFeel && <p>Feel: {lastOrder.fabricFeel}</p>}
                      {lastOrder?.colourMood && <p>Colour mood: {lastOrder.colourMood}</p>}
                      {lastOrder?.selectedSurfaces?.length > 0 && <p>Surfaces: {lastOrder.selectedSurfaces.join(', ')}</p>}
                      {!lastOrder?.fabricFeel && !lastOrder?.colourMood && <p>As per your brief.</p>}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Fabric option cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {fabricOptions.map(fab => {
                    const sel = selectedFabrics.has(fab.id);
                    return (
                      <div key={fab.id} className={`bg-card rounded-xl border overflow-hidden cursor-pointer transition-all ${sel ? 'ring-2 ring-accent border-accent' : 'border-border hover:shadow-md'}`} onClick={() => {
                        const n = new Set(selectedFabrics);
                        if (n.has(fab.id)) n.delete(fab.id); else n.add(fab.id);
                        setSelectedFabrics(n);
                      }}>
                        <div className="h-40 overflow-hidden relative">
                          <img src={fab.image} alt={fab.name} className="w-full h-full object-cover" />
                          {sel && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"><Check className="w-4 h-4 text-accent-foreground" /></div>}
                        </div>
                        <div className="p-3">
                          <p className="font-sans font-semibold text-sm text-foreground">{fab.name}</p>
                          <p className="text-[10px] text-muted-foreground font-sans">{fab.type} · {fab.weight}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground font-sans">Drape: {fab.drape}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-sans font-medium">{fab.priceTag}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-sans italic mt-2">{fab.note}</p>
                          <label className="flex items-center gap-2 mt-2 text-xs font-sans text-foreground cursor-pointer" onClick={e => e.stopPropagation()}>
                            <Checkbox checked={sel} onCheckedChange={() => {
                              const n = new Set(selectedFabrics);
                              if (n.has(fab.id)) n.delete(fab.id); else n.add(fab.id);
                              setSelectedFabrics(n);
                            }} />
                            Select this fabric
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TODO: ARTISAN_PORTAL — replace mock fabric cards with real photos uploaded by artisan */}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="sm" onClick={() => setFabricChangeRequest(!fabricChangeRequest)}>Request Different Options</Button>
                  <Button variant="gold" size="sm" disabled={selectedFabrics.size === 0} onClick={() => {
                    advance(3);
                    toast.success(`Fabric approved! ${artisanRealName} will proceed with stitching.`);
                  }}>
                    Approve Selected Fabric →
                  </Button>
                </div>

                {fabricChangeRequest && (
                  <div className="mt-4 space-y-2">
                    <Textarea placeholder="Describe what you want..." value={fabricChangeText} onChange={e => setFabricChangeText(e.target.value)} className="font-sans text-sm" />
                    <Button size="sm" variant="outline" onClick={() => {
                      setFabricChangeRequest(false);
                      setFabricChangeText('');
                      toast.info(`Request sent to ${artisanRealName}`);
                    }}>Submit Request</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════ MILESTONE 3 — STITCHING ═══════ */}
            {activeMilestone === 3 && (
              <motion.div key="m3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M3 — Stitching in Progress</h2>
                <p className="text-sm text-muted-foreground font-sans mb-6">Sit back — {artisanRealName} is crafting your {garmentLabel}. No action needed.</p>

                {/* 4-stage vertical timeline */}
                <div className="space-y-0 mb-6">
                  {stitchStages.map((stage, idx) => {
                    const completed = idx < stitchStage;
                    const active = idx === stitchStage;
                    const pending = idx > stitchStage;
                    return (
                      <div key={idx} className="flex gap-3">
                        {/* Left timeline */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all ${
                            completed ? 'bg-success text-success-foreground' : active ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 animate-pulse' : 'bg-muted text-muted-foreground/50'
                          }`}>
                            {completed ? <Check className="w-5 h-5" /> : stage.icon}
                          </div>
                          {idx < stitchStages.length - 1 && <div className={`w-0.5 h-12 ${completed ? 'bg-success' : active ? 'bg-amber-400' : 'bg-transparent'}`} />}
                        </div>
                        {/* Right content */}
                        <div className="pb-6">
                          <p className={`font-sans text-sm ${active ? 'font-bold text-foreground' : completed ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                            {stage.label} <span className="text-[10px] text-muted-foreground ml-2">{stage.day}</span>
                          </p>
                          {!pending && <p className="text-xs text-muted-foreground font-sans">{stage.detail}{active && '...'}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-muted mb-4">
                  <p className="text-sm font-sans text-foreground">🗓️ Estimated delivery: {deliveryDate}</p>
                </div>

                <p className="text-sm font-sans text-muted-foreground italic text-center">"{stitchQuotes[stitchStage]}"</p>

                {/* TODO: ARTISAN_PORTAL — in production, stitchStage is set by artisan. Remove auto-advance interval. */}
              </motion.div>
            )}

            {/* ═══════ MILESTONE 4 — FITTING VIDEO ═══════ */}
            {activeMilestone === 4 && (
              <motion.div key="m4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M4 — Final Fitting Verification</h2>
                <p className="text-sm text-muted-foreground font-sans mb-6">{artisanRealName} has uploaded a video of your completed {garmentLabel}. Watch and verify measurements.</p>

                {/* Video card */}
                <div className="aspect-video rounded-2xl overflow-hidden relative mb-6 cursor-pointer border border-border group" onClick={() => setIsPlaying(!isPlaying)}>
                  <img src={virtualTrialCover} alt="Fitting video" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center group-hover:bg-black/40 transition-colors">
                    {isPlaying ? (
                      <p className="text-white font-sans text-sm">▶ Playing... 3:24</p>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center mb-2">
                          <Play className="w-7 h-7 text-accent-foreground ml-1" />
                        </div>
                        <p className="text-white font-sans text-xs">{artisanRealName} · Final Fitting Video</p>
                        <p className="text-white/60 font-sans text-[10px]">Uploaded: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </>
                    )}
                  </div>
                  {/* TODO: VIDEO_INTEGRATION — replace with <video> element from artisan upload */}
                </div>

                {/* Measurement verification checklist */}
                <h3 className="text-sm font-sans font-semibold text-foreground mb-1">Verify measurements shown in video</h3>
                <p className="text-xs text-muted-foreground font-sans mb-3">Tick each measurement as you see it demonstrated by {artisanRealName}.</p>

                <div className="space-y-2 mb-4">
                  {confirmedKeys.map(key => (
                    <label key={key} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${verifiedFields[key] ? 'bg-success-light' : 'hover:bg-secondary'}`}>
                      <Checkbox checked={!!verifiedFields[key]} onCheckedChange={v => setVerifiedFields({ ...verifiedFields, [key]: !!v })} />
                      <span className="text-xs font-sans text-foreground flex-1">{key}: {String(confirmedMeasurements[key]).replace(/"+$/, '')}"</span>
                      {verifiedFields[key] && <span className="text-[10px] font-sans text-success font-medium">Verified ✓</span>}
                    </label>
                  ))}
                  {confirmedKeys.length === 0 && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-warning-light border border-warning/20">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-xs font-sans text-foreground">
                        No confirmed measurements found for this order. Visually verify all fit points in the video before approving.
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {totalVerifyCount > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-sans text-muted-foreground mb-1">
                      <span>{verifiedCount} of {totalVerifyCount} measurements verified</span>
                    </div>
                    <Progress value={(verifiedCount / totalVerifyCount) * 100} className="h-2" />
                  </div>
                )}

                {/* Approval section — show always but disable approve until 100% verified */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => {
                    // Pre-populate alteration text with unchecked measurements
                    const unchecked = confirmedKeys
                      .filter(k => !verifiedFields[k])
                      .map(k => `• ${k}: ${confirmedMeasurements[k]}"`)
                      .join('\n');
                    if (unchecked) {
                      setM4AlterationText(`Measurements not verified on video:\n${unchecked}\n\nPlease re-record or adjust these points.`);
                    }
                    setM4AlterationOpen(!m4AlterationOpen);
                  }}>
                    Request Alteration
                  </Button>
                  <div className="relative group">
                    <Button variant="gold" size="sm" disabled={totalVerifyCount > 0 && verifiedCount !== totalVerifyCount} onClick={() => {
                      advance(5);
                      toast.success(`Approved! ${artisanRealName} will now prepare dispatch.`);
                    }}>
                      Approve & Proceed to Dispatch →
                    </Button>
                    {totalVerifyCount > 0 && verifiedCount !== totalVerifyCount && (
                      <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-[10px] font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Verify all measurements in the video before approving
                      </div>
                    )}
                  </div>
                </div>

                {m4AlterationOpen && (
                  <div className="mt-4 space-y-2">
                    <Textarea placeholder="Describe what needs adjusting..." value={m4AlterationText} onChange={e => setM4AlterationText(e.target.value)} className="font-sans text-sm" />
                    <Button size="sm" variant="outline" onClick={() => {
                      setM4AlterationOpen(false);
                      setM4AlterationText('');
                      toast.info(`Alteration request sent to ${artisanRealName}`);
                    }}>Submit Request</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════ MILESTONE 5 — DELIVERY ═══════ */}
            {activeMilestone === 5 && (
              <motion.div key="m5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M5 — Final Approval & Dispatch</h2>

                {/* Phase: Address */}
                {m5Phase === 'address' && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground font-sans mb-4">Confirm your delivery address.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {([
                        ['name', 'Full Name'], ['addr1', 'Address Line 1'], ['addr2', 'Address Line 2 (optional)'],
                        ['city', 'City'], ['state', 'State'], ['pincode', 'Pincode'], ['phone', 'Phone'],
                      ] as const).map(([k, label]) => (
                        <div key={k} className={k === 'addr1' || k === 'addr2' ? 'sm:col-span-2' : ''}>
                          <Label className="text-xs font-sans text-muted-foreground">{label}</Label>
                          <Input value={(shippingForm as any)[k]} onChange={e => setShippingForm({ ...shippingForm, [k]: e.target.value })} className="mt-1 h-10 text-sm" />
                        </div>
                      ))}
                    </div>
                    <Button variant="gold" disabled={!m5ShipValid} onClick={() => {
                      setM5Phase('awb');
                      toast.success(`Address confirmed! ${artisanRealName} will dispatch within 24 hours.`);
                    }}>
                      Confirm Address →
                    </Button>
                  </div>
                )}

                {/* Phase: AWB Tracking */}
                {m5Phase === 'awb' && (
                  <div className="mt-4 space-y-5">
                    <h3 className="font-sans font-semibold text-lg text-foreground">Your Order is On Its Way! 📦</h3>

                    <div className="p-4 rounded-xl bg-success-light border border-success/20">
                      <p className="font-sans font-medium text-foreground text-sm">{artisanRealName} has shipped your {garmentLabel}.</p>
                    </div>

                    <div>
                      <Label className="text-xs font-sans text-muted-foreground">Tracking Number (AWB)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={awbNumber} readOnly className="bg-muted font-mono text-sm flex-1" />
                        <Button size="icon" variant="outline" className="shrink-0" onClick={() => {
                          navigator.clipboard.writeText(awbNumber);
                          toast.success('AWB copied to clipboard');
                        }}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <a href="#" target="_blank" className="text-sm font-sans text-accent hover:underline flex items-center gap-1">
                      Track on courier website → <ExternalLink className="w-3 h-3" />
                    </a>
                    {/* TODO: ARTISAN_PORTAL — AWB number from vendor portal */}

                    <p className="text-sm font-sans text-muted-foreground">
                      Estimated delivery: {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="border-t border-border pt-4">
                      <Button variant="outline-gold" onClick={() => {
                        setM5Phase('review');
                        toast.success("Great! Let us know how it went.");
                      }}>
                        Mark as Delivered
                      </Button>
                    </div>
                  </div>
                )}

                {/* Phase: Review */}
                {m5Phase === 'review' && (
                  <div className="mt-4 space-y-5">
                    <p className="text-sm font-sans text-muted-foreground">Rate your experience with {artisanRealName}</p>

                    {(['Quality of Work', 'Communication', 'Timeliness', 'Value for Money'] as const).map(cat => {
                      const rKey = cat === 'Quality of Work' ? 'quality' : cat === 'Value for Money' ? 'value' : cat.toLowerCase() as keyof typeof review;
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm font-sans text-foreground w-40">{cat}</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-5 h-5 cursor-pointer transition-colors ${s <= (review[rKey] as number) ? 'fill-accent text-accent' : 'text-border hover:text-accent/40'}`}
                                onClick={() => setReview({ ...review, [rKey]: s })} />
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="relative">
                      <Textarea
                        placeholder="Share your experience — your review helps other customers find great artisans on Naapio."
                        value={review.comment}
                        onChange={e => setReview({ ...review, comment: e.target.value.slice(0, 500) })}
                        className="font-sans"
                        maxLength={500}
                      />
                      <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">{review.comment.length}/500</span>
                    </div>

                    <Button variant="gold" disabled={review.quality === 0} onClick={handleSubmitReview}>
                      Submit Review →
                    </Button>
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
          {MILESTONES.filter(ms => ms.id < activeMilestone).map(ms => (
            <div key={ms.id} className="flex items-center gap-3 p-3 bg-success-light/50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center"><Check className="w-4 h-4 text-success-foreground" /></div>
              <span className="text-sm font-sans text-foreground font-medium">{ms.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* ═══ Measurement Tip Modal (Section 4) ═══ */}
      <Dialog open={!!tipField} onOpenChange={() => setTipField(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-sans">How to measure: {tipField?.field}</DialogTitle>
            <DialogDescription className="sr-only">Measurement instructions</DialogDescription>
          </DialogHeader>
          {tipField && (
            <div className="space-y-4">
              <div className="text-4xl text-center">{getTipEmoji(tipField.field)}</div>
              <p className="text-sm font-sans text-foreground">{tipField.description}</p>
              <p className="text-sm font-sans text-muted-foreground">{tipField.videoTip || tipField.tip}</p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <p className="text-xs font-sans text-foreground">💡 Measure over regular undergarments. Keep tape snug but comfortable — you should be able to breathe easily.</p>
              </div>
              {/* TODO: VIDEO_INTEGRATION — replace with embedded measurement tutorial video per field */}
              <Button variant="gold" className="w-full" onClick={() => setTipField(null)}>Got it ✓</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispute Modal */}
      <DisputeModalInline open={disputeOpen} onClose={() => setDisputeOpen(false)} orderId={orderId} />
    </div>
  );
};

export default ActiveOrdersPage;
