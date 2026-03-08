import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronRight, ChevronLeft, Check, X, CalendarIcon, Lock, ChevronDown, Info, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const garmentOptions = [
  "Saree Blouse",
  "Lehenga",
  "Salwar Kameez",
  "Anarkali",
  "Gown",
  "Kurta (Men's)",
  "Suit Jacket",
  "Trousers",
  "Sherwani",
  "Saree (fall/pico only)",
  "Other",
];

const garmentEmojis: Record<string, string> = {
  "Saree Blouse": "👚",
  "Lehenga": "👗",
  "Salwar Kameez": "👘",
  "Anarkali": "✨",
  "Gown": "🥻",
  "Kurta (Men's)": "👔",
  "Suit Jacket": "🤵",
  "Trousers": "👖",
  "Sherwani": "🎩",
  "Saree (fall/pico only)": "🧵",
  "Other": "📝",
};

const fixOptions = [
  "Take in / Make smaller",
  "Let out / Make bigger",
  "Shorten length",
  "Lengthen (if fabric allows)",
  "Change neckline",
  "Change sleeves",
  "Add lining",
  "Add padding / structure",
  "Re-stitch / Repair seam",
  "Add embellishment",
  "Remove embellishment",
  "Convert to different garment",
  "Other",
];

const getMinDelivery = (fixes: string[]): number => {
  const majorFixes = [
    "Convert to different garment",
    "Change neckline",
    "Change sleeves",
    "Add embellishment",
  ];
  const hasMajor = fixes.some((f) => majorFixes.includes(f));
  return hasMajor ? 7 : 3;
};

