import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsPage = () => {
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

        <h1 className="text-3xl font-bold text-foreground mb-2">Terms &amp; Conditions</h1>
        <p className="text-muted-foreground mb-2">
          Please read these terms carefully before using Naapio's platform.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-foreground leading-7 text-[15px]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. About Naapio</h2>
            <p>
              Naapio is a managed marketplace that connects customers seeking custom ethnic wear with independent tailors and artisans. Naapio is not itself a tailoring service — we facilitate the connection, manage escrow payments, and ensure quality through our 5-milestone framework.
            </p>
            <p className="mt-3">
              Naapio is operated by [Company Name] registered in Bangalore, Karnataka, India.
            </p>
            {/* TODO: LEGAL — insert registered company name and CIN number before launch */}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Order Posting Fee</h2>
            <p>A non-refundable order posting fee of ₹499 is charged when you post a brief on Naapio. This fee:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Goes live to tailors in your city</li>
              <li>Is deducted from your final payment when you confirm a tailor</li>
              <li>Is non-refundable if no tailor is selected within 7 days</li>
              <li>Is non-refundable if you cancel after selecting a tailor</li>
            </ul>
            <p className="mt-3">
              If no bids are received within 7 days, you may repost your brief at no additional charge within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Escrow &amp; Payments</h2>
            <p>
              All garment payments (excluding the ₹499 posting fee) are held in escrow by Naapio's payment partner [Payment Partner Name].
            </p>
            {/* TODO: LEGAL — insert payment partner name (Razorpay or equivalent) before launch */}
            <p className="mt-3">
              Escrow funds are released to the tailor in 5 tranches, one per milestone, only upon customer approval. Naapio charges a platform commission of [X]% on the total garment value.
            </p>
            {/* TODO: LEGAL — insert commission percentage */}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Milestones &amp; Approvals</h2>
            <p>Your order is managed through 5 quality milestones:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>M1:</strong> Measurement Confirmation</li>
              <li><strong>M2:</strong> Fabric Approval</li>
              <li><strong>M3:</strong> Stitching Preview</li>
              <li><strong>M4:</strong> Final Fitting</li>
              <li><strong>M5:</strong> Delivery</li>
            </ul>
            <p className="mt-3">
              You must approve or raise a change request within 48 hours of each milestone upload. Failure to respond within 48 hours is treated as approval and the corresponding escrow tranche is released.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Disputes</h2>
            <p>
              If you are dissatisfied with any milestone, you may raise a dispute through the Naapio dashboard. Naapio's dispute team will review within 24 hours. Naapio's decision on disputes is final.
            </p>
            <p className="mt-3">Naapio is not liable for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Fabric damage where customer-provided fabric was not in the condition described</li>
              <li>Colour variations between digital references and physical fabric</li>
              <li>Fit variations where measurements were provided by the customer and confirmed at M1</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Own Fabric Orders</h2>
            <p>
              For Own Fabric orders, the customer is responsible for providing sufficient fabric in good condition. The tailor will inspect fabric at Milestone 1 before cutting. If fabric is found insufficient or damaged, the tailor will notify the customer before proceeding.
            </p>
            <p className="mt-3">
              Naapio recommends photographing your fabric before handing it to your tailor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Tailor Conduct</h2>
            <p>
              All Naapio tailors have undergone KYC verification and work sample review. However, Naapio is not responsible for the independent actions of tailors beyond the platform's dispute resolution process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Data &amp; Privacy</h2>
            <p>
              We collect and process your personal data in accordance with our{' '}
              <button onClick={() => navigate('/privacy')} className="text-primary underline hover:text-primary/80">
                Privacy Policy
              </button>{' '}
              and the Digital Personal Data Protection Act, 2023 (DPDP Act). See our Privacy Policy for full details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p>For any questions regarding these terms:</p>
            <p className="mt-2">
              Email:{' '}
              <a href="mailto:legal@naapio.in" className="text-primary underline hover:text-primary/80">
                legal@naapio.in
              </a>
            </p>
            {/* TODO: LEGAL — confirm legal email before launch */}
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Naapio. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
