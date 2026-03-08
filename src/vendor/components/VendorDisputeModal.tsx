import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const DISPUTE_REASONS = [
  "Measurements not followed by artisan",
  "Fabric different from approved",
  "Quality does not match brief",
  "Delivery significantly delayed",
  "Customer unresponsive / abandoned order",
  "Payment not released correctly",
  "Artisan/Customer behaviour issue",
  "Other",
];

type Props = {
  open: boolean;
  onClose: () => void;
  orderId?: string;
};

const VendorDisputeModal = ({ open, onClose, orderId }: Props) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const canSubmit = reason.length > 0 && description.length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: DISPUTE_INTEGRATION — POST /v1/disputes
    const caseId = `#DIS-${orderId || 'GEN'}-001`;
    toast.success(`Dispute raised. Case ID: ${caseId}. Our team will contact you within 24 hours via your registered mobile.`);
    setReason(''); setDescription(''); setFiles([]);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">
            Raise a Dispute{orderId ? ` — #${orderId}` : ''}
          </DialogTitle>
          <DialogDescription className="font-sans">
            Naapio will review and respond within 24 hours. All disputes are confidential.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="font-sans text-sm">Reason <span className="text-destructive">*</span></Label>
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
            <Label className="font-sans text-sm">Describe the issue <span className="text-destructive">*</span></Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 1000))}
              placeholder="Describe the issue in detail..."
              className="mt-1 font-sans min-h-[100px]"
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              {description.length > 0 && description.length < 20 && (
                <p className="text-xs text-destructive font-sans">Minimum 20 characters required</p>
              )}
              <p className="text-xs text-muted-foreground font-sans ml-auto">{description.length}/1000</p>
            </div>
          </div>

          <div>
            <Label className="font-sans text-sm">Upload evidence (optional)</Label>
            <p className="text-xs text-muted-foreground font-sans mb-2">Upload screenshots, photos, or any supporting evidence</p>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <input type="file" accept="image/*,.pdf" multiple className="hidden" id="dispute-evidence" onChange={handleFileChange} />
              <label htmlFor="dispute-evidence" className="cursor-pointer">
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-sans text-muted-foreground">Click to upload files</p>
              </label>
            </div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-xs font-sans">
                    <span className="truncate max-w-[120px]">{f.name}</span>
                    <button onClick={() => removeFile(i)}><X className="w-3 h-3 text-muted-foreground hover:text-foreground" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground font-sans mt-3">
          By submitting, you agree to Naapio's dispute resolution process. False disputes may affect your account standing.
        </p>

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
