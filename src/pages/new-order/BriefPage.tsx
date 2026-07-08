import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { menCategories, womenCategories } from "@/data/mockData";
import { resolveGarmentMeasurementConfig } from "@/data/measurementConfig";

const subCategories: Record<string, string[]> = {
  "Sherwani": ["Achkan", "Indo-Western Sherwani", "Jodhpuri Sherwani", "Double-Breasted Sherwani", "Nehru Collar Sherwani"],
  "Kurta": ["Straight Kurta", "Pathani Kurta", "Kaftan Kurta", "Embroidered / Festive Kurta", "Plain / Daily Wear Kurta", "Nehru Collar Kurta"],
  "Bandhgala": ["Single-Breasted Bandhgala", "Double-Breasted Bandhgala", "Jodhpuri Suit with Trousers", "Jodhpuri Suit with Churidar"],
  "Suit": ["2-Piece Suit", "3-Piece Suit with Waistcoat", "Single-Breasted Blazer", "Double-Breasted Blazer", "Tuxedo / Dinner Jacket", "Safari Suit"],
  "Blazer": ["Single-Breasted Blazer", "Double-Breasted Blazer", "Casual Blazer"],
  "Trousers": ["Formal Trousers", "Churidar", "Pyjama / Salwar", "Dhoti", "Jodhpuri Pants"],
  "Indo-Western": ["Indo-Western Jacket + Kurta", "Cape + Kurta", "Fusion Sherwani-Suit", "Draped Dhoti Pant Set"],
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

const necklineOptions = ["Round Neck", "V-Neck", "Sweetheart", "Boat Neck", "High / Mandarin", "Square Neck", "Keyhole", "Halter", "Off-shoulder", "One-shoulder", "Deep Back / Backless", "Collar", "No Preference"];
const sleeveOptions = ["Sleeveless", "Cap Sleeve", "Half / Elbow", "3/4 Sleeve", "Full Sleeve", "Bell / Flared", "Puff / Balloon", "Cold Shoulder", "No Preference"];
const dupattaOptions = ["2-piece (no dupatta)", "3-piece same fabric", "3-piece contrast fabric", "3-piece sheer / net dupatta", "Tailor suggests"];
const liningOptions = ["Fully Lined", "Partially Lined", "Unlined", "Padded (bust)", "No Preference"];

const showNeckline = ["Saree Blouse", "Anarkali", "Gown", "Salwar Kameez", "Kurti", "Kurta", "Sherwani", "Jacket", "Lehenga", "Co-ord Set"];
const showSleeve = ["Saree Blouse", "Anarkali", "Gown", "Salwar Kameez", "Kurti", "Kurta", "Sherwani", "Jacket", "Co-ord Set", "Lehenga"];
const showDupatta = ["Lehenga", "Salwar Kameez", "Anarkali"];
const showLining = ["Saree Blouse", "Gown", "Sherwani", "Suit", "Bandhgala", "Lehenga", "Jacket"];

const feelOptions = [
  { label: "Light & Airy", desc: "Flowing, breathable, moves with you" },
  { label: "Structured", desc: "Holds its shape, clean silhouette" },
  { label: "Rich & Heavy", desc: "Luxurious weight, bridal-grade" },
  { label: "Crisp & Sharp", desc: "Formal, pressed, tailored look" },
  { label: "Soft & Draped", desc: "Gentle drape, comfortable all day" },
  { label: "No Preference", desc: "Let the tailor recommend" },
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
  { label: "Deep Reds", swatch: "#8B1A1A" }, { label: "Jewel Tones", swatch: "#2E4A7A" },
  { label: "Pastels", swatch: "#E8B4C8" }, { label: "Golds & Champagne", swatch: "#C8963E" },
  { label: "Ivory & Cream", swatch: "#F5EDD6" }, { label: "Greens & Teals", swatch: "#2D6A4F" },
  { label: "Pinks & Mauves", swatch: "#C9748C" }, { label: "Blues & Indigos", swatch: "#3D405B" },
  { label: "Blacks & Charcoals", swatch: "#2C2C2C" }, { label: "Whites & Silvers", swatch: "#E8E8E8" },
  { label: "I'll upload a reference", swatch: null as string | null },
];

const surfaceOptions = [
  { label: "Plain / No Embellishment", exclusive: true },
  { label: "Heavy Embroidery" }, { label: "Zardozi / Zari Work" }, { label: "Mirror Work" },
  { label: "Sequence & Beadwork" }, { label: "Bandhani / Tie-Dye" }, { label: "Kalamkari / Block Print" },
  { label: "Resham Thread Work" }, { label: "Cutwork / Lace" }, { label: "Smocking / Pintucks" },
  { label: "Digital Print" }, { label: "Appliqué" }, { label: "No Preference" },
];

const blendOptions = [
  { label: "Pure Natural", desc: "100% cotton, silk, linen or wool — breathes best, premium feel", icon: "🌿" },
  { label: "Natural Blend", desc: "Natural fibre mixed with a small % synthetic for durability", icon: "🪡" },
  { label: "Synthetic Blend", desc: "Poly-blend or viscose — more affordable, easier to maintain", icon: "✨" },
  { label: "No Preference", desc: "Let the tailor recommend what works for your garment", icon: "🤍" },
];

const brandOptions = ["Nalli Silks", "Kancheepuram Co-op", "Fabindia", "W for Woman", "Raymond", "Manyavar (fabric)", "Soch", "Biba", "Meena Bazaar", "Taneira", "Good Earth", "No preference"];

const fabricBudgetOptions = [
  { label: "Economy", range: "₹100 – ₹500 / metre", desc: "Polycotton, synthetic blends, basic cotton", accent: "border-green-300 bg-green-50" },
  { label: "Mid-Range", range: "₹500 – ₹2,000 / metre", desc: "Good cotton, georgette, light silks, linen", accent: "border-amber-300 bg-amber-50" },
  { label: "Premium", range: "₹2,000+ / metre", desc: "Pure silk, Banarasi, Kanjivaram, designer fabric", accent: "border-purple-300 bg-purple-50" },
];

const WOMEN_SIZES = [
  { size: 'XS', bust: '31–32', waist: '23–24', hip: '33–34' },
  { size: 'S',  bust: '33–34', waist: '25–26', hip: '35–36' },
  { size: 'M',  bust: '35–36', waist: '27–28', hip: '37–38' },
  { size: 'L',  bust: '37–39', waist: '29–31', hip: '39–41' },
  { size: 'XL', bust: '40–42', waist: '32–34', hip: '42–44' },
  { size: 'XXL',bust: '43–45', waist: '35–37', hip: '45–47' },
];

const MEN_SIZES = [
  { size: 'XS', chest: '34–35', waist: '28–29', shoulder: '16' },
  { size: 'S',  chest: '36–37', waist: '30–31', shoulder: '17' },
  { size: 'M',  chest: '38–39', waist: '32–33', shoulder: '18' },
  { size: 'L',  chest: '40–41', waist: '34–35', shoulder: '19' },
  { size: 'XL', chest: '42–43', waist: '36–37', shoulder: '20' },
  { size: 'XXL',chest: '44–45', waist: '38–39', shoulder: '21' },
];

const mapAnalysisToFields = (analysis: any) => ({
  gender: analysis.detectedGender?.toLowerCase() === 'men' ? 'men' : 'women',
  category: analysis.detectedGarment && analysis.detectedGarment !== 'Other' ? analysis.detectedGarment : '',
  subCategory: analysis.detectedSubCategory || '',
  occasion: analysis.detectedOccasion || '',
  feel: analysis.detectedFeel || '',
  colourMood: analysis.detectedColour || '',
  surfaces: analysis.detectedSurfaces || [],
});

const PillSelect = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(o => (
      <button
        key={o}
        onClick={() => onChange(o)}
        className={`px-3 py-1.5 rounded-full text-sm font-sans border transition-all ${
          value === o ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card text-foreground hover:border-accent/30'
        }`}
      >{o}</button>
    ))}
  </div>
);

