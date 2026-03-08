import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronRight, ChevronLeft, Check, X, CalendarIcon, Lock, ChevronDown, Info, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
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

type PlacementView = 'front-upper' | 'back' | 'lower';

const frontUpperZones: { id: string; label: string; d: string }[] = [
  { id: "neckline", label: "Neckline", d: "M 95,38 Q 120,28 150,30 Q 180,28 205,38 Q 195,50 150,52 Q 105,50 95,38 Z" },
  { id: "left-shoulder", label: "L Shoulder", d: "M 68,48 L 95,38 L 95,65 L 72,62 Z" },
  { id: "right-shoulder", label: "R Shoulder", d: "M 205,38 L 232,48 L 228,62 L 205,65 Z" },
  { id: "chest-left", label: "Chest L", d: "M 90,55 L 148,55 L 148,115 L 90,115 Z" },
  { id: "chest-right", label: "Chest R", d: "M 152,55 L 210,55 L 210,115 L 152,115 Z" },
  { id: "left-sleeve", label: "L Sleeve", d: "M 30,55 L 88,55 L 88,125 L 30,105 Z" },
  { id: "right-sleeve", label: "R Sleeve", d: "M 212,55 L 270,55 L 270,105 L 212,125 Z" },
  { id: "waist-front", label: "Waist", d: "M 90,117 L 210,117 L 210,145 L 90,145 Z" },
  { id: "abdomen", label: "Abdomen", d: "M 90,147 L 210,147 L 210,210 L 90,210 Z" },
  { id: "hem-front", label: "Front Hem", d: "M 85,212 L 215,212 L 218,245 L 82,245 Z" },
];

const backZones: { id: string; label: string; d: string }[] = [
  { id: "back-neckline", label: "Back Neck", d: "M 95,38 Q 120,28 150,30 Q 180,28 205,38 Q 195,50 150,52 Q 105,50 95,38 Z" },
  { id: "upper-back", label: "Upper Back", d: "M 90,55 L 210,55 L 210,115 L 90,115 Z" },
  { id: "mid-back", label: "Mid Back", d: "M 90,117 L 210,117 L 210,175 L 90,175 Z" },
  { id: "lower-back", label: "Lower Back", d: "M 90,177 L 210,177 L 210,220 L 90,220 Z" },
  { id: "back-left-sleeve", label: "L Sleeve", d: "M 30,55 L 88,55 L 88,125 L 30,105 Z" },
  { id: "back-right-sleeve", label: "R Sleeve", d: "M 212,55 L 270,55 L 270,105 L 212,125 Z" },
  { id: "hem-back", label: "Back Hem", d: "M 85,222 L 215,222 L 218,250 L 82,250 Z" },
  { id: "back-full", label: "Select All", d: "" },
];

const lowerZones: { id: string; label: string; d: string }[] = [
  { id: "waistband", label: "Waistband", d: "M 70,20 L 230,20 L 230,50 L 70,50 Z" },
  { id: "front-left-panel", label: "Front L", d: "M 75,52 L 148,52 L 140,200 L 65,200 Z" },
  { id: "front-right-panel", label: "Front R", d: "M 152,52 L 225,52 L 235,200 L 160,200 Z" },
  { id: "back-left-panel", label: "Back L", d: "" },
  { id: "back-right-panel", label: "Back R", d: "" },
  { id: "left-side-seam", label: "L Seam", d: "M 63,52 L 73,52 L 63,200 L 53,200 Z" },
  { id: "right-side-seam", label: "R Seam", d: "M 227,52 L 237,52 L 247,200 L 237,200 Z" },
  { id: "left-hem-lower", label: "L Hem", d: "M 53,202 L 142,202 L 142,230 L 53,230 Z" },
  { id: "right-hem-lower", label: "R Hem", d: "M 158,202 L 247,202 L 247,230 L 158,230 Z" },
  { id: "full-lower", label: "Select All", d: "" },
];

const viewLabels: Record<PlacementView, string> = {
  'front-upper': 'Front & Upper Body',
  'back': 'Back Body',
  'lower': 'Lower Body',
};

