import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RotateCw, Share2, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const milestones = [
  { key: 'M1', label: 'Measurement Confirmation' },
  { key: 'M2', label: 'Fabric Approval' },
  { key: 'M3', label: 'Stitching Preview' },
  { key: 'M4', label: 'Final Fitting' },
  { key: 'M5', label: 'Delivery' },
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeText, setDisputeText] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  // TODO: API_INTEGRATION_POINT — GET /orders/:id
  useEffect(() => {
    try {
      const raw = localStorage.getItem('naapio_last_order');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.orderId === id || !id) {
          setOrder(parsed);
        }
      }
    } catch {}
    setLoading(false);
  }, [id]);

  const handleReorder = () => {
    if (!order) return;
    const draft = {
      step: 3,
      step2Phase: 'fabric',
      step3Phase: 'colour',
      orderType: order.orderType,
      gender: order.gender,
      selectedCategory: order.selectedCategory,
      selectedSubCategory: order.selectedSubCategory,
      selectedOccasion: order.selectedOccasion,
      selectedFit: order.selectedFit,
      selectedNeckline: order.selectedNeckline,
      selectedSleeve: order.selectedSleeve,
      measurementType: 'saved',
      selectedColourMood: '',
      selectedFabricTypes: [],
      selectedSurfaces: [],
      budgetRange: order.budgetRange,
      reorderFrom: order.orderId,
      isReorder: true,
      reorderMode: 'same',
    };
    localStorage.setItem('naapio_wizard_draft', JSON.stringify(draft));
    navigate('/wizard');
  };

  const handleShare = () => {
    const text = `Check out my Naapio order #${id}! Track it at naapio.lovable.app/order/${id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDisputeSubmit = () => {
    if (!disputeText.trim()) return;
    // TODO: API_INTEGRATION_POINT — POST dispute to backend
    setDisputeSubmitted(true);
    toast({
      title: "Dispute raised",
      description: "Our team will respond within 24 hours.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order not found</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">
          We couldn't find order #{id}. It may have been placed on a different device.
        </p>
        <Button variant="gold" onClick={() => navigate('/dashboard')}>
          View My Dashboard →
        </Button>
      </div>
    );
  }

  const orderTypeBadge = () => {
    const type = order.orderType || 'new';
    const map: Record<string, { label: string; className: string }> = {
      new: { label: 'New Order', className: 'bg-primary text-primary-foreground' },
      alteration: { label: 'Alteration', className: 'bg-accent text-accent-foreground' },
      customise: { label: 'Customisation', className: 'bg-[hsl(var(--info))] text-primary-foreground' },
      ownFabric: { label: 'Own Fabric', className: 'bg-[hsl(var(--success))] text-success-foreground' },
    };
    const t = map[type] || map.new;
    return <Badge className={t.className}>{t.label}</Badge>;
  };

  const currentMilestone = order.currentMilestone || 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            My Orders
          </button>
          <span className="text-sm text-muted-foreground">Order #{id}</span>
        </div>

        {/* Order type */}
        <div className="mb-6">{orderTypeBadge()}</div>

        {/* 5-step stepper */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {milestones.map((m, i) => (
                <div key={m.key} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < currentMilestone
                        ? 'bg-[hsl(var(--success))] text-success-foreground'
                        : i === currentMilestone
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < currentMilestone ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 text-center leading-tight hidden sm:block">
                    {m.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 sm:hidden">{m.key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {order.selectedCategory && (
                <div><span className="text-muted-foreground">Garment:</span> <span className="font-medium">{order.selectedCategory}</span></div>
              )}
              {order.selectedOccasion && (
                <div><span className="text-muted-foreground">Occasion:</span> <span className="font-medium">{order.selectedOccasion}</span></div>
              )}
              {order.selectedFit && (
                <div><span className="text-muted-foreground">Fit:</span> <span className="font-medium">{order.selectedFit}</span></div>
              )}
              {order.selectedColourMood && (
                <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{order.selectedColourMood}</span></div>
              )}
              {order.selectedFabricFeel && (
                <div><span className="text-muted-foreground">Fabric feel:</span> <span className="font-medium">{order.selectedFabricFeel}</span></div>
              )}
              {order.budgetRange && (
                <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">{order.budgetRange}</span></div>
              )}
              {order.deliveryDate && (
                <div><span className="text-muted-foreground">Delivery:</span> <span className="font-medium">{order.deliveryDate}</span></div>
              )}
              {order.isRushOrder && (
                <div><Badge className="bg-[hsl(var(--warning))] text-warning-foreground">⚡ Rush Order</Badge></div>
              )}
              {order.isGiftOrder && (
                <div className="col-span-2"><span className="text-muted-foreground">🎁 Gift order</span></div>
              )}
              {order.groupOrderCount && Number(order.groupOrderCount) > 1 && (
                <div className="col-span-2"><span className="text-muted-foreground">👥 Group order: {order.groupOrderCount} pieces</span></div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Milestone Timeline */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Milestone Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((m, i) => {
                const isPast = i < currentMilestone;
                const isCurrent = i === currentMilestone;
                return (
                  <div key={m.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isPast
                            ? 'bg-[hsl(var(--success))] text-success-foreground'
                            : isCurrent
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isPast ? '✓' : i + 1}
                      </div>
                      {i < milestones.length - 1 && (
                        <div className={`w-px flex-1 min-h-[24px] ${isPast ? 'bg-[hsl(var(--success))]' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`font-medium text-sm ${isCurrent ? 'text-foreground' : isPast ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        {m.key}: {m.label}
                      </p>
                      {isPast && (
                        <p className="text-xs text-[hsl(var(--success))]">Approved</p>
                      )}
                      {isCurrent && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="success" className="text-xs">✓ Approve</Button>
                          <Button size="sm" variant="outline" className="text-xs">↩ Request Changes</Button>
                        </div>
                      )}
                      {!isPast && !isCurrent && (
                        <p className="text-xs text-muted-foreground/50">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="gold" className="w-full" onClick={handleReorder}>
            <RotateCw className="h-4 w-4 mr-2" />
            Reorder this design →
          </Button>

          <Button variant="outline" className="w-full" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            📲 Share order status
          </Button>

          {!showDispute && !disputeSubmitted && (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => setShowDispute(true)}
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              🛡️ Raise a dispute →
            </Button>
          )}

          {showDispute && !disputeSubmitted && (
            <Card className="border-destructive/30">
              <CardContent className="pt-4 space-y-3">
                <p className="font-medium text-sm">Describe your concern</p>
                <Textarea
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  placeholder="Tell us what went wrong..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={handleDisputeSubmit} disabled={!disputeText.trim()}>
                    Submit Dispute
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowDispute(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {disputeSubmitted && (
            <Card className="border-[hsl(var(--success))]/30 bg-[hsl(var(--success-light))]">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-foreground">
                  Your dispute has been raised. Our team will respond within 24 hours.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
