import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Star, MapPin, Award, TrendingUp, Clock, ShieldCheck } from "lucide-react";
import { mockVendor, mockVendorReviews } from "../data/vendorMockData";
import { toast } from "sonner";

const VendorProfile = () => {
  const navigate = useNavigate();
  const [vacationMode, setVacationMode] = useState(mockVendor.vacationMode);

  const handleVacationToggle = (v: boolean) => {
    setVacationMode(v);
    toast.success(v ? 'Vacation mode turned ON. You won\'t receive new leads.' : 'Vacation mode turned OFF. You\'re back in action!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">Profile</h1>
        <p className="text-sm font-sans text-muted-foreground">Your public profile, ratings, and settings.</p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-serif font-bold text-2xl flex-shrink-0">
            {mockVendor.realName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif font-bold text-xl text-foreground">{mockVendor.realName}</h2>
            <p className="text-sm font-sans text-muted-foreground">{mockVendor.alias}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-amber-400 text-amber-950 text-xs font-semibold">
                <Award className="w-3 h-3 mr-1" /> {mockVendor.tier} Tier
              </Badge>
              <span className="flex items-center gap-1 text-sm font-sans text-foreground">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {mockVendor.rating}
                <span className="text-muted-foreground">({mockVendor.reviewCount} reviews)</span>
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm font-sans text-muted-foreground">
              <MapPin className="w-4 h-4" /> {mockVendor.location}
            </div>
          </div>
        </div>

        {/* Specialities */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {mockVendor.specialities.map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-sans">{s}</span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: 'Orders Completed', value: mockVendor.ordersCompleted, color: 'text-accent' },
          { icon: ShieldCheck, label: 'Completion Rate', value: `${mockVendor.completionRate}%`, color: 'text-green-600' },
          { icon: Clock, label: 'On-time Rate', value: `${mockVendor.onTimeRate}%`, color: 'text-blue-600' },
          { icon: Star, label: 'Dispute Rate', value: `${mockVendor.disputeRate}%`, color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
            <p className={`font-serif font-bold text-xl ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-sans text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Vacation mode */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans font-semibold text-sm text-foreground">🏖️ Vacation Mode</p>
            <p className="text-xs font-sans text-muted-foreground">Pause receiving new leads while you're away.</p>
          </div>
          <Switch checked={vacationMode} onCheckedChange={handleVacationToggle} />
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="font-serif font-bold text-lg text-foreground mb-4">Customer Reviews</h2>
        <div className="space-y-3">
          {mockVendorReviews.map(review => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-sm text-foreground">{review.customerName}</span>
                  <Badge variant="outline" className="text-[10px]">{review.garment}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-sans font-semibold text-foreground">{review.rating}</span>
                </div>
              </div>
              <p className="text-sm font-sans text-muted-foreground">{review.comment}</p>
              <p className="text-xs font-sans text-muted-foreground mt-1">{review.date} · #{review.orderId}</p>
              {review.responded && review.response && (
                <div className="mt-2 p-2 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs font-sans text-muted-foreground"><span className="font-semibold text-foreground">Your reply:</span> {review.response}</p>
                </div>
              )}
              {!review.responded && (
                <Button variant="ghost" size="sm" className="text-xs h-7 mt-2">Reply to review</Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={() => navigate('/for-tailors')}>
        Edit Registration Details
      </Button>
    </div>
  );
};

export default VendorProfile;
