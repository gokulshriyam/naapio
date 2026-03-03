import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Award, MessageSquare, Check, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vendorBids } from "@/data/mockData";
import VendorPortfolioModal from "@/components/VendorPortfolioModal";
import { toast } from "sonner";

const tierColor: Record<string, string> = {
  Gold: "bg-accent text-accent-foreground",
  Silver: "bg-muted text-foreground",
  Bronze: "bg-warning-light text-warning",
};

const ViewBidsPage = () => {
  const navigate = useNavigate();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [portfolioVendor, setPortfolioVendor] = useState("");
  const [showEscrow, setShowEscrow] = useState(false);

  const sorted = [...vendorBids].sort((a, b) => (b.isBestMatch ? 1 : 0) - (a.isBestMatch ? 1 : 0));

  const handleAccept = () => {
    setShowEscrow(true);
  };

  const confirmAccept = () => {
    toast.success("Order confirmed! Redirecting to Active Orders...");
    setTimeout(() => navigate("/dashboard/active-orders"), 1200);
  };

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-accent font-sans font-medium text-sm mb-6 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </button>

      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <h2 className="font-sans font-semibold text-foreground mb-1">Men's Bandhgala Suit</h2>
        <p className="text-sm text-muted-foreground font-sans">Budget: ₹25,000–₹35,000 • Custom Measurements • Silk, Velvet • Deliver by Apr 20</p>
      </div>

      <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Vendor Bids ({vendorBids.length})</h2>

      <div className="space-y-4">
        {sorted.map((bid, i) => (
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-card rounded-2xl border p-6 transition-shadow hover:shadow-md ${bid.isBestMatch ? "border-accent ring-2 ring-accent/20" : "border-border"}`}
          >
            {bid.isBestMatch && (
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-xs font-sans font-bold text-accent uppercase tracking-wide">Best Match</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-serif font-bold text-primary text-lg">{bid.name.split("#")[1]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans font-semibold text-foreground">{bid.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`text-xs font-sans font-bold px-2 py-0.5 rounded-full ${tierColor[bid.tier]}`}>{bid.tier.toUpperCase()}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <span className="text-sm font-sans font-medium text-foreground">{bid.rating}★</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground font-sans">
                        <MapPin className="w-3.5 h-3.5" />{bid.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-serif font-bold text-foreground">₹{bid.bidAmount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground font-sans">{bid.deliveryDays} days</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {bid.specialisations.map((s) => (
                    <span key={s} className="px-2 py-0.5 text-xs font-sans bg-secondary text-foreground rounded-full">{s}</span>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {bid.reviews.map((r, j) => (
                    <p key={j} className="text-xs text-muted-foreground font-sans italic">"{r}"</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="default" size="sm" onClick={() => navigate("/dashboard/chat")}>
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </Button>
                  <Button variant="gold" size="sm" onClick={handleAccept}>
                    <Check className="w-3.5 h-3.5" /> Accept
                  </Button>
                  <Button variant="ghost" size="sm">Ignore</Button>
                  <Button variant="outline" size="sm" onClick={() => { setPortfolioVendor(bid.name); setPortfolioOpen(true); }}>
                    <Eye className="w-3.5 h-3.5" /> View Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <VendorPortfolioModal open={portfolioOpen} onClose={() => setPortfolioOpen(false)} vendorName={portfolioVendor} />

      {/* Escrow Modal */}
      {showEscrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground mb-2">Escrow-Protected Payment</h3>
            </div>
            <ul className="space-y-3 text-sm font-sans text-muted-foreground mb-6">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> Your payment is held securely in escrow</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> Funds released to vendor only on milestone approval</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> You're protected at every step</li>
            </ul>
            <p className="text-center font-serif font-bold text-2xl text-foreground mb-6">₹27,000</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEscrow(false)}>Cancel</Button>
              <Button variant="gold" className="flex-1" onClick={confirmAccept}>Confirm Payment</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewBidsPage;