const getZonesForView = (view: PlacementView) => {
  if (view === 'front-upper') return frontUpperZones;
  if (view === 'back') return backZones;
  return lowerZones;
};

const getZoneLabelById = (id: string): string => {
  const all = [...frontUpperZones, ...backZones, ...lowerZones];
  return all.find(z => z.id === id)?.label || id;
};

const getViewForZone = (zoneId: string): PlacementView => {
  if (frontUpperZones.some(z => z.id === zoneId)) return 'front-upper';
  if (backZones.some(z => z.id === zoneId)) return 'back';
  return 'lower';
};

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

const formatBudget = (value: number): string => {
  if (value >= 100000) return `₹${(value/100000).toFixed(1).replace('.0','')}L`;
  if (value >= 1000) return `₹${(value/1000).toFixed(1).replace('.0','')}K`;
  return `₹${value}`;
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
  const [activeView, setActiveView] = useState<PlacementView>('front-upper');
  const [selectedZonesByView, setSelectedZonesByView] = useState<Record<PlacementView, string[]>>({
    'front-upper': [], 'back': [], 'lower': [],
  });
  const [zoneNotes, setZoneNotes] = useState<Record<string, string>>({});
  const [zonePhotos, setZonePhotos] = useState<Record<string, File | null>>({});
  const [placementCustomNote, setPlacementCustomNote] = useState("");

  // Customise Intelligence
  const custIntelligence = useMemo(() => {
    const basesPerZone: Record<string, number> = {
      'Embroidery / Thread Work': 1500, 'Zari / Zardozi Work': 2000,
      'Mirror Work / Shisha': 1500, 'Sequins & Beadwork': 1200,
      'Hand Painting / Fabric Art': 2000, 'Block / Screen Printing': 800,
      'Patch / Appliqué Work': 1000, 'Monogram / Name Embroidery': 800,
      'Digital / Heat Transfer Print': 600,
    };
    const zones = totalSelectedZones || 1;
    const highestBase = customisationTypes.length > 0
      ? Math.max(...customisationTypes.map(t => basesPerZone[t] || 1000))
      : 1000;
    const avg = Math.round(highestBase * zones / 500) * 500;
    const min = Math.max(1000, Math.round(avg * 0.6 / 500) * 500);
    const max = Math.round(avg * 1.8 / 500) * 500;
    const factors: string[] = [];
    if (customisationTypes.length > 0) factors.push(`${customisationTypes[0]}${customisationTypes.length > 1 ? ` + ${customisationTypes.length - 1} more` : ''}`);
    if (zones > 1) factors.push(`${zones} zones selected`);
    return { min, max, avg, explanation: factors };
  }, [customisationTypes, totalSelectedZones]);
  const [referenceArtPhoto, setReferenceArtPhoto] = useState<File | null>(null);
  const [placementError, setPlacementError] = useState(false);

  const totalSelectedZones = Object.values(selectedZonesByView).flat().length;
  const allSelectedZones = Object.values(selectedZonesByView).flat();

  // C4
  const [customiseColourMood, setCustomiseColourMood] = useState("");
  const [customiseStyleNotes, setCustomiseStyleNotes] = useState("");

  // C5
  const [customiseBudgetRange, setCustomiseBudgetRange] = useState([1000, 8000]);
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
    // Handle "select all" shortcuts
    if (zone === "back-full") {
      const backIds = backZones.filter(z => z.id !== "back-full").map(z => z.id);
      setSelectedZonesByView(prev => ({
        ...prev,
        back: prev.back.length === backIds.length ? [] : backIds,
      }));
      return;
    }
    if (zone === "full-lower") {
      const lowerIds = lowerZones.filter(z => z.id !== "full-lower").map(z => z.id);
      setSelectedZonesByView(prev => ({
        ...prev,
        lower: prev.lower.length === lowerIds.length ? [] : lowerIds,
      }));
      return;
    }
    setSelectedZonesByView(prev => ({
      ...prev,
      [activeView]: prev[activeView].includes(zone)
        ? prev[activeView].filter(z => z !== zone)
        : [...prev[activeView], zone],
    }));
  };

  const removeZone = (zone: string) => {
    const view = getViewForZone(zone);
    setSelectedZonesByView(prev => ({
      ...prev,
      [view]: prev[view].filter(z => z !== zone),
    }));
  };

  const canProceed = () => {
    if (step === 1) return !!customisePhotos.front && !!customisePhotos.back;
    if (step === 2) {
      const hasOne = customisationTypes.length > 0;
      const otherValid = !customisationTypes.includes("Other") || !!customisationOther.trim();
      return hasOne && otherValid;
    }
    if (step === 3) return totalSelectedZones > 0;
    if (step === 4) return true;
    if (step === 5) return customiseBudgetRange[0] >= 1000 && !!customiseDeliveryDate;
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
        budgetRange: `${formatBudget(customiseBudgetRange[0])} – ${formatBudget(customiseBudgetRange[1])}`,
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
    if (step === 3 && totalSelectedZones === 0) {
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

  // ── SVG Garment Diagram (multi-view) ──
  const GarmentDiagram = () => {
    const zones = getZonesForView(activeView);
    const currentSelected = selectedZonesByView[activeView];
    const drawableZones = zones.filter(z => z.d); // only zones with SVG paths

    const silhouette = activeView === 'lower'
      ? "M 70,20 L 230,20 L 248,230 L 52,230 Z"
      : "M 150,30 Q 120,28 95,38 L 30,55 L 30,105 L 88,125 L 85,245 L 82,260 L 218,260 L 215,245 L 212,125 L 270,105 L 270,55 L 205,38 Q 180,28 150,30 Z";

    return (
      <svg viewBox={activeView === 'lower' ? "0 0 300 250" : "0 0 300 270"} className="w-full max-w-sm mx-auto" aria-label={`Garment ${activeView} placement diagram`}>
        {/* Silhouette */}
        <path d={silhouette} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
        {activeView !== 'lower' && (
          <line x1="150" y1="52" x2="150" y2="260" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />
        )}

        {/* Tappable zones */}
        {drawableZones.map((zone) => {
          const selected = currentSelected.includes(zone.id);
          // Calculate centroid for label
          const cx = zone.id.includes("left") || zone.id.includes("Left") ? 60 : zone.id.includes("right") || zone.id.includes("Right") ? 240 : 150;
          const cy = zone.id.includes("neck") || zone.id.includes("Neck") ? 44 : zone.id.includes("shoulder") || zone.id.includes("Shoulder") ? 55 : zone.id.includes("chest") || zone.id.includes("Chest") ? 88 : zone.id.includes("sleeve") || zone.id.includes("Sleeve") ? 85 : zone.id.includes("waist") || zone.id.includes("Waist") ? 35 : zone.id.includes("hem") || zone.id.includes("Hem") ? 220 : zone.id.includes("upper") ? 88 : zone.id.includes("mid") ? 148 : zone.id.includes("lower") || zone.id.includes("Lower") ? 200 : zone.id.includes("abdomen") ? 180 : zone.id.includes("front-left") ? 110 : zone.id.includes("front-right") ? 190 : 150;

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
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                className={`text-[8px] font-sans pointer-events-none select-none ${selected ? "fill-accent font-semibold" : "fill-muted-foreground"}`}
              >
                {selected ? `✓ ${zone.label}` : zone.label}
              </text>
            </g>
          );
        })}

        {/* "Select All" buttons rendered outside SVG paths */}
        {activeView === 'back' && (
          <g className="cursor-pointer" onClick={() => toggleZone('back-full')}>
            <rect x="100" y="252" width="100" height="24" rx="12" fill={currentSelected.length === backZones.filter(z => z.id !== 'back-full').length ? "hsl(var(--accent))" : "hsl(var(--muted))"} />
            <text x="150" y="268" textAnchor="middle" className={`text-[9px] font-sans font-medium pointer-events-none select-none ${currentSelected.length === backZones.filter(z => z.id !== 'back-full').length ? "fill-accent-foreground" : "fill-foreground"}`}>Select All Back</text>
          </g>
        )}
        {activeView === 'lower' && (
          <g className="cursor-pointer" onClick={() => toggleZone('full-lower')}>
            <rect x="100" y="235" width="100" height="24" rx="12" fill={currentSelected.length === lowerZones.filter(z => z.id !== 'full-lower').length ? "hsl(var(--accent))" : "hsl(var(--muted))"} />
            <text x="150" y="251" textAnchor="middle" className={`text-[9px] font-sans font-medium pointer-events-none select-none ${currentSelected.length === lowerZones.filter(z => z.id !== 'full-lower').length ? "fill-accent-foreground" : "fill-foreground"}`}>Select All Lower</text>
          </g>
        )}
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
                    {(['front-upper', 'back', 'lower'] as PlacementView[]).map(view => {
                      const zones = selectedZonesByView[view];
                      return zones.length > 0 ? (
                        <p key={view} className="text-sm text-foreground font-sans">
                          <span className="font-medium">{viewLabels[view]}:</span> {zones.map(z => getZoneLabelById(z)).join(", ")}
                        </p>
                      ) : null;
                    })}
                    {totalSelectedZones === 0 && <p className="text-sm text-muted-foreground font-sans">No zones selected</p>}
                    {allSelectedZones.some(z => zoneNotes[z]) && (
                      <div className="mt-2 space-y-1">
                        {allSelectedZones.filter(z => zoneNotes[z]).map(z => (
                          <p key={z} className="text-xs text-muted-foreground font-sans">📝 {getZoneLabelById(z)}: "{zoneNotes[z]}"</p>
                        ))}
                      </div>
                    )}
                    {allSelectedZones.some(z => zonePhotos[z]) && (
                      <div className="flex gap-2 mt-2">
                        {allSelectedZones.filter(z => zonePhotos[z]).map(z => (
                          <div key={z} className="text-center">
                            <img src={URL.createObjectURL(zonePhotos[z]!)} alt={getZoneLabelById(z)} className="w-12 h-12 rounded-lg object-cover border border-border" />
                            <p className="text-[10px] text-muted-foreground font-sans mt-0.5">{getZoneLabelById(z)}</p>
                          </div>
                        ))}
                      </div>
                    )}
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
                      Budget: {formatBudget(customiseBudgetRange[0])} – {formatBudget(customiseBudgetRange[1])}
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
                  <p className="text-muted-foreground font-sans mb-6">Tap the zones you want customised on each view</p>

                  {/* View selector tabs */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {(['front-upper', 'back', 'lower'] as PlacementView[]).map(view => {
                      const count = selectedZonesByView[view].length;
                      const isActive = activeView === view;
                      return (
                        <button
                          key={view}
                          onClick={() => setActiveView(view)}
                          className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                            isActive
                              ? "bg-accent text-accent-foreground border-accent font-medium"
                              : "bg-card text-foreground border-border hover:border-accent/40"
                          }`}
                        >
                          {viewLabels[view]} {count > 0 && <span className="ml-1 text-[10px] font-bold">({count})</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* SVG Diagram */}
                  <div className="bg-card rounded-2xl border border-border p-6 mb-4">
                    <GarmentDiagram />
                    {activeView === 'front-upper' && (
                      <p className="text-xs text-muted-foreground font-sans mt-3 text-center">
                        Tip: Select Left Sleeve and Right Sleeve separately if you want different designs on each side.
                      </p>
                    )}
                    {activeView === 'lower' && (
                      <p className="text-xs text-muted-foreground font-sans mt-3 text-center">
                        Back panels are not drawn but can be selected as zones below.
                      </p>
                    )}
                  </div>

                  {/* Non-drawable zone pills for lower view */}
                  {activeView === 'lower' && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lowerZones.filter(z => !z.d && z.id !== 'full-lower').map(zone => {
                        const selected = selectedZonesByView.lower.includes(zone.id);
                        return (
                          <button
                            key={zone.id}
                            onClick={() => toggleZone(zone.id)}
                            className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                              selected ? "border-accent bg-accent text-accent-foreground font-medium" : "border-border bg-card text-foreground hover:border-accent/40"
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 inline mr-1" />}
                            {zone.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Selection summary bar */}
                  <div className="mb-4 p-3 bg-muted rounded-xl">
                    {totalSelectedZones > 0 ? (
                      <>
                        <p className="text-sm font-sans font-medium text-foreground mb-2">
                          {totalSelectedZones} zone{totalSelectedZones !== 1 ? 's' : ''} selected across {Object.values(selectedZonesByView).filter(v => v.length > 0).length} view{Object.values(selectedZonesByView).filter(v => v.length > 0).length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {allSelectedZones.map(zoneId => {
                            const view = getViewForZone(zoneId);
                            const viewIcon = view === 'front-upper' ? '👕' : view === 'back' ? '🔙' : '👖';
                            return (
                              <span key={zoneId} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border text-[11px] font-sans text-foreground">
                                {viewIcon} {getZoneLabelById(zoneId)}
                                <button onClick={() => removeZone(zoneId)} className="hover:text-destructive ml-0.5">×</button>
                              </span>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm font-sans text-muted-foreground text-center">Tap zones on the diagram to select placement areas</p>
                    )}
                  </div>

                  {placementError && (
                    <p className="text-sm font-sans text-destructive mb-4">Please tap at least one zone to show where you want the work done</p>
                  )}

                  {/* Per-zone reference & notes */}
                  {totalSelectedZones > 0 && (
                    <div className="space-y-3 mb-6">
                      <h3 className="font-sans font-semibold text-foreground text-sm">Zone details & references</h3>
                      {allSelectedZones.map(zoneId => (
                        <div key={zoneId} className="p-4 bg-card rounded-xl border border-border">
                          <p className="font-sans font-medium text-sm text-foreground mb-2">{getZoneLabelById(zoneId)} <span className="text-muted-foreground font-normal">({viewLabels[getViewForZone(zoneId)]})</span></p>
                          
                          {/* Photo upload */}
                          <div className="mb-2">
                            {zonePhotos[zoneId] ? (
                              <div className="flex items-center gap-3">
                                <img src={URL.createObjectURL(zonePhotos[zoneId]!)} alt={`Ref ${zoneId}`} className="w-16 h-16 rounded-lg object-cover border border-border" />
                                <div>
                                  <p className="text-xs text-success font-sans">✓ Reference added</p>
                                  <button onClick={() => setZonePhotos(prev => ({ ...prev, [zoneId]: null }))} className="text-xs text-muted-foreground hover:text-foreground font-sans">Remove</button>
                                </div>
                              </div>
                            ) : (
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-muted-foreground hover:text-accent">
                                <Upload className="w-3.5 h-3.5" /> Add reference image →
                                <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  if (f && f.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                                  setZonePhotos(prev => ({ ...prev, [zoneId]: f }));
                                }} />
                              </label>
                            )}
                            {totalSelectedZones > 2 && !zonePhotos[zoneId] && (
                              <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-warning-light text-warning">
                                📸 Strongly recommended — multiple zones selected
                              </span>
                            )}
                          </div>

                          {/* Notes */}
                          <Input
                            value={zoneNotes[zoneId] || ""}
                            onChange={(e) => setZoneNotes(prev => ({ ...prev, [zoneId]: e.target.value }))}
                            placeholder={`e.g. "Zardozi border only on cuff" or "Same as inspiration but in gold"`}
                            className="font-sans text-xs h-8"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* General reference photo upload */}
                  <div className="bg-card rounded-xl border border-border p-5 mb-4">
                    <h3 className="font-sans font-semibold text-foreground mb-1">Upload a general reference image</h3>
                    <p className="text-xs text-muted-foreground font-sans mb-3">
                      Show the artisan a design, pattern, or artwork you like — even a rough sketch works
                    </p>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-warning-light text-warning mb-3">
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
                        <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          if (f && f.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                          setReferenceArtPhoto(f);
                        }} />
                      </label>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-muted-foreground font-sans">
                    📌 These diagrams are for placement reference only. Your artisan will work directly from your uploaded garment photos (added in Step C1) and your zone notes.
                  </p>
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

                      {/* Intelligence Card */}
                      {customisationTypes.length > 0 && (
                        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span>💡</span>
                            <span className="font-sans text-xs font-bold uppercase tracking-wider text-amber-800">Naapio Intelligence</span>
                            <span className="font-sans text-[10px] text-amber-600">Based on your selections</span>
                          </div>
                          <p className="text-xs text-amber-800 font-sans mb-3">
                            Estimated artisan cost: {formatBudget(custIntelligence.min)}–{formatBudget(custIntelligence.max)}
                          </p>
                          <div className="relative h-2 bg-amber-200 rounded-full mb-2">
                            <div className="absolute h-full bg-accent rounded-full" style={{ left: '0%', right: `${Math.max(0, 100 - ((custIntelligence.max - custIntelligence.min) / custIntelligence.max) * 100)}%` }} />
                            <div className="absolute w-2 h-4 bg-accent rounded-full -top-1" style={{ left: `${((custIntelligence.avg - custIntelligence.min) / (custIntelligence.max - custIntelligence.min)) * 100}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-amber-700 font-sans mb-2">
                            <span>{formatBudget(custIntelligence.min)}</span>
                            <span className="font-semibold">Avg {formatBudget(custIntelligence.avg)}</span>
                            <span>{formatBudget(custIntelligence.max)}</span>
                          </div>
                          {custIntelligence.explanation.map((f, i) => (
                            <p key={i} className="text-[10px] text-amber-700 font-sans">• {f}</p>
                          ))}
                          <Button variant="outline" size="sm" className="text-xs mt-3" onClick={() => setCustomiseBudgetRange([custIntelligence.min, custIntelligence.max])}>
                            Use Suggested Range
                          </Button>
                          <p className="text-[10px] text-amber-600 font-sans mt-2">This is an estimate — final amount is what you agree with your chosen artisan.</p>
                        </div>
                      )}

                      {/* Dual Handle Slider */}
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-sans font-semibold text-accent">{formatBudget(customiseBudgetRange[0])}</span>
                          <span className="text-sm font-sans font-semibold text-accent">{formatBudget(customiseBudgetRange[1])}</span>
                        </div>
                        <Slider
                          value={customiseBudgetRange}
                          onValueChange={(val) => { if (val[1] - val[0] >= 2000) setCustomiseBudgetRange(val); }}
                          min={1000}
                          max={200000}
                          step={customiseBudgetRange[0] < 10000 ? 500 : customiseBudgetRange[0] < 50000 ? 1000 : 5000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground font-sans mt-1">
                          <span>₹1K</span>
                          <span>₹2L</span>
                        </div>
                      </div>

                      {/* Manual override inputs */}
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                          <label className="text-xs font-sans text-muted-foreground mb-1 block">Min ₹</label>
                          <Input
                            type="number"
                            placeholder="1,000"
                            value={customiseBudgetRange[0] || ""}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setCustomiseBudgetRange([val, Math.max(val + 2000, customiseBudgetRange[1])]);
                            }}
                            className="font-sans"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-sans text-muted-foreground mb-1 block">Max ₹</label>
                          <Input
                            type="number"
                            placeholder="8,000"
                            value={customiseBudgetRange[1] || ""}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setCustomiseBudgetRange([Math.min(customiseBudgetRange[0], val - 2000), val]);
                            }}
                            className="font-sans"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        💡 Set a realistic range — artisans bid within it.
                      </p>
                    </div>

                    {/* Rush Order Toggle */}
                    <div className={`p-5 rounded-xl border transition-all col-span-full mb-4 ${isRushOrder ? "bg-amber-50 border-amber-300" : "bg-card border-border"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚡</span>
                          <div>
                            <p className="font-sans font-bold text-foreground text-sm">Rush Order</p>
                            <p className="text-xs text-muted-foreground font-sans mt-0.5">Need it faster? Rush orders attract artisans who specialise in quick turnaround.</p>
                          </div>
                        </div>
                        <Switch checked={isRushOrder} onCheckedChange={setIsRushOrder} />
                      </div>
                      {isRushOrder && (
                        <p className="mt-3 p-3 bg-amber-100/60 rounded-lg text-xs text-amber-800 font-sans">⚡ Rush surcharge: Artisans may add 20–40% to their bid for rush orders.</p>
                      )}
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
