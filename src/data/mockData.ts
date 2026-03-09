export const customer = {
  name: "Priya Sharma",
  city: "Bangalore",
  email: "priya.sharma@email.com",
  phone: "98XXXXXX45",
  memberSince: "January 2024",
  measurements: {
    chest: 36, waist: 30, hips: 38, shoulderWidth: 15, sleeveLength: 23,
    backLength: 16, frontLength: 14, neck: 14, bicep: 12, forearm: 10,
    wrist: 6.5, thigh: 22, knee: 15, calf: 14, ankle: 9,
    torso: 17, crossBack: 14, crossFront: 13, armhole: 16, rise: 10, inseam: 32,
  },
  totalOrders: 4,
  totalSpent: 185000,
  avgRating: 4.6,
  preferredCategories: ["Lehenga", "Saree Blouse", "Anarkali"],
  preferredFabrics: ["Silk", "Velvet", "Georgette"],
};

export const activeRequests = [
  {
    id: "REQ-001",
    category: "Women's Lehenga",
    budgetMin: 45000,
    budgetMax: 60000,
    status: "matching" as const,
    statusLabel: "Matching with 50+ designers",
    bidsCount: 0,
    countdown: { days: 6, hours: 14 },
  },
  {
    id: "REQ-002",
    category: "Women's Lehenga",
    budgetMin: 25000,
    budgetMax: 35000,
    status: "bids_received" as const,
    statusLabel: "8 bids received",
    bidsCount: 8,
    countdown: { days: 3, hours: 0 },
  },
];

export const pastRequests = [
  {
    id: "REQ-099",
    category: "Saree Blouse",
    budgetMin: 3000,
    budgetMax: 5000,
    status: "delivered" as const,
    statusLabel: "Delivered",
    rating: 4.8,
    vendorName: "Artisan #7",
    completedDate: "Dec 2024",
  },
];

export const vendorBids = [
  {
    id: "BID-001",
    name: "Artisan #1",
    tier: "Silver" as const,
    rating: 4.5,
    location: "Jaipur",
    specialisations: ["Bridal", "Lehenga"],
    bidAmount: 28000,
    deliveryDays: 18,
    reviews: [
      "Beautiful craftsmanship, very detailed work!",
      "Delivered on time, excellent communication.",
    ],
    ordersCompleted: 180,
    isBestMatch: false,
  },
  {
    id: "BID-002",
    name: "Artisan #2",
    tier: "Gold" as const,
    rating: 4.7,
    location: "Surat",
    specialisations: ["Menswear", "Indo-Western"],
    bidAmount: 30000,
    deliveryDays: 20,
    reviews: [
      "Amazing fit, exactly what I envisioned.",
      "Professional and skilled artisan.",
    ],
    ordersCompleted: 290,
    isBestMatch: false,
  },
  {
    id: "BID-003",
    name: "Artisan #3",
    tier: "Gold" as const,
    rating: 4.9,
    location: "Bangalore",
    specialisations: ["Bridal", "Menswear", "Indo-Western"],
    bidAmount: 27000,
    deliveryDays: 16,
    reviews: [
      "Exceptional quality, exceeded my expectations!",
      "The best tailor I've worked with.",
    ],
    ordersCompleted: 340,
    isBestMatch: true,
  },
  {
    id: "BID-004",
    name: "Artisan #4",
    tier: "Bronze" as const,
    rating: 4.3,
    location: "Lucknow",
    specialisations: ["Kurta", "Sherwani"],
    bidAmount: 25500,
    deliveryDays: 22,
    reviews: [
      "Good work for the price, happy overall.",
      "Fabric selection was excellent.",
    ],
    ordersCompleted: 95,
    isBestMatch: false,
  },
  {
    id: "BID-005",
    name: "Artisan #5",
    tier: "Silver" as const,
    rating: 4.6,
    location: "Mumbai",
    specialisations: ["Gown", "Anarkali", "Bridal"],
    bidAmount: 31000,
    deliveryDays: 19,
    reviews: [
      "Stunning embroidery work, highly recommend.",
      "Very responsive and accommodating.",
    ],
    ordersCompleted: 210,
    isBestMatch: false,
  },
];

