import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

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
          We're here to help — reach out to the right team below.
        </p>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-foreground leading-7 text-[15px]">
          <section className="rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-3">General Support</h2>
            <p className="text-muted-foreground mb-4">
              For queries about orders, bids, payments, refunds, tailors, or anything else on Naapio.
            </p>
            <a
              href="mailto:contact@naapio.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <Mail className="h-4 w-4" />
              contact@naapio.com
            </a>
            <p className="mt-3 text-sm text-muted-foreground">Typical response time: within 24 hours</p>
          </section>

          <section className="rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-3">Grievance Officer</h2>
            <p className="text-muted-foreground mb-4">
              As required under the Information Technology Rules, 2011 and the Consumer Protection (E-Commerce) Rules, 2020, complaints and grievances may be addressed to our Grievance Officer.
            </p>
            <a
              href="mailto:grievance@naapio.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <Mail className="h-4 w-4" />
              grievance@naapio.com
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Grievances are acknowledged within 48 hours and resolved within 30 days as per applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Business Hours</h2>
            <p>Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            <p className="text-sm text-muted-foreground mt-2">
              Emails received outside business hours will be actioned on the next working day.
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
