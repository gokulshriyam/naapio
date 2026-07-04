import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naapio_upload');
      if (saved) setUploadData(JSON.parse(saved));
      else navigate('/new-order/upload');
    } catch {
      navigate('/new-order/upload');
    }
  }, [navigate]);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('naapio_payment', JSON.stringify({
        phone, otpVerified: true, paidAt: new Date().toISOString(),
        amount: 499, platformFee: 49, escrow: 450,
      }));
      setLoading(false);
      navigate('/new-order/brief');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto max-w-lg flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-serif font-bold text-lg text-foreground">Naapio</button>
          <p className="font-sans text-sm text-muted-foreground hidden sm:block">Step 2 of 3 — Secure Your Brief</p>
        </div>
        <div className="container mx-auto max-w-lg mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent" initial={{ width: '33%' }} animate={{ width: '66%' }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-lg pb-32 sm:pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Post your brief</h2>
          <p className="font-sans text-muted-foreground mb-8">Pay ₹499 to send your brief to 500+ verified artisans in your city</p>

          {uploadData?.photoDataUrl && (
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border mb-8">
              <img src={uploadData.photoDataUrl} alt="Inspiration" className="w-16 h-16 object-cover rounded-lg border border-border" />
              <div className="min-w-0 flex-1">
                <p className="font-sans text-xs text-muted-foreground">Your inspiration</p>
                <p className="font-sans text-sm font-medium text-foreground truncate">{uploadData.photoName || 'Photo uploaded'}</p>
                {uploadData.photoAnalysis?.detectedGarment && uploadData.photoAnalysis.detectedGarment !== 'Other' && (
                  <span className="font-sans text-xs text-accent">✨ {uploadData.photoAnalysis.detectedGarment}</span>
                )}
              </div>
            </div>
          )}

          <div className="p-6 bg-card rounded-2xl border-2 border-accent/30 shadow-lg mb-6">
            <p className="font-serif text-5xl font-bold text-accent text-center">₹499</p>
            <p className="font-sans font-semibold text-foreground text-center mt-1">Brief Posting Fee</p>
            <div className="border-t border-border mt-4 mb-4" />
            <div className="flex justify-between font-sans text-sm mb-1">
              <span className="text-muted-foreground">Platform fee</span>
              <span className="text-foreground">₹49</span>
            </div>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-muted-foreground">Held in escrow</span>
              <span className="text-success font-semibold">₹450</span>
            </div>
            <p className="text-xs text-muted-foreground font-sans text-center mt-3">
              ₹450 returned to you if no artisan accepts within 7 days
            </p>
          </div>

          <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <p className="font-sans font-semibold text-success text-sm">100% Escrow Protected</p>
              <p className="font-sans text-xs text-muted-foreground">Your money is held safely — released to the artisan only at your final approval</p>
            </div>
          </div>

          <div className="p-5 bg-card rounded-xl border border-border mb-6">
            <h3 className="font-sans font-semibold text-foreground mb-3">Verify your mobile</h3>
            {!otpVerified ? (
              !otpSent ? (
                <div className="flex gap-2">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="font-sans" />
                  <Button onClick={() => { if (phone.length < 6) { toast.error("Enter a valid phone"); return; } setOtpSent(true); toast.info("OTP sent!"); }}>
                    Send OTP
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="4-digit OTP" maxLength={4} className="font-sans" />
                    <Button variant="gold" onClick={() => {
                      if (/^\d{4}$/.test(otp)) { setOtpVerified(true); toast.success("Phone verified ✓"); }
                      else toast.error("Enter any 4 digits");
                    }}>Verify</Button>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-2">Demo mode — enter any 4 digits</p>
                </>
              )
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-sans text-sm font-medium text-foreground">Mobile verified ✓</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 mb-6">
            <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
            <label htmlFor="terms" className="text-sm font-sans text-muted-foreground cursor-pointer">
              I agree to the Terms &amp; Conditions and Privacy Policy
            </label>
          </div>

          <Button
            variant="gold"
            size="hero"
            className="w-full"
            disabled={!otpVerified || !termsAccepted || loading}
            onClick={handlePay}
          >
            {loading ? "Processing..." : "Pay ₹499 & Post Brief →"}
          </Button>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border p-4 sm:static sm:mt-4 sm:pt-6">
        <div className="container mx-auto max-w-lg">
          <Button variant="outline" onClick={() => navigate('/new-order/upload')}>
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
