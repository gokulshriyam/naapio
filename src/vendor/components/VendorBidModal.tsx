import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Lead } from "../data/vendorMockData";

type Props = {
  open: boolean;
  onClose: () => void;
  lead: Lead;
  onBidSubmitted: (leadId: string, bid: { amount: number; date: string; message: string }) => void;
};

const VendorBidModal = ({ open, onClose, lead, onBidSubmitted }: Props) => {
  const [price, setPrice] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [message, setMessage] = useState('');

  const numPrice = Number(price) || 0;
  const netEarning = Math.round(numPrice * 0.8);
  const exceedsBudget = numPrice > lead.budgetMax;
  const tooLow = numPrice > 0 && numPrice < 1000;
  const pastDeadline = deliveryDate && new Date(lead.deliveryDate) < deliveryDate;
  const canSubmit = numPrice >= 1000 && price.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onBidSubmitted(lead.id, {
      amount: numPrice,
      date: deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : lead.deliveryDate,
      message,
    });
    toast.success(`Bid submitted for ₹${numPrice.toLocaleString('en-IN')}!`);
    setPrice(''); setDeliveryDate(undefined); setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Submit Bid — #{lead.id}</DialogTitle>
        </DialogHeader>

        {/* Brief recap */}
        <div className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border">
          <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center text-2xl flex-shrink-0">
            {lead.category.includes('Women') ? '👗' : '🤵'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans font-semibold text-sm text-foreground">{lead.subCategory}</p>
            <p className="text-xs text-muted-foreground font-sans">{lead.occasion} · {lead.customerFirstName}, {lead.city}</p>
            <p className="text-xs font-sans text-accent font-semibold mt-0.5">
              ₹{lead.budgetMin.toLocaleString('en-IN')} – ₹{lead.budgetMax.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-2">
          {/* Price */}
          <div>
            <Label className="font-sans text-sm">Proposed Price (₹)</Label>
            <Input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Enter your bid amount"
              className="mt-1 font-sans"
              min={1000}
            />
            {numPrice > 0 && (
              <p className="text-xs text-muted-foreground font-sans mt-1">
                You will receive: <span className="font-semibold text-foreground">₹{netEarning.toLocaleString('en-IN')}</span> after 20% platform fee
              </p>
            )}
            {exceedsBudget && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-sans mt-1">
                ⚠️ Your bid exceeds customer's max budget (₹{lead.budgetMax.toLocaleString('en-IN')}). They may still consider it.
              </p>
            )}
            {tooLow && (
              <p className="text-xs text-destructive font-sans mt-1">Minimum bid is ₹1,000</p>
            )}
          </div>

          {/* Delivery date */}
          <div>
            <Label className="font-sans text-sm">Estimated Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !deliveryDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, 'PPP') : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  disabled={d => d < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {pastDeadline && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-sans mt-1">
                ⚠️ This delivery date is after customer's deadline ({lead.deliveryDate}). Consider if that's acceptable.
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label className="font-sans text-sm">Message to Customer (optional)</Label>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 500))}
              placeholder="Describe your approach, experience with this garment type, or why you're the best fit..."
              className="mt-1 font-sans min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground font-sans mt-1 text-right">{message.length}/500</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-sans mt-2">By submitting, your bid is binding for 7 days.</p>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
            Submit Bid →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorBidModal;
