import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ruler, Scissors, Video, Package, Check, Lock, ArrowLeft, Star,
  MessageSquare, AlertTriangle, Send, Paperclip, CheckCheck, X, Copy, Printer,
  Upload, Plus, Link as LinkIcon, ChevronDown, ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockVendorActiveOrders, mockVendor } from "../data/vendorMockData";
import VendorDisputeModal from "../components/VendorDisputeModal";

// ═══════════════════════════════════════
// Contact masking
// ═══════════════════════════════════════
const maskContactInfo = (text: string): string => {
  let masked = text.replace(/(\+91[\s-]?)?[6-9]\d{9}/g, '📵 [contact hidden]');
  masked = masked.replace(/\b\d{7,}\b/g, '[number hidden]');
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '📵 [email hidden]');
  masked = masked.replace(/whatsapp/gi, '📵 [contact hidden]');
  return masked;
};

const MILESTONES = [
  { id: 1, label: 'Measurements', icon: Ruler },
  { id: 2, label: 'Fabric', icon: Scissors },
  { id: 3, label: 'Stitching', icon: Scissors },
  { id: 4, label: 'Fitting Video', icon: Video },
  { id: 5, label: 'Delivery', icon: Package },
];

const FABRIC_TYPES = ['Silk', 'Cotton', 'Georgette', 'Velvet', 'Chiffon', 'Brocade', 'Crepe', 'Other'];
const WEIGHT_OPTIONS = ['Light <100 GSM', 'Medium 100–150 GSM', 'Heavy 150–200 GSM', 'Very Heavy >200 GSM'];

const stitchStages = [
  { label: 'Pattern marked & cut', detail: 'Fabric cut precisely to measurements', dayLabel: 'Day 1' },
  { label: 'Stitching begun', detail: 'Main seams joined, garment taking shape', dayLabel: 'Day 2–3' },
  { label: 'Assembly & detailing', detail: 'Lining, finishing, embellishment applied', dayLabel: 'Day 4–6' },
  { label: 'Quality check complete', detail: 'Final inspection done, ready for review', dayLabel: 'Day 7' },
];

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

// ═══════════════════════════════════════
// Chat types & component
// ═══════════════════════════════════════
type ChatMsg = {
  id: string;
  text: string;
  from: 'vendor' | 'customer' | 'system';
  status: 'sent' | 'delivered' | 'read';
  timestamp: number;
  changeRequest?: {
    id: string;
    description: string;
    amount: number;
    status: 'pending' | 'accepted' | 'declined';
  };
};

