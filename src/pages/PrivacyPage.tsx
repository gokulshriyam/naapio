import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPage = () => {
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

        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-2">
          How Naapio collects, uses, and protects your personal data — in accordance with the Digital Personal Data Protection Act, 2023.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-foreground leading-7 text-[15px]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Data We Collect</h2>
            <p>We collect the following personal data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identity data:</strong> Name, phone number, email address</li>
              <li><strong>Order data:</strong> Garment specifications, occasion, fit preferences, design details</li>
              <li><strong>Measurement data:</strong> Body measurements you provide</li>
              <li><strong>Photo data:</strong> Inspiration photos, reference images, selfie photos uploaded for AI visualisation</li>
              <li><strong>Location data:</strong> City selected on our platform</li>
              <li><strong>Payment data:</strong> Processed by our payment partner — Naapio does not store card details</li>
              <li><strong>Usage data:</strong> Pages visited, steps completed, time spent (anonymised analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Data</h2>
            <p>Your data is used for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Processing and managing your custom orders</li>
              <li>Sharing your brief (anonymised) with tailors in your city</li>
              <li>Generating AI outfit visualisations (Gemini API — photo sent for generation only, not stored)</li>
              <li>Sending order updates via WhatsApp / SMS</li>
              <li>Improving our platform through anonymised analytics</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. AI Visualisation &amp; Your Photos</h2>
            <p>If you use our AI outfit preview feature:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your photo is sent to Google's Gemini API for image generation</li>
              <li>The photo is used solely for generating the visualisation and is not stored on Naapio's servers</li>
              <li>Google's data processing terms apply to this feature</li>
              <li>You may skip this feature entirely — it is optional</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
            <p>We share your data with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Tailors in your city:</strong> your order brief (identity hidden until you confirm a tailor)</li>
              <li><strong>Payment partner:</strong> for escrow processing</li>
              <li><strong>Google:</strong> only your selfie photo, only when you use the AI visualisation feature</li>
              <li><strong>Legal authorities:</strong> only when required by law</li>
            </ul>
            <p className="mt-3">We do not sell your data to advertisers or third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights (DPDP Act 2023)</h2>
            <p>Under the Digital Personal Data Protection Act 2023, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Erase your data (subject to legal retention requirements)</li>
              <li>Withdraw consent for data processing</li>
              <li>Nominate a person to exercise these rights on your behalf</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact:{' '}
              <a href="mailto:privacy@naapio.in" className="text-primary underline hover:text-primary/80">
                privacy@naapio.in
              </a>
            </p>
            {/* TODO: LEGAL — confirm privacy email before launch */}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <p>We retain your data for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Active orders:</strong> duration of order + 2 years</li>
              <li><strong>Measurement profiles:</strong> until you request deletion</li>
              <li><strong>Payment records:</strong> 7 years (legal requirement)</li>
              <li><strong>Analytics data:</strong> 2 years (anonymised)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
            <p>
              We use essential cookies only — for session management and language/city preferences. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact Our Data Protection Officer</h2>
            {/* TODO: LEGAL — appoint DPO and insert contact details before launch */}
            <p>
              Email:{' '}
              <a href="mailto:privacy@naapio.in" className="text-primary underline hover:text-primary/80">
                privacy@naapio.in
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

export default PrivacyPage;
