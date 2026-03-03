import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Clock, AlertCircle, Lock, Scissors, Video, Package, ArrowLeft, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { orderMilestones } from "@/data/mockData";
import { toast } from "sonner";
import redLehenga from "@/assets/red-lehenga.jpg";

const statusConfig = {
  completed: { icon: Check, color: "bg-success text-success-foreground", ring: "ring-success/20", label: "Completed" },
  action_required: { icon: AlertCircle, color: "bg-warning text-warning-foreground", ring: "ring-warning/20 animate-pulse-gold", label: "Action Required" },
  in_progress: { icon: Clock, color: "bg-info text-primary-foreground", ring: "ring-info/20", label: "In Progress" },
  pending: { icon: Lock, color: "bg-muted text-muted-foreground", ring: "", label: "Pending" },
};

const milestoneIcons: Record<string, typeof Scissors> = {
  ruler: Check, scissors: Scissors, thread: Clock, video: Video, package: Package,
};

const ActiveOrdersPage = () => {
  const navigate = useNavigate();
  const [review, setReview] = useState({ quality: 0, communication: 0, timeliness: 0, value: 0, text: "" });

  const completedCount = orderMilestones.filter((m) => m.status === "completed").length;

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-accent font-sans font-medium text-sm mb-6 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Track Order <span className="text-accent">#12346</span></h1>
          <p className="text-muted-foreground font-sans mt-1">Men's Bandhgala Suit • Artisan #3</p>
        </div>
        <span className="px-4 py-1.5 rounded-full text-sm font-sans font-medium bg-success-light text-success">
          {completedCount}/5 Completed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Order card */}
        <div className="bg-card rounded-2xl border border-border p-5 h-fit sticky top-24">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img src={redLehenga} alt="Order" className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2 px-2 py-1 bg-card/90 backdrop-blur-sm rounded-md text-xs font-sans font-medium">RED LEHENGA</div>
          </div>
          <p className="text-accent font-sans text-sm underline cursor-pointer mb-4">Click here to view the Measurement Card</p>
          <div className="space-y-3 text-sm font-sans">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">Order Summary</p>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-info-light text-info">IN PROGRESS</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expected Delivery</span><span className="font-medium text-foreground">April 20, 2026</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Price</span><span className="font-serif font-bold text-xl text-foreground">₹20,000</span></div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-success-light rounded-full text-success text-sm font-sans font-medium">
            <Check className="w-4 h-4" /> ₹20k in Escrow
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-3">Master Tailor</p>
            <h3 className="font-sans font-semibold text-foreground">Studio Vastra <Check className="w-4 h-4 inline text-info" /></h3>
            <p className="text-xs text-muted-foreground font-sans mt-1">📍 Indiranagar, Bangalore</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-sm font-sans">4.5 Rating</span>
              <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">GOLD TIER</span>
            </div>
            <Button variant="default" className="w-full mt-4" onClick={() => navigate("/dashboard/chat")}>
              💬 Chat
            </Button>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-1">
          <h2 className="font-serif font-bold text-xl text-foreground mb-6">Project Milestones</h2>

          {orderMilestones.map((ms, i) => {
            const config = statusConfig[ms.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={ms.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {i < orderMilestones.length - 1 && (
                  <div className={`absolute left-[19px] top-[48px] w-0.5 h-[calc(100%-32px)] ${ms.status === "completed" ? "bg-success" : "bg-border"}`} />
                )}

                <div className="flex gap-4 pb-8">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ${config.color} ${config.ring}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className={`flex-1 p-5 rounded-xl border transition-all ${ms.status === "pending" ? "bg-muted/50 border-border opacity-60" : "bg-card border-border"} ${ms.status === "action_required" ? "border-warning/40 shadow-md" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        {ms.status === "action_required" && <span className="text-xs font-sans font-bold text-warning uppercase mb-1 block">ACTIVE</span>}
                        <h3 className="font-sans font-semibold text-foreground">{ms.title}</h3>
                      </div>
                      {ms.completedDate && <span className="text-xs text-muted-foreground font-sans">{ms.completedDate}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground font-sans">{ms.description}</p>

                    {/* Vendor message */}
                    {ms.vendorMessage && (
                      <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
                        <p className="text-sm font-sans text-foreground italic">"{ms.vendorMessage}"</p>
                      </div>
                    )}

                    {/* Fabric swatches */}
                    {ms.fabrics && (
                      <div className="mt-4 flex gap-4">
                        {ms.fabrics.map((f) => (
                          <div key={f.name} className="text-center">
                            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${f.color} shadow-sm cursor-pointer hover:scale-105 transition-transform`} />
                            <span className="text-xs font-sans text-muted-foreground mt-1 block">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {ms.status === "action_required" && (
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" size="sm">Request Change</Button>
                        <Button variant="gold" size="sm" onClick={() => toast.success("Fabric approved!")}>Approve Fabric</Button>
                      </div>
                    )}

                    {/* Progress update */}
                    {ms.progressUpdate && (
                      <p className="mt-3 text-xs text-muted-foreground font-sans bg-info-light p-3 rounded-lg">{ms.progressUpdate}</p>
                    )}

                    {ms.estimatedDate && (
                      <p className="mt-2 text-xs text-muted-foreground font-sans">Est. completion: {ms.estimatedDate}</p>
                    )}

                    {/* Final milestone - review */}
                    {ms.id === 5 && ms.status !== "pending" && (
                      <div className="mt-4 space-y-4">
                        {["Quality", "Communication", "Timeliness", "Value"].map((cat) => {
                          const key = cat.toLowerCase() as keyof typeof review;
                          return (
                            <div key={cat} className="flex items-center gap-3">
                              <span className="text-sm font-sans text-foreground w-28">{cat}</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-5 h-5 cursor-pointer transition-colors ${s <= (review[key] as number) ? "fill-accent text-accent" : "text-border"}`}
                                    onClick={() => setReview({ ...review, [key]: s })}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        <Textarea placeholder="Write a review..." value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} className="font-sans" />
                        <Button variant="gold" onClick={() => toast.success("Review submitted!")}>Submit Review</Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActiveOrdersPage;
