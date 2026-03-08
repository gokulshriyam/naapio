import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">🧵</div>

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        This page got lost in the fitting room.
      </h1>

      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        The page you're looking for doesn't exist — but your dream outfit still can.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="gold" size="lg" onClick={() => navigate('/')}>
          Back to Home →
        </Button>
        <Button variant="outline-gold" size="lg" onClick={() => navigate('/start')}>
          Start an Order →
        </Button>
      </div>

      <p className="mt-12 text-sm text-muted-foreground max-w-sm">
        If you followed a link that brought you here, please let us know at{' '}
        <a href="mailto:hello@naapio.in" className="text-primary underline hover:text-primary/80">
          hello@naapio.in
        </a>
      </p>
    </div>
  );
};

export default NotFoundPage;
