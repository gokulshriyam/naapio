import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCity } from "@/context/CityContext";

const StartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { selectedCity } = useCity();
  const [prefilledCategory, setPrefilledCategory] = useState<string>('');

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

  const orderTypes = [
    {
      emoji: "🆕",
      title: t('start.newOrder'),
      description: t('start.newOrderDesc'),
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      route: "/wizard",
      img: "https://source.unsplash.com/featured/?indian+woman+ethnic+fashion+fabric&1002",
    },
    {
      emoji: "✂️",
      title: t('start.alteration'),
      description: t('start.alterationDesc'),
      color: "bg-orange-50 border-orange-200 hover:border-orange-400",
      route: "/alteration",
      img: "https://source.unsplash.com/featured/?tailor+sewing+mannequin+workshop&1003",
    },
    {
      emoji: "🧵",
      title: t('start.ownFabric'),
      description: t('start.ownFabricDesc'),
      color: "bg-green-50 border-green-200 hover:border-green-400",
      route: "/wizard?type=own-fabric",
      img: "https://source.unsplash.com/featured/?fabric+bolt+textile+store&1004",
    },
    {
      emoji: "🎨",
      title: t('start.customise'),
      description: t('start.customiseDesc'),
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      route: "/customise",
      img: "https://source.unsplash.com/featured/?embroidery+jacket+closeup+detail&1005",
    },
  ];

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
          {t('start.heading')}
        </h1>
        <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
          {t('start.subheading')}
        </p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl transition-opacity ${!isCitySelected ? "opacity-50 pointer-events-none" : ""}`}>
        {orderTypes.map((type) => (
          <button
            key={type.title}
            onClick={() => {
              if (isCitySelected) navigate(type.route);
            }}
            className={`border-2 rounded-2xl overflow-hidden text-left transition-all duration-200 ${
              isCitySelected ? "hover:shadow-lg hover:scale-[1.02]" : "cursor-not-allowed"
            } ${type.color}`}
          >
            <img
              src={type.img}
              alt={type.title}
              className="w-full h-36 object-cover"
            />
            <div className="p-6 pt-4">
              <div className="text-3xl mb-3">{type.emoji}</div>
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                {type.title}
              </h2>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                {type.description}
              </p>
            </div>
          </button>
        ))}
      </div>

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