export const chatMessages = [
  { id: 1, sender: "customer" as const, text: "Hi! I love the design you showed in your portfolio. Can we discuss the fabric options?", time: "10:30 AM" },
  { id: 2, sender: "vendor" as const, text: "Thank you, Priya! I'd recommend German Velvet for the lehenga body and Silk Net for the dupatta. It'll give a rich, luxurious drape.", time: "10:35 AM" },
  { id: 3, sender: "customer" as const, text: "That sounds perfect! What about the embroidery — can you do zardozi work?", time: "10:38 AM" },
  { id: 4, sender: "vendor" as const, text: "Absolutely! Zardozi with kundan highlights is my speciality. I'll share some reference samples with you.", time: "10:42 AM" },
  { id: 5, sender: "customer" as const, text: "Great! And what's the timeline looking like?", time: "10:45 AM" },
  { id: 6, sender: "vendor" as const, text: "For the full lehenga with blouse and dupatta, I'd need about 16 working days. That's well within your deadline.", time: "10:48 AM" },
];

export const notifications = [
  { id: 1, type: "bid" as const, title: "New bid received", description: "Artisan #5 placed a bid of ₹31,000 on your Women's Lehenga request", time: "2 hours ago", unread: true },
  { id: 2, type: "milestone" as const, title: "Milestone update", description: "Artisan #3 has uploaded fabric swatches for your approval", time: "5 hours ago", unread: true },
  { id: 3, type: "chat" as const, title: "New message", description: "Artisan #3 sent you a message about fabric selection", time: "1 day ago", unread: false },
];

export const orderMilestones = [
  {
    id: 1,
    title: "Fit & Measurement Confirmation",
    status: "completed" as const,
    description: "Vendor confirmed all 21 measurements verified. Customer approved to proceed.",
    completedDate: "Feb 14, 2026",
    icon: "ruler",
  },
  {
    id: 2,
    title: "Fabric & Materials Approval",
    status: "action_required" as const,
    description: "Vendor has uploaded fabric swatch photos for your approval.",
    vendorMessage: "Hi Priya, procured the German Velvet for the lehenga body and net for the dupatta. See the texture photos below.",
    fabrics: [
      { name: "Red Velvet", color: "from-red-700 to-red-500" },
      { name: "Silk Net", color: "from-orange-300 to-orange-200" },
    ],
    icon: "scissors",
  },
  {
    id: 3,
    title: "Stitching in Progress",
    status: "in_progress" as const,
    description: "Your garment is being crafted with care.",
    estimatedDate: "Mar 15, 2026",
    progressUpdate: "Embroidery work 60% complete. Zardozi detailing on the lehenga border has begun.",
    icon: "thread",
  },
  {
    id: 4,
    title: "Virtual Trial (Video Proof)",
    status: "pending" as const,
    description: "Vendor will upload video/photos of garment on mannequin for your review.",
    icon: "video",
  },
  {
    id: 5,
    title: "Final Confirmation & Dispatch",
    status: "pending" as const,
    description: "Final garment photos, your approval, and shipping.",
    icon: "package",
  },
];

export const menCategories = [
  "Sherwani", "Kurta", "Bandhgala", "Suit", "Blazer", "Trousers", "Indo-Western",
];

export const womenCategories = [
  "Saree Blouse", "Lehenga", "Salwar Kameez", "Anarkali", "Gown", "Kurti", "Co-ord Set", "Jacket",
];

