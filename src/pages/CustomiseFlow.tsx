import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronRight, ChevronLeft, Check, X, CalendarIcon, Lock, ChevronDown, Info, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Data constants ──────────────────────────────────────────────

const customisationOptions = [
  { label: "Embroidery / Thread Work", emoji: "🪡" },
  { label: "Zari / Zardozi Work", emoji: "✨" },
  { label: "Mirror Work / Shisha", emoji: "🔮" },
  { label: "Sequins & Beadwork", emoji: "💎" },
  { label: "Hand Painting / Fabric Art", emoji: "🎨" },
  { label: "Block / Screen Printing", emoji: "🖨️" },
  { label: "Patch / Appliqué Work", emoji: "🪢" },
  { label: "Monogram / Name Embroidery", emoji: "🔤" },
  { label: "Digital / Heat Transfer Print", emoji: "🖥️" },
  { label: "Other", emoji: "➕" },
];

const placementZoneOptions = [
  "Collar / Neckline",
  "Chest / Front Panel",
  "Back Panel",
  "Sleeves",
  "Hem / Border",
  "Waistband",
  "Full Garment",
  "Custom Area",
];

const getMinDeliveryDays = (types: string[]): number => {
  if (types.includes("Hand Painting / Fabric Art")) return 7;
  if (
    types.includes("Embroidery / Thread Work") ||
    types.includes("Zari / Zardozi Work") ||
    types.includes("Mirror Work / Shisha") ||
    types.includes("Sequins & Beadwork")
  )
    return 5;
  return 3;
};

const getMinDeliveryDate = (types: string[]) => {
  const d = new Date();
  d.setDate(d.getDate() + getMinDeliveryDays(types));
  return d;
};

const colourMoodOptions = [
  { label: "Deep Reds", swatch: "#8B1A1A" },
  { label: "Jewel Tones", swatch: "#2E4A7A" },
  { label: "Pastels", swatch: "#E8B4C8" },
  { label: "Golds & Champagne", swatch: "#C8963E" },
  { label: "Ivory & Cream", swatch: "#F5EDD6" },
  { label: "Greens & Teals", swatch: "#2D6A4F" },
  { label: "Pinks & Mauves", swatch: "#C9748C" },
  { label: "Blues & Indigos", swatch: "#3D405B" },
  { label: "Blacks & Charcoals", swatch: "#2C2C2C" },
  { label: "Whites & Silvers", swatch: "#E8E8E8" },
  { label: "Match my garment", swatch: null },
];

// SVG zone definitions for a kurta front-view
const svgZones: { id: string; label: string; d: string }[] = [
  {
    id: "Collar / Neckline",
    label: "Neckline",
    d: "M 95,38 Q 120,28 150,30 Q 180,28 205,38 Q 195,50 150,52 Q 105,50 95,38 Z",
  },
  {
    id: "Chest / Front Panel",
    label: "Chest",
    d: "M 90,55 L 210,55 L 210,130 L 90,130 Z",
  },
  {
    id: "Sleeves",
    label: "Sleeves",
    d: "M 40,55 L 88,55 L 88,120 L 40,100 Z M 212,55 L 260,55 L 260,100 L 212,120 Z",
  },
  {
    id: "Waistband",
    label: "Waist",
    d: "M 90,132 L 210,132 L 210,155 L 90,155 Z",
  },
  {
    id: "Hem / Border",
    label: "Hem",
    d: "M 85,230 L 215,230 L 218,260 L 82,260 Z",
  },
];

// ── Component ───────────────────────────────────────────────────

