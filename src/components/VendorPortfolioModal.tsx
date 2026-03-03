import { X } from "lucide-react";

interface VendorPortfolioModalProps {
  open: boolean;
  onClose: () => void;
  vendorName: string;
}

const portfolioColors = [
  "from-red-700 to-red-500", "from-amber-600 to-amber-400", "from-emerald-700 to-emerald-500",
  "from-blue-700 to-blue-500", "from-purple-700 to-purple-500", "from-rose-600 to-rose-400",
];

const VendorPortfolioModal = ({ open, onClose, vendorName }: VendorPortfolioModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-serif font-bold text-xl text-foreground">{vendorName}'s Portfolio</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
          {portfolioColors.map((color, i) => (
            <div key={i} className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${color} flex items-end p-3`}>
              <span className="text-xs font-sans font-medium text-primary-foreground/80 bg-foreground/20 backdrop-blur-sm px-2 py-1 rounded-md">
                Project #{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorPortfolioModal;
