import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, MapPin, Award, TrendingUp, Clock, ShieldCheck, CheckCircle, Pencil, Plus, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockVendor, mockVendorReviews } from "../data/vendorMockData";
import { toast } from "sonner";
import vendorAvatar from "@/assets/vendor-avatar.jpg";

const ALL_SPECIALITIES = [
  'Bridal Lehenga', 'Saree Blouse', 'Anarkali', 'Salwar Kameez', 'Sherwani',
  'Bandhgala', 'Indo-Western', 'Gown', 'Kurta Pajama', 'Dhoti',
  'Jacket / Waistcoat', 'Trouser / Pant', 'Alteration & Repairs', 'Kids Wear',
];

const DEMO_PORTFOLIO = [
  { id: 'p1', url: bidThumb1, caption: 'Bridal lehenga with mirror work' },
  { id: 'p2', url: bidThumb2, caption: 'Embroidered saree blouse' },
  { id: 'p3', url: vendorAvatar, caption: 'Navy sherwani formal collection' },
];

const VendorProfile = () => {
  const navigate = useNavigate();
  const [vacationMode, setVacationMode] = useState(mockVendor.vacationMode);

  // Reviews state
  const [reviews, setReviews] = useState(mockVendorReviews.map(r => ({ ...r })));
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Portfolio state
  const [portfolio, setPortfolio] = useState(DEMO_PORTFOLIO);
  const [editCaptionId, setEditCaptionId] = useState<string | null>(null);

  // Specialities state
  const [specialities, setSpecialities] = useState(mockVendor.specialities);
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [pendingSpecs, setPendingSpecs] = useState<string[]>(mockVendor.specialities);

  const handleVacationToggle = (v: boolean) => {
    setVacationMode(v);
    if (v) toast('Vacation mode is ON. You\'ve been removed from the active leads list.', { icon: '🏖️' });
    else toast.success("You're back! New leads will appear in your dashboard.");
  };

  const handlePostResponse = (reviewId: string) => {
    if (!responseText.trim()) return;
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, responded: true, response: responseText } : r));
    // TODO: API_INTEGRATION_POINT — POST /v1/reviews/{id}/response
    toast.success('Response posted');
    setRespondingTo(null);
    setResponseText('');
  };

  const handleRemovePortfolio = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
    toast.success('Photo removed');
  };

  const handleAddPortfolio = () => {
    // Demo: add a placeholder
    const newId = `p-${Date.now()}`;
    setPortfolio(prev => [...prev, { id: newId, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', caption: '' }]);
    toast.success('Photo added to portfolio');
    // TODO: API_INTEGRATION_POINT — upload to S3, sync portfolio to vendor profile
  };

  const handleSaveSpecs = () => {
    setSpecialities(pendingSpecs);
    setSpecModalOpen(false);
    toast.success('Specialities updated');
  };

  const avgRating = mockVendor.rating;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">My Profile</h1>
        <p className="text-sm font-sans text-muted-foreground">Your public profile, ratings, and settings.</p>
      </div>

      {/* Profile header card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Avatar */}
          <img src={vendorAvatar} alt="Priya Designs Studio" className="w-20 h-20 rounded-full object-cover object-top flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-bold text-xl text-foreground">{mockVendor.realName}</h2>
              <div className="flex items-center gap-1 text-xs font-sans text-green-600 dark:text-green-400">
                <CheckCircle className="w-3.5 h-3.5" /> Verified
              </div>
            </div>
            <p className="text-sm font-sans text-muted-foreground">{mockVendor.alias}</p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className="bg-amber-400 text-amber-950 text-xs font-semibold">
                <Award className="w-3 h-3 mr-1" /> {mockVendor.tier} Tier
              </Badge>
            </div>

            <div className="flex items-center gap-1 mt-2 text-sm font-sans text-muted-foreground">
              <MapPin className="w-4 h-4" /> {mockVendor.location}
            </div>

            {/* Inline stats */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs font-sans">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-foreground">{mockVendor.rating}</span>
                <span className="text-muted-foreground">({mockVendor.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-accent" />
                <span className="font-semibold text-foreground">{mockVendor.ordersCompleted}</span>
                <span className="text-muted-foreground">orders</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-semibold text-foreground">{mockVendor.onTimeRate}%</span>
                <span className="text-muted-foreground">on time</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-foreground">{mockVendor.disputeRate}%</span>
                <span className="text-muted-foreground">disputes</span>
              </span>
            </div>
          </div>
        </div>

        {/* Edit profile + vacation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-5 border-t border-border">
          <div />
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-sans font-semibold text-foreground">Vacation Mode</p>
              <p className="text-[10px] font-sans text-muted-foreground">When ON, you won't receive new lead alerts</p>
            </div>
            <Switch checked={vacationMode} onCheckedChange={handleVacationToggle} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: 'Orders Completed', value: mockVendor.ordersCompleted, color: 'text-accent' },
          { icon: ShieldCheck, label: 'Completion Rate', value: `${mockVendor.completionRate}%`, color: 'text-green-600 dark:text-green-400' },
          { icon: Clock, label: 'On-time Rate', value: `${mockVendor.onTimeRate}%`, color: 'text-blue-600 dark:text-blue-400' },
          { icon: Star, label: 'Dispute Rate', value: `${mockVendor.disputeRate}%`, color: 'text-amber-600 dark:text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <stat.icon className={cn("w-5 h-5 mx-auto mb-1.5", stat.color)} />
            <p className={cn("font-serif font-bold text-xl", stat.color)}>{stat.value}</p>
            <p className="text-[10px] font-sans text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Specialities */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-sans font-semibold text-foreground">Your Specialities</p>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => { setPendingSpecs(specialities); setSpecModalOpen(true); }}>
            <Pencil className="w-3 h-3 mr-1" /> Edit
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {specialities.map(s => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-sans">{s}</span>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-lg text-foreground">My Portfolio</h2>
          <Button variant="outline" size="sm" className="text-xs" onClick={handleAddPortfolio}>
            <Plus className="w-3 h-3 mr-1" /> Add Photo
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {portfolio.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border bg-muted">
              <img src={item.url} alt={item.caption} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  onClick={() => handleRemovePortfolio(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {editCaptionId === item.id ? (
                <div className="p-2">
                  <Input
                    defaultValue={item.caption}
                    onBlur={e => {
                      setPortfolio(prev => prev.map(p => p.id === item.id ? { ...p, caption: e.target.value } : p));
                      setEditCaptionId(null);
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    className="text-xs h-7"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="p-2 flex items-center justify-between">
                  <p className="text-xs font-sans text-muted-foreground truncate flex-1">{item.caption || 'Add caption...'}</p>
                  <button onClick={() => setEditCaptionId(item.id)} className="text-muted-foreground hover:text-foreground ml-1">
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="font-serif font-bold text-lg text-foreground">What Customers Say</h2>
          <p className="text-sm font-sans text-muted-foreground">{mockVendor.reviewCount} reviews · {avgRating}★ average</p>
        </div>
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-sans font-semibold text-sm text-foreground">{review.customerName}</span>
                  <span className="text-xs font-sans text-muted-foreground ml-2">{review.garment} · #{review.orderId}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn("w-3.5 h-3.5", s <= Math.round(review.rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                  ))}
                  <span className="text-xs font-sans font-semibold text-foreground ml-1">{review.rating}</span>
                </div>
              </div>
              <p className="text-sm font-sans text-muted-foreground">{review.comment}</p>
              <p className="text-xs font-sans text-muted-foreground mt-1">{review.date}</p>

              {review.responded && review.response && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs font-sans text-muted-foreground">
                    <span className="font-semibold text-foreground">Your response:</span>{' '}
                    <span className="italic">{review.response}</span>
                  </p>
                </div>
              )}

              {!review.responded && (
                <>
                  {respondingTo === review.id ? (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        className="text-xs font-sans min-h-[60px]"
                        maxLength={500}
                      />
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => { setRespondingTo(null); setResponseText(''); }}>Cancel</Button>
                        <Button variant="gold" size="sm" className="text-xs h-7" onClick={() => handlePostResponse(review.id)}>Post Response</Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs h-7 mt-2" onClick={() => { setRespondingTo(review.id); setResponseText(''); }}>
                      Respond to Review
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Specialities modal */}
      <Dialog open={specModalOpen} onOpenChange={setSpecModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Specialities</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 mt-2">
            {ALL_SPECIALITIES.map(s => {
              const selected = pendingSpecs.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => setPendingSpecs(prev => selected ? prev.filter(x => x !== s) : [...prev, s])}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-sans transition-colors border",
                    selected ? 'bg-accent text-accent-foreground border-accent font-semibold' : 'bg-card text-muted-foreground border-border hover:border-accent/50'
                  )}
                >
                  {selected && '✓ '}{s}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setSpecModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="gold" onClick={handleSaveSpecs} className="flex-1">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProfile;
