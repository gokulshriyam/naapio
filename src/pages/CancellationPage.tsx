import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CancellationPage = () => {
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

        <h1 className="text-3xl font-bold text-foreground mb-2">Cancellation Policy</h1>
        <p className="text-muted-foreground mb-2">
          When and how you can cancel a Naapio order, and what happens to your money at each stage.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-foreground leading-7 text-[15px]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
            <p>
              Because Naapio orders are bespoke and stitched to your measurements, cancellation rights depend on which stage the order has reached. This policy sets out the cancellation windows and applicable charges at each stage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Before a Tailor Is Selected</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You may cancel a posted brief at any time before confirming a tailor</li>
              <li>₹450 of the ₹499 brief posting fee is refunded to your original payment method</li>
              <li>The ₹49 platform fee is non-refundable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. After a Tailor Is Selected — Before Milestone 1</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You may cancel and receive a refund of your escrow, less a 10% cancellation fee</li>
              <li>The ₹499 brief posting fee is non-refundable at this stage</li>
              <li>The cancellation fee compensates the tailor for time reserved and initial planning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. After Milestone 1 (Measurement Confirmed)</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cancellation is permitted, but the M1 tranche (20% of garment value) is non-refundable</li>
              <li>Remaining escrow tranches (80%) are refunded to your original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. After Milestone 2 (Fabric Approved) or Later</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Because fabric has been cut and stitching begun, all released milestone tranches are non-refundable</li>
              <li>Only unreleased tranches may be refunded, subject to Naapio's dispute review</li>
              <li>You may not cancel after Milestone 4 (Final Fitting) — you may only raise a dispute</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Cancellation by the Tailor</h2>
            <p>If a tailor cancels or fails to progress an order for more than 14 days without valid reason:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You receive a full refund of all unreleased escrow tranches</li>
              <li>Naapio will help you re-post the brief at no additional cost</li>
              <li>Any customer-provided fabric will be returned at the tailor's cost</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cancellation by Naapio</h2>
            <p>Naapio reserves the right to cancel any order in the following situations, with a full refund of unreleased escrow and the ₹499 posting fee:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Suspected fraudulent activity</li>
              <li>Violation of our Terms &amp; Conditions</li>
              <li>Inability to service your city</li>
              <li>Any legal or regulatory requirement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. How to Cancel</h2>
            <p>
              To cancel an order, use the "Cancel Order" option in your Naapio dashboard, or email{' '}
              <a href="mailto:support@naapio.in" className="text-primary underline hover:text-primary/80">
                support@naapio.in
              </a>{' '}
              with your order ID and reason for cancellation. Cancellations are typically processed within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Refund Processing</h2>
            <p>
              Cancellation refunds follow the timelines set out in our{' '}
              <button onClick={() => navigate('/refund')} className="text-primary underline hover:text-primary/80">
                Refund Policy
              </button>{' '}
              and are always returned to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p>For cancellation-related queries:</p>
            <p className="mt-2">
              Email:{' '}
              <a href="mailto:support@naapio.in" className="text-primary underline hover:text-primary/80">
                support@naapio.in
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

export default CancellationPage;
