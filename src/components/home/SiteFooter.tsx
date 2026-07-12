import { useNavigate } from "react-router-dom";
import naapioLogo from "@/assets/naapio-logo.png";

const SiteFooter = () => {
  const navigate = useNavigate();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/');
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1 — Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={naapioLogo} alt="Naapio" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xl font-serif font-bold">Naapio</span>
            </div>
            <p className="text-primary-foreground/60 font-sans text-sm leading-relaxed">
              India's premier marketplace for bespoke custom tailoring. See it. Stitch it.
            </p>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">Explore</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => scrollToId('how-it-works')}>How It Works</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => scrollToId('categories')}>Categories</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/our-story')}>Our Naapio Story</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/for-tailors')}>For Tailors</li>
            </ul>
          </div>

          {/* Column 3 — Order Types */}
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">Order Types</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/start')}>New Order</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/alteration')}>Alteration &amp; Repair</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/customise')}>Customise My Garment</li>
            </ul>
          </div>

          {/* Column 4 — Company */}
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">Company</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => scrollToId('faq')}>FAQ</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/careers')}>Careers</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/terms')}>Terms &amp; Conditions</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/privacy')}>Privacy Policy</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/refund')}>Refund Policy</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate('/cancellation')}>Cancellation Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/40 font-sans text-sm">
          © 2026 Naapio. All rights reserved. Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
