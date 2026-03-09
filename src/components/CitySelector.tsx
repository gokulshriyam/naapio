import { useState, useRef, useEffect } from "react";
import { MapPin, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCity } from "@/context/CityContext";

const tier1Cities = [
  { name: 'Bangalore', state: 'Karnataka', live: true },
  { name: 'Chennai', state: 'Tamil Nadu', live: true },
  { name: 'Mumbai', state: 'Maharashtra', live: false },
  { name: 'Delhi / NCR', state: 'Delhi', live: false },
  { name: 'Hyderabad', state: 'Telangana', live: false },
  { name: 'Kolkata', state: 'West Bengal', live: false },
  { name: 'Pune', state: 'Maharashtra', live: false },
  { name: 'Ahmedabad', state: 'Gujarat', live: false },
  { name: 'Surat', state: 'Gujarat', live: false },
  { name: 'Jaipur', state: 'Rajasthan', live: false },
];

interface CitySelectorProps {
  variant?: "header" | "mobile";
}

const CitySelector = ({ variant = "header" }: CitySelectorProps) => {
  const { selectedCity, setCity } = useCity();
  const [open, setOpen] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notifyCity, setNotifyCity] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowNotifyForm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (cityName: string) => {
    setCity(cityName);
    setOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="w-full">
        <p className="text-xs text-muted-foreground font-sans mb-2">City</p>
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Available Now
          </p>
          {tier1Cities.filter(c => c.live).map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelect(city.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-sans flex items-center justify-between transition-colors ${
                selectedCity === city.name
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span>{city.name} <span className="text-muted-foreground text-xs">— {city.state}</span></span>
              {selectedCity === city.name && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
          <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider font-semibold mt-3 mb-1">Launching Soon</p>
          {tier1Cities.filter(c => !c.live).map((city) => (
            <div key={city.name} className="px-3 py-2 text-sm font-sans text-muted-foreground/50">
              {city.name} — {city.state}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-sans transition-colors ${
          selectedCity
            ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            : "text-accent animate-pulse hover:bg-muted/50"
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-xs font-medium">{selectedCity || "Select City"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg z-50 py-1">
          {/* Available Now */}
          <p className="px-4 py-2 text-[10px] text-muted-foreground font-sans uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Available Now
          </p>
          {tier1Cities.filter(c => c.live).map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelect(city.name)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-sans hover:bg-muted/50 transition-colors"
            >
              <span className="text-foreground">{city.name} <span className="text-muted-foreground text-xs">— {city.state}</span></span>
              {selectedCity === city.name && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}

          <div className="h-px bg-border mx-3 my-1" />

          {/* Launching Soon */}
          <p className="px-4 py-2 text-[10px] text-muted-foreground font-sans uppercase tracking-wider font-semibold">Launching Soon</p>
          {tier1Cities.filter(c => !c.live).map((city) => (
            <div key={city.name} className="px-4 py-2 text-sm font-sans text-muted-foreground/50">
              {city.name} — {city.state}
            </div>
          ))}

          <div className="h-px bg-border mx-3 my-1" />

          {/* Not listed */}
          {!showNotifyForm && !notifySubmitted ? (
            <button
              onClick={() => setShowNotifyForm(true)}
              className="w-full text-left px-4 py-2.5 text-sm font-sans text-accent hover:bg-muted/50 transition-colors"
            >
              📍 My city isn't listed →
            </button>
          ) : notifySubmitted ? (
            <p className="px-4 py-2.5 text-xs text-green-600 font-sans">
              Thanks! We'll notify you when we launch in {notifyCity}.
            </p>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <Input
                value={notifyCity}
                onChange={(e) => setNotifyCity(e.target.value)}
                placeholder="Your city name"
                className="text-sm h-8"
              />
              <Input
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                className="text-sm h-8"
              />
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  if (notifyCity.trim() && notifyEmail.trim()) {
                    setNotifySubmitted(true);
                    setShowNotifyForm(false);
                    // TODO: API_INTEGRATION_POINT — POST city interest to backend
                  }
                }}
              >
                Notify Me When Live
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelector;
