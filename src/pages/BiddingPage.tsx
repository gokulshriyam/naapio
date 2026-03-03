import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Edit, Eye, X as XIcon, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activeRequests, pastRequests } from "@/data/mockData";
import redLehenga from "@/assets/red-lehenga.jpg";

const BiddingPage = () => {
  const navigate = useNavigate();
  const [timers, setTimers] = useState(activeRequests.map((r) => ({ ...r.countdown, minutes: 0, seconds: 0 })));

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

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">My Requests</h1>
      <p className="text-muted-foreground font-sans mb-8">Manage your active and past bidding requests</p>

      <h2 className="font-sans font-semibold text-foreground text-lg mb-4">Active Requests</h2>
      <div className="space-y-4 mb-10">
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

      <h2 className="font-sans font-semibold text-foreground text-lg mb-4">Past Requests</h2>
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
    </div>
  );
};

export default BiddingPage;
