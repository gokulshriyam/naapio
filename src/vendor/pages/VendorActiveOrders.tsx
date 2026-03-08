import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Ruler, Scissors, Video, Package, Check } from "lucide-react";
import { mockVendorActiveOrders } from "../data/vendorMockData";

const MILESTONES = [
  { id: 1, label: 'Measurements', icon: Ruler },
  { id: 2, label: 'Fabric Approval', icon: Scissors },
  { id: 3, label: 'Stitching', icon: Scissors },
  { id: 4, label: 'Fitting Video', icon: Video },
  { id: 5, label: 'Delivery', icon: Package },
];

const VendorActiveOrders = () => {
  const [orders] = useState(mockVendorActiveOrders);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🪡</p>
        <h1 className="font-serif font-bold text-xl text-foreground mb-2">No active orders</h1>
        <p className="text-sm font-sans text-muted-foreground">Once a customer accepts your bid, the order will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">Active Orders</h1>
        <p className="text-sm font-sans text-muted-foreground">Manage your in-progress orders and milestone updates.</p>
      </div>

      <div className="space-y-6">
        {orders.map(order => {
          const progress = ((order.currentMilestone - 1) / 5) * 100;
          return (
            <div key={order.orderId} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-serif font-bold text-lg text-foreground">#{order.orderId}</h2>
                      <Badge className="bg-accent/15 text-accent border-accent/30 text-xs">{order.subCategory}</Badge>
                    </div>
                    <p className="text-sm font-sans text-muted-foreground">
                      {order.customerFirstName}, {order.city} · {order.occasion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-lg text-foreground">₹{order.bidAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-sans text-muted-foreground">
                      Net: <span className="text-accent font-semibold">₹{order.netEarning.toLocaleString('en-IN')}</span> (after 20% fee)
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-4">
                  {MILESTONES.map((m, i) => {
                    const done = order.currentMilestone > m.id;
                    const current = order.currentMilestone === m.id;
                    return (
                      <div key={m.id} className="flex items-center gap-1 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done ? 'bg-accent text-accent-foreground' : current ? 'bg-accent/20 text-accent ring-2 ring-accent' : 'bg-muted text-muted-foreground'
                        }`}>
                          {done ? <Check className="w-4 h-4" /> : <m.icon className="w-4 h-4" />}
                        </div>
                        {i < MILESTONES.length - 1 && (
                          <div className={`flex-1 h-0.5 ${done ? 'bg-accent' : 'bg-border'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-sans text-muted-foreground mb-4">
                  {MILESTONES.map(m => <span key={m.id} className="text-center flex-1">{m.label}</span>)}
                </div>

                <Progress value={progress} className="h-1.5 mb-4" />

                {/* Brief */}
                <div className="p-3 rounded-xl bg-muted/50 border border-border mb-4">
                  <p className="text-xs font-sans font-semibold text-foreground mb-1">Customer Brief</p>
                  <p className="text-xs font-sans text-muted-foreground">{order.brief}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {order.surfaces.map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-sans">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Measurements */}
                <div className="p-3 rounded-xl bg-muted/50 border border-border mb-4">
                  <p className="text-xs font-sans font-semibold text-foreground mb-2">Customer Measurements</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(order.measurements).map(([key, val]) => (
                      <div key={key} className="text-xs font-sans">
                        <span className="text-muted-foreground">{key}:</span>{' '}
                        <span className="font-semibold text-foreground">{val}"</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="gold" size="sm" className="text-xs">
                    Update Milestone →
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Chat with Customer
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorActiveOrders;
