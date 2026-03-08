import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const cities = ["Bangalore", "Chennai", "Mumbai"];

const StartPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem("naapio_city") || "";
  });
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("naapio_city", selectedCity);
    }
  }, [selectedCity]);

  const orderTypes = [
    {
      emoji: "🆕",
      title: "New Order",
      description: "Make a new outfit from scratch. Tailor sources fabric and stitches to your specs.",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      route: "/wizard",
      img: "https://source.unsplash.com/featured/?indian+woman+ethnic+fashion+fabric&1002",
    },
    {
      emoji: "✂️",
      title: "Alteration / Repair",
      description: "Fix, resize, shorten or repair an existing garment you already own.",
      color: "bg-orange-50 border-orange-200 hover:border-orange-400",
      route: "/alteration",
      img: "https://source.unsplash.com/featured/?tailor+sewing+mannequin+workshop&1003",
    },
    {
      emoji: "🧵",
      title: "I Have My Own Fabric",
      description: "You have fabric ready. Tailor stitches your garment using it.",
      color: "bg-green-50 border-green-200 hover:border-green-400",
      route: "/wizard?type=own-fabric",
      img: "https://source.unsplash.com/featured/?fabric+bolt+textile+store&1004",
    },
    {
      emoji: "🎨",
      title: "Customise My Garment",
      description: "Add embroidery, artwork, sequins, prints or patches to an existing piece.",
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
        ← Back to Home
      </button>

      {/* City Selector */}
      <div className="w-full max-w-2xl mb-10">
        <p className="text-xs text-muted-foreground font-sans mb-3">Currently live in:</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2 rounded-full font-sans text-sm border transition-all ${
                selectedCity === city
                  ? "border-accent bg-accent text-accent-foreground font-medium"
                  : "border-border bg-card text-foreground hover:border-accent/40"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-sans">
          More cities coming soon —{" "}
          {!showNotifyForm ? (
            <button
              onClick={() => setShowNotifyForm(true)}
              className="text-accent hover:underline"
            >
              register your interest below
            </button>
          ) : (
            "register your interest below"
          )}
        </p>

        {showNotifyForm && !notifySubmitted && (
          <div className="mt-3 flex gap-2 max-w-sm">
            <Input
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              className="font-sans"
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                if (notifyEmail.trim()) {
                  setNotifySubmitted(true);
                  toast.success("Thanks! We'll notify you when we launch there.");
                }
              }}
            >
              Notify Me
            </Button>
          </div>
        )}
        {notifySubmitted && (
          <p className="text-xs text-green-600 font-sans mt-2">
            Thanks! We'll notify you when we launch there.
          </p>
        )}
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
          What would you like to do?
        </h1>
        <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
          Choose the right path — we'll tailor the experience for you.
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

      {!isCitySelected && (
        <p className="text-sm text-muted-foreground font-sans mt-6">
          👆 Please select your city above to continue
        </p>
      )}
    </div>
  );
};

export default StartPage;
