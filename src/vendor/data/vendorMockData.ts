export const mockVendor = {
  alias: 'Artisan Gold-7',
  realName: 'Priya Designs Studio',
  tier: 'Gold' as const,
  rating: 4.9,
  reviewCount: 234,
  completionRate: 97,
  disputeRate: 1.2,
  onTimeRate: 96,
  ordersCompleted: 158,
  location: 'Jayanagar, Bangalore',
  city: 'Bangalore',
  specialities: ['Bridal Lehenga', 'Saree Blouse', 'Anarkali'],
  walletBalance: 8500,
  escrowBalance: 31500,
  totalEarnings: 412000,
  bankAccount: { bank: 'HDFC Bank', accountLast4: '7823', ifsc: 'HDFC0001234', verified: true },
  vacationMode: false,
};

export type Lead = {
  id: string;
  orderType: string;
  category: string;
  subCategory: string;
  occasion: string;
  budgetMin: number;
  budgetMax: number;
  deliveryDate: string;
  postedAt: Date;
  bidDeadline: Date;
  city: string;
  isRushOrder: boolean;
  bidsCount: number;
  bidMin: number;
  bidMax: number;
  myBidRank: number | null;
  inspirationThumb: string;
  brief: string;
  customerFirstName: string;
  // Full brief fields
  fabricFeel?: string;
  colourMood?: string;
  selectedSurfaces?: string[];
  selectedFit?: string;
  selectedNeckline?: string;
  selectedSleeve?: string;
  dupattaOption?: string;
  liningOption?: string;
  additionalNotes?: string;
  inspirationPhoto?: string;
};

