import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SiteFooter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">{t('footer.services')}</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors">{t('nav.howItWorks')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors">{t('footer.categories')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/alteration")}>{t('footer.alteration')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/customise")}>{t('footer.customise')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">{t('footer.company')}</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/for-tailors")}>{t('footer.forTailors')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => { const el = document.getElementById('faq'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else navigate('/'); }}>{t('footer.faq')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/terms")}>{t('footer.terms')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/privacy")}>{t('footer.privacy')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wide text-primary-foreground/80">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-primary-foreground/60 font-sans text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors" onClick={() => navigate("/wizard")}>{t('footer.regional')}</li>
              <li className="hover:text-accent cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Careers</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/40 font-sans text-sm">
          {t('footer.rights')} Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