export const fabricOptions = [
  { name: "Silk", color: "from-amber-200 to-amber-100" },
  { name: "Cotton", color: "from-stone-200 to-stone-100" },
  { name: "Chiffon", color: "from-pink-100 to-pink-50" },
  { name: "Velvet", color: "from-red-800 to-red-600" },
  { name: "Linen", color: "from-yellow-100 to-yellow-50" },
  { name: "Georgette", color: "from-purple-200 to-purple-100" },
  { name: "Crepe", color: "from-teal-200 to-teal-100" },
  { name: "Brocade", color: "from-amber-500 to-amber-300" },
  { name: "Organza", color: "from-sky-100 to-sky-50" },
  { name: "Net", color: "from-rose-100 to-rose-50" },
  { name: "Denim", color: "from-blue-600 to-blue-400" },
  { name: "Wool", color: "from-gray-400 to-gray-300" },
  { name: "Blend", color: "from-emerald-200 to-emerald-100" },
];

export const measurementFields = [
  "Chest", "Waist", "Hips", "Shoulder Width", "Sleeve Length",
  "Back Length", "Front Length", "Neck", "Bicep", "Forearm",
  "Wrist", "Thigh", "Knee", "Calf", "Ankle",
  "Torso", "Cross Back", "Cross Front", "Armhole", "Rise", "Inseam",
];

export const faqItems = [
  {
    q: "How does the bidding process work?",
    a: "Upload your design inspiration, set your budget and timeline, and our verified master tailors will bid on your project. You compare bids, chat with artisans, and choose the best fit — all while vendor identities remain masked until you accept a bid.",
  },
  {
    q: "Is my payment protected?",
    a: "Absolutely. All payments are held in escrow and released to the artisan only when you approve each milestone. If you're not satisfied, our dispute resolution team steps in.",
  },
  {
    q: "How are tailors verified?",
    a: "Every tailor on Naapio goes through a rigorous 5-step verification: identity check, skill assessment, portfolio review, sample garment evaluation, and customer reference verification. Only top artisans make the cut.",
  },
  {
    q: "What if no vendor bids on my request?",
    a: "If no vendor bids within 7 days, your ₹499 posting fee is fully refunded. No questions asked.",
  },
  {
    q: "Can I share my measurements later?",
    a: "Yes! You can choose to provide measurements during the request or after accepting a bid.",
  },
  {
    q: "How is my measurement data protected?",
    a: "Your body measurements are sensitive personal data protected under the Digital Personal Data Protection Act, 2023. Data is encrypted, shared only with your accepted vendor, and can be deleted upon request within 72 hours.",
  },
  {
    q: "Can I get my existing clothes altered?",
    a: "Yes — select 'Alteration / Repair' when you start your order. Upload photos of your garment, describe what needs to change, and artisans will bid on your brief.",
  },
  {
    q: "Can I get embroidery or artwork added to my jacket or kurta?",
    a: "Yes — select 'Customise My Garment'. Upload photos of your existing garment and describe the artwork or embellishment you want. Embroiderers, zari artisans, and painters in our network will bid on your brief. This flow is for adding to an existing finished garment — not for stitching a new one.",
  },
  {
    q: "I have my own fabric. Can Naapio help with just the stitching?",
    a: "Yes — select 'I Have My Own Fabric' when you start. You skip the fabric sourcing steps and go straight to design, fit, and measurements. Your tailor works with the fabric you provide. Describe your fabric (type, colour, metres available) and the tailor will confirm it's sufficient for your garment.",
  },
  {
    q: "Do you cover regional garments like Mundu, Mekhela Chador, or Nauvari Saree?",
    a: "Yes — regional garments are covered under Men's Regional Traditional and Women's Regional Traditional categories in the wizard. These garments have their own measurement and construction logic built in, so your brief reaches tailors who specialise in them.",
  },
  {
    q: "I'm a tailor. How do I start receiving orders?",
    a: "Visit our Artisan page, submit your details for verification. Once approved, you'll see open customer briefs in your city and can start placing bids immediately.",
  },
  {
    q: "When do I get paid as an artisan?",
    a: "Payments are released within 7 days of the customer's final delivery approval. Funds are held in escrow throughout — so you're always protected.",
  },
  {
    q: "Can I set my own prices?",
    a: "Yes. You see the customer's budget range and submit your own bid. You decide your price — Naapio takes a platform commission on completed orders.",
  },
];