export const mockLeads: Lead[] = [
  {
    id: 'NP-2026-00142',
    orderType: 'New Order',
    category: "Women's",
    subCategory: 'Salwar Kameez',
    occasion: 'Festival / Puja',
    budgetMin: 8000,
    budgetMax: 12000,
    deliveryDate: '2026-04-20',
    postedAt: new Date(Date.now() - 0.5 * 86400000),
    bidDeadline: new Date(Date.now() + 6.5 * 86400000),
    city: 'Bangalore',
    isRushOrder: false,
    bidsCount: 3,
    bidMin: 8500,
    bidMax: 11800,
    myBidRank: null,
    inspirationThumb: '',
    brief: 'Heavily embroidered Salwar Kameez in deep green. Festive occasion. Prefer georgette or silk fabric. Reference image attached.',
    customerFirstName: 'Priya',
    fabricFeel: 'Light & Flowy',
    colourMood: 'Deep Greens',
    selectedSurfaces: ['Thread Embroidery', 'Sequin Work'],
    selectedFit: 'Regular / Comfort',
    selectedNeckline: 'Round Neck',
    selectedSleeve: '3/4 Sleeve',
    dupattaOption: '3-piece same fabric',
    liningOption: 'Partially Lined',
    additionalNotes: 'Prefer georgette fabric. Please keep embroidery subtle on sleeves.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
  },
  {
    id: 'NP-2026-00198',
    orderType: 'New Order',
    category: "Women's",
    subCategory: 'Lehenga',
    occasion: 'Wedding / Baraat',
    budgetMin: 45000,
    budgetMax: 60000,
    deliveryDate: '2026-05-10',
    postedAt: new Date(Date.now() - 1 * 86400000),
    bidDeadline: new Date(Date.now() + 6 * 86400000),
    city: 'Bangalore',
    isRushOrder: false,
    bidsCount: 7,
    bidMin: 44000,
    bidMax: 59000,
    myBidRank: null,
    inspirationThumb: '',
    brief: 'Bridal lehenga — full 3-piece set. Wants heavy embroidery, mirror work. Deep red preferred.',
    customerFirstName: 'Riya',
    fabricFeel: 'Rich & Heavy',
    colourMood: 'Deep Reds',
    selectedSurfaces: ['Heavy Embroidery', 'Mirror Work'],
    selectedFit: 'Close-fitted / Slim',
    selectedNeckline: 'V-Neck',
    selectedSleeve: 'Full Sleeve',
    dupattaOption: '3-piece same fabric',
    liningOption: 'Fully Lined',
    additionalNotes: 'Please ensure the mirror work is on the dupatta border as shown in reference.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=300&fit=crop',
  },
  {
    id: 'NP-2026-00201',
    orderType: 'Alteration',
    category: "Men's",
    subCategory: 'Sherwani',
    occasion: 'Wedding / Baraat',
    budgetMin: 2000,
    budgetMax: 5000,
    deliveryDate: '2026-04-05',
    postedAt: new Date(Date.now() - 2 * 86400000),
    bidDeadline: new Date(Date.now() + 5 * 86400000),
    city: 'Bangalore',
    isRushOrder: true,
    bidsCount: 2,
    bidMin: 2200,
    bidMax: 4800,
    myBidRank: null,
    inspirationThumb: '',
    brief: 'Sherwani needs sleeve shortening and waist taking in. Rush — event in 5 days.',
    customerFirstName: 'Arjun',
    additionalNotes: 'Sleeve shortening by 2 inches and waist taking in by 1.5 inches. Rush order.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop',
  },
  {
    id: 'NP-2026-00155',
    orderType: 'New Order',
    category: "Women's",
    subCategory: 'Saree Blouse',
    occasion: 'Reception / Cocktail',
    budgetMin: 3000,
    budgetMax: 6000,
    deliveryDate: '2026-04-15',
    postedAt: new Date(Date.now() - 3 * 86400000),
    bidDeadline: new Date(Date.now() + 4 * 86400000),
    city: 'Bangalore',
    isRushOrder: false,
    bidsCount: 5,
    bidMin: 3200,
    bidMax: 5800,
    myBidRank: null,
    inspirationThumb: '',
    brief: 'Backless blouse for silk saree. Deep V back, halter neck. Intricate hand embroidery.',
    customerFirstName: 'Meera',
    fabricFeel: 'Structured & Crisp',
    colourMood: 'Deep Blues',
    selectedSurfaces: ['Hand Embroidery', 'Zardosi Work'],
    selectedFit: 'Close-fitted / Slim',
    selectedNeckline: 'Halter Neck',
    selectedSleeve: 'Sleeveless',
    liningOption: 'Fully Lined',
    additionalNotes: 'Deep V-back with intricate hand embroidery. Must match the silk saree shade.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop',
  },
  {
    id: 'NP-2026-00167',
    orderType: 'New Order',
    category: "Men's",
    subCategory: 'Bandhgala',
    occasion: 'Formal Office / Corporate',
    budgetMin: 12000,
    budgetMax: 18000,
    deliveryDate: '2026-04-25',
    postedAt: new Date(Date.now() - 4 * 86400000),
    bidDeadline: new Date(Date.now() + 3 * 86400000),
    city: 'Bangalore',
    isRushOrder: false,
    bidsCount: 4,
    bidMin: 12500,
    bidMax: 17500,
    myBidRank: null,
    inspirationThumb: '',
    brief: 'Double-breasted bandhgala in navy blue. Formal office use. Premium fabric, clean finish.',
    customerFirstName: 'Rohan',
    fabricFeel: 'Structured & Crisp',
    colourMood: 'Navy / Dark Blues',
    selectedFit: 'Tailored / Slim',
    additionalNotes: 'Double-breasted style. Premium wool-blend fabric preferred. Clean minimalist finish.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  },
];

export type MyBid = {
  id: string;
  leadId: string;
  orderType: string;
  category: string;
  subCategory: string;
  customerFirstName: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  bidAmount: number;
  deliveryDate: string;
  submittedAt: Date;
  bidDeadline: Date;
  myRank: number;
  totalBids: number;
  bidRangeMin: number;
  bidRangeMax: number;
  status: 'active' | 'accepted' | 'declined' | 'expired' | 'withdrawn';
  message: string;
  inspirationThumb: string;
  outbidAlert: boolean;
  // Full brief fields
  occasion?: string;
  fabricFeel?: string;
  colourMood?: string;
  selectedSurfaces?: string[];
  selectedFit?: string;
  selectedNeckline?: string;
  selectedSleeve?: string;
  dupattaOption?: string;
  liningOption?: string;
  additionalNotes?: string;
  inspirationPhoto?: string;
  isRushOrder?: boolean;
};

export const mockMyBids: MyBid[] = [
  {
    id: 'BID-V-001',
    leadId: 'NP-2026-00098',
    orderType: 'New Order',
    category: "Women's",
    subCategory: 'Lehenga',
    customerFirstName: 'Sneha',
    city: 'Bangalore',
    budgetMin: 25000,
    budgetMax: 35000,
    bidAmount: 31500,
    deliveryDate: '2026-04-18',
    submittedAt: new Date(Date.now() - 2 * 86400000),
    bidDeadline: new Date(Date.now() + 2 * 86400000),
    myRank: 1,
    totalBids: 8,
    bidRangeMin: 25000,
    bidRangeMax: 32000,
    status: 'active',
    message: 'I specialise in heavily embroidered lehengas. Can match reference exactly.',
    inspirationThumb: '',
    outbidAlert: false,
    occasion: 'Wedding / Baraat',
    fabricFeel: 'Rich & Heavy',
    colourMood: 'Deep Reds',
    selectedSurfaces: ['Heavy Embroidery', 'Mirror Work'],
    selectedFit: 'Close-fitted / Slim',
    selectedNeckline: 'V-Neck',
    selectedSleeve: 'Full Sleeve',
    dupattaOption: '3-piece same fabric',
    liningOption: 'Fully Lined',
    additionalNotes: 'Please ensure the mirror work is on the dupatta border as shown in reference.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=300&fit=crop',
    isRushOrder: false,
  },
  {
    id: 'BID-V-002',
    leadId: 'NP-2026-00034',
    orderType: 'New Order',
    category: "Women's",
    subCategory: 'Anarkali',
    customerFirstName: 'Kavitha',
    city: 'Bangalore',
    budgetMin: 8000,
    budgetMax: 15000,
    bidAmount: 12000,
    deliveryDate: '2026-04-10',
    submittedAt: new Date(Date.now() - 5 * 86400000),
    bidDeadline: new Date(Date.now() - 1 * 86400000),
    myRank: 2,
    totalBids: 5,
    bidRangeMin: 9000,
    bidRangeMax: 13500,
    status: 'expired',
    message: '',
    inspirationThumb: '',
    outbidAlert: false,
    occasion: 'Festival / Puja',
    fabricFeel: 'Light & Flowy',
    colourMood: 'Pastels',
    selectedSurfaces: ['Thread Embroidery'],
    selectedFit: 'Flared / A-Line',
    additionalNotes: 'Prefer soft pastel colour with minimal embroidery. Comfortable for all-day wear.',
    inspirationPhoto: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
    isRushOrder: false,
  },
];

export const mockVendorActiveOrders = [
  {
    orderId: 'NP-2026-00098',
    orderType: 'New Order',
    category: "Women's",
    subCategory: 'Lehenga',
    customerFirstName: 'Sneha',
    city: 'Bangalore',
    bidAmount: 31500,
    platformFee: 6300,
    netEarning: 25200,
    deliveryDate: '2026-04-18',
    acceptedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    currentMilestone: 2,
    inspirationThumb: '',
    measurements: {
      'Bust': '36', 'Under-bust': '32', 'Waist': '28', 'Hip': '38',
      'Shoulder width': '14', 'Skirt length (waist to floor)': '42',
      'Height': "5'5\"",
    },
    brief: 'Bridal lehenga — full 3-piece set. Wants heavy embroidery, mirror work. Deep red preferred.',
    fabricFeel: 'Rich & Heavy',
    colourMood: 'Deep Reds',
    surfaces: ['Heavy Embroidery', 'Mirror Work'],
    occasion: 'Wedding / Baraat',
    deliveryDays: 18,
    // Full brief fields
    selectedFit: 'Close-fitted / Slim',
    selectedNeckline: 'V-Neck',
    selectedSleeve: 'Full Sleeve',
    dupattaOption: '3-piece same fabric',
    liningOption: 'Fully Lined',
    additionalNotes: 'Please ensure the mirror work is on the dupatta border as shown in reference.',
    budgetMin: 45000,
    budgetMax: 60000,
    isRushOrder: false,
    inspirationPhoto: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=300&fit=crop',
    m5Data: {
      awbNumber: 'DTDC2026098XY',
      courierService: 'DTDC',
      dispatchPhotoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      dispatchedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      markedDelivered: false,
    },
  },
];

export const mockWalletTransactions = [
  { id: 'TXN-001', date: '2026-03-01', description: 'Order NP-2026-00067 (Lehenga) — Escrow Release', amount: 28000, status: 'Credited', type: 'credit' as const },
  { id: 'TXN-002', date: '2026-03-01', description: 'Platform fee 20% — NP-2026-00067', amount: -7000, status: 'Deducted', type: 'debit' as const },
  { id: 'TXN-003', date: '2026-02-25', description: 'Withdrawal to HDFC Bank ••7823', amount: -15000, status: 'Success', type: 'debit' as const },
  { id: 'TXN-004', date: '2026-02-18', description: 'Order NP-2026-00055 (Saree Blouse) — Escrow Release', amount: 4800, status: 'Credited', type: 'credit' as const },
  { id: 'TXN-005', date: '2026-02-18', description: 'Platform fee 20% — NP-2026-00055', amount: -1200, status: 'Deducted', type: 'debit' as const },
  { id: 'TXN-006', date: '2026-03-07', description: 'Order NP-2026-00098 (Lehenga) — In Escrow', amount: 31500, status: 'In Escrow', type: 'escrow' as const },
];

export const mockVendorReviews = [
  { id: 'REV-001', customerName: 'Sneha K.', orderId: 'NP-2026-00067', garment: 'Lehenga', rating: 5.0, comment: 'Absolutely stunning work! The embroidery was perfect and delivery was on time.', date: 'Mar 1, 2026', responded: false, response: '' },
  { id: 'REV-002', customerName: 'Meera R.', orderId: 'NP-2026-00055', garment: 'Saree Blouse', rating: 4.8, comment: 'Beautiful blouse, exact as discussed. Minor delay in delivery but worth the wait.', date: 'Feb 18, 2026', responded: true, response: 'Thank you Meera! The hand embroidery took a bit longer than expected — glad you loved it.' },
  { id: 'REV-003', customerName: 'Divya M.', orderId: 'NP-2026-00041', garment: 'Anarkali', rating: 4.5, comment: 'Good fit and quality fabric. Would have liked slightly more detailed communication during stitching.', date: 'Jan 30, 2026', responded: false, response: '' },
];
