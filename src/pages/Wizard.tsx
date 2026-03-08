import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronRight, ChevronLeft, Check, Image as ImageIcon, X, HelpCircle, Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { menCategories, womenCategories, measurementFields } from "@/data/mockData";
import { fabricOptionsWithImages } from "@/data/fabricData";
import redLehenga from "@/assets/red-lehenga.jpg";

const categoryBudgetRanges: Record<string, { min: number; max: number; label: string }> = {
  "Lehenga": { min: 30000, max: 100000, label: "👗 Lehenga" },
  "Saree Blouse": { min: 1500, max: 6000, label: "🧵 Saree Blouse" },
  "Salwar Kameez": { min: 2000, max: 8000, label: "👘 Salwar Kameez" },
  "Anarkali": { min: 5000, max: 25000, label: "✨ Anarkali" },
  "Gown": { min: 10000, max: 50000, label: "👗 Gown" },
  "Kurti": { min: 1500, max: 5000, label: "👚 Kurti" },
  "Co-ord Set": { min: 3000, max: 12000, label: "🎀 Co-ord Set" },
  "Jacket": { min: 5000, max: 20000, label: "🧥 Jacket" },
  "Sherwani": { min: 15000, max: 60000, label: "🤵 Sherwani" },
  "Kurta": { min: 2000, max: 8000, label: "👔 Kurta" },
  "Bandhgala": { min: 5000, max: 20000, label: "🎩 Bandhgala" },
  "Suit": { min: 8000, max: 30000, label: "👔 Suit" },
  "Blazer": { min: 5000, max: 20000, label: "🧥 Blazer" },
  "Trousers": { min: 2000, max: 8000, label: "👖 Trousers" },
  "Indo-Western": { min: 8000, max: 35000, label: "✨ Indo-Western" },
};

const defaultRange = { min: 5000, max: 50000, label: "🧵 Custom" };

const subCategories: Record<string, string[]> = {
  // Men's
  "Sherwani": ["Achkan", "Indo-Western Sherwani", "Jodhpuri Sherwani", "Double-Breasted Sherwani", "Nehru Collar Sherwani"],
  "Kurta": ["Straight Kurta", "Pathani Kurta", "Kaftan Kurta", "Embroidered / Festive Kurta", "Plain / Daily Wear Kurta", "Nehru Collar Kurta"],
  "Bandhgala": ["Single-Breasted Bandhgala", "Double-Breasted Bandhgala", "Jodhpuri Suit with Trousers", "Jodhpuri Suit with Churidar"],
  "Suit": ["2-Piece Suit", "3-Piece Suit with Waistcoat", "Single-Breasted Blazer", "Double-Breasted Blazer", "Tuxedo / Dinner Jacket", "Safari Suit"],
  "Blazer": ["Single-Breasted Blazer", "Double-Breasted Blazer", "Casual Blazer"],
  "Trousers": ["Formal Trousers", "Churidar", "Pyjama / Salwar", "Dhoti", "Jodhpuri Pants"],
  "Indo-Western": ["Indo-Western Jacket + Kurta", "Cape + Kurta", "Fusion Sherwani-Suit", "Draped Dhoti Pant Set"],
  // Women's
  "Saree Blouse": ["Backless Blouse", "High-neck Blouse", "Halter Neck", "Peplum Blouse", "Off-shoulder", "Boat Neck", "Sheer / Net Blouse", "Princess-cut Blouse", "Sweetheart Neck", "One-shoulder"],
  "Lehenga": ["Bridal Lehenga (Full 3-piece Set)", "Party Lehenga", "Lehenga Skirt Only", "Half-and-Half Lehenga", "Layered / Ruffle Lehenga", "Sharara Lehenga", "Chaniya Choli"],
  "Salwar Kameez": ["Straight Suit", "Patiala Suit", "Palazzo Suit", "Churidar Suit", "Afghani Suit", "Pakistani Style Suit", "Gharara Suit"],
  "Anarkali": ["Floor-length Anarkali", "Mid-calf Anarkali", "Jacket Anarkali", "Front-slit Anarkali", "Layered Anarkali"],
  "Gown": ["A-line Gown", "Ball Gown", "Mermaid / Fishtail Gown", "Indo-Western Gown", "Cape Gown", "Kaftan Gown"],
  "Kurti": ["Straight Kurti", "A-line Kurti", "Tunic / Long Kurti", "Asymmetric Kurti", "Jacket Kurti"],
  "Co-ord Set": ["Kurti + Palazzo", "Crop Top + Skirt", "Blazer Set", "Co-ord Kurta Set"],
  "Jacket": ["Embroidered Jacket", "Shrug / Cape", "Embellished Blazer"],
};

