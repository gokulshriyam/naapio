import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, RotateCw, Share2, ShieldAlert, ChevronDown, ChevronUp,
  Star, MessageSquare, Check, Circle, AlertCircle, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const formatBudget = (v: number): string => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1).replace(".0", "")}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1).replace(".0", "")}K`;
  return `₹${v}`;
};

type MilestoneStatus = "pending" | "awaiting_approval" | "approved" | "changes_requested";

interface MilestoneData {
  id: number;
  key: string;
  label: string;
  subText: string;
  status: MilestoneStatus;
  approvedDate?: string;
}

const defaultMilestones: MilestoneData[] = [
  { id: 1, key: "M1", label: "Measurement Confirmation", subText: "Your artisan has confirmed your measurements.", status: "pending" },
  { id: 2, key: "M2", label: "Fabric Approval", subText: "Artisan uploads photo of selected/received fabric.", status: "pending" },
  { id: 3, key: "M3", label: "Stitching Preview", subText: "First stitch photos before completion.", status: "pending" },
  { id: 4, key: "M4", label: "Final Fitting", subText: "Complete garment before final delivery.", status: "pending" },
  { id: 5, key: "M5", label: "Delivery", subText: "Garment delivered. Please confirm receipt.", status: "pending" },
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<MilestoneData[]>(defaultMilestones);
  const [changeNotes, setChangeNotes] = useState<Record<number, string>>({});
  const [changeSending, setChangeSending] = useState<Record<number, boolean>>({});
  const [showBrief, setShowBrief] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeText, setDisputeText] = useState("");
  const [disputeMilestone, setDisputeMilestone] = useState("");
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ text: string; from: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showChangeInput, setShowChangeInput] = useState<number | null>(null);

  // Load order
  useEffect(() => {
    try {
      const raw = localStorage.getItem("naapio_last_order");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.orderId === id || !id) {
          setOrder(parsed);
          // If tailor was selected, set M1 to awaiting
          if (parsed.tailorSelected || parsed.status === "tailor_selected") {
            setMilestones((prev) =>
              prev.map((m) => (m.id === 1 ? { ...m, status: "awaiting_approval" as MilestoneStatus } : m))
            );
          }
        }
      }
    } catch {}
    setLoading(false);
  }, [id]);

  const handleApprove = (milestoneId: number) => {
    setMilestones((prev) => {
      const updated = prev.map((m) => {
        if (m.id === milestoneId) return { ...m, status: "approved" as MilestoneStatus, approvedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) };
        if (m.id === milestoneId + 1) return { ...m, status: "awaiting_approval" as MilestoneStatus };
        return m;
      });
      if (milestoneId === 5) {
        setTimeout(() => setOrderComplete(true), 500);
      }
      return updated;
    });
    toast.success(`Milestone ${milestoneId} approved!`);
  };

  const handleRequestChanges = (milestoneId: number) => {
    if (!changeNotes[milestoneId]?.trim()) return;
    setChangeSending((prev) => ({ ...prev, [milestoneId]: true }));
    setTimeout(() => {
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "changes_requested" as MilestoneStatus } : m))
      );
      setChangeSending((prev) => ({ ...prev, [milestoneId]: false }));
      setShowChangeInput(null);
      toast.info("Change request sent to artisan.");
    }, 1000);
  };

  const handleReorder = () => {
    if (!order) return;
    const draft = {
      step: 3, step2Phase: "fabric", step3Phase: "colour",
      orderType: order.orderType, gender: order.gender,
      selectedCategory: order.selectedCategory, selectedSubCategory: order.selectedSubCategory,
      measurementType: "saved", isReorder: true, reorderMode: "same",
    };
    localStorage.setItem("naapio_wizard_draft", JSON.stringify(draft));
    navigate("/wizard");
  };

  const handleShare = () => {
    const text = `Check out my Naapio order #${id}! Track at naapio.lovable.app/order/${id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { text: chatInput.trim(), from: "you" }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { text: "Thank you for your message. I'll review and respond shortly.", from: "tailor" }]);
    }, 1000);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order not found</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">We couldn't find order #{id}. It may have been placed on a different device.</p>
        <Button variant="gold" onClick={() => navigate("/dashboard")}>View My Dashboard →</Button>
      </div>
    );
  }

  // Completion celebration
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        {/* CSS confetti */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                backgroundColor: ["#F59E0B", "#EF4444", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"][i % 6],
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-50 max-w-md">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Order Complete!</h2>
          <p className="text-muted-foreground font-sans mb-6">Your garment has been delivered. We hope you love it!</p>

          {!reviewSubmitted ? (
            <div className="space-y-4 mb-8">
              <p className="font-sans font-semibold text-sm text-foreground">Rate your artisan</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className={`text-3xl transition-transform hover:scale-110 ${s <= rating ? "text-accent" : "text-muted-foreground/30"}`}>★</button>
                ))}
              </div>
              {rating > 0 && (
                <div className="space-y-3">
                  <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us what you loved..." className="min-h-[80px]" />
                  <Button variant="gold" className="w-full" onClick={() => setReviewSubmitted(true)}>Submit Review</Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-success font-sans mb-8">Thank you! Your review helps other customers find great artisans.</p>
          )}

          <div className="space-y-3">
            <Button variant="gold" className="w-full" onClick={handleReorder}>🔄 Reorder this design</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/start")}>Start a New Order →</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const orderTypeMap: Record<string, { label: string; cls: string }> = {
    new: { label: "New Order", cls: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
    "new-order": { label: "New Order", cls: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
    alteration: { label: "Alteration", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    customise: { label: "Customisation", cls: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    "own-fabric": { label: "Own Fabric", cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  };
  const otBadge = orderTypeMap[order.orderType] || orderTypeMap.new;

  const artisan = order.selectedArtisan || { alias: "Artisan Gold-7", tier: "Gold", rating: 4.9, completionRate: 97, disputeRate: 1.2, bidAmount: order.bidAmount || 28000 };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> My Orders
          </button>
          <span className="text-sm text-muted-foreground font-sans">Order #{id}</span>
        </div>

        {/* Type badge + garment */}
        <div className="mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium ${otBadge.cls}`}>{otBadge.label}</span>
          <h1 className="font-serif font-bold text-xl text-foreground mt-2">
            {order.garment || `${order.gender || ""} · ${order.selectedCategory || ""} · ${order.selectedSubCategory || ""}`}
          </h1>
        </div>

        {/* Order Summary (collapsible) */}
        <Card className="mb-4">
          <button onClick={() => setShowBrief(!showBrief)} className="w-full flex items-center justify-between px-6 py-4">
            <span className="font-sans font-semibold text-sm text-foreground">Order Summary</span>
            {showBrief ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showBrief && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm font-sans">
                {order.selectedCategory && <div><span className="text-muted-foreground">Garment:</span> <span className="font-medium">{order.selectedCategory}</span></div>}
                {(order.occasion || order.selectedOccasion) && <div><span className="text-muted-foreground">Occasion:</span> <span className="font-medium">{order.occasion || order.selectedOccasion}</span></div>}
                {order.selectedFit && <div><span className="text-muted-foreground">Fit:</span> <span className="font-medium">{order.selectedFit}</span></div>}
                {order.selectedColourMood && <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{order.selectedColourMood}</span></div>}
                {order.selectedFabricFeel && <div><span className="text-muted-foreground">Fabric:</span> <span className="font-medium">{order.selectedFabricFeel}</span></div>}
                {order.budgetRange && <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">{typeof order.budgetRange === "string" ? order.budgetRange : `${formatBudget(order.budgetRange.min)} – ${formatBudget(order.budgetRange.max)}`}</span></div>}
                {order.deliveryDate && <div><span className="text-muted-foreground">Delivery:</span> <span className="font-medium">{order.deliveryDate}</span></div>}
                {order.isRushOrder && <div><Badge className="bg-warning text-warning-foreground">⚡ Rush Order</Badge></div>}
                {order.isGiftOrder && <div className="col-span-2"><span className="text-muted-foreground">🎁 Gift order for {order.recipientName || "someone special"}</span></div>}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Artisan Panel */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-foreground">{artisan.alias}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-sans font-medium">{artisan.tier}</span>
                  <span className="text-xs text-muted-foreground font-sans">⭐ {artisan.rating} · ✅ {artisan.completionRate}% · 🛡️ {artisan.disputeRate}%</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-1">Escrow: {formatBudget(artisan.bidAmount)}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setChatOpen(!chatOpen)}>
                <MessageSquare className="w-3 h-3 mr-1" /> Message Artisan
              </Button>
            </div>
            {chatOpen && (
              <div className="mt-3 border border-border rounded-lg overflow-hidden">
                <div className="h-32 overflow-y-auto p-3 space-y-2 bg-muted/50">
                  {chatMessages.length === 0 && <p className="text-xs text-muted-foreground text-center py-6 font-sans">Start a conversation with your artisan.</p>}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-sans ${m.from === "you" ? "bg-accent text-accent-foreground" : "bg-card text-foreground"}`}>{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 p-2 border-t border-border">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 h-8 text-xs px-3 rounded-md border border-input bg-background font-sans" onKeyDown={(e) => e.key === "Enter" && handleSendChat()} />
                  <Button size="sm" variant="gold" className="h-8 px-3" onClick={handleSendChat}>Send</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 5-Milestone Tracker */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-serif">Milestone Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {milestones.map((m, i) => {
                const statusIcon = () => {
                  switch (m.status) {
                    case "approved": return <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center"><Check className="w-4 h-4 text-success-foreground" /></div>;
                    case "awaiting_approval": return <div className="w-7 h-7 rounded-full bg-warning flex items-center justify-center animate-pulse"><Clock className="w-4 h-4 text-warning-foreground" /></div>;
                    case "changes_requested": return <div className="w-7 h-7 rounded-full bg-destructive flex items-center justify-center"><AlertCircle className="w-4 h-4 text-destructive-foreground" /></div>;
                    default: return <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><Circle className="w-3.5 h-3.5 text-muted-foreground" /></div>;
                  }
                };

                const needsMeasurements = m.id === 1 && !order.measurementType || (order.measurementType === "later");

                return (
                  <div key={m.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {statusIcon()}
                      {i < milestones.length - 1 && <div className={`w-px flex-1 min-h-[32px] ${m.status === "approved" ? "bg-success" : "bg-border"}`} />}
                    </div>
                    <div className="pb-5 flex-1">
                      <p className={`font-sans font-medium text-sm ${m.status === "pending" ? "text-muted-foreground/60" : "text-foreground"}`}>
                        {m.key}: {m.label}
                      </p>

                      {m.status === "approved" && (
                        <p className="text-xs text-success font-sans mt-0.5">Approved on {m.approvedDate || "—"}</p>
                      )}

                      {m.status === "changes_requested" && (
                        <p className="text-xs text-destructive font-sans mt-0.5">Changes requested — waiting for artisan update</p>
                      )}

                      {m.status === "awaiting_approval" && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground font-sans mb-2">{m.subText}</p>

                          {m.id === 1 && needsMeasurements && (
                            <div className="p-3 bg-warning-light rounded-lg mb-3">
                              <p className="text-xs font-sans text-foreground font-medium">⚠️ You haven't submitted your measurements yet. Your artisan cannot start without them.</p>
                              <Button size="sm" variant="gold" className="mt-2 text-xs" onClick={() => navigate("/wizard")}>Submit Measurements →</Button>
                            </div>
                          )}

                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="gold" className="text-xs" onClick={() => handleApprove(m.id)}>✓ Approve</Button>
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowChangeInput(showChangeInput === m.id ? null : m.id)}>✏️ Request Changes</Button>
                          </div>

                          {showChangeInput === m.id && (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                value={changeNotes[m.id] || ""}
                                onChange={(e) => setChangeNotes((prev) => ({ ...prev, [m.id]: e.target.value }))}
                                placeholder="Describe what needs to change..."
                                className="min-h-[60px] text-xs"
                              />
                              <Button size="sm" variant="destructive" className="text-xs" disabled={!changeNotes[m.id]?.trim() || changeSending[m.id]} onClick={() => handleRequestChanges(m.id)}>
                                {changeSending[m.id] ? "Sending..." : "Send Change Request"}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {m.status === "pending" && (
                        <p className="text-xs text-muted-foreground/50 font-sans mt-0.5">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <Button variant="gold" className="w-full" onClick={handleReorder}>
            <RotateCw className="h-4 w-4 mr-2" /> Reorder this design →
          </Button>
          <Button variant="outline" className="w-full" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" /> 📲 Share order status
          </Button>
        </div>

        {/* Dispute */}
        <Card className="mb-8">
          <button onClick={() => setShowDispute(!showDispute)} className="w-full flex items-center justify-between px-6 py-4">
            <span className="font-sans text-sm text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> 🛡️ Raise a concern
            </span>
            {showDispute ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showDispute && !disputeSubmitted && (
            <CardContent className="pt-0 space-y-3">
              <Textarea value={disputeText} onChange={(e) => setDisputeText(e.target.value)} placeholder="Describe your concern..." className="min-h-[80px]" />
              <Select value={disputeMilestone} onValueChange={setDisputeMilestone}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Which milestone?" /></SelectTrigger>
                <SelectContent>
                  {milestones.map((m) => <SelectItem key={m.key} value={m.key}>{m.key}: {m.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="destructive" disabled={!disputeText.trim()} onClick={() => {
                setDisputeSubmitted(true);
                toast.info("Your concern has been raised. Our team responds within 24 hours.");
              }}>Submit</Button>
            </CardContent>
          )}
          {disputeSubmitted && (
            <CardContent className="pt-0">
              <p className="text-sm font-sans text-success">Your concern has been raised. Our team responds within 24 hours.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
