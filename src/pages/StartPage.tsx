import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useCity } from "@/context/CityContext";
import startNewOrder from "@/assets/categories/start-new-order.jpg";
import startAlteration from "@/assets/categories/start-alteration.jpg";

const StartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { selectedCity } = useCity();
  const [prefilledCategory, setPrefilledCategory] = useState<string>('');
  const [showExistingOptions, setShowExistingOptions] = useState(false);

  useEffect(() => {
    const state = location.state as { prefilledGender?: string; prefilledCategory?: string } | null;
    if (state?.prefilledCategory) {
      localStorage.setItem('naapio_prefill', JSON.stringify({
        gender: state.prefilledGender || 'Women',
        category: state.prefilledCategory,
        orderType: 'New Order'
      }));
      setPrefilledCategory(state.prefilledCategory);
    }
  }, [location.state]);

  const isCitySelected = !!selectedCity;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      <button
        onClick={() => navigate("/")}
        className="self-start mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        ← {t('common.back')}
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
          What would you like made?
        </h1>
        <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
          New creation, or bringing something back to life?
        </p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl transition-opacity ${!isCitySelected ? "opacity-50 pointer-events-none" : ""}`}>
        <button
          onClick={() => { if (isCitySelected) navigate('/new-order/upload'); }}
          className={`border-2 rounded-2xl overflow-hidden text-left transition-all duration-200 bg-blue-50 border-blue-200 hover:border-blue-400 ${isCitySelected ? "hover:shadow-lg hover:scale-[1.02]" : "cursor-not-allowed"}`}
        >
          <img
            src={startNewOrder}
            alt="New bespoke order — designer draping fabric on mannequin"
            className="w-full h-48 object-cover object-top rounded-t-xl"
          />
          <div className="p-6 pt-4">
            <div className="text-3xl mb-3">🆕</div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">New Garment</h2>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Make something from scratch — upload your inspiration, AI builds the brief, artisans bid honest prices.
            </p>
          </div>
        </button>

        <button
          onClick={() => { if (isCitySelected) setShowExistingOptions(!showExistingOptions); }}
          className={`border-2 rounded-2xl overflow-hidden text-left transition-all duration-200 bg-orange-50 border-orange-200 hover:border-orange-400 ${isCitySelected ? "hover:shadow-lg hover:scale-[1.02]" : "cursor-not-allowed"}`}
        >
          <img
            src={startAlteration}
            alt="Alteration and repair — tailor working on sewing machine"
            className="w-full h-48 object-cover rounded-t-xl"
            loading="lazy"
          />
          <div className="p-6 pt-4">
            <div className="text-3xl mb-3">✂️</div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">Existing Garment</h2>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Alter, repair, or add artwork to something you already own.
            </p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {showExistingOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-6 overflow-hidden"
          >
            <button
              onClick={() => navigate('/alteration')}
              className="flex items-center gap-4 p-5 rounded-xl border-2 border-orange-200 bg-white hover:border-orange-400 hover:shadow-md cursor-pointer transition-all w-full text-left"
            >
              <span className="text-3xl">✂️</span>
              <div>
                <p className="font-serif font-bold text-foreground">Alteration / Repair</p>
                <p className="text-xs font-sans text-muted-foreground mt-0.5">Resize, fix, or restore an existing garment</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/customise')}
              className="flex items-center gap-4 p-5 rounded-xl border-2 border-purple-200 bg-white hover:border-purple-400 hover:shadow-md cursor-pointer transition-all w-full text-left"
            >
              <span className="text-3xl">🎨</span>
              <div>
                <p className="font-serif font-bold text-foreground">Customise My Garment</p>
                <p className="text-xs font-sans text-muted-foreground mt-0.5">Add embroidery, artwork, or embellishments to an existing piece</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {prefilledCategory && (
        <p className="text-sm text-accent font-sans mt-4">Starting with {prefilledCategory} pre-selected ✓</p>
      )}

      {!isCitySelected && (
        <p className="text-sm text-muted-foreground font-sans mt-6">
          📍 {t('start.selectCityPrompt')}
        </p>
      )}
    </div>
  );
};

export default StartPage;
