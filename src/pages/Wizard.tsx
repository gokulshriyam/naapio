import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronRight, ChevronLeft, Check, Image as ImageIcon, X, HelpCircle, Lightbulb, Info, CalendarIcon, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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

const categoryImages: Record<string, string> = {
  "Sherwani": "https://source.unsplash.com/featured/?indian+man+sherwani+groom&1010",
  "Kurta": "https://source.unsplash.com/featured/?indian+man+kurta+ethnic&1011",
  "Suit": "https://source.unsplash.com/featured/?indian+man+formal+suit&1012",
  "Blazer": "https://source.unsplash.com/featured/?indian+man+formal+suit&1012",
  "Bandhgala": "https://source.unsplash.com/featured/?bandhgala+jacket+men+indian&1013",
  "Trousers": "https://source.unsplash.com/featured/?formal+trousers+men+tailored&1015",
  "Indo-Western": "https://source.unsplash.com/featured/?indo+western+fusion+fashion&1029",
  "Lehenga": "https://source.unsplash.com/featured/?indian+lehenga+bridal+woman&1020",
  "Saree Blouse": "https://source.unsplash.com/featured/?saree+blouse+indian+fashion&1026",
  "Salwar Kameez": "https://source.unsplash.com/featured/?salwar+kameez+indian+woman&1022",
  "Anarkali": "https://source.unsplash.com/featured/?anarkali+suit+indian+woman&1023",
  "Kurti": "https://source.unsplash.com/featured/?kurti+indian+woman+ethnic&1024",
  "Gown": "https://source.unsplash.com/featured/?indian+woman+ethnic+gown&1025",
  "Co-ord Set": "https://source.unsplash.com/featured/?indo+western+fusion+fashion&1029",
  "Jacket": "https://source.unsplash.com/featured/?nehru+jacket+indian+men&1014",
};

const feelOptions = [
  { label: "Light & Airy", desc: "Flowing, breathable, moves with you", img: "https://source.unsplash.com/featured/?chiffon+fabric+flowing+breeze&1030" },
  { label: "Structured", desc: "Holds its shape, clean silhouette", img: "https://source.unsplash.com/featured/?lehenga+structured+silhouette+formal&1031" },
  { label: "Rich & Heavy", desc: "Luxurious weight, bridal-grade", img: "https://source.unsplash.com/featured/?bridal+lehenga+heavy+embroidery+velvet&1032" },
  { label: "Crisp & Sharp", desc: "Formal, pressed, tailored look", img: "https://source.unsplash.com/featured/?formal+blazer+suit+lapels+closeup&1033" },
  { label: "Soft & Draped", desc: "Gentle drape, comfortable all day", img: "https://source.unsplash.com/featured/?soft+draped+fabric+indian+ethnic&1034" },
  { label: "No Preference", desc: "Let the tailor recommend", img: "https://source.unsplash.com/featured/?fabric+textile+assorted+colour&1035" },
];

const fabricTypesByFeel: Record<string, string[]> = {
  "Light & Airy": ["Chiffon", "Georgette", "Organza", "Net", "Tissue", "Chanderi Silk", "Muslin", "Voile", "No preference"],
  "Structured": ["Raw Silk", "Dupioni Silk", "Brocade", "Taffeta", "Canvas", "Denim", "Linen", "Tweed", "No preference"],
  "Rich & Heavy": ["Velvet", "Banarasi Silk", "Kanjivaram Silk", "Zari Brocade", "Patola Silk", "Tussar Silk", "Jacquard", "No preference"],
  "Crisp & Sharp": ["Cotton", "Poplin", "Oxford Cloth", "Chambray", "Linen", "Khadi", "Satin (matte)", "No preference"],
  "Soft & Draped": ["Jersey Knit", "Crepe", "Rayon", "Modal", "Silk Crepe", "Chiffon", "Georgette", "No preference"],
  "No Preference": ["Silk", "Cotton", "Georgette", "Chiffon", "Velvet", "Linen", "Crepe", "Brocade", "Khadi", "Tussar", "Organza", "Net", "Rayon", "Modal", "Jacquard", "Banarasi", "No preference"],
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
  { label: "I'll upload a reference", swatch: null },
];

const surfaceOptions = [
  { label: "Plain / No Embellishment", exclusive: true },
  { label: "Heavy Embroidery", img: "https://source.unsplash.com/featured/?heavy+embroidery+indian+fabric+closeup&1040" },
  { label: "Zardozi / Zari Work", img: "https://source.unsplash.com/featured/?zari+zardozi+gold+embroidery+closeup&1041" },
  { label: "Mirror Work", img: "https://source.unsplash.com/featured/?mirror+work+shisha+embroidery+india&1042" },
  { label: "Sequence & Beadwork", img: "https://source.unsplash.com/featured/?sequins+beadwork+fabric+closeup&1043" },
  { label: "Bandhani / Tie-Dye", img: "https://source.unsplash.com/featured/?bandhani+tie+dye+fabric+india&1044" },
  { label: "Kalamkari / Block Print", img: "https://source.unsplash.com/featured/?kalamkari+block+print+fabric+india&1045" },
  { label: "Resham Thread Work", img: "https://source.unsplash.com/featured/?resham+thread+embroidery+fabric&1046" },
  { label: "Cutwork / Lace", img: "https://source.unsplash.com/featured/?cutwork+lace+fabric+detail&1047" },
  { label: "Smocking / Pintucks", img: "https://source.unsplash.com/featured/?smocking+pintucks+fabric+texture&1048" },
  { label: "Digital Print", img: "https://source.unsplash.com/featured/?digital+print+fabric+pattern&1049" },
  { label: "Appliqué", img: "https://source.unsplash.com/featured/?applique+patchwork+fabric+indian&1050" },
  { label: "No Preference", img: null },
];

const blendOptions = [
  { label: "Pure Natural", desc: "100% cotton, silk, linen or wool — breathes best, premium feel", icon: "🌿" },
  { label: "Natural Blend", desc: "Natural fibre mixed with a small % synthetic for durability", icon: "🪡" },
  { label: "Synthetic Blend", desc: "Poly-blend or viscose — more affordable, easier to maintain", icon: "✨" },
  { label: "No Preference", desc: "Let the tailor recommend what works for your garment", icon: "🤍" },
];

const brandOptions = [
  "Nalli Silks", "Kancheepuram Co-op", "Fabindia", "W for Woman",
  "Raymond", "Manyavar (fabric)", "Soch", "Biba", "Meena Bazaar",
  "Taneira", "Good Earth", "No preference",
];

