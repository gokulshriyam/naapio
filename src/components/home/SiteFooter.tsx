import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SiteFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">Naapio</span>
            </div>
            <p className="text-primary-foreground/60 font-sans text-sm leading-relaxed">
              India's premier marketplace for bespoke custom tailoring. See it. Stitch it.
            </p>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">For Customers</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors">How It Works</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Browse Categories</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/alteration")}>Alteration &amp; Repair</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/customise")}>Customise Your Garment</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Help Centre</li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">For Tailors</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors">Join as Vendor</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Vendor Dashboard</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Tier System</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">Categories</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/wizard")}>Regional Garments</li>
              <li className="hover:text-accent cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Terms of Service</li>
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
