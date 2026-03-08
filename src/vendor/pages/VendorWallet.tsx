import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, ArrowUpRight, ArrowDownRight, Lock, TrendingUp, AlertTriangle, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockVendor, mockWalletTransactions } from "../data/vendorMockData";
import VendorDisputeModal from "../components/VendorDisputeModal";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  'Credited': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Deducted': 'bg-destructive/10 text-destructive',
  'Success': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'In Escrow': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Pending': 'bg-muted text-muted-foreground',
};

const VendorWallet = () => {
  const [earningsPeriod, setEarningsPeriod] = useState<'month' | 'quarter' | 'year' | 'lifetime'>('lifetime');
  const [txnFilter, setTxnFilter] = useState<'7' | '30' | '90'>('30');
  const [disputeOpen, setDisputeOpen] = useState(false);

  // Bank update modal
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', confirmAccount: '', ifsc: '' });
  const [bankOtpSent, setBankOtpSent] = useState(false);
  const [bankOtp, setBankOtp] = useState('');

  const handleWithdraw = () => {
    toast.success('Withdrawal request submitted. Funds will arrive in 5–7 business days.');
    // TODO: PAYMENT_INTEGRATION — POST /v1/vendor/withdrawals with amount + bank account id
  };

  const handleBankSave = () => {
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.ifsc) {
      toast.error('Please fill all required fields'); return;
    }
    if (bankForm.accountNumber !== bankForm.confirmAccount) {
      toast.error('Account numbers do not match'); return;
    }
    if (!bankOtpSent) {
      setBankOtpSent(true);
      toast.info('OTP sent to your registered mobile.');
      return;
    }
    if (!/^\d{4}$/.test(bankOtp)) {
      toast.error('Enter a valid 4-digit OTP'); return;
    }
    // TODO: AUTH_INTEGRATION — real OTP + bank verification via penny drop
    toast.success('Bank details updated and verified!');
    setBankModalOpen(false); setBankOtpSent(false); setBankOtp('');
    setBankForm({ bankName: '', accountNumber: '', confirmAccount: '', ifsc: '' });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">Wallet</h1>
        <p className="text-sm font-sans text-muted-foreground">Your earnings, escrow balance, and transaction history.</p>
      </div>

      {/* Snapshot cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Escrow */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-sans text-amber-700 dark:text-amber-300">In Escrow</span>
          </div>
          <p className="font-serif font-bold text-2xl text-amber-800 dark:text-amber-200">₹{mockVendor.escrowBalance.toLocaleString('en-IN')}</p>
          <p className="text-xs font-sans text-amber-600 dark:text-amber-400 mt-1">Releases upon order completion</p>
        </div>

        {/* Available */}
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-sans text-green-700 dark:text-green-300">Available to Withdraw</span>
          </div>
          <p className="font-serif font-bold text-2xl text-green-700 dark:text-green-300">₹{mockVendor.walletBalance.toLocaleString('en-IN')}</p>
          <Button variant="outline" size="sm" className="mt-3 text-xs border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={handleWithdraw}>
            Withdraw to Bank →
          </Button>
        </div>

        {/* Total Earnings */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs font-sans text-muted-foreground">Total Earnings</span>
          </div>
          <p className="font-serif font-bold text-2xl text-foreground">₹{mockVendor.totalEarnings.toLocaleString('en-IN')}</p>
          <div className="flex gap-1 mt-2">
            {(['month', 'quarter', 'year', 'lifetime'] as const).map(p => (
              <button
                key={p}
                onClick={() => setEarningsPeriod(p)}
                className={cn("px-2 py-0.5 rounded-full text-[10px] font-sans capitalize transition-colors",
                  earningsPeriod === p ? 'bg-accent text-accent-foreground font-semibold' : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          {/* TODO: API_INTEGRATION_POINT — show filtered totals per period */}
        </div>
      </div>

      {/* Bank account */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-sans font-semibold text-foreground">Bank Account</p>
          {mockVendor.bankAccount.verified && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px]">✓ Verified</Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏦</span>
          <div className="flex-1">
            <p className="text-sm font-sans text-foreground">{mockVendor.bankAccount.bank} — Account ending ••{mockVendor.bankAccount.accountLast4}</p>
            <p className="text-xs font-sans text-muted-foreground">IFSC: {mockVendor.bankAccount.ifsc}</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setBankModalOpen(true)}>
            Update Bank Details
          </Button>
        </div>
      </div>

      {/* Dispute */}
      <div className="mb-6">
        <button onClick={() => setDisputeOpen(true)} className="flex items-center gap-2 text-xs font-sans text-destructive hover:text-destructive/80 transition-colors">
          <AlertTriangle className="w-3.5 h-3.5" /> Raise a Dispute
        </button>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-serif font-bold text-lg text-foreground">Recent Transactions</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {(['7', '30', '90'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setTxnFilter(d)}
                  className={cn("px-2 py-1 rounded-full text-[10px] font-sans transition-colors",
                    txnFilter === d ? 'bg-accent text-accent-foreground font-semibold' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  Last {d} days
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => toast.info('Statement download coming soon — TODO: PDF_EXPORT')}>
              <Download className="w-3 h-3 mr-1" /> Statement
            </Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left text-xs font-sans font-semibold text-muted-foreground px-4 py-2.5">Date</th>
                <th className="text-left text-xs font-sans font-semibold text-muted-foreground px-4 py-2.5">Description</th>
                <th className="text-right text-xs font-sans font-semibold text-muted-foreground px-4 py-2.5">Amount</th>
                <th className="text-right text-xs font-sans font-semibold text-muted-foreground px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockWalletTransactions.map(txn => (
                <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-sans text-muted-foreground whitespace-nowrap">{txn.date}</td>
                  <td className="px-4 py-3 text-sm font-sans text-foreground">{txn.description}</td>
                  <td className={cn("px-4 py-3 text-sm font-sans font-semibold text-right whitespace-nowrap",
                    txn.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                    txn.type === 'escrow' ? 'text-amber-600 dark:text-amber-400' :
                    'text-foreground'
                  )}>
                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold", STATUS_STYLES[txn.status] || 'bg-muted text-muted-foreground')}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {mockWalletTransactions.map(txn => (
            <div key={txn.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                txn.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30' :
                txn.type === 'escrow' ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-muted'
              )}>
                {txn.type === 'credit' ? <ArrowUpRight className="w-4 h-4 text-green-600" /> :
                 txn.type === 'escrow' ? <Lock className="w-4 h-4 text-amber-600" /> :
                 <ArrowDownRight className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans text-foreground truncate">{txn.description}</p>
                <p className="text-xs font-sans text-muted-foreground">{txn.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn("text-sm font-sans font-semibold",
                  txn.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                  txn.type === 'escrow' ? 'text-amber-600 dark:text-amber-400' :
                  'text-foreground'
                )}>
                  {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                </p>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-sans", STATUS_STYLES[txn.status] || 'bg-muted text-muted-foreground')}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Modal */}
      <VendorDisputeModal open={disputeOpen} onClose={() => setDisputeOpen(false)} />

      {/* Bank Update Modal */}
      <Dialog open={bankModalOpen} onOpenChange={v => { if (!v) { setBankModalOpen(false); setBankOtpSent(false); setBankOtp(''); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Update Bank Details</DialogTitle>
            <DialogDescription className="font-sans">
              OTP will be sent to your registered mobile to verify changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label className="text-xs font-sans">Bank Name</Label>
              <Input value={bankForm.bankName} onChange={e => setBankForm(p => ({ ...p, bankName: e.target.value }))} placeholder="e.g. HDFC Bank" className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs font-sans">Account Number</Label>
              <Input value={bankForm.accountNumber} onChange={e => setBankForm(p => ({ ...p, accountNumber: e.target.value }))} placeholder="Enter account number" className="mt-1 h-8 text-xs" type="password" />
            </div>
            <div>
              <Label className="text-xs font-sans">Confirm Account Number</Label>
              <Input value={bankForm.confirmAccount} onChange={e => setBankForm(p => ({ ...p, confirmAccount: e.target.value }))} placeholder="Re-enter account number" className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs font-sans">IFSC Code</Label>
              <Input value={bankForm.ifsc} onChange={e => setBankForm(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))} placeholder="e.g. HDFC0001234" className="mt-1 h-8 text-xs" />
            </div>
            {bankOtpSent && (
              <div>
                <Label className="text-xs font-sans">Enter OTP</Label>
                <Input value={bankOtp} onChange={e => setBankOtp(e.target.value)} placeholder="4-digit OTP" maxLength={4} className="mt-1 h-8 text-xs" />
                <p className="text-[10px] font-sans text-muted-foreground mt-1">Demo mode — enter any 4 digits</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => { setBankModalOpen(false); setBankOtpSent(false); }} className="flex-1">Cancel</Button>
            <Button variant="gold" onClick={handleBankSave} className="flex-1">
              {bankOtpSent ? 'Verify & Save' : 'Send OTP →'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorWallet;
