import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, MessageSquare, Pencil, X, Send, Paperclip, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { mockMyBids, mockVendor, type MyBid } from "../data/vendorMockData";

// ═══════════════════════════════════════
// Contact masking (same as customer chat)
// ═══════════════════════════════════════
const maskContactInfo = (text: string): string => {
  let masked = text.replace(/(\+91[\s-]?)?[6-9]\d{9}/g, '📵 [contact hidden]');
  masked = masked.replace(/\b\d{7,}\b/g, '[number hidden]');
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '📵 [email hidden]');
  masked = masked.replace(/whatsapp/gi, '📵 [contact hidden]');
  return masked;
};

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════
const formatCountdown = (date: Date) => {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
};

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon?: string }> = {
  active: { label: 'Active', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  accepted: { label: '✓ Accepted', classes: 'bg-accent/15 text-accent' },
  declined: { label: 'Declined', classes: 'bg-muted text-muted-foreground' },
  expired: { label: 'Expired', classes: 'bg-muted text-muted-foreground' },
  withdrawn: { label: 'Withdrawn', classes: 'bg-destructive/15 text-destructive' },
};

const CATEGORY_OPTIONS = ['All', "Women's", "Men's"];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'bid-high', label: 'My Bid High-Low' },
  { value: 'deadline', label: 'Deadline Soonest' },
];

// ═══════════════════════════════════════
// Chat message type
// ═══════════════════════════════════════
type ChatMsg = {
  id: string;
  text: string;
  from: 'vendor' | 'customer' | 'system';
  status: 'sent' | 'delivered' | 'read';
  timestamp: number;
  attachment?: { type: 'image' | 'file'; name: string; url: string };
};