const CustomiseFlow = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showReview, setShowReview] = useState(false);

  // C1
  const [customisePhotos, setCustomisePhotos] = useState<{
    front: File | null;
    back: File | null;
    side: File | null;
  }>({ front: null, back: null, side: null });

  // C2
  const [customisationTypes, setCustomisationTypes] = useState<string[]>([]);
  const [customisationOther, setCustomisationOther] = useState("");

  // C3
  const [placementZones, setPlacementZones] = useState<string[]>([]);
  const [placementCustomNote, setPlacementCustomNote] = useState("");
  const [referenceArtPhoto, setReferenceArtPhoto] = useState<File | null>(null);
  const [placementError, setPlacementError] = useState(false);

  // C4
  const [customiseColourMood, setCustomiseColourMood] = useState("");
  const [customiseStyleNotes, setCustomiseStyleNotes] = useState("");

  // C5
  const [customiseBudgetMin, setCustomiseBudgetMin] = useState("");
  const [customiseBudgetMax, setCustomiseBudgetMax] = useState("");
  const [customiseDeliveryDate, setCustomiseDeliveryDate] = useState("");
  const [customiseFlexibleDate, setCustomiseFlexibleDate] = useState(false);

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

  // ── helpers ──
  const handlePhotoUpload = (slot: keyof typeof customisePhotos, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setCustomisePhotos((p) => ({ ...p, [slot]: file }));
  };

  const toggleZone = (zone: string) => {
    setPlacementError(false);
    if (zone === "Full Garment") {
      setPlacementZones((prev) =>
        prev.includes("Full Garment") ? prev.filter((z) => z !== "Full Garment") : ["Full Garment"]
      );
    } else {
      setPlacementZones((prev) => {
        const without = prev.filter((z) => z !== "Full Garment");
        return without.includes(zone) ? without.filter((z) => z !== zone) : [...without, zone];
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return !!customisePhotos.front && !!customisePhotos.back;
    if (step === 2) {
      const hasOne = customisationTypes.length > 0;
      const otherValid = !customisationTypes.includes("Other") || !!customisationOther.trim();
      return hasOne && otherValid;
    }
    if (step === 3) return placementZones.length > 0;
    if (step === 4) return true;
    if (step === 5) return !!customiseBudgetMin.trim() && !!customiseDeliveryDate;
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
        orderType: "Customise",
        garment: customisationTypes.join(", "),
        occasion: "",
        budgetRange: `₹${customiseBudgetMin} – ₹${customiseBudgetMax || "—"}`,
        deliveryDate: customiseDeliveryDate,
        timestamp: new Date().toISOString()
      }));
      setOrderSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  const progressLabel = showReview
    ? "Review & Pay"
    : step === 1
    ? "C1 — Garment Photos"
    : step === 2
    ? "C2 — Customisation Type"
    : step === 3
    ? "C3 — Placement & Reference"
    : step === 4
    ? "C4 — Colour & Style"
    : "C5 — Budget & Delivery";

  const progressPercent = showReview ? 100 : (step / 5) * 100;

  const handleNext = () => {
    if (step === 3 && placementZones.length === 0) {
      setPlacementError(true);
      return;
    }
    if (step === 5) {
      setShowReview(true);
      window.scrollTo(0, 0);
      return;
    }
    setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
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
    setStep((step - 1) as 1 | 2 | 3 | 4 | 5);
    window.scrollTo(0, 0);
  };

  // ── Shared sub-components ──

  const PhotoCard = ({
    slot,
    label,
    badge,
    badgeColor,
  }: {
    slot: keyof typeof customisePhotos;
    label: string;
    badge: string;
    badgeColor: string;
  }) => {
    const file = customisePhotos[slot];
    return (
      <div className="relative rounded-xl border-2 border-dashed border-border bg-card hover:border-accent/40 transition-all overflow-hidden">
        {file ? (
          <div className="relative">
            <img src={URL.createObjectURL(file)} alt={label} className="w-full h-44 object-cover" />
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
          <label className="flex flex-col items-center justify-center h-44 cursor-pointer p-4">
            <Camera className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="font-sans text-sm font-medium text-foreground mb-1">{label}</p>
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

  // ── SVG Garment Diagram ──
  const GarmentDiagram = () => {
    const isFullGarment = placementZones.includes("Full Garment");
    return (
      <svg viewBox="0 0 300 280" className="w-full max-w-sm mx-auto" aria-label="Garment placement diagram">
        {/* Garment silhouette outline */}
        <path
          d="M 150,30 Q 120,28 95,38 L 40,55 L 40,100 L 88,120 L 88,230 L 82,260 L 218,260 L 212,230 L 212,120 L 260,100 L 260,55 L 205,38 Q 180,28 150,30 Z"
          fill={isFullGarment ? "hsl(var(--accent) / 0.15)" : "hsl(var(--card))"}
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          className="transition-colors duration-200"
        />
        {/* Centre line */}
        <line x1="150" y1="52" x2="150" y2="260" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Tappable zones */}
        {svgZones.map((zone) => {
          const selected = placementZones.includes(zone.id) || isFullGarment;
          return (
            <g key={zone.id} className="cursor-pointer" onClick={() => toggleZone(zone.id)}>
              <path
                d={zone.d}
                fill={selected ? "hsl(var(--accent) / 0.2)" : "transparent"}
                stroke={selected ? "hsl(var(--accent))" : "hsl(var(--border))"}
                strokeWidth={selected ? "2" : "1"}
                strokeDasharray={selected ? "none" : "4 3"}
                className="transition-all duration-200 hover:fill-[hsl(var(--accent)/0.1)]"
              />
              {selected && (
                <text
                  x={zone.id === "Sleeves" ? 64 : 150}
                  y={
                    zone.id === "Collar / Neckline"
                      ? 44
                      : zone.id === "Chest / Front Panel"
                      ? 98
                      : zone.id === "Sleeves"
                      ? 82
                      : zone.id === "Waistband"
                      ? 147
                      : 250
                  }
                  textAnchor="middle"
                  className="fill-accent text-[9px] font-sans font-semibold pointer-events-none select-none"
                >
                  ✓ {zone.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Body area fill (between chest and hem) */}
        <path
          d="M 90,157 L 210,157 L 212,228 L 88,228 Z"
          fill={isFullGarment ? "hsl(var(--accent) / 0.15)" : "transparent"}
          stroke="none"
          className="pointer-events-none"
        />
      </svg>
    );
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header / progress */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/")} className="font-serif font-bold text-lg text-foreground">
              Naapio
            </button>
            <span className="font-sans text-sm text-muted-foreground">{progressLabel}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent rounded-full" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Info banner */}
      {!showReview && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-6 py-2.5 flex items-center gap-2">
            <span className="text-base">🎨</span>
            <p className="font-sans text-xs text-amber-800">
              This flow is for adding artwork or embellishment to an existing finished garment — not for stitching a new garment.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <AnimatePresence mode="wait">
          {/* ═══ REVIEW ═══ */}
          {showReview && orderSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-[560px] mx-auto text-center">
                <span className="text-6xl mb-6">✅</span>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Your brief is live!</h2>
                <p className="text-muted-foreground font-sans mb-8">
                  Artisans in your city are reviewing your brief.<br />You'll receive bids within 7 days.
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
                    { icon: "📋", text: "Artisans review your brief and submit bids" },
                    { icon: "👗", text: "You choose your artisan and confirm" },
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
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Review Your Customisation</h2>
              <p className="text-muted-foreground font-sans mb-8">Check everything below — once you pay, your brief goes live to artisans</p>

              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8">
                {/* LEFT */}
                <div className="space-y-4">
                  {/* Order Type */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Type</span>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold bg-purple-100 text-purple-800">
                        Customise My Garment
                      </span>
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Garment Photos</span>
                      <button onClick={() => { setShowReview(false); setStep(1); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <div className="flex gap-3">
                      {(["front", "back", "side"] as const).map((s) =>
                        customisePhotos[s] ? (
                          <img key={s} src={URL.createObjectURL(customisePhotos[s]!)} alt={s} className="w-14 h-14 rounded-lg object-cover border border-border" />
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* Customisation */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customisation</span>
                      <button onClick={() => { setShowReview(false); setStep(2); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <div className="space-y-1">
                      {customisationTypes.map((t) => (
                        <p key={t} className="text-sm text-foreground font-sans">
                          {t === "Other" ? customisationOther || "Other" : t}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Placement */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Placement</span>
                      <button onClick={() => { setShowReview(false); setStep(3); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">{placementZones.join(", ")}</p>
                    {placementCustomNote && <p className="text-xs text-muted-foreground font-sans mt-1">"{placementCustomNote}"</p>}
                  </div>

                  {/* Reference */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reference Design</span>
                      <button onClick={() => { setShowReview(false); setStep(3); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    {referenceArtPhoto ? (
                      <img src={URL.createObjectURL(referenceArtPhoto)} alt="Reference" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    ) : (
                      <p className="text-sm text-muted-foreground font-sans">No reference uploaded</p>
                    )}
                  </div>

                  {/* Colour & Style */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colour & Style</span>
                      <button onClick={() => { setShowReview(false); setStep(4); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">Colour: {customiseColourMood || "No preference"}</p>
                    <p className="text-sm text-foreground font-sans mt-1">Notes: {customiseStyleNotes || "None"}</p>
                  </div>

                  {/* Budget & Delivery */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget & Delivery</span>
                      <button onClick={() => { setShowReview(false); setStep(5); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">
                      Budget: ₹{customiseBudgetMin} – ₹{customiseBudgetMax || "—"}
                    </p>
                    <p className="text-sm text-foreground font-sans mt-1">
                      Delivery by: {customiseDeliveryDate ? format(new Date(customiseDeliveryDate + "T00:00:00"), "PPP") : "Not set"}
                      {customiseFlexibleDate ? " (±2 days flexible)" : ""}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground font-sans mt-2">Tap any Edit → link above to update a section without losing your other answers.</p>
                </div>

                {/* RIGHT */}
                <div className="space-y-5 md:sticky md:top-24 md:self-start">
                  <div className="text-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-sans font-bold bg-purple-100 text-purple-800">
                      Order Type: Customise My Garment
                    </span>
                  </div>

                  <div className="p-6 bg-card rounded-2xl border-2 border-accent/30 shadow-lg">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-serif font-bold text-accent">₹499</span>
                      <p className="font-sans font-semibold text-foreground mt-1">Order Posting Fee</p>
                      <p className="text-xs text-muted-foreground font-sans mt-1">Deducted from your final payment when you confirm an artisan</p>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-semibold text-green-800">100% Escrow Protected</p>
                        <p className="font-sans text-xs text-green-700">Your money is held safely until you approve every milestone</p>
                      </div>
                    </div>

                    {/* Artisan note */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 mb-4">
                      <span className="text-base mt-0.5">🎨</span>
                      <p className="font-sans text-xs text-amber-800">
                        Your brief goes to our artisan pool — embroiderers, painters, and print specialists — not general tailors. Bids reflect specialist craft rates.
                      </p>
                    </div>

                    <details className="group mb-4">
                      <summary className="flex items-center justify-between cursor-pointer font-sans text-sm font-semibold text-foreground py-2 hover:text-accent transition-colors">
                        What happens next?
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-3 space-y-4 pl-1">
                        {[
                          { num: "1", title: "Your brief goes live", sub: "Artisans in your city review your brief and submit bids within 7 days" },
                          { num: "2", title: "You choose your artisan", sub: "Review bids, artisan profiles, and ratings — then confirm your pick" },
                          { num: "3", title: "5 milestone approvals", sub: "Measurement → Fabric → Stitching → Virtual Trial → Final — you approve each step" },
                          { num: "4", title: "Delivery", sub: "Artisan delivers by your requested date. Final payment releases from escrow." },
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

                  {/* OTP */}
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
                    <Checkbox id="cust-terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
                    <label htmlFor="cust-terms" className="text-sm font-sans text-muted-foreground cursor-pointer">
                      I agree to the <span className="text-accent underline">Terms & Conditions</span> and <span className="text-accent underline">Privacy Policy</span>
                    </label>
                  </div>

                  <Button variant="gold" size="hero" className="w-full" disabled={!(otpVerified && termsAccepted) || loading} onClick={handlePay}>
                    {loading ? "Processing..." : "Pay ₹499 & Post Brief"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* ═══ C1: GARMENT PHOTOS ═══ */}
              {step === 1 && (
                <motion.div key="c1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Show us the garment you want customised</h2>
                  <p className="text-muted-foreground font-sans mb-6">Your artisan needs to see exactly what they're working with</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <PhotoCard slot="front" label="Front View" badge="Required" badgeColor="bg-rose-100 text-rose-700" />
                    <PhotoCard slot="back" label="Back View" badge="Required" badgeColor="bg-rose-100 text-rose-700" />
                    <PhotoCard slot="side" label="Side View" badge="Optional" badgeColor="bg-muted text-muted-foreground" />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-blue-800">
                      Clear, well-lit photos help artisans understand the fabric, colour, and existing details — so their bid is accurate and their work fits perfectly.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ═══ C2: CUSTOMISATION TYPE ═══ */}
              {step === 2 && (
                <motion.div key="c2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What would you like done?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Select everything you want — your artisan will advise what works together</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {customisationOptions.map((opt) => {
                      const selected = customisationTypes.includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          onClick={() => {
                            setCustomisationTypes((prev) =>
                              prev.includes(opt.label) ? prev.filter((t) => t !== opt.label) : [...prev, opt.label]
                            );
                          }}
                          className={`p-5 rounded-xl text-left font-sans transition-all border ${
                            selected ? "border-accent bg-gold-light ring-2 ring-accent/30" : "border-border bg-card hover:border-accent/30"
                          }`}
                        >
                          <span className="text-2xl block mb-2">{opt.emoji}</span>
                          <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                            {selected && <Check className="w-4 h-4 text-accent" />}
                            {opt.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {customisationTypes.includes("Other") && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <Input
                        value={customisationOther}
                        onChange={(e) => setCustomisationOther(e.target.value)}
                        placeholder="Describe the customisation you have in mind"
                        className="font-sans"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ═══ C3: PLACEMENT & REFERENCE ═══ */}
              {step === 3 && (
                <motion.div key="c3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Where on the garment, and what should it look like?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Tap the zones you want customised</p>

                  {/* SVG Diagram */}
                  <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                    <GarmentDiagram />
                  </div>

                  {/* Zone pills below SVG */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Back Panel", "Full Garment", "Custom Area"].map((zone) => {
                      const selected = placementZones.includes(zone);
                      return (
                        <button
                          key={zone}
                          onClick={() => {
                            if (zone === "Custom Area") {
                              toggleZone(zone);
                            } else {
                              toggleZone(zone);
                            }
                          }}
                          className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                            selected
                              ? "border-accent bg-accent text-accent-foreground font-medium"
                              : "border-border bg-card text-foreground hover:border-accent/40"
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 inline mr-1" />}
                          {zone}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Area note */}
                  {placementZones.includes("Custom Area") && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                      <Input
                        value={placementCustomNote}
                        onChange={(e) => setPlacementCustomNote(e.target.value)}
                        placeholder="Describe the area — e.g. 'left cuff only' or 'pallu edge'"
                        className="font-sans"
                      />
                    </motion.div>
                  )}

                  {/* Selection summary */}
                  <div className="mb-6">
                    {placementZones.length > 0 ? (
                      <p className="text-sm font-sans text-foreground">
                        <span className="font-semibold">Selected:</span> {placementZones.join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm font-sans text-muted-foreground">Tap zones above to select placement</p>
                    )}
                  </div>

                  {placementError && (
                    <p className="text-sm font-sans text-destructive mb-4">Please tap at least one zone to show where you want the work done</p>
                  )}

                  {/* Reference photo upload */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-sans font-semibold text-foreground mb-1">Upload a reference image</h3>
                    <p className="text-xs text-muted-foreground font-sans mb-3">
                      Show the artisan a design, pattern, or artwork you like — even a rough sketch works
                    </p>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-100 text-amber-700 mb-3">
                      Optional but strongly recommended
                    </span>
                    {referenceArtPhoto ? (
                      <div className="flex items-center gap-3">
                        <img src={URL.createObjectURL(referenceArtPhoto)} alt="Reference" className="w-20 h-20 rounded-lg object-cover border border-border" />
                        <button onClick={() => setReferenceArtPhoto(null)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-dashed border-border rounded-xl hover:border-accent/40 transition-all">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="font-sans text-sm text-muted-foreground">Click to upload</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            if (f && f.size > 10 * 1024 * 1024) {
                              toast.error("File must be under 10MB");
                              return;
                            }
                            setReferenceArtPhoto(f);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ C4: COLOUR & STYLE ═══ */}
              {step === 4 && (
                <motion.div key="c4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Any colour or style preferences for the artwork?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Optional — leave blank if you're happy for the artisan to suggest</p>

                  <div className="mb-8">
                    <p className="font-sans font-semibold text-foreground mb-3">Colour for the embroidery / artwork</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {colourMoodOptions.map((cm) => (
                        <button
                          key={cm.label}
                          onClick={() => setCustomiseColourMood(customiseColourMood === cm.label ? "" : cm.label)}
                          className={`p-4 rounded-xl text-left font-sans text-sm transition-all border ${
                            customiseColourMood === cm.label
                              ? "border-accent bg-gold-light ring-2 ring-accent/30"
                              : "border-border bg-card hover:border-accent/30"
                          }`}
                        >
                          {cm.swatch ? (
                            <div className="w-10 h-10 rounded-full mb-3 border border-border" style={{ backgroundColor: cm.swatch }} />
                          ) : (
                            <div className="w-10 h-10 rounded-full mb-3 border border-border bg-muted flex items-center justify-center">
                              <span className="text-xs">🎨</span>
                            </div>
                          )}
                          <span className="leading-tight block font-medium">{cm.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-sans mt-3">This is the colour of the artwork itself — not your garment colour</p>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-foreground mb-3">Any specific style notes? <span className="font-normal text-muted-foreground">(optional)</span></p>
                    <Textarea
                      value={customiseStyleNotes}
                      onChange={(e) => setCustomiseStyleNotes(e.target.value.slice(0, 300))}
                      placeholder="e.g. 'Keep it minimal, just outline work' or 'I want it to match the border of my dupatta' or 'Inspired by Rajasthani style'"
                      className="font-sans min-h-[120px]"
                      maxLength={300}
                    />
                    <p className="text-xs text-muted-foreground font-sans mt-2 text-right">{customiseStyleNotes.length}/300</p>
                  </div>

                  <button onClick={() => { setStep(5); window.scrollTo(0, 0); }} className="mt-4 text-sm font-sans text-accent hover:underline">
                    Skip this step →
                  </button>
                </motion.div>
              )}

              {/* ═══ C5: BUDGET & DELIVERY ═══ */}
              {step === 5 && (
                <motion.div key="c5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What's your budget and when do you need it?</h2>
                  <p className="text-muted-foreground font-sans mb-8">Final details before we match you with artisans</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="font-sans font-semibold text-foreground mb-4">Budget for the customisation work</h3>
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                          <label className="text-xs font-sans text-muted-foreground mb-1 block">Min ₹</label>
                          <Input type="number" placeholder="500" value={customiseBudgetMin} onChange={(e) => setCustomiseBudgetMin(e.target.value)} className="font-sans" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-sans text-muted-foreground mb-1 block">Max ₹</label>
                          <Input type="number" placeholder="3,000" value={customiseBudgetMax} onChange={(e) => setCustomiseBudgetMax(e.target.value)} className="font-sans" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Artisans bid on this range. Complex hand work like Zardozi may need a higher range to attract skilled bids.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-sans font-semibold text-foreground mb-4">When do you need it ready?</h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-sans", !customiseDeliveryDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customiseDeliveryDate ? format(new Date(customiseDeliveryDate + "T00:00:00"), "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={customiseDeliveryDate ? new Date(customiseDeliveryDate + "T00:00:00") : undefined}
                            onSelect={(date) => { if (date) setCustomiseDeliveryDate(date.toISOString().split("T")[0]); }}
                            disabled={(date) => date < getMinDeliveryDate(customisationTypes)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground font-sans mt-2">
                        {customisationTypes.includes("Hand Painting / Fabric Art")
                          ? "Hand painting needs at least 7 days"
                          : customisationTypes.some((t) =>
                              ["Embroidery / Thread Work", "Zari / Zardozi Work", "Mirror Work / Shisha", "Sequins & Beadwork"].includes(t)
                            )
                          ? "Detailed embroidery needs at least 5 days"
                          : "At least 3 days required"}
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <Checkbox id="cust-flex" checked={customiseFlexibleDate} onCheckedChange={(v) => setCustomiseFlexibleDate(!!v)} />
                        <label htmlFor="cust-flex" className="text-sm font-sans text-foreground cursor-pointer">My date is flexible ±2 days</label>
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

export default CustomiseFlow;
