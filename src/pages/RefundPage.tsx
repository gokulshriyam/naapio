import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RefundPage = () => {
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

        <h1 className="text-3xl font-bold text-foreground mb-2">Refund Policy</h1>
        <p className="text-muted-foreground mb-2">
          How refunds are handled on Naapio's escrow-protected marketplace.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-foreground leading-7 text-[15px]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
            <p>
              Naapio operates a managed marketplace connecting customers with independent tailors. All garment payments are held in escrow and released to the tailor in tranches only upon customer approval at each milestone. This policy explains when refunds are available, how they are processed, and their timelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Brief Posting Fee (₹499)</h2>
            <p>The ₹499 brief posting fee is generally non-refundable. However, we will refund ₹450 (the escrow portion, excluding the ₹49 platform fee) in the following cases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>No tailor bids are received within 7 days of posting</li>
              <li>You choose not to proceed with any of the received bids within 7 days</li>
              <li>Technical issues on Naapio prevent your brief from going live</li>
            </ul>
            <p className="mt-3">The ₹49 platform fee is non-refundable in all cases.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Escrow Refunds (Garment Payment)</h2>
            <p>Escrow funds are released in 5 tranches (20% each) upon your approval at each milestone. Unreleased escrow funds are refundable in the following situations:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Tailor cancels or fails to deliver:</strong> Full refund of unreleased escrow</li>
              <li><strong>Milestone rejected via dispute:</strong> Refund per Naapio's dispute team decision</li>
              <li><strong>Order abandoned by tailor for &gt;14 days:</strong> Full refund of unreleased escrow</li>
              <li><strong>Mutual cancellation:</strong> Refund of unreleased escrow, less any work-in-progress compensation to the tailor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Non-Refundable Situations</h2>
            <p>Refunds will not be issued in the following cases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Milestone tranches already released upon your approval</li>
              <li>Auto-approved milestones (no response within 48 hours of upload)</li>
              <li>Fit issues where measurements were confirmed by you at Milestone 1</li>
              <li>Colour or texture variations where customer-provided references were followed</li>
              <li>Damage to customer-provided fabric where the tailor flagged concerns before cutting</li>
              <li>Change requests raised after final delivery approval</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Refund Timelines</h2>
            <p>Approved refunds are processed by our payment partner and typically credited as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>UPI / Wallets:</strong> 3–5 business days</li>
              <li><strong>Debit / Credit Cards:</strong> 5–7 business days</li>
              <li><strong>Net Banking:</strong> 5–7 business days</li>
              <li><strong>International Cards:</strong> up to 14 business days</li>
            </ul>
            <p className="mt-3">
              Refunds are always returned to the original payment method. Naapio does not issue cash refunds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. How to Request a Refund</h2>
            <p>
              To request a refund, raise a dispute or refund request from your Naapio dashboard, or email{' '}
              <a href="mailto:support@naapio.in" className="text-primary underline hover:text-primary/80">
                support@naapio.in
              </a>{' '}
              with your order ID and reason. Our team will respond within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Dispute Resolution</h2>
            <p>
              Refund disputes are reviewed by Naapio's dispute team within 24 hours of submission. Naapio's decision on refund disputes is final and binding on both customers and tailors, subject to applicable Indian consumer protection law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p>For refund-related queries:</p>
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

export default RefundPage;