const BriefPage = () => {
  const navigate = useNavigate();

  const [uploadData, setUploadData] = useState<any>(null);
  const [gender, setGender] = useState<'men' | 'women'>('women');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedFit, setSelectedFit] = useState('');
  const [selectedNeckline, setSelectedNeckline] = useState('');
  const [selectedSleeve, setSelectedSleeve] = useState('');
  const [selectedDupatta, setSelectedDupatta] = useState('');
  const [selectedLining, setSelectedLining] = useState('');
  const [selectedFeel, setSelectedFeel] = useState('');
  const [selectedFabricTypes, setSelectedFabricTypes] = useState<string[]>([]);
  const [selectedColourMood, setSelectedColourMood] = useState('');
  const [colourNote, setColourNote] = useState('');
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [selectedBlend, setSelectedBlend] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [fabricBudgetBand, setFabricBudgetBand] = useState('');
  const [ownFabric, setOwnFabric] = useState(false);
  const [ownFabricDescription, setOwnFabricDescription] = useState('');
  const [measurementType, setMeasurementType] = useState<'standard' | 'custom' | 'later'>('later');
  const [selectedStandardSize, setSelectedStandardSize] = useState('');
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [measureLaterConsent, setMeasureLaterConsent] = useState(false);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [budgetMin, setBudgetMin] = useState(5000);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderingFor, setOrderingFor] = useState<'self' | 'someone' | 'group' | ''>('');
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [groupSize, setGroupSize] = useState(2);
  const [activeSection, setActiveSection] = useState<'garment' | 'fabric' | 'measurements' | 'addons' | 'review'>('garment');
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewRegenerated, setPreviewRegenerated] = useState(false);
  const [previewSkipped, setPreviewSkipped] = useState(false);

  useEffect(() => {
    try {
      const payment = localStorage.getItem('naapio_payment');
      if (!payment || !JSON.parse(payment).otpVerified) {
        navigate('/new-order/payment');
        return;
      }
      const upload = localStorage.getItem('naapio_upload');
      if (upload) {
        const parsed = JSON.parse(upload);
        setUploadData(parsed);
        if (parsed.photoAnalysis?.analysisComplete && !parsed.photoAnalysis.analysisError) {
          const p = mapAnalysisToFields(parsed.photoAnalysis);
          setGender(p.gender as 'men' | 'women');
          if (p.category) setSelectedCategory(p.category);
          if (p.subCategory) setSelectedSubCategory(p.subCategory);
          if (p.occasion) setSelectedOccasion(p.occasion);
          if (p.feel) setSelectedFeel(p.feel);
          if (p.colourMood) setSelectedColourMood(p.colourMood);
          if (p.surfaces.length > 0) setSelectedSurfaces(p.surfaces);
        }
      }
    } catch {
      navigate('/new-order/payment');
    }
  }, [navigate]);

  const garmentConfig = useMemo(
    () => resolveGarmentMeasurementConfig(selectedCategory, selectedSubCategory),
    [selectedCategory, selectedSubCategory]
  );

  const completeness = useMemo(() => {
    let filled = 0; const total = 8;
    if (selectedCategory) filled++;
    if (selectedOccasion) filled++;
    if (selectedFit) filled++;
    if (selectedFeel) filled++;
    if (selectedColourMood) filled++;
    if (selectedSurfaces.length > 0) filled++;
    if (measurementType === 'later' ? measureLaterConsent : measurementType === 'standard' ? !!selectedStandardSize : Object.keys(measurements).length > 0) filled++;
    if (budgetMin > 0 && budgetMax > budgetMin && deliveryDate) filled++;
    return Math.round((filled / total) * 100);
  }, [selectedCategory, selectedOccasion, selectedFit, selectedFeel, selectedColourMood, selectedSurfaces, measurementType, measureLaterConsent, selectedStandardSize, measurements, budgetMin, budgetMax, deliveryDate]);

  const toggleArray = (arr: string[], v: string, setter: (a: string[]) => void, exclusive?: boolean) => {
    if (exclusive) { setter(arr.includes(v) ? [] : [v]); return; }
    if (arr.includes(v)) setter(arr.filter(x => x !== v));
    else setter([...arr.filter(x => x !== 'Plain / No Embellishment'), v]);
  };

  const handleSubmit = () => {
    if (completeness < 50) { toast.error("Please complete more of your brief before submitting"); return; }
    if (!budgetMin || !deliveryDate) { toast.error("Please set your budget and delivery date"); return; }
    const orderId = `NP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    localStorage.setItem('naapio_last_order', JSON.stringify({
      orderId,
      orderType: ownFabric ? 'Own Fabric' : 'New Order',
      garment: `${gender === 'women' ? "Women's" : "Men's"} · ${selectedCategory}${selectedSubCategory ? ' · ' + selectedSubCategory : ''}`,
      occasion: selectedOccasion, gender, selectedCategory, selectedSubCategory,
      selectedFit, selectedNeckline, selectedSleeve,
      selectedFeel, selectedColourMood, selectedSurfaces,
      fabricBudgetBand, selectedBlend, selectedBrand,
      budgetRange: [budgetMin, budgetMax], deliveryDate,
      ownFabric, ownFabricDescription,
      isGift, recipientName, isGroup, groupSize,
      inspirationPhoto: uploadData?.photoDataUrl || null,
      timestamp: new Date().toISOString(),
    }));
    localStorage.removeItem('naapio_upload');
    localStorage.removeItem('naapio_payment');
    toast.success("Brief posted to artisans!");
    navigate('/dashboard');
  };

  const categories = gender === 'men' ? menCategories : womenCategories;
  const sizes = gender === 'women' ? WOMEN_SIZES : MEN_SIZES;
  const hasPrefill = uploadData?.photoAnalysis?.analysisComplete && !uploadData?.photoAnalysis?.analysisError;

  return (
    <div className="min-h-screen bg-secondary">
      <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto max-w-3xl flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-serif font-bold text-lg text-foreground">Naapio</button>
          <p className="font-sans text-sm text-muted-foreground hidden sm:block">Step 3 of 3 — Review Your Brief</p>
        </div>
        <div className="container mx-auto max-w-3xl mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent" animate={{ width: `${completeness}%` }} transition={{ duration: 0.4 }} />
        </div>
        <p className="container mx-auto max-w-3xl text-xs text-muted-foreground font-sans text-right mt-1">{completeness}% complete</p>
      </div>

      {hasPrefill && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <p className="container mx-auto max-w-3xl font-sans text-sm text-amber-800">
            ✨ We've pre-filled your brief from your photo — review and adjust anything below.
          </p>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-3xl pb-32">
        {uploadData?.photoDataUrl && (
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border mb-6">
            <img src={uploadData.photoDataUrl} alt="Inspiration" className="w-14 h-14 object-cover rounded-lg" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Your inspiration</p>
              <p className="text-sm text-foreground truncate">{uploadData.description || uploadData.photoName}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1 mb-8">
          {[
            { id: 'garment', label: 'Garment Details' },
            { id: 'fabric', label: 'Fabric' },
            { id: 'measurements', label: 'Measurements' },
            { id: 'addons', label: 'Add-ons' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-full font-sans text-sm border transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-card text-foreground hover:border-accent/30'
              }`}
            >{tab.label}</button>
          ))}
        </div>

        {/* GARMENT DETAILS */}
        {activeSection === 'garment' && (
          <motion.div key="garment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {hasPrefill && selectedCategory && (
              <p className="text-xs text-amber-700">✨ Detected from your photo — confirm or change below</p>
            )}

            <div>
              <label className="font-sans font-semibold text-foreground block mb-3">Who is it for?</label>
              <div className="flex gap-3">
                {(['men', 'women'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => { setGender(g); setSelectedCategory(''); }}
                    className={`px-5 py-2.5 rounded-xl border font-sans text-sm ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground'}`}
                  >{g === 'men' ? "👔 Men's" : "👗 Women's"}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-sans font-semibold text-foreground block mb-3">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(''); }}
                    className={`rounded-xl border font-sans text-sm p-3 text-left transition-all ${
                      selectedCategory === cat ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                    }`}
                  >{cat}</button>
                ))}
              </div>
            </div>

            {selectedCategory && subCategories[selectedCategory] && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">Select style for {selectedCategory}</label>
                <PillSelect options={subCategories[selectedCategory]} value={selectedSubCategory} onChange={setSelectedSubCategory} />
              </div>
            )}

            <div>
              <label className="font-sans font-semibold text-foreground block mb-3">Occasion</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {occasions.map(o => (
                  <button
                    key={o.label}
                    onClick={() => setSelectedOccasion(o.label)}
                    className={`p-4 rounded-xl border font-sans text-sm text-left ${
                      selectedOccasion === o.label ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                    }`}
                  ><span className="mr-2">{o.emoji}</span>{o.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-sans font-semibold text-foreground block mb-3">Preferred fit</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {fitOptions.map(f => (
                  <button
                    key={f.label}
                    onClick={() => setSelectedFit(f.label)}
                    className={`p-4 rounded-xl border font-sans text-left ${
                      selectedFit === f.label ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                    }`}
                  >
                    <p className="text-sm font-semibold"><span className="mr-2">{f.emoji}</span>{f.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {showNeckline.includes(selectedCategory) && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">Neckline</label>
                <PillSelect options={necklineOptions} value={selectedNeckline} onChange={setSelectedNeckline} />
              </div>
            )}
            {showSleeve.includes(selectedCategory) && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">Sleeve</label>
                <PillSelect options={sleeveOptions} value={selectedSleeve} onChange={setSelectedSleeve} />
              </div>
            )}
            {showDupatta.includes(selectedCategory) && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">Dupatta</label>
                <PillSelect options={dupattaOptions} value={selectedDupatta} onChange={setSelectedDupatta} />
              </div>
            )}
            {showLining.includes(selectedCategory) && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">Lining</label>
                <PillSelect options={liningOptions} value={selectedLining} onChange={setSelectedLining} />
              </div>
            )}
          </motion.div>
        )}

        {/* FABRIC */}
        {activeSection === 'fabric' && (
          <motion.div key="fabric" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <label className="font-sans font-semibold text-foreground">I'm providing my own fabric</label>
              <Switch checked={ownFabric} onCheckedChange={setOwnFabric} />
            </div>

            {ownFabric ? (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">Describe your fabric</label>
                <Textarea value={ownFabricDescription} onChange={(e) => setOwnFabricDescription(e.target.value)} placeholder="e.g. 5m raw silk, red, purchased from Nalli — 44 inch wide" className="min-h-[120px] font-sans" />
              </div>
            ) : (
              <>
                <div>
                  <label className="font-sans font-semibold text-foreground block mb-3">How should the fabric feel?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {feelOptions.map(f => (
                      <button
                        key={f.label}
                        onClick={() => setSelectedFeel(f.label)}
                        className={`p-4 rounded-xl border text-left ${
                          selectedFeel === f.label ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                        }`}
                      >
                        <p className="font-sans text-sm font-semibold">{f.label}</p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedFeel && (
                  <div>
                    <label className="font-sans font-semibold text-foreground block mb-3">Which fabrics? (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {(fabricTypesByFeel[selectedFeel] || fabricTypesByFeel['No Preference']).map(ft => (
                        <button
                          key={ft}
                          onClick={() => toggleArray(selectedFabricTypes, ft, setSelectedFabricTypes)}
                          className={`px-3 py-1.5 rounded-full text-sm font-sans border ${
                            selectedFabricTypes.includes(ft) ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card'
                          }`}
                        >{ft}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-sans font-semibold text-foreground block mb-3">What colour?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {colourMoodOptions.map(cm => (
                      <button
                        key={cm.label}
                        onClick={() => setSelectedColourMood(cm.label)}
                        className={`p-4 rounded-xl border flex items-center gap-3 ${
                          selectedColourMood === cm.label ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                        }`}
                      >
                        {cm.swatch ? (
                          <span className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cm.swatch, border: '1px solid #ccc' }} />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">📎</span>
                        )}
                        <span className="font-sans text-sm text-left">{cm.label}</span>
                      </button>
                    ))}
                  </div>
                  {selectedColourMood && (
                    <Input value={colourNote} onChange={(e) => setColourNote(e.target.value)} placeholder="Any specific shade note?" className="font-sans mt-3" />
                  )}
                </div>

                <div>
                  <label className="font-sans font-semibold text-foreground block mb-3">Any embellishment?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {surfaceOptions.map(s => (
                      <button
                        key={s.label}
                        onClick={() => toggleArray(selectedSurfaces, s.label, setSelectedSurfaces, s.exclusive)}
                        className={`p-3 rounded-xl border text-left text-sm font-sans ${
                          selectedSurfaces.includes(s.label) ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                        }`}
                      >{s.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-sans font-semibold text-foreground block mb-3">Fabric blend</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {blendOptions.map(b => (
                      <button
                        key={b.label}
                        onClick={() => setSelectedBlend(b.label)}
                        className={`p-4 rounded-xl border text-left ${
                          selectedBlend === b.label ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                        }`}
                      >
                        <p className="font-sans text-sm font-semibold">{b.icon} {b.label}</p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-sans font-semibold text-foreground block mb-3">Preferred brand (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {brandOptions.map(b => (
                      <button
                        key={b}
                        onClick={() => toggleArray(selectedBrand, b, setSelectedBrand)}
                        className={`px-3 py-1.5 rounded-full text-sm font-sans border ${
                          selectedBrand.includes(b) ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card'
                        }`}
                      >{b}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-sans font-semibold text-foreground block mb-3">Fabric budget per metre</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {fabricBudgetOptions.map(fb => (
                      <button
                        key={fb.label}
                        onClick={() => setFabricBudgetBand(fb.label)}
                        className={`p-5 rounded-xl border-2 text-left ${
                          fabricBudgetBand === fb.label ? `${fb.accent} ring-2 ring-accent/30` : `border-border bg-card hover:${fb.accent}`
                        }`}
                      >
                        <p className="font-sans font-semibold">{fb.label}</p>
                        <p className="font-sans text-sm text-foreground mt-1">{fb.range}</p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">{fb.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* MEASUREMENTS */}
        {activeSection === 'measurements' && (
          <motion.div key="measurements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {garmentConfig.noStitching ? (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-sans text-sm text-amber-800">{garmentConfig.noStitchingMessage}</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap">
                  {garmentConfig.supportsStandard && (
                    <button
                      onClick={() => setMeasurementType('standard')}
                      className={`px-4 py-2 rounded-full font-sans text-sm ${measurementType === 'standard' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
                    >📐 Standard Size</button>
                  )}
                  <button
                    onClick={() => setMeasurementType('custom')}
                    className={`px-4 py-2 rounded-full font-sans text-sm ${measurementType === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
                  >✏️ Custom</button>
                  <button
                    onClick={() => setMeasurementType('later')}
                    className={`px-4 py-2 rounded-full font-sans text-sm ${measurementType === 'later' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
                  >⏱ Provide Later</button>
                </div>

                {measurementType === 'standard' && garmentConfig.supportsStandard && (
                  <div className="overflow-x-auto bg-card rounded-xl border border-border">
                    <table className="w-full text-sm font-sans">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(sizes[0]).map(k => (
                            <th key={k} className="p-3 text-left capitalize">{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sizes.map((row: any) => (
                          <tr
                            key={row.size}
                            onClick={() => setSelectedStandardSize(row.size)}
                            className={`cursor-pointer hover:bg-muted/50 border-t border-border ${selectedStandardSize === row.size ? 'bg-gold-light' : ''}`}
                          >
                            {Object.values(row).map((v: any, i) => (
                              <td key={i} className="p-3">{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {measurementType === 'custom' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {garmentConfig.fields.map(field => (
                        <div key={field.field}>
                          <label className="text-sm font-sans font-medium text-foreground block mb-1">{field.description}</label>
                          <Input
                            type="number"
                            value={measurements[field.field] || ''}
                            onChange={(e) => setMeasurements(prev => ({ ...prev, [field.field]: e.target.value }))}
                            placeholder={field.tip}
                            className="font-sans"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-start gap-2">
                        <Checkbox id="c1" checked={consent1} onCheckedChange={(v) => setConsent1(!!v)} />
                        <label htmlFor="c1" className="text-xs font-sans text-muted-foreground cursor-pointer">I consent to storing my body measurements securely for order fulfillment (DPDP Act).</label>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox id="c2" checked={consent2} onCheckedChange={(v) => setConsent2(!!v)} />
                        <label htmlFor="c2" className="text-xs font-sans text-muted-foreground cursor-pointer">I understand measurements are only shared with the accepted artisan.</label>
                      </div>
                    </div>
                  </div>
                )}

                {measurementType === 'later' && (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="font-sans text-sm text-amber-800 mb-3">
                      We'll send a WhatsApp link after you post your brief. You can add measurements anytime before the artisan starts cutting.
                    </p>
                    <div className="flex items-start gap-2">
                      <Checkbox id="cl" checked={measureLaterConsent} onCheckedChange={(v) => setMeasureLaterConsent(!!v)} />
                      <label htmlFor="cl" className="text-xs font-sans text-amber-900 cursor-pointer">I'll provide measurements before production begins.</label>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ADD-ONS */}
        {activeSection === 'addons' && (
          <motion.div key="addons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <label className="font-sans font-semibold text-foreground block mb-3">Who is this for?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'self', label: '👤 For Myself', desc: 'You are the wearer' },
                  { id: 'someone', label: '🎁 For Someone Else', desc: 'Gift or recipient' },
                  { id: 'group', label: '👯 Group Order', desc: 'Bridesmaids / squad' },
                ].map(o => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setOrderingFor(o.id as any);
                      setIsGift(o.id === 'someone');
                      setIsGroup(o.id === 'group');
                    }}
                    className={`p-4 rounded-xl border text-left ${
                      orderingFor === o.id ? 'border-accent bg-gold-light ring-2 ring-accent/30' : 'border-border bg-card hover:border-accent/30'
                    }`}
                  >
                    <p className="font-sans font-semibold text-sm">{o.label}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1">{o.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {orderingFor === 'someone' && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-2">Recipient's name</label>
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Full name" className="font-sans" />
                <p className="text-xs text-muted-foreground font-sans mt-2">We'll WhatsApp them for measurements</p>
              </div>
            )}

            {orderingFor === 'group' && (
              <div>
                <label className="font-sans font-semibold text-foreground block mb-3">How many pieces?</label>
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      onClick={() => setGroupSize(n)}
                      className={`px-4 py-2 rounded-full font-sans text-sm border ${groupSize === n ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card'}`}
                    >{n}</button>
                  ))}
                  <button onClick={() => setGroupSize(10)} className={`px-4 py-2 rounded-full font-sans text-sm border ${groupSize === 10 ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card'}`}>7–10</button>
                  <button onClick={() => setGroupSize(15)} className={`px-4 py-2 rounded-full font-sans text-sm border ${groupSize === 15 ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card'}`}>10+</button>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-3">Same design, individual measurements. Shareable measurement link generated after posting.</p>
                <div className="p-3 bg-muted/50 rounded-xl mt-3">
                  <p className="text-xs font-sans">Artisans will bid per piece. Total = per-piece bid × quantity</p>
                </div>
              </div>
            )}

            <div>
              <label className="font-sans font-semibold text-foreground block mb-3">Your budget (all-inclusive)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-sans block mb-1">Min ₹</label>
                  <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="font-sans" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-sans block mb-1">Max ₹</label>
                  <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="font-sans" />
                </div>
              </div>
            </div>

            <div>
              <label className="font-sans font-semibold text-foreground block mb-2">Delivery date</label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
                className="font-sans"
              />
            </div>
          </motion.div>
        )}

        {/* SUBMIT */}
        <div className="mt-10 space-y-4">
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between mb-2">
              <span className="font-sans text-sm font-semibold">Brief completeness</span>
              <span className="font-sans text-sm">{completeness}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-accent" animate={{ width: `${completeness}%` }} transition={{ duration: 0.4 }} />
            </div>
            {completeness < 80 ? (
              <p className="text-xs text-muted-foreground font-sans mt-2">Complete more sections for better quality bids</p>
            ) : (
              <p className="text-xs text-success font-sans mt-2">✓ Great brief — ready to post</p>
            )}
          </div>

          <Button
            variant="gold"
            size="hero"
            className="w-full"
            onClick={handleSubmit}
            disabled={completeness < 50 || !budgetMin || !deliveryDate}
          >
            Post Brief to Artisans →
          </Button>

          <p className="text-xs text-muted-foreground font-sans text-center">
            🔒 Your ₹450 is held in escrow. Released only at your final approval.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border p-4 sm:static sm:mt-4 sm:pt-6">
        <div className="container mx-auto max-w-3xl">
          <Button variant="outline" onClick={() => navigate('/new-order/payment')}>
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BriefPage;
