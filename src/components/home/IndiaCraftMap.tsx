import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IndiaMap from "@aryanjsx/indiamap";
import { craftHeritage, StateEntry, totalStatesCount, totalCraftsCount } from "@/data/craftHeritage";
import { X, MapPin, Award } from "lucide-react";

// @aryanjsx/indiamap emits ISO 3166-2:IN-style two-letter codes.
const stateCodeToSlug: Record<string, string> = {
  JK: "jammu-kashmir",
  LA: "ladakh",
  HP: "himachal-pradesh",
  PB: "punjab",
  HR: "haryana",
  RJ: "rajasthan",
  UP: "uttar-pradesh",
  UT: "uttarakhand",
  WB: "west-bengal",
  BR: "bihar",
  JH: "jharkhand",
  OR: "odisha",
  AS: "assam",
  MN: "manipur",
  NL: "nagaland",
  ML: "meghalaya",
  MZ: "mizoram",
  TR: "tripura",
  AR: "arunachal-pradesh",
  SK: "sikkim",
  TN: "tamil-nadu",
  KL: "kerala",
  KA: "karnataka",
  AP: "andhra-pradesh",
  TG: "telangana",
  MH: "maharashtra",
  GJ: "gujarat",
  GA: "goa",
  MP: "madhya-pradesh",
  CT: "chhattisgarh",
  CG: "chhattisgarh",
};

const findStateEntry = (rawValue: string): StateEntry | undefined => {
  if (!rawValue) return undefined;
  const upper = rawValue.trim().toUpperCase();
  const slugFromCode = stateCodeToSlug[upper];
  if (slugFromCode) {
    const hit = craftHeritage.find((s) => s.stateSlug === slugFromCode);
    if (hit) return hit;
  }
  const normalise = (s: string) =>
    s.toLowerCase().trim().replace(/&/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
  const target = normalise(rawValue);
  return craftHeritage.find(
    (s) => normalise(s.state) === target || s.stateSlug === target
  );
};

const IndiaCraftMap = () => {
  const [selectedState, setSelectedState] = useState<StateEntry | null>(null);
  const [noTextileState, setNoTextileState] = useState<string | null>(null);

  const prettifyRegion = (raw: string) => {
    const upper = raw.trim().toUpperCase();
    const namesByCode: Record<string, string> = {
      AN: "Andaman & Nicobar Islands",
      LD: "Lakshadweep",
      DN: "Dadra & Nagar Haveli and Daman & Diu",
      DD: "Dadra & Nagar Haveli and Daman & Diu",
      PY: "Puducherry",
      CH: "Chandigarh",
    };
    if (namesByCode[upper]) return namesByCode[upper];
    return raw
      .toLowerCase()
      .split(/\s+|-/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="relative w-full bg-card rounded-3xl border border-border overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        {/* LEFT — map */}
        <div className="p-8 md:p-12 flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-card">
          <div className="w-full max-w-lg">
            <IndiaMap
              onClick={(value: string) => {
                const entry = findStateEntry(value);
                if (entry) {
                  setNoTextileState(null);
                  setSelectedState(entry);
                } else {
                  setSelectedState(null);
                  setNoTextileState(prettifyRegion(value));
                }
              }}
              size="100%"
              mapColor="hsl(var(--muted))"
              strokeColor="hsl(var(--border))"
              strokeWidth="1"
              hoverColor="hsl(var(--accent))"
              className="w-full h-auto"
            />
          </div>
          <p className="text-center font-sans text-xs text-muted-foreground mt-4">
            Tap any state to explore its craft heritage — {totalStatesCount} states, {totalCraftsCount} traditions
          </p>
        </div>

        {/* RIGHT — detail panel */}
        <div className="min-h-[420px] md:min-h-[560px] max-h-[640px] relative border-t md:border-t-0 md:border-l border-border">
          <AnimatePresence mode="wait">
            {!selectedState && !noTextileState ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full p-8 text-center absolute inset-0"
              >
                <MapPin className="w-10 h-10 text-muted-foreground/40 mb-4" />
                <p className="font-serif text-lg text-muted-foreground">Select a state to begin</p>
                <p className="font-sans text-sm text-muted-foreground/70 mt-2">
                  5,000 years of craft, mapped across every region of India
                </p>
              </motion.div>
            ) : noTextileState ? (
              <motion.div
                key={`no-${noTextileState}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center relative"
              >
                <button
                  onClick={() => setNoTextileState(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="text-5xl mb-4">🪵</span>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {noTextileState}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-sm">
                  This region's craft heritage runs through wood, leather, bamboo, and shell work rather than textiles — its own rich tradition, just outside what Naapio's garment marketplace covers today.
                </p>
              </motion.div>

            ) : (
              <motion.div
                key={selectedState.stateSlug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 h-full overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-sans text-xs text-accent uppercase tracking-wider mb-1">
                      {selectedState.region} India
                    </p>
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {selectedState.state}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedState(null)}
                    className="p-1.5 rounded-full hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <p className="font-sans text-sm text-muted-foreground mb-6">
                  {selectedState.crafts.length} craft tradition
                  {selectedState.crafts.length !== 1 ? "s" : ""} from this region
                </p>

                <div className="space-y-4">
                  {selectedState.crafts.map((craft) => (
                    <div
                      key={craft.slug}
                      className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={craft.image}
                        alt={craft.name}
                        className="w-20 h-20 object-cover object-[50%_35%] rounded-lg flex-shrink-0 border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-serif font-bold text-foreground text-sm">
                            {craft.name}
                          </p>
                          {craft.giTagged && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-accent/10 rounded-full">
                              <Award className="w-3 h-3 text-accent" />
                              <span className="font-sans text-[9px] font-semibold text-accent">GI</span>
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                          {craft.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IndiaCraftMap;
