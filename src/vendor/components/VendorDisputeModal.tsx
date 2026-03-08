import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const DISPUTE_REASONS = [
  "Measurements not followed",
  "Fabric different from approved",
  "Quality issues",
  "Delivery delay",
  "Artisan unresponsive",
  "Other",
];

type Props = {
  open: boolean;
  onClose: () => void;
  orderId: string;
};

const VendorDisputeModal = ({ open, onClose, orderId }: Props) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = reason.length > 0 && description.length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: DISPUTE_INTEGRATION — POST /v1/disputes with orderId, reason, description, evidenceUrls
    toast.success(`Dispute raised. Case #${orderId}-D01. Our team will contact you within 24 hours.`);
    setReason(''); setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Raise a Dispute — #{orderId}</DialogTitle>
          <DialogDescription className="font-sans">
            Naapio will review and respond within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="font-sans text-sm">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {DISPUTE_REASONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-sans text-sm">Describe the issue</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail (min 20 characters)..."
              className="mt-1 font-sans min-h-[100px]"
            />
            {description.length > 0 && description.length < 20 && (
              <p className="text-xs text-destructive font-sans mt-1">Minimum 20 characters required</p>
            )}
          </div>

          <div>
            <Label className="font-sans text-sm">Upload evidence (photos / screenshots)</Label>
            <input type="file" accept="image/*" multiple className="mt-1 text-sm font-sans" />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
            Submit Dispute
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDisputeModal;