const InlineChat = ({ customerName, onClose, orderId, bidAmount }: { customerName: string; onClose: () => void; orderId: string; bidAmount: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'sys-1', text: 'Messages are moderated by Naapio. No contact sharing until order is confirmed.', from: 'system', status: 'read', timestamp: Date.now() - 60000 },
  ]);
  const [input, setInput] = useState('');
  const [showChangeRequestForm, setShowChangeRequestForm] = useState(false);
  const [crDescription, setCrDescription] = useState('');
  const [crAmount, setCrAmount] = useState('');

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const raw = input.trim();
    if (!raw) return;
    const masked = maskContactInfo(raw);
    const wasModified = masked !== raw;
    const newMsg: ChatMsg = { id: `v-${Date.now()}`, text: masked, from: 'vendor', status: 'sent', timestamp: Date.now() };
    setMessages(prev => {
      const next = [...prev, newMsg];
      if (wasModified) next.push({ id: `sys-${Date.now()}`, text: '📵 Contact details are hidden until the order is confirmed.', from: 'system', status: 'read', timestamp: Date.now() });
      return next;
    });
    setInput('');
    setTimeout(() => setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m)), 600);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
      setMessages(prev => [...prev, { id: `c-${Date.now()}`, text: 'Thank you for your message. I will review and get back to you shortly.', from: 'customer', status: 'read', timestamp: Date.now() }]);
    }, 1500);
  };

  const handleSendChangeRequest = () => {
    if (!crDescription.trim() || !crAmount.trim() || Number(crAmount) < 100) return;
    const amount = Number(crAmount);
    const crMsg: ChatMsg = {
      id: `cr-${Date.now()}`,
      text: '',
      from: 'vendor',
      status: 'read',
      timestamp: Date.now(),
      changeRequest: {
        id: `cr-${Date.now()}`,
        description: crDescription,
        amount,
        status: 'pending',
      },
    };
    setMessages(prev => [...prev, crMsg]);
    setShowChangeRequestForm(false);
    setCrDescription('');
    setCrAmount('');
    toast.success('Change request sent to customer.');
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <div>
          <span className="text-xs font-sans font-semibold text-foreground">{customerName}</span>
          <span className="text-[10px] font-sans text-muted-foreground ml-2">Last seen 3 min ago</span>
        </div>
        <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
      </div>
      <div ref={scrollRef} className="h-48 overflow-y-auto p-3 space-y-2">
        {messages.map(msg => {
          // Change request card (vendor perspective)
          if (msg.changeRequest) {
            const cr = msg.changeRequest;
            const newTotal = bidAmount + cr.amount;
            return (
              <div key={msg.id} className="mx-0 my-2 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3 space-y-2">
                <p className="text-[10px] font-sans font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">📋 Change Request Sent</p>
                <p className="text-sm font-sans text-foreground">{cr.description}</p>
                <div>
                  <p className="text-xs text-muted-foreground font-sans">Additional cost</p>
                  <p className="text-lg font-serif font-bold text-accent">+₹{cr.amount.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] font-sans text-muted-foreground">New order total: ₹{newTotal.toLocaleString('en-IN')}</p>
                </div>
                {cr.status === 'pending' && (
                  <span className="inline-block text-[10px] font-sans text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Awaiting customer approval</span>
                )}
                {cr.status === 'accepted' && (
                  <span className="inline-block text-[10px] font-sans text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">✓ Customer Accepted</span>
                )}
                {cr.status === 'declined' && (
                  <span className="inline-block text-[10px] font-sans text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Declined</span>
                )}
                <p className="text-[10px] text-muted-foreground font-sans">🔒 Payment is escrow-protected.</p>
              </div>
            );
          }

          return (
            <div key={msg.id} className={cn(
              "max-w-[80%] text-xs font-sans rounded-xl px-3 py-2",
              msg.from === 'vendor' ? 'ml-auto bg-accent/15 text-foreground' :
              msg.from === 'customer' ? 'bg-muted text-foreground' :
              'mx-auto bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-center text-[10px] rounded-full px-3 py-1'
            )}>
              {msg.text}
              {msg.from === 'vendor' && (
                <div className="flex justify-end mt-0.5">
                  {msg.status === 'sent' && <Check className="w-3 h-3 text-muted-foreground" />}
                  {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
                  {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Change request form */}
      {showChangeRequestForm && (
        <div className="px-3 py-2 border-t border-border bg-amber-50/50 dark:bg-amber-950/10 space-y-2">
          <p className="text-[10px] font-sans font-semibold text-foreground">Raise a Change Request</p>
          <Input value={crDescription} onChange={e => setCrDescription(e.target.value)} placeholder="What additional work is needed?" className="h-7 text-xs" />
          <Input type="number" value={crAmount} onChange={e => setCrAmount(e.target.value)} placeholder="Additional cost (₹)" className="h-7 text-xs" min={100} />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setShowChangeRequestForm(false)}>Cancel</Button>
            <Button variant="gold" size="sm" className="text-xs h-6" onClick={handleSendChangeRequest} disabled={!crDescription.trim() || Number(crAmount) < 100}>Send Change Request</Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
        <button className="text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 text-xs font-sans bg-transparent outline-none text-foreground placeholder:text-muted-foreground" />
        <button onClick={handleSend} className="text-accent hover:text-accent/80"><Send className="w-4 h-4" /></button>
      </div>
      {!showChangeRequestForm && (
        <div className="px-3 pb-2">
          <button onClick={() => setShowChangeRequestForm(true)} className="text-xs font-sans text-accent hover:underline">
            + Raise a Change Request
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════
// Fabric entry type
// ═══════════════════════════════════════
type FabricEntry = {
  id: string;
  type: string;
  weave: string;
  weight: string;
  colour: string;
  notes: string;
  hasPhoto: boolean;
};

// ═══════════════════════════════════════
// Full Brief Card (left column)
// ═══════════════════════════════════════
const OrderBriefCard = ({ order, onZoomImage }: { order: typeof mockVendorActiveOrders[0]; onZoomImage?: (src: string) => void }) => {
  const SectionHeader = ({ title }: { title: string }) => (
    <p className="text-[10px] uppercase tracking-wider font-sans text-muted-foreground border-b border-border pb-1 mt-4 mb-2">{title}</p>
  );
  const BriefRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-xs font-sans">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-1">
      <p className="text-xs font-sans font-semibold text-foreground">Brief Summary</p>

      {order.inspirationPhoto && (
        <img
          src={order.inspirationPhoto}
          alt=""
          className="w-full h-36 object-cover object-top rounded-xl mt-2 cursor-pointer"
          onClick={() => onZoomImage?.(order.inspirationPhoto!)}
        />
      )}

      <SectionHeader title="Order Details" />
      <BriefRow label="Order Type" value={order.orderType} />
      <BriefRow label="Garment" value={`${order.category} · ${order.subCategory}`} />
      <BriefRow label="Occasion" value={order.occasion} />

      <SectionHeader title="Design Preferences" />
      {order.fabricFeel && <BriefRow label="Fabric Feel" value={order.fabricFeel} />}
      {order.colourMood && <BriefRow label="Colour Mood" value={order.colourMood} />}
      {order.selectedFit && <BriefRow label="Fit" value={order.selectedFit} />}
      {order.selectedNeckline && <BriefRow label="Neckline" value={order.selectedNeckline} />}
      {order.selectedSleeve && <BriefRow label="Sleeve" value={order.selectedSleeve} />}
      {order.dupattaOption && <BriefRow label="Dupatta" value={order.dupattaOption} />}
      {order.liningOption && <BriefRow label="Lining" value={order.liningOption} />}

      {order.surfaces && order.surfaces.length > 0 && (
        <div className="mt-1">
          <p className="text-[10px] font-sans text-muted-foreground mb-1">Surfaces</p>
          <div className="flex flex-wrap gap-1">
            {order.surfaces.map(s => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-sans">{s}</span>
            ))}
          </div>
        </div>
      )}

      <SectionHeader title="Logistics" />
      <BriefRow label="Budget" value={`₹${(order.budgetMin || 0).toLocaleString('en-IN')} – ₹${(order.budgetMax || 0).toLocaleString('en-IN')}`} />
      <BriefRow label="Delivery by" value={`${order.deliveryDate} (${order.deliveryDays} days)`} />
      <BriefRow label="Rush Order" value={order.isRushOrder ? 'Yes' : 'No'} />

      {order.additionalNotes && (
        <>
          <SectionHeader title="Notes" />
          <p className="text-xs font-sans text-foreground italic">"{order.additionalNotes}"</p>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════
// Main Component
// ═══════════════════════════════════════

const VendorActiveOrders = () => {
  const navigate = useNavigate();
  const [orders] = useState(mockVendorActiveOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = orders.find(o => o.orderId === selectedOrderId);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Milestone state — initialised from order's currentMilestone
  const [activeMilestone, setActiveMilestone] = useState(2);
  const [m1ReadOnly, setM1ReadOnly] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // M2 state
  const [fabricEntries, setFabricEntries] = useState<FabricEntry[]>([
    { id: 'fe-1', type: '', weave: '', weight: '', colour: '', notes: '', hasPhoto: false },
  ]);
  const [fabricSubmitted, setFabricSubmitted] = useState(false);
  const [fabricApproved, setFabricApproved] = useState(false);

  // M3 state
  const [stitchComplete, setStitchComplete] = useState<boolean[]>([false, false, false, false]);

  // M4 state
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoSubmitted, setVideoSubmitted] = useState(false);
  const [videoApproved, setVideoApproved] = useState(false);

  // M5 state
  const [awbNumber, setAwbNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [shipped, setShipped] = useState(false);
  const [customerRating, setCustomerRating] = useState({ communication: 0, clarity: 0, timeliness: 0 });
  const [ratingComment, setRatingComment] = useState('');
  const [orderClosed, setOrderClosed] = useState(false);

  // Reset milestone state when order changes — START at currentMilestone (Fix 6)
  useEffect(() => {
    if (selectedOrder) {
      setActiveMilestone(selectedOrder.currentMilestone);
      setM1ReadOnly(false);
    }
  }, [selectedOrder]);

  // ─── ORDER LIST VIEW ───
  if (!selectedOrderId) {
    if (orders.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🪡</p>
          <h1 className="font-serif font-bold text-xl text-foreground mb-2">No active orders</h1>
          <p className="text-sm font-sans text-muted-foreground">Once a customer accepts your bid, the order will appear here.</p>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6">
          <h1 className="font-serif font-bold text-2xl text-foreground">Active Orders</h1>
          <p className="text-sm font-sans text-muted-foreground">Manage your in-progress orders and milestone updates.</p>
        </div>
        <div className="space-y-4">
          {orders.map(order => {
            const progress = ((order.currentMilestone - 1) / 5) * 100;
            return (
              <div key={order.orderId} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground">#{order.orderId}</h2>
                    <p className="text-sm font-sans text-muted-foreground">{order.subCategory} · {order.customerFirstName}, {order.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-foreground">₹{order.bidAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-sans text-muted-foreground">Net: ₹{order.netEarning.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {MILESTONES.map((m, i) => {
                    const done = order.currentMilestone > m.id;
                    const current = order.currentMilestone === m.id;
                    return (
                      <div key={m.id} className="flex items-center gap-1 flex-1">
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs",
                          done ? 'bg-accent text-accent-foreground' : current ? 'bg-accent/20 text-accent ring-2 ring-accent' : 'bg-muted text-muted-foreground'
                        )}>
                          {done ? <Check className="w-3.5 h-3.5" /> : <m.icon className="w-3.5 h-3.5" />}
                        </div>
                        {i < MILESTONES.length - 1 && <div className={cn("flex-1 h-0.5", done ? 'bg-accent' : 'bg-border')} />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-sans text-muted-foreground mb-3">
                  {MILESTONES.map(m => <span key={m.id} className="flex-1 text-center">{m.label}</span>)}
                </div>
                <Progress value={progress} className="h-1 mb-4" />
                <Button variant="gold" size="sm" className="text-xs min-h-[44px]" onClick={() => setSelectedOrderId(order.orderId)}>
                  {order.currentMilestone === 1 ? 'Review Measurements →' : `Continue — M${order.currentMilestone} →`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── ORDER DETAIL VIEW ───
  const order = selectedOrder!;
  const progress = ((activeMilestone - 1) / 5) * 100;

  const addFabricEntry = () => {
    setFabricEntries(prev => [...prev, { id: `fe-${Date.now()}`, type: '', weave: '', weight: '', colour: '', notes: '', hasPhoto: false }]);
  };

  const updateFabricEntry = (id: string, field: keyof FabricEntry, value: string | boolean) => {
    setFabricEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const canSubmitFabric = fabricEntries.some(e => e.type && e.hasPhoto);

  const markStitchStage = (idx: number) => {
    setStitchComplete(prev => { const n = [...prev]; n[idx] = true; return n; });
    toast.success('Customer notified of progress');
  };

  const allStitchDone = stitchComplete.every(Boolean);

  const handlePrintBrief = () => {
    window.print();
  };

  const handleShip = () => {
    if (!awbNumber.trim() || !courierName.trim()) { toast.error('Enter AWB number and courier name'); return; }
    setShipped(true);
    toast.success('Order marked as shipped. Customer notified.');
  };

  const handleCloseOrder = () => {
    if (customerRating.communication === 0 || customerRating.clarity === 0 || customerRating.timeliness === 0) {
      toast.error('Please rate all categories'); return;
    }
    setOrderClosed(true);
    toast.success(`🎉 Order complete! ₹${order.netEarning.toLocaleString('en-IN')} will be released within 7 days.`);
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} onClick={() => onChange(s)} className="p-0.5">
          <Star className={cn("w-5 h-5 transition-colors", s <= value ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => { setSelectedOrderId(null); setM1ReadOnly(false); }} className="flex items-center gap-1 text-sm font-sans text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to orders
        </button>
        <h1 className="font-serif font-bold text-2xl text-foreground">Order #{order.orderId}</h1>
        <p className="text-sm font-sans text-muted-foreground">{order.subCategory} · {order.customerFirstName}, {order.city}</p>
      </div>

      {/* Milestone stepper */}
      <div className="flex items-center gap-1 mb-2">
        {MILESTONES.map((m, i) => {
          const done = activeMilestone > m.id;
          const current = activeMilestone === m.id;
          return (
            <div key={m.id} className="flex items-center gap-1 flex-1">
              <button
                onClick={() => {
                  if (m.id === 1 && activeMilestone > 1) {
                    setM1ReadOnly(true);
                    setActiveMilestone(1);
                  } else if (done || current) {
                    setM1ReadOnly(false);
                    setActiveMilestone(m.id);
                  }
                }}
                className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  done ? 'bg-accent text-accent-foreground cursor-pointer' :
                  current ? 'bg-accent/20 text-accent ring-2 ring-accent cursor-pointer' :
                  'bg-muted text-muted-foreground cursor-default'
                )}
              >
                {done ? <Check className="w-4 h-4" /> : m.id > activeMilestone ? <Lock className="w-3.5 h-3.5" /> : <m.icon className="w-4 h-4" />}
              </button>
              {i < MILESTONES.length - 1 && <div className={cn("flex-1 h-0.5", done ? 'bg-accent' : 'bg-border')} />}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] font-sans text-muted-foreground mb-4">
        {MILESTONES.map(m => <span key={m.id} className="flex-1 text-center">{m.label}</span>)}
      </div>
      <Progress value={progress} className="h-1.5 mb-8" />

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* Full brief card (Fix 7) */}
          <OrderBriefCard order={order} onZoomImage={setZoomImage} />

          {/* Measurements */}
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs font-sans font-semibold text-foreground mb-2">Customer Measurements (M1 Confirmed)</p>
            <div className="space-y-1">
              {Object.entries(order.measurements).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs font-sans">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-semibold text-foreground">{val}{key !== 'Height' ? '"' : ''}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Check className="w-3 h-3 text-teal-600" />
              <span className="text-[10px] font-sans text-teal-600 dark:text-teal-400">Confirmed by customer ✓</span>
            </div>
            {/* Link to review M1 (Fix 6) */}
            {activeMilestone > 1 && !m1ReadOnly && (
              <button
                onClick={() => { setM1ReadOnly(true); setActiveMilestone(1); }}
                className="text-[10px] font-sans text-accent hover:underline mt-2 block"
              >
                ↩ Review M1 Measurements
              </button>
            )}
          </div>

          {/* Download brief */}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={handlePrintBrief}>
            <Printer className="w-3.5 h-3.5 mr-1" /> Download Brief + Measurements
          </Button>
          <p className="text-[9px] font-sans text-muted-foreground text-center">Confidential · Order #{order.orderId} · Destroy after completion</p>

          {/* Dispute */}
          <button onClick={() => setDisputeOpen(true)} className="flex items-center gap-2 text-xs font-sans text-destructive hover:text-destructive/80 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5" /> Raise a Dispute
          </button>

          {/* Escrow */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-accent" />
              <span className="text-xs font-sans font-semibold text-foreground">₹{order.bidAmount.toLocaleString('en-IN')} in Escrow</span>
            </div>
            <p className="text-[10px] font-sans text-muted-foreground">Net earning after 20% fee: <span className="text-accent font-semibold">₹{order.netEarning.toLocaleString('en-IN')}</span></p>
          </div>

          {/* Chat */}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setChatOpen(!chatOpen)}>
            <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message {order.customerFirstName}
          </Button>
          {chatOpen && <InlineChat customerName={order.customerFirstName} onClose={() => setChatOpen(false)} orderId={order.orderId} bidAmount={order.bidAmount} />}
        </div>

        {/* RIGHT COLUMN — Milestone content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ═══ M1 — Measurements Review (read-only if m1ReadOnly) ═══ */}
            {activeMilestone === 1 && (
              <motion.div key="m1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M1 — Measurements Review</h2>
                {m1ReadOnly ? (
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-4">
                      Measurements confirmed on {new Date(order.acceptedAt).toLocaleDateString()}. Contact customer via chat if adjustments needed.
                    </p>
                    <div className="bg-muted rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(order.measurements).map(([key, val]) => (
                          <div key={key} className="text-sm font-sans">
                            <span className="text-muted-foreground">{key}:</span>{' '}
                            <span className="font-semibold text-foreground">{val}{key !== 'Height' ? '"' : ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => { setM1ReadOnly(false); setActiveMilestone(order.currentMilestone); }}>
                      ← Back to current milestone
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-4">Customer has submitted measurements. Review and confirm before proceeding.</p>
                    <div className="bg-muted rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(order.measurements).map(([key, val]) => (
                          <div key={key} className="text-sm font-sans">
                            <span className="text-muted-foreground">{key}:</span>{' '}
                            <span className="font-semibold text-foreground">{val}{key !== 'Height' ? '"' : ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setChatOpen(true)}>
                        Ask about a measurement
                      </Button>
                      <Button variant="gold" size="sm" className="text-xs" onClick={() => { setActiveMilestone(2); toast.success('Measurements confirmed. Proceed to fabric sourcing.'); }}>
                        ✓ Confirm Measurements — Begin Fabric Sourcing
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══ M2 — Fabric Sourcing ═══ */}
            {activeMilestone === 2 && (
              <motion.div key="m2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M2 — Upload Fabric Options for Customer Approval</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">Add fabric options for the customer to choose from.</p>

                {fabricApproved ? (
                  <div>
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mb-4">
                      <p className="text-sm font-sans text-green-800 dark:text-green-200">✓ Customer approved fabric on {new Date().toLocaleDateString()}. Proceed to stitching.</p>
                    </div>
                    <Button variant="gold" onClick={() => setActiveMilestone(3)}>Begin Stitching →</Button>
                  </div>
                ) : fabricSubmitted ? (
                  <div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mb-4">
                      <p className="text-sm font-sans text-amber-800 dark:text-amber-200">⏳ Fabric options submitted. Waiting for customer approval...</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setFabricApproved(true)}>
                      [Demo] Simulate Customer Approval
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fabricEntries.map((entry, idx) => (
                      <div key={entry.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <p className="text-xs font-sans font-semibold text-foreground">Fabric Option {idx + 1}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-sans">Fabric Type</Label>
                            <Select value={entry.type} onValueChange={v => updateFabricEntry(entry.id, 'type', v)}>
                              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
                              <SelectContent>{FABRIC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-sans">Weave / Finish</Label>
                            <Input value={entry.weave} onChange={e => updateFabricEntry(entry.id, 'weave', e.target.value)} placeholder="e.g. Banarasi, gold zari" className="mt-1 h-8 text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs font-sans">Weight</Label>
                            <Select value={entry.weight} onValueChange={v => updateFabricEntry(entry.id, 'weight', v)}>
                              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Select weight" /></SelectTrigger>
                              <SelectContent>{WEIGHT_OPTIONS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-sans">Colour</Label>
                            <Input value={entry.colour} onChange={e => updateFabricEntry(entry.id, 'colour', e.target.value)} placeholder="e.g. Deep crimson" className="mt-1 h-8 text-xs" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-sans">Notes (optional)</Label>
                          <Textarea value={entry.notes} onChange={e => updateFabricEntry(entry.id, 'notes', e.target.value.slice(0, 300))} placeholder="Additional details..." className="mt-1 text-xs min-h-[60px]" maxLength={300} />
                        </div>
                        <div>
                          <Label className="text-xs font-sans">Upload photos/video</Label>
                          <div className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center">
                            <input type="file" accept="image/*,video/*" multiple className="hidden" id={`fabric-upload-${entry.id}`}
                              onChange={() => updateFabricEntry(entry.id, 'hasPhoto', true)} />
                            <label htmlFor={`fabric-upload-${entry.id}`} className="cursor-pointer text-xs font-sans text-muted-foreground hover:text-foreground">
                              <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                              {entry.hasPhoto ? <span className="text-accent">✓ File selected</span> : 'Click to upload'}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" size="sm" className="text-xs" onClick={addFabricEntry}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Another Fabric Option
                    </Button>

                    <div className="mt-2">
                      {mockVendor.tier === 'Gold' ? (
                        <Button variant="outline" size="sm" className="text-xs border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                          Request Fabric Advance →
                        </Button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button variant="outline" size="sm" className="text-xs opacity-50" disabled>Request Fabric Advance</Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs">
                            Fabric advance is available for Gold Tier artisans only.{' '}
                            <button onClick={() => navigate('/for-tailors#tier-benefits')} className="text-accent underline">How to reach Gold Tier →</button>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    <Button variant="gold" className="w-full sm:w-auto" disabled={!canSubmitFabric} onClick={() => {
                      setFabricSubmitted(true);
                      toast.success('Fabric options submitted! Waiting for customer approval.');
                    }}>
                      Submit Fabric Options for Approval →
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══ M3 — Stitching ═══ */}
            {activeMilestone === 3 && (
              <motion.div key="m3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M3 — Update Stitching Progress</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">Keep your customer informed. Update each stage as you complete it.</p>
                <div className="space-y-3">
                  {stitchStages.map((stage, idx) => (
                    <div key={idx} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-colors",
                      stitchComplete[idx] ? 'bg-accent/5 border-accent/30' : 'bg-card border-border'
                    )}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        stitchComplete[idx] ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                      )}>
                        {stitchComplete[idx] ? <Check className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-sans font-semibold text-foreground">{stage.label}</p>
                        <p className="text-xs font-sans text-muted-foreground">{stage.detail}</p>
                        <p className="text-[10px] font-sans text-muted-foreground">{stage.dayLabel}</p>
                      </div>
                      {!stitchComplete[idx] && (idx === 0 || stitchComplete[idx - 1]) && (
                        <Button variant="gold" size="sm" className="text-xs min-h-[44px]" onClick={() => markStitchStage(idx)}>
                          Mark Complete ✓
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {allStitchDone && (
                  <Button variant="gold" className="mt-6" onClick={() => setActiveMilestone(4)}>
                    Proceed to Fitting Video Upload →
                  </Button>
                )}
              </motion.div>
            )}

            {/* ═══ M4 — Fitting Video ═══ */}
            {activeMilestone === 4 && (
              <motion.div key="m4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M4 — Upload Final Fitting Video</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">Upload a clear video showing the garment against your measurements card.</p>
                {videoApproved ? (
                  <div>
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mb-4">
                      <p className="text-sm font-sans text-green-800 dark:text-green-200">✓ Customer approved the fitting video. Proceed to delivery.</p>
                    </div>
                    <Button variant="gold" onClick={() => setActiveMilestone(5)}>Proceed to Delivery →</Button>
                  </div>
                ) : videoSubmitted ? (
                  <div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mb-4">
                      <p className="text-sm font-sans text-amber-800 dark:text-amber-200">⏳ Video submitted. Waiting for customer review...</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setVideoApproved(true)}>
                      [Demo] Simulate Customer Approval
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                      <input type="file" accept="video/*" className="hidden" id="fitting-video-upload"
                        onChange={() => setVideoUploaded(true)} />
                      <label htmlFor="fitting-video-upload" className="cursor-pointer">
                        <Video className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                        {videoUploaded ? (
                          <p className="text-sm font-sans text-accent font-semibold">✓ Video selected</p>
                        ) : (
                          <p className="text-sm font-sans text-muted-foreground">Click to upload fitting video</p>
                        )}
                      </label>
                    </div>
                    <div>
                      <Label className="text-xs font-sans">Or paste a link (YouTube / Google Drive)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="https://..." className="text-xs h-8" onChange={() => setVideoUploaded(true)} />
                        <LinkIcon className="w-4 h-4 text-muted-foreground mt-2" />
                      </div>
                    </div>
                    <div className="bg-muted rounded-xl p-3">
                      <p className="text-xs font-sans font-semibold text-foreground mb-2">Customer Measurements (for reference)</p>
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(order.measurements).map(([key, val]) => (
                          <p key={key} className="text-xs font-sans text-muted-foreground">{key}: <span className="text-foreground font-semibold">{val}</span></p>
                        ))}
                      </div>
                    </div>
                    <Button variant="gold" disabled={!videoUploaded} onClick={() => {
                      setVideoSubmitted(true);
                      toast.success('Video submitted. Waiting for customer approval.');
                    }}>
                      Submit Fitting Video for Customer Review →
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══ M5 — Delivery ═══ */}
            {activeMilestone === 5 && (
              <motion.div key="m5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="font-serif font-bold text-xl text-foreground mb-1">M5 — Ship & Close Order</h2>
                <p className="text-sm text-muted-foreground font-sans mb-4">Ship the garment and close this order.</p>
                {orderClosed ? (
                  <div className="text-center py-8">
                    <p className="text-5xl mb-3">🎉</p>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-2">Order Complete!</h3>
                    <p className="text-sm font-sans text-muted-foreground">₹{order.netEarning.toLocaleString('en-IN')} will be released to your wallet within 7 days.</p>
                    <Button variant="gold" className="mt-4" onClick={() => navigate('/vendor/wallet')}>View Wallet →</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs font-sans font-semibold text-foreground mb-2">Customer Address</p>
                      <div className="text-sm font-sans text-foreground space-y-0.5">
                        <p className="font-semibold">Sneha Krishnamurthy</p>
                        <p>14B, 3rd Cross, Jayanagar 4th Block</p>
                        <p>Bangalore, Karnataka 560041</p>
                        <p>+91 98765 XXXXX</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => {
                          navigator.clipboard.writeText('Sneha Krishnamurthy, 14B, 3rd Cross, Jayanagar 4th Block, Bangalore, Karnataka 560041');
                          toast.success('Address copied!');
                        }}>
                          <Copy className="w-3 h-3 mr-1" /> Copy Address
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-amber-700 dark:text-amber-400" onClick={() => toast.info('Address verification request sent to Naapio team.')}>
                          Request Address Verification
                        </Button>
                      </div>
                    </div>
                    {!shipped ? (
                      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <p className="text-xs font-sans font-semibold text-foreground">Shipment Details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-sans">AWB Tracking Number</Label>
                            <Input value={awbNumber} onChange={e => setAwbNumber(e.target.value)} placeholder="Enter AWB number" className="mt-1 h-8 text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs font-sans">Courier Service</Label>
                            <Input value={courierName} onChange={e => setCourierName(e.target.value)} placeholder="e.g. DTDC, Blue Dart" className="mt-1 h-8 text-xs" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-sans">Courier Logo / Package Photo</Label>
                          <input type="file" accept="image/*" className="mt-1 text-xs font-sans" />
                        </div>
                        <Button variant="gold" onClick={handleShip}>
                          <Package className="w-4 h-4 mr-1" /> Mark as Shipped
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mb-4">
                          <p className="text-sm font-sans text-green-800 dark:text-green-200">📦 Shipped! AWB: {awbNumber} via {courierName}</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                          <p className="text-sm font-sans font-semibold text-foreground">Rate {order.customerFirstName} as a buyer</p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans text-muted-foreground">Communication</span>
                              <StarRating value={customerRating.communication} onChange={v => setCustomerRating(p => ({ ...p, communication: v }))} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans text-muted-foreground">Clarity of Brief</span>
                              <StarRating value={customerRating.clarity} onChange={v => setCustomerRating(p => ({ ...p, clarity: v }))} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans text-muted-foreground">Timely Response</span>
                              <StarRating value={customerRating.timeliness} onChange={v => setCustomerRating(p => ({ ...p, timeliness: v }))} />
                            </div>
                          </div>
                          <Textarea value={ratingComment} onChange={e => setRatingComment(e.target.value.slice(0, 300))} placeholder="Optional comment..." className="text-xs min-h-[60px]" maxLength={300} />
                          <Button variant="gold" className="w-full" onClick={handleCloseOrder}>
                            Submit Rating & Close Order →
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dispute Modal */}
      <VendorDisputeModal open={disputeOpen} onClose={() => setDisputeOpen(false)} orderId={order.orderId} />

      {/* Lightbox */}
      {zoomImage && (
        <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center" onClick={() => setZoomImage(null)}>
          <button onClick={() => setZoomImage(null)} className="fixed top-4 right-4 text-white z-[401]">
            <X className="w-6 h-6" />
          </button>
          <img src={zoomImage} alt="" className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default VendorActiveOrders;
