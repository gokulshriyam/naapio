import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  const orderTypes = [
    {
      emoji: "🆕",
      title: "New Order",
      description: "Make a new outfit from scratch. Tailor sources fabric and stitches to your specs.",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      route: "/wizard",
    },
    {
      emoji: "✂️",
      title: "Alteration / Repair",
      description: "Fix, resize, shorten or repair an existing garment you already own.",
      color: "bg-orange-50 border-orange-200 hover:border-orange-400",
      route: "/alteration",
    },
    {
      emoji: "🧵",
      title: "I Have My Own Fabric",
      description: "You have fabric ready. Tailor stitches your garment using it.",
      color: "bg-green-50 border-green-200 hover:border-green-400",
      route: "/wizard?type=own-fabric",
    },
    {
      emoji: "🎨",
      title: "Customise My Garment",
      description: "Add embroidery, artwork, sequins, prints or patches to an existing piece.",
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      route: "/wizard?type=customise",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      <button
        onClick={() => navigate("/")}
        className="self-start mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        ← Back to Home
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
          What would you like to do?
        </h1>
        <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
          Choose the right path — we'll tailor the experience for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {orderTypes.map((type) => (
          <button
            key={type.title}
            onClick={() => navigate(type.route)}
            className={`border-2 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${type.color}`}
          >
            <div className="text-4xl mb-4">{type.emoji}</div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              {type.title}
            </h2>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StartPage;
