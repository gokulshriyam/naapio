import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { mockLeads, mockMyBids, mockVendor, type Lead } from "../data/vendorMockData";
import VendorBidModal from "../components/VendorBidModal";

const formatCountdown = (date: Date) => {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
};

const CITY_OPTIONS = ['All Cities', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai'];
const CATEGORY_OPTIONS = ['All', "Women's", "Men's", 'Alteration', 'Own Fabric', 'Customise'];
const BUDGET_OPTIONS = ['Any', 'Under ₹5K', '₹5K–₹15K', '₹15K–₹40K', 'Above ₹40K'];
const DELIVERY_OPTIONS = ['Any', 'Within 7 days', '7–21 days', '21+ days'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget-high', label: 'Budget High-Low' },
  { value: 'budget-low', label: 'Budget Low-High' },
  { value: 'deadline', label: 'Deadline Soonest' },
  { value: 'most-bids', label: 'Most Bids' },
  { value: 'fewest-bids', label: 'Fewest Bids' },
];

// ═══════════════════════════════════════
// Collapsible Brief Component (shared)
// ═══════════════════════════════════════
const BriefField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider font-sans text-muted-foreground">{label}</p>
    <p className="text-sm font-sans text-foreground">{value}</p>
  </div>
);

const FullBriefGrid = ({ data }: { data: Record<string, any> }) => {
  const fields: { label: string; value: string | undefined }[] = [
    { label: 'Garment', value: data.category && data.subCategory ? `${data.category} · ${data.subCategory}` : undefined },
    { label: 'Occasion', value: data.occasion },
    { label: 'Fit Preference', value: data.selectedFit },
    { label: 'Fabric Feel', value: data.fabricFeel },
    { label: 'Colour Mood', value: data.colourMood },
    { label: 'Neckline', value: data.selectedNeckline },
    { label: 'Sleeve', value: data.selectedSleeve },
    { label: 'Dupatta', value: data.dupattaOption },
    { label: 'Lining', value: data.liningOption },
    { label: 'Rush Order', value: data.isRushOrder !== undefined ? (data.isRushOrder ? 'Yes' : 'No') : undefined },
    { label: 'Budget', value: data.budgetMin !== undefined ? `₹${data.budgetMin.toLocaleString('en-IN')} – ₹${data.budgetMax.toLocaleString('en-IN')}` : undefined },
    { label: 'Delivery by', value: data.deliveryDate },
  ];

  const validFields = fields.filter(f => f.value);

  return (
    <div className="space-y-3 mt-3">
      {data.selectedSurfaces && data.selectedSurfaces.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-sans text-muted-foreground">Surface / Embellishment</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {data.selectedSurfaces.map((s: string) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-sans">{s}</span>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {validFields.map(f => <BriefField key={f.label} label={f.label} value={f.value!} />)}
      </div>
      {data.additionalNotes && (
        <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
          <p className="text-[10px] uppercase tracking-wider font-sans text-muted-foreground mb-1">Additional Notes</p>
          <p className="text-xs font-sans text-foreground">{data.additionalNotes}</p>
        </div>
      )}
      {data.postedAt && (
        <p className="text-[10px] font-sans text-muted-foreground">
          Posted: {formatDistanceToNow(data.postedAt, { addSuffix: true })}
        </p>
      )}
    </div>
  );
};

const VendorLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());
  const [bidModalLead, setBidModalLead] = useState<Lead | null>(null);
  const [bids, setBids] = useState<Record<string, { amount: number; rank: number }>>({});
  const [expandedBriefs, setExpandedBriefs] = useState<Set<string>>(new Set());
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Filters
  const [city, setCity] = useState('All Cities');
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState('Any');
  const [delivery, setDelivery] = useState('Any');
  const [rushOnly, setRushOnly] = useState(false);
  const [sort, setSort] = useState('newest');

  const activeFilters = [
    city !== 'All Cities' ? city : null,
    category !== 'All' ? category : null,
    budget !== 'Any' ? budget : null,
    delivery !== 'Any' ? delivery : null,
    rushOnly ? 'Rush Only' : null,
  ].filter(Boolean) as string[];

  const clearFilter = (f: string) => {
    if (CITY_OPTIONS.includes(f)) setCity('All Cities');
    else if (CATEGORY_OPTIONS.includes(f)) setCategory('All');
    else if (BUDGET_OPTIONS.includes(f)) setBudget('Any');
    else if (DELIVERY_OPTIONS.includes(f)) setDelivery('Any');
    else if (f === 'Rush Only') setRushOnly(false);
  };

  const filtered = useMemo(() => {
    let result = leads.filter(l => !ignoredIds.has(l.id));
    if (city !== 'All Cities') result = result.filter(l => l.city === city);
    if (category !== 'All') {
      if (category === 'Alteration') result = result.filter(l => l.orderType === 'Alteration');
      else result = result.filter(l => l.category === category);
    }
    if (budget !== 'Any') {
      if (budget === 'Under ₹5K') result = result.filter(l => l.budgetMax < 5000);
      else if (budget === '₹5K–₹15K') result = result.filter(l => l.budgetMin >= 5000 && l.budgetMax <= 15000);
      else if (budget === '₹15K–₹40K') result = result.filter(l => l.budgetMin >= 15000 && l.budgetMax <= 40000);
      else if (budget === 'Above ₹40K') result = result.filter(l => l.budgetMin >= 40000);
    }
    if (delivery !== 'Any') {
      const now = Date.now();
      if (delivery === 'Within 7 days') result = result.filter(l => new Date(l.deliveryDate).getTime() - now <= 7 * 86400000);
      else if (delivery === '7–21 days') result = result.filter(l => { const d = new Date(l.deliveryDate).getTime() - now; return d > 7 * 86400000 && d <= 21 * 86400000; });
      else if (delivery === '21+ days') result = result.filter(l => new Date(l.deliveryDate).getTime() - now > 21 * 86400000);
    }
    if (rushOnly) result = result.filter(l => l.isRushOrder);

    switch (sort) {
      case 'oldest': result.sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime()); break;
      case 'budget-high': result.sort((a, b) => b.budgetMax - a.budgetMax); break;
      case 'budget-low': result.sort((a, b) => a.budgetMin - b.budgetMin); break;
      case 'deadline': result.sort((a, b) => a.bidDeadline.getTime() - b.bidDeadline.getTime()); break;
      case 'most-bids': result.sort((a, b) => b.bidsCount - a.bidsCount); break;
      case 'fewest-bids': result.sort((a, b) => a.bidsCount - b.bidsCount); break;
      default: result.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    }
    return result;
  }, [leads, ignoredIds, city, category, budget, delivery, rushOnly, sort]);

  const handleIgnore = (id: string) => {
    setIgnoredIds(prev => new Set(prev).add(id));
    toast('Lead ignored', {
      action: {
        label: 'Undo',
        onClick: () => {
          setIgnoredIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        },
      },
      duration: 5000,
    });
  };

  const handleBidSubmitted = (leadId: string, bid: { amount: number }) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    setBids(prev => ({ ...prev, [leadId]: { amount: bid.amount, rank: lead.bidsCount + 1 } }));
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, bidsCount: l.bidsCount + 1, myBidRank: l.bidsCount + 1 } : l));
  };

  const toggleBrief = (id: string) => {
    setExpandedBriefs(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const outbidCount = mockMyBids.filter(b => b.status === 'active' && b.outbidAlert).length;

  return (
    <div>
      {mockVendor.vacationMode && (
        <div className="mb-6 p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-sm font-sans text-amber-800 dark:text-amber-200">
          🏖️ Vacation mode is ON. You are not receiving new leads. Turn it off in your Profile.
        </div>
      )}

      {outbidCount > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-sm font-sans text-amber-800 dark:text-amber-200 flex-1">
            ⚠️ You've been outbid on {outbidCount} brief{outbidCount !== 1 ? 's' : ''}.
          </span>
          <Button variant="ghost" size="sm" className="text-xs h-7 text-amber-700 dark:text-amber-300" onClick={() => navigate('/vendor/bids')}>
            Review & Edit →
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl text-foreground">Open Leads</h1>
          <p className="text-sm font-sans text-muted-foreground">Briefs from customers across India. Select and bid on orders that match your craft.</p>
        </div>
        <Badge className="bg-accent/15 text-accent border-accent/30 font-sans self-start">
          {filtered.length} open brief{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-auto min-w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{CITY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-auto min-w-[100px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={budget} onValueChange={setBudget}>
          <SelectTrigger className="w-auto min-w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{BUDGET_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={delivery} onValueChange={setDelivery}>
          <SelectTrigger className="w-auto min-w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{DELIVERY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex items-center gap-1.5 px-2">
          <Switch checked={rushOnly} onCheckedChange={setRushOnly} className="scale-75" />
          <span className="text-xs font-sans text-muted-foreground">Rush Only</span>
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-auto min-w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{SORT_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeFilters.map(f => (
            <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-sans">
              {f}
              <button onClick={() => clearFilter(f)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-serif font-bold text-lg text-foreground">No leads match your filters</p>
            <p className="text-sm font-sans text-muted-foreground">Try adjusting your filters to see more briefs.</p>
          </div>
        )}

        {filtered.map(lead => {
          const hasBid = bids[lead.id] || lead.myBidRank;
          const isExpanded = expandedBriefs.has(lead.id);
          const thumbSrc = lead.inspirationPhoto || lead.inspirationThumb;
          return (
            <div key={lead.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
              {/* TOP ROW */}
              <div className="flex gap-3 items-start">
                {/* Thumbnail */}
                {thumbSrc ? (
                  <button onClick={() => setZoomImage(thumbSrc)} className="flex-shrink-0">
                    <img src={thumbSrc} alt="" className="w-14 h-14 object-cover object-center rounded-lg flex-shrink-0" />
                  </button>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {lead.category.includes('Women') ? '👗' : '🤵'}
                  </div>
                )}

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{lead.orderType}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{lead.subCategory}</Badge>
                    {lead.isRushOrder && (
                      <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0">🔥 Rush</Badge>
                    )}
                  </div>
                  <p className="text-sm font-serif font-semibold text-foreground">{lead.category} · {lead.subCategory}</p>
                  <p className="text-xs text-muted-foreground font-sans">#{lead.id} · {lead.customerFirstName}, {lead.city} · {lead.occasion}</p>
                </div>

                {/* Budget + deadline — right aligned */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-sm font-serif font-bold text-accent">
                    ₹{(lead.budgetMin / 1000).toFixed(0)}K–₹{(lead.budgetMax / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Due {lead.deliveryDate}</p>
                </div>
              </div>

              {/* Budget on mobile */}
              <div className="sm:hidden mt-2 flex items-center justify-between">
                <p className="text-sm font-serif font-bold text-accent">
                  ₹{(lead.budgetMin / 1000).toFixed(0)}K–₹{(lead.budgetMax / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground">Due {lead.deliveryDate}</p>
              </div>

              {/* COMPETITION ROW */}
              <div className="mt-2 flex items-center gap-3 text-xs font-sans text-muted-foreground">
                <span>{lead.bidsCount} bids placed</span>
                <span>·</span>
                <span>Range: ₹{(lead.bidMin / 1000).toFixed(0)}K–₹{(lead.bidMax / 1000).toFixed(0)}K</span>
                <span>·</span>
                <span>Deadline: {formatCountdown(lead.bidDeadline)}</span>
                {lead.isRushOrder && <span className="text-amber-600 font-medium">⚡ Rush</span>}
              </div>

              {/* FULL BRIEF (collapsible) */}
              <button
                onClick={() => toggleBrief(lead.id)}
                className="text-xs text-accent hover:underline font-sans mt-2 block"
              >
                {isExpanded ? 'Hide Brief ↑' : 'View Full Brief ↓'}
              </button>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border">
                  <FullBriefGrid data={lead} />
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-3 pt-3 border-t border-border flex gap-2 justify-end">
                {hasBid ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-sans text-green-600 dark:text-green-400 font-semibold">
                      ✓ Bid submitted — Rank #{bids[lead.id]?.rank || lead.myBidRank} of {lead.bidsCount}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs h-7">Edit Bid</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive">Withdraw</Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="text-xs min-h-[44px]" onClick={() => handleIgnore(lead.id)}>Ignore</Button>
                    <Button variant="gold" size="sm" className="text-xs min-h-[44px]" onClick={() => setBidModalLead(lead)}>Place Bid →</Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {zoomImage && (
        <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center" onClick={() => setZoomImage(null)}>
          <button onClick={() => setZoomImage(null)} className="fixed top-4 right-4 text-white z-[401]">
            <X className="w-6 h-6" />
          </button>
          <img src={zoomImage} alt="" className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}

      {bidModalLead && (
        <VendorBidModal
          open={!!bidModalLead}
          onClose={() => setBidModalLead(null)}
          lead={bidModalLead}
          onBidSubmitted={handleBidSubmitted}
        />
      )}
    </div>
  );
};

export default VendorLeads;