const fabricBudgetOptions = [
  { label: "Economy", range: "₹100 – ₹500 / metre", desc: "Polycotton, synthetic blends, basic cotton", accent: "border-green-300 bg-green-50" },
  { label: "Mid-Range", range: "₹500 – ₹2,000 / metre", desc: "Good cotton, georgette, light silks, linen", accent: "border-amber-300 bg-amber-50" },
  { label: "Premium", range: "₹2,000+ / metre", desc: "Pure silk, Banarasi, Kanjivaram, designer fabric", accent: "border-purple-300 bg-purple-50" },
];

const embellishmentBudgetOptions = [
  { label: "Light Detailing", range: "₹500 – ₹3,000", desc: "Simple thread work, basic prints, minimal mirror work", accent: "border-teal-300 bg-teal-50" },
  { label: "Medium Work", range: "₹3,000 – ₹10,000", desc: "Resham embroidery, bandhani, moderate zari", accent: "border-amber-300 bg-amber-50" },
  { label: "Heavy / Bridal", range: "₹10,000+", desc: "Zardozi, full zari, dense mirror work, bridal-grade", accent: "border-rose-300 bg-rose-50" },
];

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
  const [searchParams] = useSearchParams();
  const orderType = searchParams.get("type") || "new-order";
  const isOwnFabric = orderType === "own-fabric";
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
  const [step3Phase, setStep3Phase] = useState<
    "feel" | "fabricType" | "colour" | "surface" | "blend" | "brand" | "fabricBudget" | "embellishment" | "budgetDelivery"
  >("feel");
  const [selectedFeel, setSelectedFeel] = useState("");
  const [selectedFabricTypes, setSelectedFabricTypes] = useState<string[]>([]);
  const [selectedColourMood, setSelectedColourMood] = useState("");
  const [colourNote, setColourNote] = useState("");
  const [colourReferencePhoto, setColourReferencePhoto] = useState<File | null>(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [ownFabricDescription, setOwnFabricDescription] = useState("");
  const [selectedBlend, setSelectedBlend] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [fabricBudgetBand, setFabricBudgetBand] = useState("");
  const [embellishmentBudget, setEmbellishmentBudget] = useState("");
  const [showOwnFabricInput, setShowOwnFabricInput] = useState(true);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState<any>(null);
  const [measureGuideOpen, setMeasureGuideOpen] = useState(false);

  // Outfit Visualiser state
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [generatedOutfitImage, setGeneratedOutfitImage] = useState<string>("");
  const [visualiserLoading, setVisualiserLoading] = useState<boolean>(false);
  const [visualiserError, setVisualiserError] = useState<string>("");
  const [visualiserDismissed, setVisualiserDismissed] = useState<boolean>(false);

  const hasEmbellishment = selectedSurfaces.length > 0 &&
    !selectedSurfaces.every((s) => s === "Plain / No Embellishment" || s === "No Preference");

  const getMinDeliveryDays = () => {
    const bridal = ["Lehenga", "Saree Blouse"];
    const formal = ["Sherwani", "Suit", "Bandhgala"];
    if (bridal.includes(selectedCategory)) return 21;
    if (formal.includes(selectedCategory)) return 14;
    return 10;
  };

  const getMinDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + getMinDeliveryDays());
    return d;
  };

  useEffect(() => {
    const min = getMinDeliveryDate();
    setDeliveryDate(min.toISOString().split("T")[0]);
  }, [selectedCategory]);

  // Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("naapio_wizard_draft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.step && draft.step > 1) {
          setDraftRestored(true);
          setRestoredDraft(draft);
        }
      } catch (e) {
        localStorage.removeItem("naapio_wizard_draft");
      }
    }
  }, []);

  // Save draft on step changes
  useEffect(() => {
    if (step > 1) {
      const draft = {
        step, step2Phase, step3Phase, orderType, gender,
        selectedCategory, selectedSubCategory, selectedOccasion,
        selectedFit, selectedNeckline, selectedSleeve, selectedDupatta,
        selectedLining, measurementType, standardSize, sizeRegion,
        selectedFeel, selectedFabricTypes, selectedColourMood, colourNote,
        selectedSurfaces, selectedBlend, selectedBrand, fabricBudgetBand,
        embellishmentBudget, budgetRange, deliveryDate, flexibleDate, description,
      };
      localStorage.setItem("naapio_wizard_draft", JSON.stringify(draft));
    }
  }, [step, step2Phase, step3Phase, gender, selectedCategory,
      selectedOccasion, selectedFit, measurementType,
      selectedFeel, selectedColourMood, budgetRange]);


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
    if (step === 3) {
      if (isOwnFabric && showOwnFabricInput) return true;
      if (step3Phase === "feel") return !!selectedFeel;
      if (step3Phase === "fabricType") return true;
      if (step3Phase === "colour") return true;
      if (step3Phase === "surface") return true;
      if (step3Phase === "blend") return true;
      if (step3Phase === "brand") return true;
      if (step3Phase === "fabricBudget") return !!fabricBudgetBand;
      if (step3Phase === "embellishment") return !!embellishmentBudget;
      if (step3Phase === "budgetDelivery") return budgetRange[0] >= 1000 && !!deliveryDate;
      return true;
    }
    if (step === 4) return otpVerified && termsAccepted;
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
        orderType: isOwnFabric ? "Own Fabric" : "New Order",
        garment: `${gender === "women" ? "Women's" : "Men's"} · ${selectedCategory} · ${selectedSubCategory}`,
        occasion: selectedOccasion,
        budgetRange: `${formatINR(budgetRange[0])} – ${formatINR(budgetRange[1])}`,
        deliveryDate,
        timestamp: new Date().toISOString()
      }));
      localStorage.removeItem("naapio_wizard_draft");
      setOrderSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  // Outfit Visualiser helpers
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const buildOutfitPrompt = (): string => {
    const parts: string[] = [];
    parts.push(
      `Generate a realistic fashion photograph of this person wearing a custom Indian outfit. ` +
      `Maintain their exact face, skin tone, body shape, and proportions from the uploaded photo. ` +
      `Show the complete garment from head to toe. ` +
      `Clean neutral studio background. Photorealistic style.`
    );
    if (selectedCategory) {
      parts.push(`Garment type: ${selectedCategory}${selectedSubCategory ? ` — specifically ${selectedSubCategory}` : ''}.`);
    }
    if (gender) {
      parts.push(`For a ${gender.toLowerCase()} customer.`);
    }
    if (selectedOccasion) {
      parts.push(`Occasion: ${selectedOccasion}.`);
    }
    if (selectedFit && selectedFit !== '') {
      parts.push(`Fit: ${selectedFit}.`);
    }
    const designParts: string[] = [];
    if (selectedNeckline) designParts.push(`${selectedNeckline} neckline`);
    if (selectedSleeve) designParts.push(`${selectedSleeve} sleeves`);
    if (designParts.length > 0) {
      parts.push(`Design details: ${designParts.join(', ')}.`);
    }
    if (selectedFeel && selectedFeel !== 'No Preference') {
      parts.push(`Fabric feel: ${selectedFeel}.`);
    }
    if (selectedFabricTypes && selectedFabricTypes.length > 0 && !selectedFabricTypes.includes('No preference')) {
      parts.push(`Fabric: ${selectedFabricTypes.slice(0, 2).join(' or ')}.`);
    }
    if (selectedColourMood && selectedColourMood !== 'No preference') {
      parts.push(`Colour: ${selectedColourMood}.`);
      if (colourNote) parts.push(`Colour note: ${colourNote}.`);
    }
    if (
      selectedSurfaces && selectedSurfaces.length > 0 &&
      !selectedSurfaces.includes('Plain / No Embellishment') &&
      !selectedSurfaces.includes('No Preference')
    ) {
      parts.push(`Surface embellishment: ${selectedSurfaces.slice(0, 2).join(', ')}.`);
    }
    parts.push(`The outfit must look like a real tailored garment — not a costume or illustration.`);
    return parts.join(' ');
  };

  const generateOutfitVisualisation = async (file: File) => {
    setVisualiserLoading(true);
    setVisualiserError("");
    setGeneratedOutfitImage("");
    try {
      const base64 = await fileToBase64(file);
      const prompt = buildOutfitPrompt();
      const apiKey = "AIzaSyBDz4pIb90FuUS9AeLgzn6bnSqjMszizg0"; // TODO: move server-side before launch
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: file.type || 'image/jpeg',
                      data: base64
                    }
                  },
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          })
        }
      );
      const data = await response.json();
      const imagePart = data?.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData?.mimeType?.startsWith('image/')
      );
      if (imagePart?.inlineData?.data) {
        setGeneratedOutfitImage(
          `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
        );
      } else {
        throw new Error(`No image in response. Raw: ${JSON.stringify(data).slice(0, 300)}`);
      }
    } catch (err: any) {
      console.error('Gemini error:', err);
      setVisualiserError(
        `Error: ${err?.message || JSON.stringify(err)}`
      );
    } finally {
      setVisualiserLoading(false);
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Photo must be under 8 MB");
      return;
    }
    setSelfiePhoto(file);
    generateOutfitVisualisation(file);
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
      {/* Draft Resume Banner */}
      {draftRestored && restoredDraft && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-sans text-sm text-amber-800">
              You have an unfinished order — want to continue where you left off?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="gold"
                onClick={() => {
                  const d = restoredDraft;
                  if (d.step) setStep(d.step);
                  if (d.step2Phase) setStep2Phase(d.step2Phase);
                  if (d.step3Phase) setStep3Phase(d.step3Phase);
                  if (d.gender) setGender(d.gender);
                  if (d.selectedCategory) setSelectedCategory(d.selectedCategory);
                  if (d.selectedSubCategory) setSelectedSubCategory(d.selectedSubCategory);
                  if (d.selectedOccasion) setSelectedOccasion(d.selectedOccasion);
                  if (d.selectedFit) setSelectedFit(d.selectedFit);
                  if (d.selectedNeckline) setSelectedNeckline(d.selectedNeckline);
                  if (d.selectedSleeve) setSelectedSleeve(d.selectedSleeve);
                  if (d.selectedDupatta) setSelectedDupatta(d.selectedDupatta);
                  if (d.selectedLining) setSelectedLining(d.selectedLining);
                  if (d.measurementType) setMeasurementType(d.measurementType);
                  if (d.standardSize) setStandardSize(d.standardSize);
                  if (d.sizeRegion) setSizeRegion(d.sizeRegion);
                  if (d.selectedFeel) setSelectedFeel(d.selectedFeel);
                  if (d.selectedFabricTypes) setSelectedFabricTypes(d.selectedFabricTypes);
                  if (d.selectedColourMood) setSelectedColourMood(d.selectedColourMood);
                  if (d.colourNote) setColourNote(d.colourNote);
                  if (d.selectedSurfaces) setSelectedSurfaces(d.selectedSurfaces);
                  if (d.selectedBlend) setSelectedBlend(d.selectedBlend);
                  if (d.selectedBrand) setSelectedBrand(d.selectedBrand);
                  if (d.fabricBudgetBand) setFabricBudgetBand(d.fabricBudgetBand);
                  if (d.embellishmentBudget) setEmbellishmentBudget(d.embellishmentBudget);
                  if (d.budgetRange) setBudgetRange(d.budgetRange);
                  if (d.deliveryDate) setDeliveryDate(d.deliveryDate);
                  if (d.flexibleDate !== undefined) setFlexibleDate(d.flexibleDate);
                  if (d.description) setDescription(d.description);
                  setDraftRestored(false);
                  setRestoredDraft(null);
                }}
              >
                Resume →
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("naapio_wizard_draft");
                  setDraftRestored(false);
                  setRestoredDraft(null);
                }}
              >
                Start Fresh
              </Button>
            </div>
          </div>
        </div>
      )}

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
               : step === 3
                ? isOwnFabric && showOwnFabricInput
                  ? "Step 3 — Your Fabric"
                  : step3Phase === "feel"
                  ? "Step 3a — Fabric Feel"
                  : step3Phase === "fabricType"
                  ? "Step 3b — Fabric Type"
                  : step3Phase === "colour"
                  ? "Step 3c — Colour Mood"
                  : step3Phase === "surface"
                  ? "Step 3d — Surface & Texture"
                  : step3Phase === "blend"
                  ? "Step 3e — Fabric Blend"
                  : step3Phase === "brand"
                  ? "Step 3f — Brand Preference"
                  : step3Phase === "fabricBudget"
                  ? "Step 3g — Fabric Budget"
                  : step3Phase === "embellishment"
                  ? "Step 3h — Embellishment Budget"
                  : step3Phase === "budgetDelivery"
                  ? "Step 3i — Budget & Delivery"
                  : `Step 3 of 4`
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
                        className={`rounded-xl text-left font-sans text-sm transition-all border overflow-hidden ${selectedCategory === cat ? "border-accent bg-gold-light text-foreground font-semibold ring-2 ring-accent/30" : "border-border bg-card text-foreground hover:border-accent/30"}`}
                      >
                        {categoryImages[cat] && (
                          <img src={categoryImages[cat]} alt={cat} className="w-full h-20 object-cover" />
                        )}
                        <span className="block p-3">{cat}</span>
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
                <div>
                  {/* Measurement Guide */}
                  <div className="mb-6">
                    <button
                      onClick={() => setMeasureGuideOpen(!measureGuideOpen)}
                      className="font-sans text-sm font-medium text-accent hover:underline"
                    >
                      📏 How to take your measurements {measureGuideOpen ? "↑" : "→"}
                    </button>
                    {measureGuideOpen && (
                      <div className="mt-3 p-5 bg-card rounded-xl border border-border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          {[
                            { title: "Bust / Chest", tip: "Measure around the fullest part of your chest, keeping the tape parallel to the floor." },
                            { title: "Waist", tip: "Measure around your natural waist — the narrowest part of your torso, usually 2–3 inches above your navel." },
                            { title: "Hips", tip: "Measure around the fullest part of your hips and seat, about 7–9 inches below your natural waist." },
                            { title: "Height", tip: "Stand straight without shoes. Measure from the top of your head to the floor." },
                            { title: "Shoulder Width", tip: "Measure from the edge of one shoulder to the other across your back." },
                            { title: "Sleeve Length", tip: "From the shoulder edge, down the outside of your arm to your wrist with arm slightly bent." },
                          ].map((item) => (
                            <div key={item.title}>
                              <p className="font-sans text-sm font-semibold text-foreground">{item.title}</p>
                              <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.tip}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground font-sans mb-3">
                          📌 Tip: Ask someone to help measure you — self-measurements are often inaccurate. Your tailor will confirm all measurements at Milestone 1 before cutting any fabric.
                        </p>
                        <button
                          onClick={() => setMeasureGuideOpen(false)}
                          className="text-xs text-accent font-sans hover:underline"
                        >
                          Got it — close guide ↑
                        </button>
                      </div>
                    )}
                  </div>

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

          {/* STEP 3: Fabric & Customisation */}
          {step === 3 && (
            <motion.div key={`s3-${step3Phase}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

              {/* OWN FABRIC PATH */}
              {/* OWN FABRIC PATH */}
              {isOwnFabric && showOwnFabricInput && (
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Tell us about your fabric</h2>
                  <p className="text-muted-foreground font-sans mb-6">Describe your fabric — type, colour, weight, condition</p>
                  <Textarea
                    value={ownFabricDescription}
                    onChange={(e) => setOwnFabricDescription(e.target.value.slice(0, 300))}
                    placeholder="e.g. Navy blue Kanjivaram silk saree fabric, about 6 metres, unused"
                    className="font-sans min-h-[150px]"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground font-sans mt-2 text-right">{ownFabricDescription.length}/300</p>
                </div>
              )}

              {/* STANDARD PATH */}
              {(!isOwnFabric || !showOwnFabricInput) && (
                <>
                  {/* STEP 3a: FABRIC FEEL */}
                  {step3Phase === "feel" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">How do you want the fabric to feel?</h2>
                      <p className="text-muted-foreground font-sans mb-6">Choose the quality that matches your vision</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {feelOptions.map((feel) => (
                          <button
                            key={feel.label}
                            onClick={() => setSelectedFeel(feel.label)}
                            className={`rounded-xl overflow-hidden text-left transition-all border-2 ${
                              selectedFeel === feel.label
                                ? "border-accent ring-2 ring-accent/30"
                                : "border-border hover:border-accent/30"
                            }`}
                          >
                            <img src={feel.img} alt={feel.label} className="w-full h-32 object-cover" />
                            <div className="p-4">
                              <p className="font-sans font-bold text-sm text-foreground mb-1 flex items-center gap-2">
                                {selectedFeel === feel.label && <Check className="w-4 h-4 text-accent" />}
                                {feel.label}
                              </p>
                              <p className="text-xs text-muted-foreground">{feel.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3b: FABRIC TYPE */}
                  {step3Phase === "fabricType" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Which fabrics do you have in mind?</h2>
                      <p className="text-muted-foreground font-sans mb-6">Select all that appeal to you — your tailor will confirm availability</p>
                      <div className="flex flex-wrap gap-2">
                        {(fabricTypesByFeel[selectedFeel] || fabricTypesByFeel["No Preference"]).map((fab) => (
                          <button
                            key={fab}
                            onClick={() => {
                              if (fab === "No preference") {
                                setSelectedFabricTypes(["No preference"]);
                              } else {
                                setSelectedFabricTypes((prev) => {
                                  const without = prev.filter((f) => f !== "No preference");
                                  return without.includes(fab) ? without.filter((f) => f !== fab) : [...without, fab];
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                              selectedFabricTypes.includes(fab)
                                ? "border-accent bg-accent text-accent-foreground font-medium"
                                : "border-border bg-card text-foreground hover:border-accent/40"
                            } ${selectedFabricTypes.includes("No preference") && fab !== "No preference" ? "opacity-40 pointer-events-none" : ""}`}
                          >
                            {fab}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep3Phase("colour")}
                        className="mt-4 text-sm font-sans text-accent hover:underline"
                      >
                        Skip this step →
                      </button>
                    </div>
                  )}

                  {/* STEP 3c: COLOUR MOOD */}
                  {step3Phase === "colour" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What colour are you drawn to?</h2>
                      <p className="text-muted-foreground font-sans mb-6">Choose a mood — your tailor will suggest specific shades</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {colourMoodOptions.map((cm) => (
                          <button
                            key={cm.label}
                            onClick={() => setSelectedColourMood(selectedColourMood === cm.label ? "" : cm.label)}
                            className={`p-4 rounded-xl text-left font-sans text-sm transition-all border ${
                              selectedColourMood === cm.label
                                ? "border-accent bg-gold-light ring-2 ring-accent/30"
                                : "border-border bg-card hover:border-accent/30"
                            }`}
                          >
                            {cm.swatch ? (
                              <div
                                className="w-10 h-10 rounded-full mb-3 border border-border"
                                style={{ backgroundColor: cm.swatch }}
                              />
                            ) : (
                              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                            )}
                            <span className="leading-tight block font-medium">{cm.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Upload reference photo */}
                      {selectedColourMood === "I'll upload a reference" && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                          <label className="font-sans text-sm font-medium text-foreground mb-2 block">Upload a colour reference photo</label>
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size <= 5 * 1024 * 1024) {
                                setColourReferencePhoto(file);
                              } else if (file) {
                                toast.error("File must be under 5MB");
                              }
                            }}
                            className="font-sans text-sm"
                          />
                          {colourReferencePhoto && (
                            <div className="mt-2 flex items-center gap-2">
                              <img
                                src={URL.createObjectURL(colourReferencePhoto)}
                                alt="Colour reference"
                                className="w-16 h-16 rounded-lg object-cover border border-border"
                              />
                              <span className="text-xs text-muted-foreground font-sans">{colourReferencePhoto.name}</span>
                              <button onClick={() => setColourReferencePhoto(null)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Optional shade note */}
                      <div className="mt-6">
                        <Input
                          value={colourNote}
                          onChange={(e) => setColourNote(e.target.value)}
                          placeholder="Any specific shade or note? (optional)"
                          className="font-sans"
                        />
                      </div>

                      <button
                        onClick={() => setStep3Phase("surface")}
                        className="mt-4 text-sm font-sans text-accent hover:underline"
                      >
                        Skip this step →
                      </button>
                    </div>
                  )}

                  {/* STEP 3d: SURFACE & TEXTURE */}
                  {step3Phase === "surface" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Any embellishment or surface work?</h2>
                      <p className="text-muted-foreground font-sans mb-6">Select everything that interests you — your tailor will advise what works for your garment</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {surfaceOptions.map((sopt) => {
                          const isSelected = selectedSurfaces.includes(sopt.label);
                          const isExclusive = 'exclusive' in sopt && sopt.exclusive;
                          const plainSelected = selectedSurfaces.includes("Plain / No Embellishment");
                          return (
                            <button
                              key={sopt.label}
                              onClick={() => {
                                if (isExclusive) {
                                  setSelectedSurfaces(isSelected ? [] : [sopt.label]);
                                } else {
                                  setSelectedSurfaces((prev) => {
                                    const without = prev.filter((s) => s !== "Plain / No Embellishment");
                                    return without.includes(sopt.label)
                                      ? without.filter((s) => s !== sopt.label)
                                      : [...without, sopt.label];
                                  });
                                }
                              }}
                              className={`rounded-xl overflow-hidden text-left transition-all border ${
                                isSelected
                                  ? "border-accent ring-2 ring-accent/30"
                                  : "border-border hover:border-accent/30"
                              } ${plainSelected && !isExclusive ? "opacity-40 pointer-events-none" : ""}`}
                            >
                              {'img' in sopt && sopt.img ? (
                                <img src={sopt.img} alt={sopt.label} className="w-full h-24 object-cover" />
                              ) : (
                                <div className="w-full h-24 bg-muted flex items-center justify-center">
                                  <span className="text-muted-foreground font-sans text-xs">
                                    {isExclusive ? "None" : "—"}
                                  </span>
                                </div>
                              )}
                              <div className="p-3">
                                <p className="font-sans text-xs font-medium text-foreground flex items-center gap-1">
                                  {isSelected && <Check className="w-3 h-3 text-accent" />}
                                  {sopt.label}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setStep3Phase("blend")}
                        className="mt-4 text-sm font-sans text-accent hover:underline"
                      >
                        Skip this step →
                      </button>
                    </div>
                  )}

                  {/* STEP 3e: FABRIC BLEND */}
                  {step3Phase === "blend" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Any preference on fabric composition?</h2>
                      <p className="text-muted-foreground font-sans mb-6">This helps your tailor source the right quality</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blendOptions.map((b) => (
                          <button
                            key={b.label}
                            onClick={() => setSelectedBlend(b.label)}
                            className={`p-5 rounded-xl text-left font-sans transition-all border ${
                              selectedBlend === b.label
                                ? "border-accent bg-gold-light ring-2 ring-accent/30"
                                : "border-border bg-card hover:border-accent/30"
                            }`}
                          >
                            <span className="text-3xl block mb-3">{b.icon}</span>
                            <p className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
                              {selectedBlend === b.label && <Check className="w-4 h-4 text-accent" />}
                              {b.label}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep3Phase("brand")}
                        className="mt-4 text-sm font-sans text-accent hover:underline"
                      >
                        Skip this step →
                      </button>
                    </div>
                  )}

                  {/* STEP 3f: BRAND PREFERENCE */}
                  {step3Phase === "brand" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Any preferred fabric brand?</h2>
                      <p className="text-muted-foreground font-sans mb-6">Optional — leave blank if you have no preference</p>
                      <div className="flex flex-wrap gap-2">
                        {brandOptions.map((br) => (
                          <button
                            key={br}
                            onClick={() => {
                              if (br === "No preference") {
                                setSelectedBrand(["No preference"]);
                              } else {
                                setSelectedBrand((prev) => {
                                  const without = prev.filter((b) => b !== "No preference");
                                  return without.includes(br) ? without.filter((b) => b !== br) : [...without, br];
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-full font-sans text-sm border transition-all ${
                              (Array.isArray(selectedBrand) ? selectedBrand : []).includes(br)
                                ? "border-accent bg-accent text-accent-foreground font-medium"
                                : "border-border bg-card text-foreground hover:border-accent/40"
                            } ${(Array.isArray(selectedBrand) ? selectedBrand : []).includes("No preference") && br !== "No preference" ? "opacity-40 pointer-events-none" : ""}`}
                          >
                            {br}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep3Phase("fabricBudget")}
                        className="mt-4 text-sm font-sans text-accent hover:underline"
                      >
                        Skip this step →
                      </button>
                    </div>
                  )}

                  {/* STEP 3g: FABRIC BUDGET BAND */}
                  {step3Phase === "fabricBudget" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What's your fabric budget per metre?</h2>
                      <p className="text-muted-foreground font-sans mb-6">Helps your tailor source within your range</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {fabricBudgetOptions.map((fb) => (
                          <button
                            key={fb.label}
                            onClick={() => setFabricBudgetBand(fb.label)}
                            className={`p-6 rounded-xl text-left font-sans transition-all border-2 ${
                              fabricBudgetBand === fb.label
                                ? "border-accent ring-2 ring-accent/30 bg-gold-light"
                                : `${fb.accent} hover:border-accent/30`
                            }`}
                          >
                            <p className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                              {fabricBudgetBand === fb.label && <Check className="w-5 h-5 text-accent" />}
                              {fb.label}
                            </p>
                            <p className="font-semibold text-sm text-accent mb-2">{fb.range}</p>
                            <p className="text-xs text-muted-foreground">{fb.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3h: EMBELLISHMENT BUDGET */}
                  {step3Phase === "embellishment" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What's your embellishment budget?</h2>
                      <p className="text-muted-foreground font-sans mb-6">For the embroidery or surface work you selected</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {embellishmentBudgetOptions.map((eb) => (
                          <button
                            key={eb.label}
                            onClick={() => setEmbellishmentBudget(eb.label)}
                            className={`p-6 rounded-xl text-left font-sans transition-all border-2 ${
                              embellishmentBudget === eb.label
                                ? "border-accent ring-2 ring-accent/30 bg-gold-light"
                                : `${eb.accent} hover:border-accent/30`
                            }`}
                          >
                            <p className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                              {embellishmentBudget === eb.label && <Check className="w-5 h-5 text-accent" />}
                              {eb.label}
                            </p>
                            <p className="font-semibold text-sm text-accent mb-2">{eb.range}</p>
                            <p className="text-xs text-muted-foreground">{eb.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3i: TOTAL BUDGET + DELIVERY DATE */}
                  {step3Phase === "budgetDelivery" && (
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What's your total budget and when do you need it?</h2>
                      <p className="text-muted-foreground font-sans mb-8">Final details before we match you with tailors</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Total Budget */}
                        <div>
                          <h3 className="font-sans font-semibold text-foreground mb-4">Total budget for the garment (including stitching)</h3>
                          <div className="flex gap-3 mb-3">
                            <div className="flex-1">
                              <label className="text-xs font-sans text-muted-foreground mb-1 block">Min ₹</label>
                              <Input
                                type="number"
                                placeholder="5,000"
                                value={budgetRange[0] || ""}
                                onChange={(e) => setBudgetRange([Number(e.target.value) || 0, budgetRange[1]])}
                                className="font-sans"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-sans text-muted-foreground mb-1 block">Max ₹</label>
                              <Input
                                type="number"
                                placeholder="15,000"
                                value={budgetRange[1] || ""}
                                onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value) || 0])}
                                className="font-sans"
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">
                            Vendor bids will be based on this range. You're not locked in — bids above range won't be shown.
                          </p>
                        </div>

                        {/* Delivery Date */}
                        <div>
                          <h3 className="font-sans font-semibold text-foreground mb-4">When do you need this ready?</h3>
                          <p className="text-xs text-muted-foreground font-sans mb-3">
                            Minimum {getMinDeliveryDays()} days from today for {selectedCategory || "this garment"}
                          </p>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-sans",
                                  !deliveryDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deliveryDate ? format(new Date(deliveryDate + "T00:00:00"), "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={deliveryDate ? new Date(deliveryDate + "T00:00:00") : undefined}
                                onSelect={(date) => {
                                  if (date) setDeliveryDate(date.toISOString().split("T")[0]);
                                }}
                                disabled={(date) => date < getMinDeliveryDate()}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>

                          <div className="flex items-center gap-3 mt-4">
                            <Checkbox
                              id="flex-date"
                              checked={flexibleDate}
                              onCheckedChange={(v) => setFlexibleDate(!!v)}
                            />
                            <label htmlFor="flex-date" className="text-sm font-sans text-foreground cursor-pointer">
                              My date is flexible ±3 days
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

            </motion.div>
          )}

          {/* STEP 4: Review & Payment */}
          {step === 4 && orderSuccess ? (
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
                    <button
                      onClick={() => { navigator.clipboard.writeText(orderId); toast.success("Copied!"); }}
                      className="p-1.5 rounded-md hover:bg-card transition-colors"
                      title="Copy Order ID"
                    >
                      📋
                    </button>
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
                  <Button variant="gold" size="hero" className="w-full" onClick={() => navigate("/dashboard")}>
                    View My Order →
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/start")}>
                    Start Another Order
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground font-sans mt-6">
                  A summary has been sent to your WhatsApp number {phone}
                </p>
              </div>
            </motion.div>
          ) : step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Review Your Order</h2>
              <p className="text-muted-foreground font-sans mb-8">Check everything below — once you pay, your brief goes live to tailors</p>

              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8">
                {/* LEFT COLUMN: Order Summary */}
                <div className="space-y-4">

                  {/* OUTFIT VISUALISER */}
                  {!visualiserDismissed && (
                    <div className="rounded-xl border border-amber-200/60 overflow-hidden" style={{ backgroundColor: '#FDF3E3' }}>
                      <div className="p-5 relative">
                        {/* Skip button */}
                        <button
                          onClick={() => setVisualiserDismissed(true)}
                          className="absolute top-3 right-3 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Skip →
                        </button>

                        {/* NO PHOTO YET */}
                        {!selfiePhoto && !visualiserLoading && !generatedOutfitImage && !visualiserError && (
                          <div>
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">NEW · OUTFIT PREVIEW</span>
                            <h3 className="font-serif font-bold text-lg text-foreground mt-1 mb-1">See this outfit on you</h3>
                            <p className="text-sm text-muted-foreground font-sans mb-4">
                              Upload a full-length photo and we'll generate an AI visualisation of how your outfit could look — before you post your brief.
                            </p>
                            <label className="inline-block cursor-pointer">
                              <input
                                type="file"
                                accept="image/jpeg,image/png"
                                className="hidden"
                                onChange={handleSelfieUpload}
                              />
                              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-semibold text-sm bg-accent text-accent-foreground shadow-md hover:bg-accent/90 transition-colors cursor-pointer">
                                Upload Your Photo →
                              </span>
                            </label>
                            <p className="text-[11px] text-muted-foreground font-sans mt-3">
                              ✦ AI-generated style inspiration only — not an exact preview. Your tailor's work is defined by your brief.
                            </p>
                            <p className="text-[10px] text-muted-foreground font-sans mt-1 flex items-center gap-1">
                              <Info className="w-3 h-3 inline" /> Your photo is sent to Google Gemini for generation only — not stored on Naapio's servers.
                            </p>
                          </div>
                        )}

                        {/* LOADING STATE */}
                        {visualiserLoading && (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
                            <p className="font-sans font-semibold text-foreground text-sm">Generating your outfit visualisation...</p>
                            <p className="text-xs text-muted-foreground font-sans mt-1">Usually takes 15–20 seconds</p>
                          </div>
                        )}

                        {/* IMAGE GENERATED */}
                        {generatedOutfitImage && !visualiserLoading && (
                          <div>
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">OUTFIT INSPIRATION · AI GENERATED</span>
                            <div className="mt-3 rounded-xl overflow-hidden shadow-md">
                              <img
                                src={generatedOutfitImage}
                                alt="AI-generated outfit visualisation"
                                className="w-full max-h-[280px] md:max-h-[480px] object-contain bg-white"
                              />
                            </div>
                            <p className="text-[11px] text-muted-foreground font-sans mt-3">
                              ✦ AI-generated inspiration view. Your actual garment is defined by the brief below.
                            </p>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelfiePhoto(null);
                                  setGeneratedOutfitImage("");
                                  setVisualiserError("");
                                }}
                              >
                                ↺ Try a different photo
                              </Button>
                              <button
                                onClick={() => setVisualiserDismissed(true)}
                                className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                              >
                                ✕ Hide
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ERROR STATE */}
                        {visualiserError && !visualiserLoading && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800 font-sans">⚠️ {visualiserError}</p>
                            <button
                              onClick={() => {
                                if (selfiePhoto) generateOutfitVisualisation(selfiePhoto);
                              }}
                              className="text-xs font-sans text-accent font-medium hover:underline mt-1"
                            >
                              Try again →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ORDER TYPE */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Type</span>
                      <button onClick={() => { navigate("/start"); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold ${
                      orderType === "own-fabric" ? "bg-blue-100 text-blue-800" :
                      orderType === "alteration" ? "bg-amber-100 text-amber-800" :
                      orderType === "customise" ? "bg-purple-100 text-purple-800" :
                      "bg-rose-100 text-rose-800"
                    }`}>
                      {orderType === "own-fabric" ? "Own Fabric" : orderType === "alteration" ? "Alteration" : orderType === "customise" ? "Customise" : "New Order"}
                    </span>
                  </div>

                  {/* INSPIRATION */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspiration Photos</span>
                      <button onClick={() => { setStep(1); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    {uploaded ? (
                      <div className="flex gap-3 items-start">
                        <img src={redLehenga} alt="Inspiration" className="w-16 h-16 rounded-lg object-cover border border-border" />
                        <p className="text-sm text-muted-foreground font-sans">{description || "Red lehenga with gold embroidery"}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground font-sans">No photos uploaded</p>
                    )}
                  </div>

                  {/* GARMENT */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Garment</span>
                      <button onClick={() => { setStep(2); setStep2Phase("category"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">
                      {gender === "women" ? "Women's" : "Men's"} · {selectedCategory}{selectedSubCategory ? ` · ${selectedSubCategory}` : ""}
                    </p>
                  </div>

                  {/* OCCASION */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occasion</span>
                      <button onClick={() => { setStep(2); setStep2Phase("occasion"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">{selectedOccasion || "Not specified"}</p>
                  </div>

                  {/* FIT PREFERENCE */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fit</span>
                      <button onClick={() => { setStep(2); setStep2Phase("fit"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">{selectedFit || "Not specified"}</p>
                  </div>

                  {/* DESIGN DETAILS */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Design Details</span>
                      <button onClick={() => { setStep(2); setStep2Phase("design"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    {(selectedNeckline || selectedSleeve || selectedDupatta || selectedLining) ? (
                      <p className="text-sm text-foreground font-sans">
                        {[selectedNeckline, selectedSleeve, selectedDupatta, selectedLining].filter(Boolean).join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground font-sans">Standard (tailor to advise)</p>
                    )}
                  </div>

                  {/* MEASUREMENTS */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Measurements</span>
                      <button onClick={() => { setStep(2); setStep2Phase("measurements"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    {measurementType === "custom" ? (
                      <p className="text-sm text-foreground font-sans">Custom measurements provided</p>
                    ) : measurementType === "standard" ? (
                      <p className="text-sm text-foreground font-sans">Standard size {standardSize} ({sizeRegion})</p>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold bg-amber-100 text-amber-800">
                        ⏱ Provide within 48 hrs of order going live
                      </span>
                    )}
                  </div>

                  {/* FABRIC */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isOwnFabric ? "Your Fabric" : "Fabric Preferences"}
                      </span>
                      <button onClick={() => {
                        if (isOwnFabric) { setStep(3); setShowOwnFabricInput(true); }
                        else { setStep(3); setStep3Phase("feel"); }
                        window.scrollTo(0, 0);
                      }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    {isOwnFabric ? (
                      <p className="text-sm text-foreground font-sans">{ownFabricDescription || "Not described"}</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                        <p className="text-xs text-muted-foreground font-sans">Feel</p>
                        <p className="text-sm text-foreground font-sans">{selectedFeel || "No preference"}</p>
                        <p className="text-xs text-muted-foreground font-sans">Type</p>
                        <p className="text-sm text-foreground font-sans">{selectedFabricTypes.length > 0 ? selectedFabricTypes.join(", ") : "No preference"}</p>
                        <p className="text-xs text-muted-foreground font-sans">Colour</p>
                        <div>
                          <p className="text-sm text-foreground font-sans">{selectedColourMood || "Not selected"}{colourNote ? ` · ${colourNote}` : ""}</p>
                          {colourReferencePhoto && (
                            <div className="mt-1">
                              <img src={URL.createObjectURL(colourReferencePhoto)} alt="Colour reference" className="w-12 h-12 rounded-lg object-cover border border-border" />
                              <p className="text-xs text-muted-foreground font-sans mt-0.5">Colour reference photo</p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-sans">Surface</p>
                        <p className="text-sm text-foreground font-sans">{selectedSurfaces.length > 0 ? selectedSurfaces.join(", ") : "No preference"}</p>
                        <p className="text-xs text-muted-foreground font-sans">Blend</p>
                        <p className="text-sm text-foreground font-sans">{selectedBlend || "No preference"}</p>
                        <p className="text-xs text-muted-foreground font-sans">Brand</p>
                        <p className="text-sm text-foreground font-sans">{(Array.isArray(selectedBrand) && selectedBrand.length > 0) ? selectedBrand.join(", ") : "No preference"}</p>
                        <p className="text-xs text-muted-foreground font-sans">Fabric Budget</p>
                        <p className="text-sm text-foreground font-sans">{fabricBudgetBand || "Not specified"}</p>
                      </div>
                    )}
                  </div>

                  {/* EMBELLISHMENT BUDGET — only if applicable */}
                  {hasEmbellishment && (
                    <div className="p-5 bg-card rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Embellishment Budget</span>
                        <button onClick={() => { setStep(3); setStep3Phase("embellishment"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                      </div>
                      <p className="text-sm text-foreground font-sans">{embellishmentBudget || "Not specified"}</p>
                    </div>
                  )}
                  {!hasEmbellishment && selectedSurfaces.length > 0 && selectedSurfaces.every((s) => s === "Plain / No Embellishment") && (
                    <div className="p-5 bg-card rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Embellishment Budget</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-sans">N/A — Plain finish</p>
                    </div>
                  )}

                  {/* BUDGET & DELIVERY */}
                  <div className="p-5 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget & Delivery</span>
                      <button onClick={() => { setStep(3); setStep3Phase("budgetDelivery"); window.scrollTo(0, 0); }} className="text-accent font-sans text-xs font-medium hover:underline">Edit →</button>
                    </div>
                    <p className="text-sm text-foreground font-sans">
                      Budget: {formatINR(budgetRange[0])} – {formatINR(budgetRange[1])}
                    </p>
                    <p className="text-sm text-foreground font-sans mt-1">
                      Delivery by: {deliveryDate ? format(new Date(deliveryDate + "T00:00:00"), "PPP") : "Not set"}{flexibleDate ? " (±3 days flexible)" : ""}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground font-sans mt-2">
                    Tap any Edit → link above to update a section without losing your other answers.
                  </p>
                </div>

                {/* RIGHT COLUMN: Payment Panel */}
                <div className="space-y-5 md:sticky md:top-24 md:self-start">

                  {/* Order Type Badge */}
                  <div className="text-center">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-sans font-bold ${
                      orderType === "own-fabric" ? "bg-blue-100 text-blue-800" :
                      orderType === "alteration" ? "bg-amber-100 text-amber-800" :
                      orderType === "customise" ? "bg-purple-100 text-purple-800" :
                      "bg-rose-100 text-rose-800"
                    }`}>
                      Order Type: {orderType === "own-fabric" ? "Own Fabric" : orderType === "alteration" ? "Alteration" : orderType === "customise" ? "Customise" : "New Order"}
                    </span>
                  </div>

                  {/* Pricing Card */}
                  <div className="p-6 bg-card rounded-2xl border-2 border-accent/30 shadow-lg">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-serif font-bold text-accent">₹499</span>
                      <p className="font-sans font-semibold text-foreground mt-1">Order Posting Fee</p>
                      <p className="text-xs text-muted-foreground font-sans mt-1">Deducted from your final payment when you confirm a tailor</p>
                    </div>

                    {/* Escrow Trust Badge */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-semibold text-green-800">100% Escrow Protected</p>
                        <p className="font-sans text-xs text-green-700">Your money is held safely until you approve every milestone</p>
                      </div>
                    </div>

                    {/* What Happens Next Accordion */}
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

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
                    <label htmlFor="terms" className="text-sm font-sans text-muted-foreground cursor-pointer">
                      I agree to the <span className="text-accent underline">Terms & Conditions</span> and <span className="text-accent underline">Privacy Policy</span>
                    </label>
                  </div>

                  {/* Pay Button */}
                  <Button
                    variant="gold"
                    size="hero"
                    className="w-full"
                    disabled={!canProceed() || loading}
                    onClick={handlePay}
                  >
                    {loading ? "Processing..." : "Pay ₹499 & Post Brief"}
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
              if (step === 3) {
                if (isOwnFabric && showOwnFabricInput) {
                  setStep(2);
                  setStep2Phase("measurements");
                } else if (isOwnFabric && !showOwnFabricInput) {
                  if (step3Phase === "fabricBudget") {
                    setShowOwnFabricInput(true);
                  } else if (step3Phase === "embellishment") {
                    setStep3Phase("fabricBudget");
                  } else if (step3Phase === "budgetDelivery") {
                    if (hasEmbellishment) {
                      setStep3Phase("embellishment");
                    } else {
                      setStep3Phase("fabricBudget");
                    }
                  }
                } else {
                  if (step3Phase === "budgetDelivery") {
                    if (hasEmbellishment) {
                      setStep3Phase("embellishment");
                    } else {
                      setStep3Phase("fabricBudget");
                    }
                  } else if (step3Phase === "embellishment") {
                    setStep3Phase("fabricBudget");
                  } else if (step3Phase === "fabricBudget") {
                    setStep3Phase("brand");
                  } else if (step3Phase === "brand") {
                    setStep3Phase("blend");
                  } else if (step3Phase === "blend") {
                    setStep3Phase("surface");
                  } else if (step3Phase === "surface") {
                    setStep3Phase("colour");
                  } else if (step3Phase === "colour") {
                    setStep3Phase("fabricType");
                  } else if (step3Phase === "fabricType") {
                    setStep3Phase("feel");
                  } else {
                    setStep(2);
                    setStep2Phase("measurements");
                  }
                }
              } else if (step === 2) {
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
                if (step === 4) setStep3Phase("budgetDelivery");
                if (step === 3) setStep2Phase("measurements");
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
                    setStep(3);
                    setStep3Phase("feel");
                  }
                } else if (step === 3) {
                  if (isOwnFabric && showOwnFabricInput) {
                    setShowOwnFabricInput(false);
                    setStep3Phase("fabricBudget");
                  } else if (step3Phase === "feel") {
                    setStep3Phase("fabricType");
                  } else if (step3Phase === "fabricType") {
                    setStep3Phase("colour");
                  } else if (step3Phase === "colour") {
                    setStep3Phase("surface");
                  } else if (step3Phase === "surface") {
                    setStep3Phase("blend");
                  } else if (step3Phase === "blend") {
                    setStep3Phase("brand");
                  } else if (step3Phase === "brand") {
                    setStep3Phase("fabricBudget");
                  } else if (step3Phase === "fabricBudget") {
                    if (hasEmbellishment) {
                      setStep3Phase("embellishment");
                    } else {
                      setStep3Phase("budgetDelivery");
                    }
                  } else if (step3Phase === "embellishment") {
                    setStep3Phase("budgetDelivery");
                  } else if (step3Phase === "budgetDelivery") {
                    setStep(4);
                    setStep3Phase("feel");
                  } else {
                    setStep(4);
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