const occasions = [
  { label: "Wedding / Baraat / Nikah", emoji: "💒" },
  { label: "Reception / Cocktail", emoji: "🥂" },
  { label: "Engagement / Roka", emoji: "💍" },
  { label: "Mehendi / Haldi", emoji: "🌿" },
  { label: "Festival (Diwali / Eid / Navratri)", emoji: "🪔" },
  { label: "Garba / Dandiya Night", emoji: "💃" },
  { label: "Religious Ceremony / Puja", emoji: "🛕" },
  { label: "Formal Office / Corporate", emoji: "💼" },
  { label: "Casual / Daily Wear", emoji: "☀️" },
  { label: "Party / Night Out", emoji: "🎉" },
  { label: "Pre-Wedding / Photoshoot", emoji: "📸" },
  { label: "Graduation / Convocation", emoji: "🎓" },
];

const fitOptions = [
  { label: "Close-fitted / Slim", description: "Follows your body shape closely. Minimal ease.", emoji: "🤏" },
  { label: "Regular / Comfortable", description: "Standard fit. Neither tight nor loose. Most popular.", emoji: "👌" },
  { label: "Relaxed / Loose", description: "Fabric falls away from the body. Comfortable and airy.", emoji: "🌊" },
  { label: "Flowing / Dramatic", description: "Maximum flare and volume. Best for gowns and lehengas.", emoji: "✨" },
  { label: "Match a Reference Outfit", description: "We'll replicate the fit of an outfit that already works for you.", emoji: "📐" },
];

const necklineOptions = [
  "Round Neck", "V-Neck", "Sweetheart", "Boat Neck", "High / Mandarin",
  "Square Neck", "Keyhole", "Halter", "Off-shoulder", "One-shoulder",
  "Deep Back / Backless", "Collar", "No Preference",
];

const sleeveOptions = [
  "Sleeveless", "Cap Sleeve", "Half / Elbow", "3/4 Sleeve", "Full Sleeve",
  "Bell / Flared", "Puff / Balloon", "Cold Shoulder", "No Preference",
];

const dupatttaOptions = [
  "2-piece (no dupatta)", "3-piece same fabric", "3-piece contrast fabric",
  "3-piece sheer / net dupatta", "Tailor suggests",
];

const liningOptions = [
  "Fully Lined", "Partially Lined", "Unlined", "Padded (bust)", "No Preference",
];

const showNeckline = ["Saree Blouse", "Anarkali", "Gown", "Salwar Kameez", "Kurti", "Kurta", "Sherwani", "Jacket", "Lehenga", "Co-ord Set"];
const showSleeve = ["Saree Blouse", "Anarkali", "Gown", "Salwar Kameez", "Kurti", "Kurta", "Sherwani", "Jacket", "Co-ord Set", "Lehenga"];
const showDupatta = ["Lehenga", "Salwar Kameez", "Anarkali"];
const showLining = ["Saree Blouse", "Gown", "Sherwani", "Suit", "Bandhgala", "Lehenga", "Jacket"];

