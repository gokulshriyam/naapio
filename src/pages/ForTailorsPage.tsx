import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  IndianRupee,
  Package,
  Star,
  ClipboardCheck,
  Scissors,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import SiteFooter from "@/components/home/SiteFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const benefits = [
  {
    icon: IndianRupee,
    title: "Earn More, Guaranteed",
    description:
      "Earn ₹60,000/month on just 5 orders. That's 3× the average tailor street income of ₹20,000. Every rupee is held in escrow and released to you on time — no chasing customers for payment.",
  },
  {
    icon: Package,
    title: "Zero Customer Acquisition",
    description:
      "No need to find clients, advertise, or negotiate. Naapio brings verified customers with confirmed budgets directly to you through our bid room.",
  },
  {
    icon: Star,
    title: "Grow Your Reputation",
    description:
      "Build a verified review profile that only grows with every completed order. Top-rated Gold Tier tailors get priority leads, co-marketing features, and a dedicated account manager.",
  },
];

const steps = [
  {
    icon: ClipboardCheck,
    title: "Apply & Get Verified",
    description:
      "Submit your details, complete Aadhaar KYC, and pass a workspace inspection.",
  },
  {
    icon: Scissors,
    title: "Receive Order Requests",
    description:
      "Browse incoming customer RFQs and place your bid.",
  },
  {
    icon: ShieldCheck,
    title: "Stitch & Hit Milestones",
    description:
      "Complete the order in 5 tracked milestones; customer approves each stage.",
  },
  {
    icon: Landmark,
    title: "Get Paid",
    description:
      "Payment released within 7 days of delivery. No delays, no disputes left hanging.",
  },
];

const tierData = [
  {
    tier: "Bronze",
    color: "bg-amber-700/20 text-amber-800 dark:text-amber-400",
    badge: "🥉",
    criteria: "All new tailors",
    benefits: [
      "Full platform access",
      "Standard T+7 payout",
      "Community support",
    ],
  },
  {
    tier: "Silver",
    color: "bg-slate-300/30 text-slate-700 dark:text-slate-300",
    badge: "🥈",
    criteria: "10+ orders, 3.8★ rating",
    benefits: [
      "Priority placement in bid room",
      "Faster T+5 payout",
      "Profile badge & trust seal",
    ],
  },
  {
    tier: "Gold",
    color: "bg-accent/20 text-accent",
    badge: "🥇",
    criteria: "20+ orders, 4.2★ rating",
    benefits: [
      "Fabric advance facility",
      "Dedicated account manager",
      "Co-marketing on Naapio campaigns",
    ],
  },
];

const specialisations = [
  "Bridal Wear",
  "Salwar / Kameez",
  "Saree Blouse",
  "Formals",
  "Kids Wear",
  "Other",
];

const ForTailorsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    city: "",
    experience: "",
    specialisation: "",
    worksWithBoutiques: false,
    message: "",
  });

  const isValid =
    formData.fullName.trim().length > 0 &&
    formData.mobile.trim().length >= 10 &&
    formData.city.trim().length > 0 &&
    formData.experience.trim().length > 0 &&
    formData.specialisation.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
    toast({
      title: "Interest submitted!",
      description: "Our team will reach out within 2 business days.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">
              Naapio
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-muted-foreground">
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/#categories" className="hover:text-foreground transition-colors">Categories</a>
            <a href="/for-tailors" className="text-foreground font-medium">For Tailors</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Login
            </Button>
            <Button variant="gold" size="sm" onClick={() => navigate("/wizard")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ======== HERO ======== */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* decorative thread motif */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(120deg, hsl(var(--accent)) 0px, transparent 1px, transparent 60px)",
          }}
        />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 text-accent font-sans font-medium tracking-wide uppercase text-sm mb-6">
              <Scissors className="w-4 h-4" /> For Master Tailors & Artisans
            </span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight mb-6 max-w-4xl mx-auto"
          >
            Turn Your Craft Into a{" "}
            <span className="text-accent italic">Thriving Business</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join Naapio and earn 3× more than street income — with guaranteed
            payments, zero marketing effort, and customers who value your skill.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button
              variant="gold"
              size="hero"
              onClick={() =>
                document
                  .getElementById("express-interest")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Express Interest to Join
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ======== WHY JOIN ======== */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-16"
          >
            Why Join Naapio?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <b.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                  {b.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-16"
          >
            How It Works for Tailors
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5">
                  <s.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
                <div className="text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== TIER TABLE ======== */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-4"
          >
            Tailor Tier Benefits
          </motion.h2>
          <p className="text-center text-muted-foreground font-sans mb-16 max-w-lg mx-auto">
            Grow through the ranks — every order you complete takes you closer to
            Gold.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {tierData.map((t, i) => (
              <motion.div
                key={t.tier}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`rounded-2xl p-8 border border-border bg-card ${
                  t.tier === "Gold" ? "ring-2 ring-accent shadow-lg" : "shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{t.badge}</span>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-foreground">
                      {t.tier} Tier
                    </h3>
                    <span className="text-sm text-muted-foreground font-sans">
                      {t.criteria}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mt-6">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm font-sans text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== EXPRESS INTEREST FORM ======== */}
      <section id="express-interest" className="py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-3">
              Ready to Join? Tell Us About Yourself
            </h2>
            <p className="text-center text-muted-foreground font-sans mb-12">
              Fill in the form and our team will reach out within 2 business days.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl border border-accent/30 p-12 text-center shadow-sm"
            >
              <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                Thank You!
              </h3>
              <p className="text-muted-foreground font-sans">
                Our team will reach out within 2 business days. We're excited to
                have you on board.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Your name"
                    maxLength={100}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, fullName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    placeholder="10-digit mobile"
                    maxLength={15}
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        mobile: e.target.value.replace(/[^0-9+\- ]/g, ""),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City / Location *</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Jaipur"
                    maxLength={100}
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, city: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    placeholder="e.g. 8"
                    maxLength={3}
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        experience: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specialisation *</Label>
                <Select
                  value={formData.specialisation}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, specialisation: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialisations.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
                <Label htmlFor="boutique" className="cursor-pointer font-sans text-sm text-foreground">
                  Do you currently work with boutiques or bridal stores?
                </Label>
                <Switch
                  id="boutique"
                  checked={formData.worksWithBoutiques}
                  onCheckedChange={(c) =>
                    setFormData((p) => ({ ...p, worksWithBoutiques: c }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Brief Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us a bit about your workshop, team size, or anything else…"
                  maxLength={1000}
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={!isValid}
              >
                Submit My Interest
              </Button>
            </motion.form>
          )}
        </div>
      </section>

      {/* ======== DIVIDER ======== */}
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 my-0">
          <div className="flex-1 border-t border-border" />
          <span className="text-muted-foreground font-sans text-sm">or</span>
          <div className="flex-1 border-t border-border" />
        </div>
      </div>

      {/* ======== ARTISAN SECTION ======== */}
      <ArtisanSection />

      <SiteFooter />
    </div>
  );
};

/* ═══════════════════════════════════════ */
/*  Artisan / Embroiderer Interest Section */
/* ═══════════════════════════════════════ */

const artisanCraftOptions = [
  "Embroidery / Thread Work",
  "Zari / Zardozi",
  "Mirror Work / Shisha",
  "Hand Painting / Fabric Art",
  "Block / Screen Printing",
  "Sequins & Beadwork",
  "Digital / Heat Transfer Print",
  "Other",
];

const craftShowcase = [
  { emoji: "🪡", label: "Embroidery & Thread Work" },
  { emoji: "✨", label: "Zari / Zardozi" },
  { emoji: "🎨", label: "Hand Painting" },
  { emoji: "🖨️", label: "Block & Screen Printing" },
  { emoji: "💎", label: "Sequins & Beadwork" },
];

const artisanBenefits = [
  {
    emoji: "🎨",
    title: "Your craft, on your terms",
    body: "Receive customisation briefs that match your speciality. Bid only on work you want to take.",
  },
  {
    emoji: "🔒",
    title: "Guaranteed payment",
    body: "Same escrow protection as our tailor network. Payment released when the customer approves your work.",
  },
  {
    emoji: "📈",
    title: "Build your reputation",
    body: "Every completed order adds a verified review to your profile. Better reviews mean more visibility and higher-value briefs.",
  },
];

const ArtisanSection = () => {
  const { toast } = useToast();
  const [artisanName, setArtisanName] = useState("");
  const [artisanCrafts, setArtisanCrafts] = useState<string[]>([]);
  const [artisanCraftOther, setArtisanCraftOther] = useState("");
  const [artisanCity, setArtisanCity] = useState("");
  const [artisanPhone, setArtisanPhone] = useState("");
  const [artisanSubmitted, setArtisanSubmitted] = useState(false);

  const toggleCraft = (craft: string) => {
    setArtisanCrafts((prev) =>
      prev.includes(craft) ? prev.filter((c) => c !== craft) : [...prev, craft]
    );
  };

  const isArtisanValid =
    artisanName.trim().length > 0 &&
    artisanCrafts.length > 0 &&
    (!artisanCrafts.includes("Other") || artisanCraftOther.trim().length > 0) &&
    artisanCity.trim().length > 0 &&
    /^\d{10}$/.test(artisanPhone.replace(/\s/g, ""));

  const handleArtisanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isArtisanValid) return;
    setArtisanSubmitted(true);
    setArtisanName("");
    setArtisanCrafts([]);
    setArtisanCraftOther("");
    setArtisanCity("");
    setArtisanPhone("");
    toast({
      title: "Thanks! We'll be in touch when we launch in your city. 🎨",
    });
  };

  return (
    <section className="py-24" style={{ backgroundColor: "#F0EBF9" }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-sans font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">
            Also Looking For
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Embroiderers, Artisans &amp; Painters
          </h2>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            We're building a dedicated artisan network for our 'Customise My Garment'
            order type. If you do embroidery, zari work, hand painting, block printing,
            or any fabric art — we want to hear from you.
          </p>
        </motion.div>

        {/* Craft Showcase Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {craftShowcase.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border text-sm font-sans text-foreground min-h-[44px]"
            >
              <span>{c.emoji}</span> {c.label}
            </span>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {artisanBenefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border"
            >
              <div className="text-3xl mb-4">{b.emoji}</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {b.title}
              </h3>
              <p className="text-muted-foreground font-sans leading-relaxed">
                {b.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Interest Registration Form */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
              Register your interest
            </h3>
            <p className="text-muted-foreground font-sans">
              We'll reach out when the artisan network launches in your city.
            </p>
          </motion.div>

          {artisanSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl border border-purple-300 p-12 text-center shadow-sm"
            >
              <CheckCircle2 className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                Thanks! We'll be in touch when we launch in your city. 🎨
              </h3>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleArtisanSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm space-y-6"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="artisanName">Your name *</Label>
                <Input
                  id="artisanName"
                  placeholder="Full name"
                  maxLength={100}
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                />
              </div>

              {/* Craft Type - Multi-select pills */}
              <div className="space-y-2">
                <Label>Your craft *</Label>
                <div className="flex flex-wrap gap-2">
                  {artisanCraftOptions.map((craft) => (
                    <button
                      key={craft}
                      type="button"
                      onClick={() => toggleCraft(craft)}
                      className={`px-4 py-2.5 rounded-full text-sm font-sans border transition-all min-h-[44px] ${
                        artisanCrafts.includes(craft)
                          ? "bg-purple-100 border-purple-400 text-purple-800 dark:bg-purple-900/30 dark:border-purple-500 dark:text-purple-300"
                          : "bg-card border-border text-foreground hover:border-purple-300"
                      }`}
                    >
                      {artisanCrafts.includes(craft) && (
                        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      )}
                      {craft}
                    </button>
                  ))}
                </div>
                {artisanCrafts.includes("Other") && (
                  <Input
                    placeholder="Describe your craft"
                    maxLength={200}
                    value={artisanCraftOther}
                    onChange={(e) => setArtisanCraftOther(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="artisanCity">Your city *</Label>
                <Input
                  id="artisanCity"
                  placeholder="e.g. Bangalore, Chennai, Mumbai"
                  maxLength={100}
                  value={artisanCity}
                  onChange={(e) => setArtisanCity(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="artisanPhone">Phone number *</Label>
                <Input
                  id="artisanPhone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={artisanPhone}
                  onChange={(e) =>
                    setArtisanPhone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!isArtisanValid}
              >
                Register My Interest
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForTailorsPage;
