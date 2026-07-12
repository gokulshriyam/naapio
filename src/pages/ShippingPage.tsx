import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ShippingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6">
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Shipping &amp; Exchange Policy</h1>
        <p className="text-muted-foreground mb-2">
          How your custom-tailored garments are shipped and our exchange rules.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-foreground leading-7 text-[15px]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Shipping Model</h2>
            <p>
              Naapio operates as a managed marketplace connecting customers with independent tailors and artisans. Shipping of the finished garment is handled directly by the vendor/artisan who stitched your order — Naapio does not warehouse, dispatch, or physically ship garments on the vendor's behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. When Shipping Happens</h2>
            <p>
              Every Naapio order moves through 5 milestones (M1–M5). Shipping is triggered after <strong>Milestone 4 (Final Garment Ready)</strong> is approved by the customer. Once M4 is approved:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The vendor packs and dispatches the garment to the shipping address you provided at the time of order.</li>
              <li>The vendor shares a tracking number and courier partner details on your Naapio dashboard.</li>
              <li>Delivery to your doorstep marks <strong>Milestone 5 (Delivered)</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Shipping Address</h2>
            <p>
              The garment is shipped to the address designated by you at the time of order placement. Please ensure your shipping address is accurate and complete. Changes to the shipping address can be requested via chat with the vendor before M4 is approved; changes after dispatch may not be possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Delivery Timelines</h2>
            <p>Typical delivery timelines once the garment is dispatched (post-M4):</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Within the same city:</strong> 1–3 business days</li>
              <li><strong>Metro to metro / intra-state:</strong> 3–5 business days</li>
              <li><strong>Rest of India:</strong> 5–7 business days</li>
              <li><strong>Remote pin codes:</strong> up to 10 business days</li>
            </ul>
            <p className="mt-3">
              Timelines are indicative and depend on the courier partner used by the vendor. Delays caused by courier partners, weather, strikes, or force majeure events are outside Naapio's and the vendor's control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Shipping Charges</h2>
            <p>
              Shipping charges (if any) are included in the vendor's quoted bid unless explicitly stated otherwise in the brief. There are no hidden shipping fees added by Naapio at the time of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Exchange Policy</h2>
            <p>
              Because every garment on Naapio is <strong>custom-stitched to your measurements, design brief, and preferences</strong>, exchanges are not available. Customised garments cannot be exchanged or returned for a different size, colour, design, or garment type.
            </p>
            <p className="mt-3">This is standard practice for bespoke tailoring worldwide and allows our artisans to price fairly for the effort involved.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. What If Something Is Wrong?</h2>
            <p>
              While exchanges are not offered, you are protected by Naapio's milestone-based approval flow. At each milestone (fabric, cutting, first stitch, final garment) you review proof from the vendor and can request changes before approving. If the delivered garment does not match the approved M4 proof, you may raise a dispute within 48 hours of delivery via your dashboard or by emailing{' '}
              <a href="mailto:contact@naapio.com" className="text-primary underline hover:text-primary/80">
                contact@naapio.com
              </a>
              . Our team will review and mediate as per the{' '}
              <button onClick={() => navigate('/refund')} className="text-primary underline hover:text-primary/80">
                Refund Policy
              </button>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Damaged or Lost Shipments</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Damaged in transit:</strong> Please refuse delivery or take photos immediately and email us within 24 hours of delivery.</li>
              <li><strong>Lost in transit:</strong> The vendor will file a claim with the courier partner and coordinate a resolution — either a re-stitch (if fabric is available) or refund of unreleased escrow.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p>For shipping and delivery queries:</p>
            <p className="mt-2">
              Email:{' '}
              <a href="mailto:contact@naapio.com" className="text-primary underline hover:text-primary/80">
                contact@naapio.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Naapio. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
