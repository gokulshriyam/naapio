import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, Lock } from "lucide-react";
import { mockVendor, mockWalletTransactions } from "../data/vendorMockData";
import { toast } from "sonner";

const VendorWallet = () => {
  const handleWithdraw = () => {
    toast.success('Withdrawal request submitted. Funds will arrive in 1-2 business days.');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">Wallet</h1>
        <p className="text-sm font-sans text-muted-foreground">Your earnings, escrow balance, and transaction history.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-accent" />
            <span className="text-xs font-sans text-muted-foreground">Available Balance</span>
          </div>
          <p className="font-serif font-bold text-2xl text-foreground">₹{mockVendor.walletBalance.toLocaleString('en-IN')}</p>
          <Button variant="gold" size="sm" className="mt-3 text-xs" onClick={handleWithdraw}>
            Withdraw to Bank →
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-sans text-muted-foreground">In Escrow</span>
          </div>
          <p className="font-serif font-bold text-2xl text-amber-600 dark:text-amber-400">₹{mockVendor.escrowBalance.toLocaleString('en-IN')}</p>
          <p className="text-xs font-sans text-muted-foreground mt-1">Released after customer approval</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-xs font-sans text-muted-foreground">Total Earnings</span>
          </div>
          <p className="font-serif font-bold text-2xl text-green-600 dark:text-green-400">₹{mockVendor.totalEarnings.toLocaleString('en-IN')}</p>
          <p className="text-xs font-sans text-muted-foreground mt-1">Lifetime on Naapio</p>
        </div>
      </div>

      {/* Bank account */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8">
        <p className="text-sm font-sans font-semibold text-foreground mb-2">Linked Bank Account</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏦</span>
          <div>
            <p className="text-sm font-sans text-foreground">{mockVendor.bankAccount.bank} ••{mockVendor.bankAccount.accountLast4}</p>
            <p className="text-xs font-sans text-muted-foreground">IFSC: {mockVendor.bankAccount.ifsc}</p>
          </div>
          {mockVendor.bankAccount.verified && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px]">✓ Verified</Badge>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="font-serif font-bold text-lg text-foreground mb-4">Transaction History</h2>
        <div className="space-y-2">
          {mockWalletTransactions.map(txn => (
            <div key={txn.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                txn.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30' :
                txn.type === 'escrow' ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-muted'
              }`}>
                {txn.type === 'credit' ? <ArrowUpRight className="w-4 h-4 text-green-600" /> :
                 txn.type === 'escrow' ? <Lock className="w-4 h-4 text-amber-600" /> :
                 <ArrowDownRight className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans text-foreground truncate">{txn.description}</p>
                <p className="text-xs font-sans text-muted-foreground">{txn.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-sans font-semibold ${
                  txn.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                  txn.type === 'escrow' ? 'text-amber-600 dark:text-amber-400' :
                  'text-foreground'
                }`}>
                  {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-sans text-muted-foreground">{txn.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorWallet;