const quickBrackets = [
  { label: "₹5K – ₹15K", min: 5000, max: 15000 },
  { label: "₹15K – ₹35K", min: 15000, max: 35000 },
  { label: "₹35K – ₹75K", min: 35000, max: 75000 },
  { label: "₹75K – ₹1.5L", min: 75000, max: 150000 },
  { label: "₹1.5L – ₹3L", min: 150000, max: 300000 },
];

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Wizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploaded, setUploaded] = useState(false);
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState<"men" | "women">("women");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [step2Phase, setStep2Phase] = useState<"category" | "occasion" | "fit" | "design" | "measurements">("category");
  const [selectedFit, setSelectedFit] = useState("");
  const [selectedNeckline, setSelectedNeckline] = useState("");
  const [selectedSleeve, setSelectedSleeve] = useState("");
  const [selectedDupatta, setSelectedDupatta] = useState("");
  const [selectedLining, setSelectedLining] = useState("");
  const [measurementType, setMeasurementType] = useState<"standard" | "custom" | "later">("standard");
  const [standardSize, setStandardSize] = useState("M");
  const [sizeRegion, setSizeRegion] = useState("UK");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [budgetRange, setBudgetRange] = useState([5000, 50000]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [flexibleDate, setFlexibleDate] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [fabricNotes, setFabricNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const min = new Date();
    min.setDate(min.getDate() + 14);
    setDeliveryDate(min.toISOString().split("T")[0]);
  }, []);

  const minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  };

  const canProceed = () => {
    if (step === 1) return uploaded;
    if (step === 2) {
      if (step2Phase === "category") return !!selectedCategory && (!!selectedSubCategory || !subCategories[selectedCategory]);
      if (step2Phase === "occasion") return !!selectedOccasion;
      if (step2Phase === "fit") return !!selectedFit;
      if (step2Phase === "design") return true;
      if (step2Phase === "measurements") return consent1 && consent2;
      return false;
    }
    if (step === 3) return budgetRange[0] >= 1000 && (flexibleDate || deliveryDate) && selectedFabrics.length > 0;
    if (step === 4) return otpVerified && termsAccepted;
    return true;
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Payment confirmed! Your request is now live.");
      navigate("/dashboard");
    }, 1500);
  };

  const toggleFabric = (name: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const categories = gender === "men" ? menCategories : womenCategories;
  const catRange = categoryBudgetRanges[selectedCategory] || defaultRange;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/")} className="font-serif font-bold text-lg text-foreground">Naapio</button>
            <span className="font-sans text-sm text-muted-foreground">
               {step === 2
                ? step2Phase === "category"
                  ? "Step 2a — Category"
                  : step2Phase === "occasion"
                  ? "Step 2b — Occasion"
                  : step2Phase === "fit"
                  ? "Step 2c — Fit"
                  : step2Phase === "design"
                  ? "Step 2d — Design Details"
                  : "Step 2e — Measurements"
                : `Step ${step} of 4`}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Inspiration Upload */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Upload Your Inspiration</h2>
                <p className="text-muted-foreground font-sans mb-6">Share the design that inspires you</p>
                {uploaded ? (
                  <div className="relative rounded-2xl overflow-hidden border border-border">
                    <img src={redLehenga} alt="Uploaded inspiration" className="w-full h-[400px] object-cover" />
                    <button onClick={() => setUploaded(false)} className="absolute top-3 right-3 p-2 bg-card rounded-full shadow-md hover:bg-muted transition-colors">
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                    <div className="absolute top-3 left-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-sans font-medium text-foreground">
                      RED LEHENGA
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setUploaded(true)}
                    className="h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors bg-card"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="font-sans font-medium text-foreground mb-1">Click to upload</p>
                    <p className="text-sm text-muted-foreground font-sans">or drag and drop your inspiration image</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-4">Additional Photos & Videos</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors bg-card">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <label className="block font-sans font-semibold text-foreground mb-2">Describe what you love about this look</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., I love the heavy zardozi border and the deep red color. Looking for a similar style for my wedding..."
                  className="min-h-[150px] font-sans"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Category, Occasion & Measurements */}
          {step === 2 && (
            <motion.div key={`s2-${step2Phase}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

              {/* SUB-PHASE: CATEGORY + SUBCATEGORY */}
              {step2Phase === "category" && (
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What are you getting made?</h2>
                  <p className="text-muted-foreground font-sans mb-6">Select your garment category, then choose a specific style</p>

                  {/* Gender Toggle */}
                  <div className="flex gap-3 mb-6">
                    {(["men", "women"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => { setGender(g); setSelectedCategory(""); setSelectedSubCategory(""); }}
                        className={`px-5 py-2.5 rounded-xl font-sans font-medium text-sm transition-all ${gender === g ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
                      >
                        {g === "men" ? "👔 Men's" : "👗 Women's"}
                      </button>
                    ))}
                  </div>

                  {/* Category Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(""); }}
                        className={`p-4 rounded-xl text-left font-sans text-sm transition-all border ${selectedCategory === cat ? "border-accent bg-gold-light text-foreground font-semibold ring-2 ring-accent/30" : "border-border bg-card text-foreground hover:border-accent/30"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Subcategory Accordion — shown when category is selected */}
                  {selectedCategory && subCategories[selectedCategory] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <p className="font-sans text-sm font-medium text-muted-foreground mb-3">
                        Select the specific style for <span className="text-foreground font-semibold">{selectedCategory}</span>:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subCategories[selectedCategory].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubCategory(sub)}
                            className={`px-4 py-2 rounded-full font-sans text-sm transition-all border ${selectedSubCategory === sub ? "border-accent bg-accent text-accent-foreground font-medium" : "border-border bg-card text-foreground hover:border-accent/40"}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* If category has no subcategories, auto-select and show confirmation */}
                  {selectedCategory && !subCategories[selectedCategory] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-4 bg-accent/10 border border-accent/30 rounded-xl flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-accent" />
                      <span className="font-sans text-sm text-foreground font-medium">{selectedCategory} selected — tap Next to continue</span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* SUB-PHASE: OCCASION */}
              {step2Phase === "occasion" && (
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What's the occasion?</h2>
                  <p className="text-muted-foreground font-sans mb-6">This helps your tailor understand the formality, fabric weight, and embellishment level needed</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {occasions.map((occ) => (
                      <button
                        key={occ.label}
                        onClick={() => setSelectedOccasion(occ.label)}
                        className={`p-4 rounded-xl text-left font-sans text-sm transition-all border ${selectedOccasion === occ.label ? "border-accent bg-gold-light text-foreground font-semibold ring-2 ring-accent/30" : "border-border bg-card text-foreground hover:border-accent/30"}`}
                      >
                        <span className="text-2xl block mb-2">{occ.emoji}</span>
                        <span className="leading-tight block">{occ.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Garba warning */}
                  {selectedOccasion === "Garba / Dandiya Night" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
                    >
                      <span className="text-xl">💃</span>
                      <p className="font-sans text-sm text-amber-800">
                        <span className="font-semibold">Garba note:</span> We'll tell your tailor to ensure full arm movement and a minimum 4-metre flare for dancing. This will be included in your brief automatically.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* SUB-PHASE: FIT PREFERENCE */}
              {step2Phase === "fit" && (
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">How should it fit?</h2>
                  <p className="text-muted-foreground font-sans mb-6">
                    This tells your tailor how much ease to build into the garment
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {fitOptions.map((fit) => (
                      <button
                        key={fit.label}
                        onClick={() => setSelectedFit(fit.label)}
                        className={`p-5 rounded-xl text-left font-sans transition-all border ${
                          selectedFit === fit.label
                            ? "border-accent bg-gold-light ring-2 ring-accent/30"
                            : "border-border bg-card hover:border-accent/30"
                        }`}
                      >
                        <span className="text-3xl block mb-3">{fit.emoji}</span>
                        <p className="font-semibold text-sm text-foreground mb-1">{fit.label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{fit.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-PHASE: DESIGN DETAILS */}
              {step2Phase === "design" && (
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Design details</h2>
                  <p className="text-muted-foreground font-sans mb-2">
                    For <span className="font-semibold text-foreground">{selectedSubCategory || selectedCategory}</span>. All fields are optional — skip anything you don't have a preference for.
                  </p>

                  <div className="space-y-8 mt-6">

                    {/* Neckline */}
                    {showNeckline.includes(selectedCategory) && (
                      <div>
                        <p className="font-sans font-semibold text-foreground mb-3">Neckline</p>
                        <div className="flex flex-wrap gap-2">
                          {necklineOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelectedNeckline(selectedNeckline === opt ? "" : opt)}
                              className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                                selectedNeckline === opt
                                  ? "border-accent bg-accent text-accent-foreground font-medium"
                                  : "border-border bg-card text-foreground hover:border-accent/40"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sleeve */}
                    {showSleeve.includes(selectedCategory) && (
                      <div>
                        <p className="font-sans font-semibold text-foreground mb-3">Sleeve Style</p>
                        <div className="flex flex-wrap gap-2">
                          {sleeveOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelectedSleeve(selectedSleeve === opt ? "" : opt)}
                              className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                                selectedSleeve === opt
                                  ? "border-accent bg-accent text-accent-foreground font-medium"
                                  : "border-border bg-card text-foreground hover:border-accent/40"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dupatta */}
                    {showDupatta.includes(selectedCategory) && (
                      <div>
                        <p className="font-sans font-semibold text-foreground mb-3">Dupatta / Set Inclusion</p>
                        <div className="flex flex-wrap gap-2">
                          {dupatttaOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelectedDupatta(selectedDupatta === opt ? "" : opt)}
                              className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                                selectedDupatta === opt
                                  ? "border-accent bg-accent text-accent-foreground font-medium"
                                  : "border-border bg-card text-foreground hover:border-accent/40"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lining */}
                    {showLining.includes(selectedCategory) && (
                      <div>
                        <p className="font-sans font-semibold text-foreground mb-3">Lining Preference</p>
                        <div className="flex flex-wrap gap-2">
                          {liningOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelectedLining(selectedLining === opt ? "" : opt)}
                              className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                                selectedLining === opt
                                  ? "border-accent bg-accent text-accent-foreground font-medium"
                                  : "border-border bg-card text-foreground hover:border-accent/40"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skip message */}
                    {!showNeckline.includes(selectedCategory) &&
                     !showSleeve.includes(selectedCategory) &&
                     !showDupatta.includes(selectedCategory) &&
                     !showLining.includes(selectedCategory) && (
                      <div className="p-4 bg-card rounded-xl border border-border text-center">
                        <p className="text-muted-foreground font-sans text-sm">No specific design details needed for {selectedCategory}. Tap Next to continue to measurements.</p>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* SUB-PHASE: MEASUREMENTS — existing UI preserved exactly */}
              {step2Phase === "measurements" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Measurements</h2>
                    <p className="text-muted-foreground font-sans mb-6">
                      For <span className="font-semibold text-foreground">{gender === "women" ? "Women's" : "Men's"} {selectedSubCategory || selectedCategory}</span>
                    </p>
                    <div className="flex gap-2 mb-6">
                      {(["standard", "custom", "later"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setMeasurementType(t)}
                          className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${measurementType === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
                        >
                          {t === "later" ? "Provide Later" : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>

                    {measurementType === "standard" && (
                      <div className="space-y-4">
                        <div className="flex gap-2 mb-3">
                          {["UK", "US", "EU"].map((r) => (
                            <button key={r} onClick={() => setSizeRegion(r)} className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium ${sizeRegion === r ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{r}</button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((s) => (
                            <button key={s} onClick={() => setStandardSize(s)} className={`w-14 h-14 rounded-xl font-sans font-medium text-sm transition-all ${standardSize === s ? "bg-accent text-accent-foreground" : "bg-card border border-border text-foreground hover:border-accent/30"}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {measurementType === "custom" && (
                      <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {measurementFields.map((field) => (
                          <div key={field}>
                            <label className="text-xs font-sans text-muted-foreground mb-1 block">{field}</label>
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={measurements[field] || ""}
                              onChange={(e) => setMeasurements({ ...measurements, [field]: e.target.value })}
                              className="font-sans"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {measurementType === "later" && (
                      <p className="text-muted-foreground font-sans text-sm p-4 bg-card rounded-xl border border-border">
                        No worries! Your accepted tailor will guide you through measurements via a video call. You have 48 hours after going live to submit measurements.
                      </p>
                    )}
                  </div>

                  <div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Data & Consent</h2>
                    <p className="text-muted-foreground font-sans mb-6">Required before your order goes live</p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox id="c1" checked={consent1} onCheckedChange={(v) => setConsent1(!!v)} />
                        <label htmlFor="c1" className="text-xs font-sans text-muted-foreground leading-relaxed cursor-pointer">
                          I consent to my measurement data being stored securely and shared only with my accepted vendor per Naapio's Privacy Policy (DPDP Act 2023)
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox id="c2" checked={consent2} onCheckedChange={(v) => setConsent2(!!v)} />
                        <label htmlFor="c2" className="text-xs font-sans text-muted-foreground leading-relaxed cursor-pointer">
                          I understand my data will be deleted upon request within 72 hours
                        </label>
                      </div>
                    </div>

                    {/* Order summary so far */}
                    <div className="mt-6 p-4 bg-card rounded-xl border border-border">
                      <p className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your order so far</p>
                      <div className="space-y-1">
                        <p className="font-sans text-sm text-foreground">
                          <span className="text-muted-foreground">Garment:</span> {gender === "women" ? "Women's" : "Men's"} {selectedSubCategory || selectedCategory}
                        </p>
                        <p className="font-sans text-sm text-foreground">
                          <span className="text-muted-foreground">Occasion:</span> {selectedOccasion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* STEP 3: Budget, Timeline & Fabric */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                {/* Budget Section */}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Budget</h2>
                  <div className="p-6 bg-card rounded-2xl border border-border space-y-5">
                    {/* Display selected range */}
                    <div className="text-center">
                      <span className="font-serif font-bold text-2xl text-accent">
                        {formatINR(budgetRange[0])} – {formatINR(budgetRange[1])}
                      </span>
                    </div>

                    {/* Dual-handle range slider */}
                    <div>
                      <div className="flex justify-between text-xs font-sans text-muted-foreground mb-2">
                        <span>₹1,000</span>
                        <span>₹5,00,000</span>
                      </div>
                      <Slider
                        value={budgetRange}
                        onValueChange={setBudgetRange}
                        min={1000}
                        max={500000}
                        step={500}
                        minStepsBetweenThumbs={1}
                      />
                    </div>

                    {/* Category context card */}
                    <div className="p-4 bg-muted rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-sans font-semibold text-foreground">{catRange.label}</span>
                        {selectedCategory && (
                          <span className="text-xs font-sans text-muted-foreground">typical range</span>
                        )}
                      </div>
                      <p className="text-sm font-sans text-accent font-medium">
                        {formatINR(catRange.min)} – {formatINR(catRange.max)}
                      </p>
                    </div>

                    {/* Quick-select chips */}
                    <div className="flex flex-wrap gap-2">
                      {quickBrackets.map((b) => (
                        <button
                          key={b.label}
                          onClick={() => setBudgetRange([b.min, b.max])}
                          className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all border ${
                            budgetRange[0] === b.min && budgetRange[1] === b.max
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border bg-card text-foreground hover:border-accent/40"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    {/* Pricing tip */}
                    <div className="flex items-start gap-2 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-xs font-sans text-muted-foreground">
                        <span className="font-medium text-foreground">Pricing tip:</span> A wider budget range attracts more vendors and gives you better options. You can always negotiate the final price.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Date Section */}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Delivery Date</h2>
                  <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
                    <p className="text-sm text-muted-foreground font-sans">Minimum 14 days from today</p>
                    <Input
                      type="date"
                      value={deliveryDate}
                      min={minDate()}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className={`font-sans ${flexibleDate ? "opacity-50 pointer-events-none" : ""}`}
                      disabled={flexibleDate}
                    />

                    {/* Flexible date toggle */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <label htmlFor="flexible-date" className="text-sm font-sans font-medium text-foreground cursor-pointer">
                          Flexible date
                        </label>
                        <p className="text-xs font-sans text-muted-foreground">I can wait for the right vendor</p>
                      </div>
                      <Switch
                        id="flexible-date"
                        checked={flexibleDate}
                        onCheckedChange={setFlexibleDate}
                      />
                    </div>

                    {flexibleDate && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-3 bg-muted rounded-lg"
                      >
                        <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-sans text-muted-foreground">
                          We'll match you with the best available vendor
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fabric Preference */}
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Fabric Preference</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
                {fabricOptionsWithImages.map((fab) => (
                  <button
                    key={fab.name}
                    onClick={() => toggleFabric(fab.name)}
                    className={`rounded-xl text-center transition-all border overflow-hidden ${selectedFabrics.includes(fab.name) ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent/30"}`}
                  >
                    <div className="w-full relative" style={{ aspectRatio: '1 / 1' }}>
                      <img src={fab.image} alt={fab.name} className="w-full h-full object-cover object-center" style={{ aspectRatio: '1 / 1' }} />
                      {selectedFabrics.includes(fab.name) && (
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-accent-foreground drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-sans font-medium text-foreground block py-2 px-1">{fab.name}</span>
                  </button>
                ))}
              </div>
              <Textarea
                value={fabricNotes}
                onChange={(e) => setFabricNotes(e.target.value)}
                placeholder="Any specific fabric notes or requirements..."
                className="font-sans"
              />
            </motion.div>
          )}

          {/* STEP 4: Summary & Payment */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Review & Pay</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Summary */}
                <div className="space-y-4">
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-sans font-semibold text-foreground">Inspiration</h3>
                      <button onClick={() => setStep(1)} className="text-accent font-sans text-sm font-medium">Edit</button>
                    </div>
                    <div className="flex gap-3">
                      <img src={redLehenga} alt="Inspiration" className="w-16 h-16 rounded-lg object-cover" />
                      <p className="text-sm text-muted-foreground font-sans">{description || "Red lehenga with gold embroidery"}</p>
                    </div>
                  </div>
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-sans font-semibold text-foreground">Category & Measurements</h3>
                      <button onClick={() => setStep(2)} className="text-accent font-sans text-sm font-medium">Edit</button>
                    </div>
                    <p className="text-sm text-muted-foreground font-sans">
                      {gender === "women" ? "Women's" : "Men's"} {selectedSubCategory || selectedCategory || "Lehenga"}
                    </p>
                    <p className="text-sm text-muted-foreground font-sans mt-1">
                      {selectedOccasion} {selectedFit && `• ${selectedFit}`}
                    </p>
                    {(selectedNeckline || selectedSleeve || selectedDupatta || selectedLining) && (
                      <p className="text-sm text-muted-foreground font-sans mt-1">
                        {[selectedNeckline, selectedSleeve, selectedDupatta, selectedLining].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground font-sans mt-1">
                      {measurementType === "standard" ? `Size ${standardSize} (${sizeRegion})` : measurementType === "custom" ? "Custom measurements" : "Will provide later"}
                    </p>
                  </div>
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-sans font-semibold text-foreground">Budget & Timeline</h3>
                      <button onClick={() => setStep(3)} className="text-accent font-sans text-sm font-medium">Edit</button>
                    </div>
                    <p className="text-sm text-muted-foreground font-sans">
                      {formatINR(budgetRange[0])} – {formatINR(budgetRange[1])} • {flexibleDate ? "Flexible delivery" : `Deliver by ${deliveryDate}`}
                    </p>
                    <p className="text-sm text-muted-foreground font-sans mt-1">Fabrics: {selectedFabrics.length > 0 ? selectedFabrics.join(", ") : "Silk, Velvet"}</p>
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-2xl border-2 border-accent/30 shadow-lg">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-serif font-bold text-accent">₹499</span>
                      <p className="font-sans font-semibold text-foreground mt-1">Posting Fee — Escrow Protected</p>
                    </div>
                    <ul className="space-y-3 text-sm font-sans text-muted-foreground">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> 100% refundable — deducted from your final order payment</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> Serious inquiries only — ensures quality responses from vendors</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> Full refund if no vendor bids within 7 days</li>
                    </ul>
                    <div className="mt-4 p-3 bg-gold-light rounded-lg">
                      <p className="text-xs font-sans text-foreground font-medium">What happens next:</p>
                      <p className="text-xs font-sans text-muted-foreground mt-1">Your request goes live to 500+ verified vendors → Receive bids within 24-48 hours → Chat, compare, and accept the best bid</p>
                    </div>
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
                        <div className="flex gap-2">
                          <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} className="font-sans" />
                          <Button variant="gold" onClick={() => { setOtpVerified(true); toast.success("Mobile verified!"); }}>Verify</Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-success-light rounded-xl flex items-center gap-3">
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-sans text-sm font-medium text-foreground">Mobile number verified</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
                    <label htmlFor="terms" className="text-sm font-sans text-muted-foreground cursor-pointer">
                      I agree to the <span className="text-accent underline">Terms & Conditions</span> and <span className="text-accent underline">Privacy Policy</span>
                    </label>
                  </div>

                  <Button
                    variant="gold"
                    size="hero"
                    className="w-full"
                    disabled={!canProceed() || loading}
                    onClick={handlePay}
                  >
                    {loading ? "Processing..." : "Pay ₹499 & Go Live"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              if (step === 2) {
                if (step2Phase === "measurements") {
                  setStep2Phase("design");
                } else if (step2Phase === "design") {
                  setStep2Phase("fit");
                } else if (step2Phase === "fit") {
                  setStep2Phase("occasion");
                } else if (step2Phase === "occasion") {
                  setStep2Phase("category");
                } else {
                  setStep(1);
                }
              } else if (step > 1) {
                setStep(step - 1);
              } else {
                navigate("/");
              }
            }}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < 4 && (
            <Button
              variant="gold"
              disabled={!canProceed()}
              onClick={() => {
                if (step === 2) {
                  if (step2Phase === "category") {
                    setStep2Phase("occasion");
                  } else if (step2Phase === "occasion") {
                    setStep2Phase("fit");
                  } else if (step2Phase === "fit") {
                    setStep2Phase("design");
                  } else if (step2Phase === "design") {
                    setStep2Phase("measurements");
                  } else {
                    setStep(step + 1);
                    setStep2Phase("category");
                  }
                } else {
                  setStep(step + 1);
                }
              }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wizard;