const getMinDeliveryDate = (fixes: string[]) => {
  const d = new Date();
  d.setDate(d.getDate() + getMinDelivery(fixes));
  return d;
};

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const AlterationFlow = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step A1
  const [alterationGarment, setAlterationGarment] = useState("");
  const [alterationGarmentOther, setAlterationGarmentOther] = useState("");

  // Matching Piece sub-flow
  const [matchingPieceType, setMatchingPieceType] = useState('');
  const [matchingForGarment, setMatchingForGarment] = useState('');
  const [matchingColourNote, setMatchingColourNote] = useState('');
  const [matchingReferencePhoto, setMatchingReferencePhoto] = useState<File | null>(null);
  const [matchingFabricAvailable, setMatchingFabricAvailable] = useState('');

  // Step A2
  const [alterationFixes, setAlterationFixes] = useState<string[]>([]);
  const [alterationFixNotes, setAlterationFixNotes] = useState<Record<string, string>>({});

  // Step A3
  const [garmentPhotos, setGarmentPhotos] = useState<{
    front: File | null;
    back: File | null;
    problem: File | null;
    reference: File | null;
  }>({ front: null, back: null, problem: null, reference: null });
  const [showBackWarning, setShowBackWarning] = useState(false);

  // Step A4
  const [alterationBudgetRange, setAlterationBudgetRange] = useState([1000, 5000]);
  const [alterationDeliveryDate, setAlterationDeliveryDate] = useState("");
  const [alterationFlexibleDate, setAlterationFlexibleDate] = useState(false);

  // Review
  const [showReview, setShowReview] = useState(false);

  // OTP + terms
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRushOrder, setIsRushOrder] = useState(false);
  const [briefShared, setBriefShared] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showExitWarning, setShowExitWarning] = useState(false);

  const formatBudget = (value: number): string => {
    if (value >= 100000) return `₹${(value/100000).toFixed(1).replace('.0','')}L`;
    if (value >= 1000) return `₹${(value/1000).toFixed(1).replace('.0','')}K`;
    return `₹${value}`;
  };

  const alterationBases: Record<string, number> = {
    'Saree Blouse': 600, 'Salwar Kameez': 800, 'Lehenga': 1500,
    'Kurti': 500, 'Trousers': 400, 'Sherwani': 1500,
    'Suit Jacket': 1200, 'Matching Piece': 2000,
    'Anarkali': 1000, 'Gown': 1200, 'Kurta (Men\'s)': 600,
    'Saree (fall/pico only)': 300,
  };

  const computeAlterationIntelligence = () => {
    const base = alterationBases[alterationGarment] || 800;
    const majorFixes = ['Convert to different garment', 'Change neckline', 'Change sleeves', 'Add embellishment', 'Add lining', 'Add padding / structure'];
    const hasMajor = alterationFixes.some(f => majorFixes.includes(f));
    const multiplier = hasMajor ? 2.0 : alterationFixes.length > 2 ? 1.5 : 1.0;
    const avg = Math.round(base * multiplier / 100) * 100;
    const min = Math.max(1000, Math.round(avg * 0.6 / 100) * 100);
    const max = Math.round(avg * 1.8 / 100) * 100;
    const factors: string[] = [];
    if (hasMajor) factors.push('Major alteration work detected (+100%)');
    else if (alterationFixes.length > 2) factors.push(`${alterationFixes.length} fixes selected (+50%)`);
    if (alterationGarment) factors.push(`Base for ${alterationGarment}: ₹${base}`);
    return { min, max, avg, explanation: factors };
  };

  const altIntelligence = computeAlterationIntelligence();

  const getDeliveryDayCount = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDeliveryDayMessage = (days: number) => {
    if (days < 7) return { text: `That's ${days} days — very tight. Consider enabling Rush Order.`, color: 'text-destructive' };
    if (days <= 14) return { text: `That's ${days} days — tight but possible for simple garments.`, color: 'text-amber-600' };
    if (days <= 30) return { text: `That's ${days} days — good timeline.`, color: 'text-green-600' };
    return { text: `That's ${days} days — comfortable timeline.`, color: 'text-muted-foreground' };
  };

  // Popstate handler for Android back button
  useEffect(() => {
    if (step >= 1) {
      window.history.pushState({ altStep: step }, '');
    }
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (showReview) {
        setShowReview(false);
      } else if (step > 1) {
        setStep((step - 1) as 1 | 2 | 3 | 4);
      } else {
        setShowExitWarning(true);
      }
      window.history.pushState({ altStep: step }, '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [step, showReview]);

  const handlePhotoUpload = (slot: keyof typeof garmentPhotos, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setGarmentPhotos((prev) => ({ ...prev, [slot]: file }));
  };

  const isMatchingPiece = alterationGarment === "Matching Piece";

  const canProceed = () => {
    if (step === 1) {
      return !!alterationGarment && (alterationGarment !== "Other" || !!alterationGarmentOther.trim());
    }
    if (step === 2) {
      if (isMatchingPiece) {
        return !!matchingPieceType && !!matchingForGarment && !!matchingFabricAvailable;
      }
      const hasAtLeastOne = alterationFixes.length > 0;
      const otherValid = !alterationFixes.includes("Other") || !!(alterationFixNotes["Other"] || "").trim();
      return hasAtLeastOne && otherValid;
    }
    if (step === 3) {
      return !!garmentPhotos.front;
    }
    if (step === 4) {
      return !!alterationBudgetMin.trim() && !!alterationDeliveryDate;
    }
    if (showReview) {
      return otpVerified && termsAccepted;
    }
    return true;
  };

  const generateOrderId = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `NP-2026-${num}`;
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      localStorage.setItem("naapio_last_order", JSON.stringify({
        orderId: newOrderId,
        orderType: "Alteration",
        garment: isMatchingPiece ? `Matching Piece: ${matchingPieceType}` : garmentDisplay,
        occasion: "",
        budgetRange: `₹${alterationBudgetMin} – ₹${alterationBudgetMax || "—"}`,
        deliveryDate: alterationDeliveryDate,
        matchingPieceType, matchingForGarment, matchingFabricAvailable, matchingColourNote,
        timestamp: new Date().toISOString()
      }));
      setOrderSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  const progressLabel = showReview
    ? "Review & Pay"
    : step === 1
    ? "A1 — Garment Type"
    : step === 2
    ? isMatchingPiece ? "A2 — Matching Piece Details" : "A2 — What Needs Fixing"
    : step === 3
    ? "A3 — Upload Photos"
    : "A4 — Budget & Delivery";

  const progressPercent = showReview ? 100 : (step / 4) * 100;

  const handleNext = () => {
    if (step === 3 && !garmentPhotos.back && !showBackWarning) {
      setShowBackWarning(true);
      return;
    }
    if (step === 4) {
      setShowReview(true);
      window.scrollTo(0, 0);
      return;
    }
    setStep((step + 1) as 1 | 2 | 3 | 4);
    setShowBackWarning(false);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
      return;
    }
    if (step === 1) {
      navigate("/start");
      return;
    }
    setStep((step - 1) as 1 | 2 | 3 | 4);
    setShowBackWarning(false);
    window.scrollTo(0, 0);
  };

  const garmentDisplay = alterationGarment === "Other" ? alterationGarmentOther : alterationGarment;

  const PhotoUploadCard = ({
    slot,
    label,
    badge,
    badgeColor,
    subText,
  }: {
    slot: keyof typeof garmentPhotos;
    label: string;
    badge: string;
    badgeColor: string;
    subText?: string;
  }) => {
    const file = garmentPhotos[slot];
    return (
      <div className="relative rounded-xl border-2 border-dashed border-border bg-card hover:border-accent/40 transition-all overflow-hidden">
        {file ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={label}
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handlePhotoUpload(slot, null)}
              className="absolute top-2 right-2 p-1.5 bg-card/90 backdrop-blur-sm rounded-full shadow-md hover:bg-muted"
            >
              <X className="w-3 h-3 text-foreground" />
            </button>
            <div className="p-3">
              <p className="font-sans text-xs font-medium text-foreground">{label}</p>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-40 cursor-pointer p-4">
            <Camera className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="font-sans text-sm font-medium text-foreground mb-1">{label}</p>
            {subText && <p className="font-sans text-xs text-muted-foreground text-center mb-2">{subText}</p>}
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${badgeColor}`}>
              {badge}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                handlePhotoUpload(slot, f);
              }}
            />
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">Leave this order?</h3>
            <p className="text-sm text-muted-foreground font-sans mb-6">Your progress will be saved as a draft — you can continue later.</p>
            <div className="flex gap-3">
              <Button variant="gold" className="flex-1" onClick={() => setShowExitWarning(false)}>Stay & Continue</Button>
              <Button variant="outline" className="flex-1" onClick={() => { setShowExitWarning(false); navigate('/'); }}>Leave</Button>
            </div>
          </div>
        </div>
      )}
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/")} className="font-serif font-bold text-lg text-foreground">
              Naapio
            </button>
            <span className="font-sans text-sm text-muted-foreground">{progressLabel}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <AnimatePresence mode="wait">
          {/* REVIEW & PAY */}
          {showReview && orderSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-[560px] mx-auto text-center">
                <span className="text-6xl mb-6">✅</span>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Your brief is live!</h2>
                <p className="text-muted-foreground font-sans mb-8">
                  Tailors in your city are reviewing your brief.<br />You'll receive bids within 7 days.
                </p>
                <div className="w-full p-5 bg-muted rounded-xl mb-8">
                  <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-1">Order ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-serif font-bold text-foreground">{orderId}</span>
                    <button onClick={() => { navigator.clipboard.writeText(orderId); toast.success("Copied!"); }} className="p-1.5 rounded-md hover:bg-card transition-colors" title="Copy Order ID">📋</button>
                  </div>
                </div>
                <div className="w-full space-y-4 mb-8 text-left">
                  <p className="font-sans font-semibold text-foreground text-sm">What happens next</p>
                  {[
                    { icon: "📋", text: "Tailors review your brief and submit bids" },
                    { icon: "👗", text: "You choose your tailor and confirm" },
                    { icon: "🔒", text: "Work begins — escrow protects every milestone" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <p className="font-sans text-sm text-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="inline-flex px-4 py-2 rounded-full bg-accent/10 text-accent font-sans text-sm font-medium mb-8">
                  Expect your first bids within 7 days
                </div>
                <div className="w-full space-y-3">
                  <Button variant="gold" size="hero" className="w-full" onClick={() => navigate("/dashboard")}>View My Order →</Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/start")}>Start Another Order</Button>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-6">A summary has been sent to your WhatsApp number {phone}</p>
              </div>
            </motion.div>
          ) : showReview ? (
            <motion.div key="review" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Review Your Alteration</h2>
              <p className="text-muted-foreground font-sans mb-8">Check everything below — once you pay, your brief goes live to tailors</p>

              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  {/* Order Type */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Type</span>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold bg-amber-100 text-amber-800">
                      Alteration
                    </span>
                  </div>

                  {/* Garment */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Garment</span>
                      <button onClick={() => { setShowReview(false); setStep(1); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">{isMatchingPiece ? "Make a Matching Piece" : garmentDisplay}</p>
                  </div>

                  {/* Matching Piece Details OR What Needs Fixing */}
                  {isMatchingPiece ? (
                    <div className="p-5 bg-card rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matching Piece</span>
                        <button onClick={() => { setShowReview(false); setStep(2); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-foreground font-sans"><span className="font-medium">Making:</span> {matchingPieceType}</p>
                        <p className="text-sm text-foreground font-sans"><span className="font-medium">To match:</span> {matchingForGarment}</p>
                        <p className="text-sm text-foreground font-sans"><span className="font-medium">Fabric:</span> {matchingFabricAvailable}</p>
                        {matchingColourNote && <p className="text-sm text-foreground font-sans"><span className="font-medium">Notes:</span> {matchingColourNote}</p>}
                        {matchingReferencePhoto && (
                          <img src={URL.createObjectURL(matchingReferencePhoto)} alt="Reference" className="w-14 h-14 rounded-lg object-cover border border-border mt-2" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-card rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">What Needs Fixing</span>
                        <button onClick={() => { setShowReview(false); setStep(2); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                      </div>
                      <div className="space-y-2">
                        {alterationFixes.map((fix) => (
                          <div key={fix}>
                            <p className="text-sm text-foreground font-sans font-medium">{fix}</p>
                            {alterationFixNotes[fix] && (
                              <p className="text-xs text-muted-foreground font-sans ml-4">"{alterationFixNotes[fix]}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photos */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photos</span>
                      <button onClick={() => { setShowReview(false); setStep(3); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <div className="flex gap-3">
                      {(["front", "back", "problem", "reference"] as const).map((slot) =>
                        garmentPhotos[slot] ? (
                          <img
                            key={slot}
                            src={URL.createObjectURL(garmentPhotos[slot]!)}
                            alt={slot}
                            className="w-14 h-14 rounded-lg object-cover border border-border"
                          />
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* Budget & Delivery */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget & Delivery</span>
                      <button onClick={() => { setShowReview(false); setStep(4); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">
                      Budget: ₹{alterationBudgetMin} – ₹{alterationBudgetMax || "—"}
                    </p>
                    <p className="text-sm text-foreground font-sans mt-1">
                      Delivery by: {alterationDeliveryDate ? format(new Date(alterationDeliveryDate + "T00:00:00"), "PPP") : "Not set"}
                      {alterationFlexibleDate ? " (±2 days flexible)" : ""}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground font-sans mt-2">
                    Tap any Edit → link above to update a section without losing your other answers.
                  </p>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5 md:sticky md:top-24 md:self-start">
                  <div className="text-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-sans font-bold bg-amber-100 text-amber-800">
                      Order Type: Alteration
                    </span>
                  </div>

                  <div className="p-6 bg-card rounded-2xl border-2 border-accent/30 shadow-lg">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-serif font-bold text-accent">₹499</span>
                      <p className="font-sans font-semibold text-foreground mt-1">Order Posting Fee</p>
                      <p className="text-xs text-muted-foreground font-sans mt-1">Deducted from your final payment when you confirm a tailor</p>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-semibold text-green-800">100% Escrow Protected</p>
                        <p className="font-sans text-xs text-green-700">Your money is held safely until you approve every milestone</p>
                      </div>
                    </div>

                    <details className="group mb-4">
                      <summary className="flex items-center justify-between cursor-pointer font-sans text-sm font-semibold text-foreground py-2 hover:text-accent transition-colors">
                        What happens next?
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-3 space-y-4 pl-1">
                        {[
                          { num: "1", title: "Your brief goes live", sub: "Tailors in your city review your brief and submit bids within 7 days" },
                          { num: "2", title: "You choose your tailor", sub: "Review bids, tailor profiles, and ratings — then confirm your pick" },
                          { num: "3", title: "5 milestone approvals", sub: "Measurement → Fabric → Stitching → Virtual Trial → Final — you approve each step" },
                          { num: "4", title: "Delivery", sub: "Tailor delivers by your requested date. Final payment releases from escrow." },
                        ].map((item) => (
                          <div key={item.num} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold font-sans">{item.num}</span>
                            <div>
                              <p className="font-sans text-sm font-semibold text-foreground">{item.title}</p>
                              <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>

                  {!otpVerified ? (
                    <div className="p-5 bg-card rounded-xl border border-border">
                      <h3 className="font-sans font-semibold text-foreground mb-3">Verify Mobile Number</h3>
                      {!otpSent ? (
                        <div className="flex gap-2">
                          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="font-sans" />
                          <Button variant="default" onClick={() => { setOtpSent(true); toast.info("OTP sent!"); }}>Send OTP</Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex gap-2">
                            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="4-digit OTP" maxLength={4} className="font-sans" />
                            <Button variant="gold" onClick={() => { if (/^\d{4}$/.test(otp)) { setOtpVerified(true); toast.success("Mobile verified!"); } else { toast.error("Enter any 4 digits"); } }}>Verify OTP</Button>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans mt-2">Demo mode — enter any 4 digits to verify</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-sans text-sm font-medium text-foreground">Mobile number verified</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Checkbox id="alt-terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
                    <label htmlFor="alt-terms" className="text-sm font-sans text-muted-foreground cursor-pointer">
                      I agree to the <span className="text-accent underline">Terms & Conditions</span> and <span className="text-accent underline">Privacy Policy</span>
                    </label>
                  </div>

                  <Button
                    variant="gold"
                    size="hero"
                    className="w-full"
                    disabled={!(otpVerified && termsAccepted) || loading}
                    onClick={handlePay}
                  >
                    {loading ? "Processing..." : "Pay ₹499 & Post Brief"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* STEP A1: GARMENT TYPE */}
              {step === 1 && (
                <motion.div key="a1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What are you getting altered?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Select your garment type</p>

                  {/* Matching Piece — Most Popular Tile */}
                  <button
                    onClick={() => setAlterationGarment("Matching Piece")}
                    className={`w-full mb-4 p-5 rounded-xl text-left font-sans transition-all border-2 relative ${
                      alterationGarment === "Matching Piece"
                        ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                        : "border-accent/40 bg-card hover:border-accent/60"
                    }`}
                  >
                    <span className="absolute top-3 right-3 inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-accent text-accent-foreground">Most Popular</span>
                    <span className="text-2xl block mb-2">🧵</span>
                    <p className="font-bold text-sm text-foreground flex items-center gap-2">
                      {alterationGarment === "Matching Piece" && <Check className="w-4 h-4 text-accent" />}
                      Make a Matching Piece
                    </p>
                    <p className="text-xs text-muted-foreground font-sans mt-1">Stitch a blouse, dupatta, or accessory to match your existing garment</p>
                  </button>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {garmentOptions.map((g) => (
                      <button
                        key={g}
                        onClick={() => setAlterationGarment(g)}
                        className={`p-5 rounded-xl text-left font-sans transition-all border ${
                          alterationGarment === g
                            ? "border-accent bg-gold-light ring-2 ring-accent/30"
                            : "border-border bg-card hover:border-accent/30"
                        }`}
                      >
                        <span className="text-2xl block mb-2">{garmentEmojis[g] || "📝"}</span>
                        <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                          {alterationGarment === g && <Check className="w-4 h-4 text-accent" />}
                          {g}
                        </p>
                      </button>
                    ))}
                  </div>

                  {alterationGarment === "Other" && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <Input
                        value={alterationGarmentOther}
                        onChange={(e) => setAlterationGarmentOther(e.target.value)}
                        placeholder="Describe your garment"
                        className="font-sans"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP A2: MATCHING PIECE SUB-FLOW or WHAT NEEDS FIXING */}
              {step === 2 && isMatchingPiece ? (
                <motion.div key="a2-matching" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What would you like made to match?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Tell us what you need and what you're matching it to</p>

                  {/* What piece do you need? */}
                  <div className="mb-8">
                    <label className="font-sans font-semibold text-foreground text-sm mb-3 block">What piece do you need? <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Saree Blouse", "Lehenga Choli (top)", "Dupatta", "Potli Bag", "Jacket / Shrug", "Hair Accessory", "Matching Kurta", "Other"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setMatchingPieceType(opt)}
                          className={`px-3 py-2.5 rounded-lg text-xs font-sans font-medium transition-all border ${
                            matchingPieceType === opt
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-card border-border text-foreground hover:border-accent/30"
                          }`}
                        >
                          {matchingPieceType === opt && <Check className="w-3 h-3 inline mr-1" />}
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* What are you matching it to? */}
                  <div className="mb-8">
                    <label className="font-sans font-semibold text-foreground text-sm mb-3 block">What are you matching it to? <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Lehenga Skirt", "Saree", "Salwar / Palazzo", "Sherwani", "Suit Jacket", "Other outfit"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setMatchingForGarment(opt)}
                          className={`px-3 py-2.5 rounded-lg text-xs font-sans font-medium transition-all border ${
                            matchingForGarment === opt
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-card border-border text-foreground hover:border-accent/30"
                          }`}
                        >
                          {matchingForGarment === opt && <Check className="w-3 h-3 inline mr-1" />}
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fabric situation */}
                  <div className="mb-8">
                    <label className="font-sans font-semibold text-foreground text-sm mb-3 block">Do you have matching fabric? <span className="text-destructive">*</span></label>
                    <div className="space-y-3">
                      {[
                        { value: "Yes — I have fabric from the same set", icon: "✅", sub: "e.g. saree came with blouse piece, lehenga came with extra fabric" },
                        { value: "No — tailor should source matching fabric", icon: "🔍", sub: "Tailor will try to match colour and texture as closely as possible" },
                        { value: "I'll bring fabric to tailor directly", icon: "🤝", sub: "You'll hand over fabric after tailor is selected" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setMatchingFabricAvailable(opt.value)}
                          className={`w-full p-4 rounded-xl text-left font-sans transition-all border flex items-start gap-3 ${
                            matchingFabricAvailable === opt.value
                              ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                              : "border-border bg-card hover:border-accent/30"
                          }`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{opt.value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {matchingFabricAvailable === "Yes — I have fabric from the same set" && (
                      <p className="mt-3 p-3 bg-accent/10 rounded-lg text-xs text-foreground font-sans">📸 Upload a photo of your fabric piece in the next step so tailors can assess it.</p>
                    )}
                  </div>

                  {/* Colour match note */}
                  <div className="mb-8">
                    <label className="font-sans font-semibold text-foreground text-sm mb-2 block">Any specific colour matching notes?</label>
                    <Input
                      value={matchingColourNote}
                      onChange={(e) => setMatchingColourNote(e.target.value)}
                      placeholder="e.g. 'Match the gold border exactly' or 'Slightly lighter shade than the skirt'"
                      className="font-sans"
                    />
                  </div>

                  {/* Reference photo */}
                  <div>
                    <label className="font-sans font-semibold text-foreground text-sm mb-1 block">Upload your existing garment</label>
                    <p className="text-xs text-muted-foreground font-sans mb-3">Show the tailor what they're matching to</p>
                    <div className="relative rounded-xl border-2 border-dashed border-border bg-card hover:border-accent/40 transition-all overflow-hidden">
                      {matchingReferencePhoto ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(matchingReferencePhoto)} alt="Reference" className="w-full h-40 object-cover" />
                          <button onClick={() => setMatchingReferencePhoto(null)} className="absolute top-2 right-2 p-1.5 bg-card/90 backdrop-blur-sm rounded-full shadow-md hover:bg-muted">
                            <X className="w-3 h-3 text-foreground" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-40 cursor-pointer p-4">
                          <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="font-sans text-sm font-medium text-foreground mb-1">Upload Photo</p>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-blue-100 text-blue-700">Recommended</span>
                          <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            if (f && f.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                            setMatchingReferencePhoto(f);
                          }} />
                        </label>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : step === 2 && (
                <motion.div key="a2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What needs to be done?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Select everything that applies — your tailor will confirm what's possible</p>

                  <div className="space-y-3">
                    {fixOptions.map((fix) => {
                      const isChecked = alterationFixes.includes(fix);
                      return (
                        <div key={fix} className={`p-4 rounded-xl border transition-all ${isChecked ? "border-accent bg-gold-light" : "border-border bg-card"}`}>
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`fix-${fix}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setAlterationFixes((prev) => [...prev, fix]);
                                } else {
                                  setAlterationFixes((prev) => prev.filter((f) => f !== fix));
                                  setAlterationFixNotes((prev) => {
                                    const next = { ...prev };
                                    delete next[fix];
                                    return next;
                                  });
                                }
                              }}
                            />
                            <label htmlFor={`fix-${fix}`} className="font-sans text-sm font-semibold text-foreground cursor-pointer flex-1">
                              {fix}
                            </label>
                          </div>
                          {isChecked && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 ml-7">
                              <Input
                                value={alterationFixNotes[fix] || ""}
                                onChange={(e) =>
                                  setAlterationFixNotes((prev) => ({ ...prev, [fix]: e.target.value }))
                                }
                                placeholder={fix === "Other" ? "Describe what needs to be done" : "Any specific notes for this? (optional)"}
                                className="font-sans text-sm"
                              />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP A3: UPLOAD PHOTOS */}
              {step === 3 && (
                <motion.div key="a3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Upload photos of your garment</h2>
                  <p className="text-muted-foreground font-sans mb-6">Your tailor needs to see the garment before bidding</p>

                  <div className="grid grid-cols-2 gap-4">
                    <PhotoUploadCard slot="front" label="Front View" badge="Required" badgeColor="bg-rose-100 text-rose-700" />
                    <div>
                      <PhotoUploadCard slot="back" label="Back View" badge="Required" badgeColor="bg-rose-100 text-rose-700" />
                      {showBackWarning && !garmentPhotos.back && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-sans text-amber-800 mb-2">
                            Back view helps tailors assess the full garment — are you sure you want to skip it?
                          </p>
                          <div className="flex gap-2">
                            <label className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-accent text-accent-foreground cursor-pointer">
                              Add Back Photo
                              <input
                                type="file"
                                accept="image/jpeg,image/png"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  handlePhotoUpload("back", f);
                                  setShowBackWarning(false);
                                }}
                              />
                            </label>
                            <button
                              onClick={() => {
                                setShowBackWarning(false);
                                setStep(4);
                                window.scrollTo(0, 0);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium border border-border text-muted-foreground hover:bg-muted"
                            >
                              Continue Anyway
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <PhotoUploadCard slot="problem" label="Problem Area" badge="Recommended" badgeColor="bg-blue-100 text-blue-700" subText="The area that needs fixing — close up" />
                    <PhotoUploadCard slot="reference" label="How You Want It" badge="Optional" badgeColor="bg-muted text-muted-foreground" subText="A photo showing how it should look after" />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-blue-800">
                      Good photos = better bids. Tailors rely on these to understand the work involved — blurry or incomplete photos may reduce bid quality.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP A4: BUDGET & DELIVERY */}
              {step === 4 && (
                <motion.div key="a4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What's your budget and when do you need it?</h2>
                  <p className="text-muted-foreground font-sans mb-8">Final details before we match you with tailors</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Budget */}
                    <div>
                      <h3 className="font-sans font-semibold text-foreground mb-4">Budget for the alteration work</h3>
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                          <label className="text-xs font-sans text-muted-foreground mb-1 block">Min ₹</label>
                          <Input
                            type="number"
                            placeholder="300"
                            value={alterationBudgetMin}
                            onChange={(e) => setAlterationBudgetMin(e.target.value)}
                            className="font-sans"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-sans text-muted-foreground mb-1 block">Max ₹</label>
                          <Input
                            type="number"
                            placeholder="1,500"
                            value={alterationBudgetMax}
                            onChange={(e) => setAlterationBudgetMax(e.target.value)}
                            className="font-sans"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        {alterationGuidance[alterationGarment] || 'Enter your comfortable range'}
                      </p>
                      {Number(alterationBudgetMin) > 0 && Number(alterationBudgetMax) > 0 && Number(alterationBudgetMin) > Number(alterationBudgetMax) && (
                        <p className="text-xs text-destructive font-sans mt-1">Min budget can't be higher than max</p>
                      )}
                      <p className="text-xs text-muted-foreground font-sans mt-2">
                        💡 Set a realistic range — tailors bid within it.
                      </p>
                    </div>

                    {/* Rush Order Toggle */}
                    <div className={`p-5 rounded-xl border transition-all col-span-full mb-4 ${isRushOrder ? "bg-amber-50 border-amber-300" : "bg-card border-border"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚡</span>
                          <div>
                            <p className="font-sans font-bold text-foreground text-sm">Rush Order</p>
                            <p className="text-xs text-muted-foreground font-sans mt-0.5">Need it faster? Rush orders attract tailors who specialise in quick turnaround.</p>
                          </div>
                        </div>
                        <Switch checked={isRushOrder} onCheckedChange={setIsRushOrder} />
                      </div>
                      {isRushOrder && (
                        <p className="mt-3 p-3 bg-amber-100/60 rounded-lg text-xs text-amber-800 font-sans">⚡ Rush surcharge: Tailors may add 20–40% to their bid for rush orders.</p>
                      )}
                    </div>

                    {/* Delivery Date */}
                    <div>
                      <h3 className="font-sans font-semibold text-foreground mb-4">When do you need it back?</h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-sans",
                              !alterationDeliveryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {alterationDeliveryDate
                              ? format(new Date(alterationDeliveryDate + "T00:00:00"), "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={alterationDeliveryDate ? new Date(alterationDeliveryDate + "T00:00:00") : undefined}
                            onSelect={(date) => {
                              if (date) setAlterationDeliveryDate(date.toISOString().split("T")[0]);
                            }}
                            disabled={(date) => date < getMinDeliveryDate(alterationFixes)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      {alterationDeliveryDate && (() => {
                        const days = getDeliveryDayCount(alterationDeliveryDate);
                        const msg = getDeliveryDayMessage(days);
                        return <p className={`text-xs font-sans mt-2 ${msg.color}`}>{msg.text}</p>;
                      })()}
                      <p className="text-xs text-muted-foreground font-sans mt-2">
                        {getMinDelivery(alterationFixes) >= 7
                          ? "Major alterations need at least 7 days"
                          : "Simple alterations need at least 3 days"}
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <Checkbox
                          id="alt-flex-date"
                          checked={alterationFlexibleDate}
                          onCheckedChange={(v) => setAlterationFlexibleDate(!!v)}
                        />
                        <label htmlFor="alt-flex-date" className="text-sm font-sans text-foreground cursor-pointer">
                          My date is flexible ±2 days
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!showReview && (
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button variant="gold" disabled={!canProceed()} onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlterationFlow;
