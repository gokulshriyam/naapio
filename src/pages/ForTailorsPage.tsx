import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Scissors,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Gavel,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import SiteFooter from "@/components/home/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import forTailorsHero from "@/assets/for-tailors-hero.jpg";


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const problems = [
  {
    title: "No structured income",
    body: "Seasonal, unpredictable, dependent on foot traffic alone.",
  },
  {
    title: "No payment protection",
    body: "Agents and middlemen take a cut. Payment delays are the norm, not the exception.",
  },
  {
    title: "No digital identity",
    body: "Decades of skill, with no record, no reputation score, no way to prove it to a new customer.",
  },
];

const changes = [
  {
    title: "Escrow-guaranteed payment",
    body: "You get paid. Every time. No chasing.",
    icon: ShieldCheck,
  },
  {
    title: "Blind bidding",
    body: "You set your own price. Customers see your bid, not your name — pricing stays honest.",
    icon: Gavel,
  },
  {
    title: "Verified digital identity",
    body: "Every completed order builds a reputation score and order history that's yours.",
    icon: BadgeCheck,
  },
];

const joinSteps = [
  { n: "01", title: "Apply", body: "Share your craft speciality and location." },
  { n: "02", title: "Verify", body: "Identity check, skill assessment, portfolio review." },
  { n: "03", title: "Start bidding", body: "See open customer briefs in your city immediately." },
];

const craftCategories = [
  "Tailors",
  "Embroiderers",
  "Zari & Zardozi artisans",
  "Mirror & shisha workers",
  "Hand painters & fabric artists",
  "Block & screen printers",
  "Sequin & beadwork specialists",
  "Weavers",
  "Kalamkari artists",
  "Alteration specialists",
];

const faqs = [
  {
    q: "How does bidding actually work?",
    a: "Customers post a brief with their budget range. You see the brief and the range, then submit your own price along with your portfolio. Bidding is blind — customers see your work and reputation, not your name — so pricing stays fair on both sides.",
  },
  {
    q: "What happens if a customer cancels after I accept?",
    a: "The customer's payment is held in escrow the moment you accept. If they cancel after work has begun, you're compensated for the completed milestones per our cancellation policy — you're never left unpaid for work you've done.",
  },
  {
    q: "How are disputes handled?",
    a: "Every order runs through 5 tracked milestones with customer approval at each stage. If a disagreement arises, our resolution team reviews the milestone evidence within 24 hours and mediates a fair outcome — with escrow protection in the meantime.",
  },
  {
    q: "What's the platform's commission?",
    a: "A flat 20% commission on each completed order covers payment protection, customer acquisition, verification and dispute resolution. No listing fees, no monthly subscription, no hidden charges.",
  },
  {
    q: "When exactly do I get paid?",
    a: "Payment for each milestone is released to your account within 7 days of the customer approving that milestone. No chasing, no delays — the escrow releases automatically.",
  },
];

const ForTailorsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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

  const scrollToForm = () =>
    document.getElementById("express-interest")?.scrollIntoView({ behavior: "smooth" });

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
      <SiteNavbar />

      {/* ======== SECTION 1 — HERO ======== */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-foreground">
        <img
          src={forTailorsHero}
          alt="Artisan workspace"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-25"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container mx-auto px-6 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 text-white/70 font-sans font-medium tracking-[0.2em] uppercase text-xs mb-8">
              <Scissors className="w-4 h-4" /> For Artisans
            </span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-serif text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-8 max-w-3xl"
          >
            Your craft deserves more than walk-in customers.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="font-sans text-white/70 text-lg max-w-xl mb-10 leading-relaxed"
          >
            Naapio is building the payment and reputation infrastructure India's artisans have never had.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button variant="gold" size="hero" onClick={scrollToForm}>
              Apply as an Artisan
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ======== SECTION 2 — THE PROBLEM ======== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-xs text-muted-foreground uppercase tracking-[0.25em] mb-6"
          >
            The problem, named plainly
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border pt-12">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {p.title}
                </h3>
                <p className="font-sans text-base text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SECTION 3 — WHAT CHANGES ======== */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <p className="font-sans text-xs text-accent uppercase tracking-[0.25em] mb-4">
              What changes on Naapio
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Infrastructure. Not intermediaries.
            </h2>
          </motion.div>

          <div className="space-y-6">
            {changes.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center bg-card rounded-2xl border border-border p-8 md:p-10"
                >
                  <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-12 h-12 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                      {c.title}
                    </h3>
                    <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======== SECTION 4 — FAIR PRICING ======== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            You set the price. The customer sees your work, not just a number.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-lg text-muted-foreground leading-relaxed"
          >
            Walk-in negotiations put you at a disadvantage — no way to prove your price is fair, no way to stand out from a lower bid down the street. On Naapio, customers see your portfolio and reputation alongside your price, so good work can win on more than just being the cheapest option.
          </motion.p>
        </div>
      </section>

      {/* ======== SECTION 5 — HOW JOINING WORKS ======== */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <p className="font-sans text-xs text-accent uppercase tracking-[0.25em] mb-4">
              How joining works
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Three steps. That's it.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {joinSteps.map((s, i) => (
              <motion.div
                key={s.n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="border-t-2 border-accent pt-6"
              >
                <span className="font-serif text-5xl font-bold text-accent block mb-4">
                  {s.n}
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {s.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SECTION 6 — CRAFT CATEGORIES WELCOME ======== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10"
          >
            Every craft tradition has a place here — not just stitching.
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3">
            {craftCategories.map((cat, i) => (
              <motion.span
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-secondary border border-border font-sans text-sm text-foreground"
              >
                {cat}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SECTION 7 — FAQ ======== */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12"
          >
            Questions artisans ask us
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={f.q}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-serif font-bold text-foreground text-lg">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1 font-sans text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SECTION 8 — CLOSING CTA ======== */}
      <section className="py-24 bg-foreground text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-white mb-8 leading-tight"
          >
            Ready to build a reputation that follows you?
          </motion.h2>
          <Button variant="gold" size="hero" onClick={scrollToForm}>
            Apply as an Artisan →
          </Button>
        </div>
      </section>

      {/* ======== EXPRESS INTEREST FORM ======== */}
      <section id="express-interest" className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-3">
              Tell us about your craft
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
                    <SelectGroup>
                      <SelectLabel>Women's Garments</SelectLabel>
                      <SelectItem value="saree-blouse">Saree Blouse</SelectItem>
                      <SelectItem value="lehenga-bridal">Lehenga &amp; Bridal Lehenga</SelectItem>
                      <SelectItem value="salwar-anarkali">Salwar Kameez &amp; Anarkali</SelectItem>
                      <SelectItem value="kurti-coord">Kurti &amp; Co-ord Sets</SelectItem>
                      <SelectItem value="gown-evening">Gown &amp; Evening Wear</SelectItem>
                      <SelectItem value="saree-nauvari">Saree Draping &amp; Nauvari</SelectItem>
                      <SelectItem value="chaniya-choli">Chaniya Choli</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Men's Garments</SelectLabel>
                      <SelectItem value="sherwani-bandhgala">Sherwani &amp; Bandhgala</SelectItem>
                      <SelectItem value="kurta-nehru">Kurta &amp; Nehru Jacket</SelectItem>
                      <SelectItem value="suit-blazer">Suit, Blazer &amp; Formal Shirt</SelectItem>
                      <SelectItem value="trousers-formal">Trousers &amp; Formal Wear</SelectItem>
                      <SelectItem value="veshti-dhoti">Veshti / Dhoti / Mundu</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Alterations &amp; Repairs</SelectLabel>
                      <SelectItem value="alterations">Alterations (All Types)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Kids</SelectLabel>
                      <SelectItem value="kids-coming-soon" disabled>Kids' Wear (Launching Soon)</SelectItem>
                    </SelectGroup>
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

      <SiteFooter />
    </div>
  );
};

export default ForTailorsPage;
