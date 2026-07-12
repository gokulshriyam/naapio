import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldAlert } from "lucide-react";

const ContactPage = () => {
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

        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-2">
          We're here to help — whether you're a customer, an artisan, or a partner.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-foreground leading-7 text-[15px]">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. General Support</h2>
            <p>
              For questions about your order, bids, milestones, refunds, or anything else about using Naapio, please reach out to our support team.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Customer Support</p>
                  <a
                    href="mailto:contact@naapio.com"
                    className="text-primary underline hover:text-primary/80"
                  >
                    contact@naapio.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    We typically respond within 24 hours on business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the Grievance Officer are provided below. If you have any complaint, concern, or grievance regarding our services, content, or handling of your personal information, please write to our Grievance Officer.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Grievance Officer</p>
                  <a
                    href="mailto:grievance@naapio.com"
                    className="text-primary underline hover:text-primary/80"
                  >
                    grievance@naapio.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Grievances are acknowledged within 48 hours and resolved within 30 days as per applicable law.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. What to Include</h2>
            <p>To help us resolve your query faster, please include the following when you write to us:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your registered name and email/phone number</li>
              <li>Order ID or brief ID (if applicable)</li>
              <li>A clear description of the issue</li>
              <li>Any relevant screenshots, photos, or attachments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. For Tailors &amp; Artisans</h2>
            <p>
              If you are an existing tailor on the platform and need help with bids, payouts, wallet, or your vendor profile, please email{' '}
              <a href="mailto:contact@naapio.com" className="text-primary underline hover:text-primary/80">
                contact@naapio.com
              </a>{' '}
              with "Vendor Support" in the subject line.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Business &amp; Partnerships</h2>
            <p>
              For press, partnerships, or bulk/enterprise enquiries, please write to{' '}
              <a href="mailto:contact@naapio.com" className="text-primary underline hover:text-primary/80">
                contact@naapio.com
              </a>{' '}
              with the nature of your enquiry in the subject line.
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

export default ContactPage;