// ═══════════════════════════════════════
// Inline Chat Panel component
// ═══════════════════════════════════════
const InlineChatPanel = ({ bidId, customerName, onClose }: { bidId: string; customerName: string; onClose: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'sys-1', text: 'Messages are moderated by Naapio. No contact sharing until order is confirmed.', from: 'system', status: 'read', timestamp: Date.now() - 60000 },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const raw = input.trim();
    if (!raw) return;
    const masked = maskContactInfo(raw);
    const wasModified = masked !== raw;

    const newMsg: ChatMsg = {
      id: `v-${Date.now()}`,
      text: masked,
      from: 'vendor',
      status: 'sent',
      timestamp: Date.now(),
    };
    setMessages(prev => {
      const next = [...prev, newMsg];
      if (wasModified) {
        next.push({ id: `sys-${Date.now()}`, text: '📵 Contact details are hidden until the order is confirmed.', from: 'system', status: 'read', timestamp: Date.now() });
      }
      return next;
    });
    setInput('');

    // Simulate delivery tick
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 600);

    // Simulate auto-reply from customer
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
      setMessages(prev => [
        ...prev,
        { id: `c-${Date.now()}`, text: 'Thank you for your message. I will review and get back to you shortly.', from: 'customer', status: 'read', timestamp: Date.now() },
      ]);
    }, 1500);
  };

  const TickIcon = ({ status }: { status: string }) => {
    if (status === 'sent') return <Check className="w-3 h-3 text-muted-foreground" />;
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
    if (status === 'read') return <CheckCheck className="w-3 h-3 text-blue-500" />;
    return null;
  };

  return (
    <div className="mt-3 border border-border rounded-xl overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <div>
          <span className="text-xs font-sans font-semibold text-foreground">{customerName}</span>
          <span className="text-[10px] font-sans text-muted-foreground ml-2">Last seen 3 min ago</span>
        </div>
        <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-48 overflow-y-auto p-3 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={cn(
            "max-w-[80%] text-xs font-sans rounded-xl px-3 py-2",
            msg.from === 'vendor' ? 'ml-auto bg-accent/15 text-foreground' :
            msg.from === 'customer' ? 'bg-muted text-foreground' :
            'mx-auto bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-center text-[10px] rounded-full px-3 py-1'
          )}>
            {msg.text}
            {msg.from === 'vendor' && (
              <div className="flex justify-end mt-0.5">
                <TickIcon status={msg.status} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
        <button className="text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-xs font-sans bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button onClick={handleSend} className="text-accent hover:text-accent/80"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// Edit Bid Modal
// ═══════════════════════════════════════

// IMPORTANT: Vendor alias is assigned at account creation and never changes.
// Customer sees consistent alias (e.g. "Artisan Gold-7") regardless of bid edits.
// This allows customers to track one vendor's revised offers. TODO: API_INTEGRATION_POINT

type EditBidModalProps = {
  open: boolean;
  onClose: () => void;
  bid: MyBid;
  onSave: (bidId: string, updates: { amount: number; date: string; message: string }) => void;
};

const EditBidModal = ({ open, onClose, bid, onSave }: EditBidModalProps) => {
  const [price, setPrice] = useState<string>(String(bid.bidAmount));
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(new Date(bid.deliveryDate));
  const [message, setMessage] = useState(bid.message);

  // Reset on open
  useEffect(() => {
    if (open) {
      setPrice(String(bid.bidAmount));
      setDeliveryDate(new Date(bid.deliveryDate));
      setMessage(bid.message);
    }
  }, [open, bid]);

  const numPrice = Number(price) || 0;
  const netEarning = Math.round(numPrice * 0.8);
  const exceedsBudget = numPrice > bid.budgetMax;
  const tooLow = numPrice > 0 && numPrice < 1000;
  const canSubmit = numPrice >= 1000 && price.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave(bid.id, {
      amount: numPrice,
      date: deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : bid.deliveryDate,
      message,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Edit Bid — #{bid.leadId}</DialogTitle>
        </DialogHeader>

        {/* Brief recap */}
        <div className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border">
          <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center text-2xl flex-shrink-0">
            {bid.category.includes('Women') ? '👗' : '🤵'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans font-semibold text-sm text-foreground">{bid.subCategory}</p>
            <p className="text-xs text-muted-foreground font-sans">{bid.customerFirstName}, {bid.city}</p>
            <p className="text-xs font-sans text-accent font-semibold mt-0.5">
              ₹{bid.budgetMin.toLocaleString('en-IN')} – ₹{bid.budgetMax.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <p className="text-xs font-sans text-muted-foreground">
          Current bid: <span className="font-semibold text-foreground">₹{bid.bidAmount.toLocaleString('en-IN')}</span>
        </p>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="font-sans text-sm">Proposed Price (₹)</Label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter your bid amount" className="mt-1 font-sans" min={1000} />
            {numPrice > 0 && (
              <p className="text-xs text-muted-foreground font-sans mt-1">
                You will receive: <span className="font-semibold text-foreground">₹{netEarning.toLocaleString('en-IN')}</span> after 20% platform fee
              </p>
            )}
            {exceedsBudget && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-sans mt-1">
                ⚠️ Your bid exceeds customer's max budget (₹{bid.budgetMax.toLocaleString('en-IN')}).
              </p>
            )}
            {tooLow && <p className="text-xs text-destructive font-sans mt-1">Minimum bid is ₹1,000</p>}
          </div>

          <div>
            <Label className="font-sans text-sm">Estimated Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !deliveryDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, 'PPP') : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} disabled={d => d < new Date()} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="font-sans text-sm">Message to Customer (optional)</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value.slice(0, 500))} placeholder="Update your approach..." className="mt-1 font-sans min-h-[80px]" maxLength={500} />
            <p className="text-xs text-muted-foreground font-sans mt-1 text-right">{message.length}/500</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-sans mt-2">Your updated bid remains binding for 7 days.</p>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!canSubmit} className="flex-1">Save Changes →</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ═══════════════════════════════════════
// Main component
// ═══════════════════════════════════════

const VendorMyBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState<MyBid[]>(mockMyBids);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sort, setSort] = useState('newest');

  // UI state
  const [openChatId, setOpenChatId] = useState<string | null>(null);
  const [editBid, setEditBid] = useState<MyBid | null>(null);
  const [withdrawConfirmId, setWithdrawConfirmId] = useState<string | null>(null);

  // Filter + sort
  const filtered = (() => {
    let result = [...bids];
    if (statusFilter !== 'All') result = result.filter(b => b.status === statusFilter.toLowerCase());
    if (categoryFilter !== 'All') result = result.filter(b => b.category === categoryFilter);
    switch (sort) {
      case 'oldest': result.sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime()); break;
      case 'bid-high': result.sort((a, b) => b.bidAmount - a.bidAmount); break;
      case 'deadline': result.sort((a, b) => a.bidDeadline.getTime() - b.bidDeadline.getTime()); break;
      default: result.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
    }
    return result;
  })();

  const handleEditSave = (bidId: string, updates: { amount: number; date: string; message: string }) => {
    setBids(prev => prev.map(b => b.id === bidId ? { ...b, bidAmount: updates.amount, deliveryDate: updates.date, message: updates.message } : b));
    const bid = bids.find(b => b.id === bidId);
    toast.success(`Bid updated. You are now ranked #${bid?.myRank || 1} of ${bid?.totalBids || 1}.`);
  };

  const handleWithdraw = (bidId: string) => {
    setBids(prev => prev.map(b => b.id === bidId ? { ...b, status: 'withdrawn' as const } : b));
    setWithdrawConfirmId(null);
    toast.success('Bid withdrawn successfully.');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">My Bids</h1>
        <p className="text-sm font-sans text-muted-foreground">Track all bids you've submitted. Edit, withdraw, or monitor your ranking.</p>
      </div>

      {/* Filter / Sort bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Status pills */}
        <div className="flex gap-1.5 overflow-x-auto">
          {['All', 'Active', 'Accepted', 'Declined', 'Expired', 'Withdrawn'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-sans transition-colors whitespace-nowrap",
                statusFilter === s
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {s} ({s === 'All' ? bids.length : bids.filter(b => b.status === s.toLowerCase()).length})
            </button>
          ))}
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-auto min-w-[100px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-auto min-w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{SORT_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="font-serif font-bold text-lg text-foreground">No bids yet</p>
          <p className="text-sm font-sans text-muted-foreground mb-4">Browse open leads and submit your first bid to start earning.</p>
          <Button variant="gold" onClick={() => navigate('/vendor')}>Browse Leads →</Button>
        </div>
      )}

      {/* Bid cards */}
      <div className="space-y-4">
        {filtered.map(bid => {
          const sc = STATUS_CONFIG[bid.status];
          return (
            <div key={bid.id} className="bg-card border border-border rounded-2xl p-4">
              {/* Accepted banner */}
              {bid.status === 'accepted' && (
                <div className="mb-3 p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs font-sans text-accent font-semibold">
                    🎉 This bid was accepted!{' '}
                    <button onClick={() => navigate('/vendor/orders')} className="underline hover:no-underline">View in Active Orders →</button>
                  </p>
                </div>
              )}

              {/* Expired banner */}
              {bid.status === 'expired' && (
                <div className="mb-3 p-2.5 rounded-xl bg-muted border border-border">
                  <p className="text-xs font-sans text-muted-foreground">⏱ Bid window closed.</p>
                </div>
              )}

              <div className="flex gap-3">
                {/* Thumb */}
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                  {bid.inspirationThumb ? (
                    <img src={bid.inspirationThumb} alt="" className="w-full h-full object-cover" />
                  ) : (
                    bid.category.includes('Women') ? '👗' : '🤵'
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-sans font-semibold", sc.classes)}>
                      {sc.label}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{bid.orderType}</Badge>
                    <span className="text-xs font-sans text-muted-foreground">{bid.category} · {bid.subCategory}</span>
                  </div>

                  {/* Row 2 */}
                  <p className="text-xs font-sans text-muted-foreground">#{bid.leadId} · {bid.customerFirstName}, {bid.city}</p>

                  {/* Row 3 */}
                  <p className="mt-1.5 text-sm font-sans">
                    <span className="text-muted-foreground">My bid:</span>{' '}
                    <span className="font-serif font-bold text-accent">₹{bid.bidAmount.toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground ml-3">Delivery:</span>{' '}
                    <span className="text-foreground text-xs">{bid.deliveryDate}</span>
                  </p>

                  {/* Row 4 */}
                  <p className="text-xs font-sans text-muted-foreground mt-0.5">
                    Customer budget: ₹{bid.budgetMin.toLocaleString('en-IN')} – ₹{bid.budgetMax.toLocaleString('en-IN')}
                  </p>

                  {/* Row 5: Competition panel */}
                  <div className="mt-2 p-2.5 rounded-lg bg-muted/70 space-y-1">
                    <p className="text-xs font-sans text-foreground">
                      📊 You are ranked <span className="font-semibold text-accent">#{bid.myRank}</span> of {bid.totalBids} bids
                    </p>
                    <p className="text-xs font-sans text-muted-foreground">
                      Bid range on this brief: ₹{bid.bidRangeMin.toLocaleString('en-IN')} – ₹{bid.bidRangeMax.toLocaleString('en-IN')}
                    </p>
                    {bid.myRank > 1 && !bid.outbidAlert && (
                      <p className="text-xs font-sans text-amber-700 dark:text-amber-400">
                        ⚠️ A lower-priced bid exists. Consider revising to stay competitive.
                      </p>
                    )}
                    {bid.outbidAlert && (
                      <p className="text-xs font-sans text-destructive">
                        🔔 You've been outbid! Update your bid before the deadline.
                      </p>
                    )}
                  </div>

                  {/* Row 6 */}
                  <p className="text-xs font-sans text-muted-foreground mt-2">
                    Bid deadline: <span className="font-semibold">{formatCountdown(bid.bidDeadline)}</span>
                    <span className="mx-2">·</span>
                    Submitted: {formatDistanceToNow(bid.submittedAt, { addSuffix: true })}
                  </p>

                  {bid.message && (
                    <p className="text-xs font-sans text-muted-foreground mt-1 italic line-clamp-2">"{bid.message}"</p>
                  )}

                  {/* Action buttons (active only) */}
                  {bid.status === 'active' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setOpenChatId(openChatId === bid.id ? null : bid.id)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" /> Chat
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setEditBid(bid)}>
                        <Pencil className="w-3 h-3 mr-1" /> Edit Bid
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive" onClick={() => setWithdrawConfirmId(bid.id)}>
                        Withdraw
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline chat */}
              {openChatId === bid.id && (
                <InlineChatPanel
                  bidId={bid.id}
                  customerName={bid.customerFirstName}
                  onClose={() => setOpenChatId(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Bid Modal */}
      {editBid && (
        <EditBidModal
          open={!!editBid}
          onClose={() => setEditBid(null)}
          bid={editBid}
          onSave={handleEditSave}
        />
      )}

      {/* Withdraw confirmation dialog */}
      <Dialog open={!!withdrawConfirmId} onOpenChange={v => { if (!v) setWithdrawConfirmId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Withdraw Bid?</DialogTitle>
            <DialogDescription className="font-sans">
              Withdrawing removes your bid. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setWithdrawConfirmId(null)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={() => withdrawConfirmId && handleWithdraw(withdrawConfirmId)} className="flex-1">
              Withdraw Bid
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorMyBids;
