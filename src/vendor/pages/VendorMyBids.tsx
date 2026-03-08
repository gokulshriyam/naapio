import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockMyBids, type MyBid } from "../data/vendorMockData";

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  accepted: 'bg-accent/15 text-accent',
  declined: 'bg-destructive/15 text-destructive',
  expired: 'bg-muted text-muted-foreground',
  withdrawn: 'bg-muted text-muted-foreground',
};

const VendorMyBids = () => {
  const [bids] = useState<MyBid[]>(mockMyBids);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? bids : bids.filter(b => b.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-foreground">My Bids</h1>
        <p className="text-sm font-sans text-muted-foreground">Track all your submitted bids and their status.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'active', 'accepted', 'expired', 'declined', 'withdrawn'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-sans capitalize transition-colors ${
              filter === s
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'all' ? `All (${bids.length})` : `${s} (${bids.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="font-serif font-bold text-lg text-foreground">No bids found</p>
          <p className="text-sm font-sans text-muted-foreground">Submit bids on open leads to see them here.</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(bid => (
          <div key={bid.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                {bid.category.includes('Women') ? '👗' : '🤵'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-sans font-semibold text-sm text-foreground">{bid.subCategory}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans font-semibold ${STATUS_COLORS[bid.status]}`}>
                    {bid.status}
                  </span>
                  {bid.outbidAlert && (
                    <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px]">⚠️ Outbid</Badge>
                  )}
                </div>
                <p className="text-xs font-sans text-muted-foreground">
                  #{bid.leadId} · {bid.customerFirstName}, {bid.city}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-sans">
                  <span>
                    <span className="text-muted-foreground">Your bid:</span>{' '}
                    <span className="font-semibold text-foreground">₹{bid.bidAmount.toLocaleString('en-IN')}</span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">Budget:</span>{' '}
                    ₹{bid.budgetMin.toLocaleString('en-IN')} – ₹{bid.budgetMax.toLocaleString('en-IN')}
                  </span>
                  <span>
                    <span className="text-muted-foreground">Rank:</span>{' '}
                    <span className="font-semibold text-accent">#{bid.myRank}</span> of {bid.totalBids}
                  </span>
                  <span>
                    <span className="text-muted-foreground">Range:</span>{' '}
                    ₹{bid.bidRangeMin.toLocaleString('en-IN')} – ₹{bid.bidRangeMax.toLocaleString('en-IN')}
                  </span>
                </div>
                {bid.message && (
                  <p className="text-xs font-sans text-muted-foreground mt-1 italic">"{bid.message}"</p>
                )}
                {bid.status === 'active' && (
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs h-7">Edit Bid</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive">Withdraw</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorMyBids;
