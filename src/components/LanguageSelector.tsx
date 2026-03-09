import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, X, ChevronDown } from "lucide-react";

const languages = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
];

interface LanguageSelectorProps {
  variant?: "header" | "mobile" | "hero";
}

const LanguageSelector = ({ variant = "header" }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("naapio_language", code);
    setOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="w-full">
        <p className="text-xs text-muted-foreground font-sans mb-2">Language</p>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-sans transition-colors ${
                i18n.language === lang.code
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="font-medium">{lang.nativeLabel}</span>
              {lang.code !== "en" && (
                <span className="text-muted-foreground text-xs ml-1">{lang.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-xs font-medium">{current.code}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-sans hover:bg-muted/50 transition-colors"
            >
              <div>
                <span className="font-medium text-foreground">{lang.nativeLabel}</span>
                {lang.code !== "en" && (
                  <span className="text-muted-foreground text-xs ml-2">{lang.label}</span>
                )}
              </div>
              {i18n.language === lang.code && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const TranslationBanner = () => {
  const { i18n } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (i18n.language === "en" || dismissed) return null;

  const current = languages.find((l) => l.code === i18n.language);

  return (
    <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
      <div className="container mx-auto px-6 py-2 flex items-center justify-between gap-4">
        <p className="font-sans text-xs text-amber-800 dark:text-amber-300">
          {current?.nativeLabel} translation coming soon — showing English for now.
          Want to help translate? contact@naapio.in
        </p>
        <button onClick={() => setDismissed(true)} className="shrink-0 p-1 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded">
          <X className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
