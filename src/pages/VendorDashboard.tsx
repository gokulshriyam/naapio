import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const vendor = (() => {
    try { return JSON.parse(localStorage.getItem('naapio_vendor') || '{}'); }
    catch { return {}; }
  })();

  if (!vendor.role) {
    navigate('/for-tailors');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-accent" />
      </div>

      <div className="max-w-md">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Artisan Dashboard</h1>
        <p className="text-muted-foreground font-sans mb-8">
          Welcome back! Your full dashboard is being built. It will show open briefs to bid on, active order milestones, and your earnings.
        </p>
      </div>

      <div className="max-w-sm w-full bg-card border border-border rounded-xl p-6 mb-8">
        <p className="text-sm font-sans font-semibold text-foreground mb-4">Coming in next release</p>
        {[
          'Browse open customer briefs',
          'Submit bids with your price & timeline',
          'Manage active orders (M1-M5)',
          'Upload fitting videos & fabric photos',
          'Track earnings & payout status',
        ].map(item => (
          <p key={item} className="text-sm font-sans text-muted-foreground py-1.5">
            ✂️ {item}
          </p>
        ))}
      </div>

      <Button variant="outline" onClick={() => { localStorage.removeItem('naapio_vendor'); navigate('/'); }}>
        Log out
      </Button>
    </div>
  );
};

export default VendorDashboard;
