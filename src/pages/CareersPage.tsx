import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CareersPage = () => {
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

        <h1 className="text-3xl font-bold text-foreground mb-4">Join the Naapio Team</h1>
        <p className="text-muted-foreground leading-7 text-[15px] mb-6">
          We're building the payment, reputation and trust infrastructure for India's bespoke fashion market — connecting millions of skilled artisans to customers who value their craft. It's a hard problem, and a real one.
        </p>
        <p className="text-muted-foreground leading-7 text-[15px] mb-10">
          We're a small, fast-moving team. If you'd like to be considered for future roles, write to us at{" "}
          <a href="mailto:careers@naapio.com" className="text-primary underline hover:text-primary/80">
            careers@naapio.com
          </a>
          .
        </p>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Naapio. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
