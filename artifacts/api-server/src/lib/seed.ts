import { sql } from "drizzle-orm";
import {
  db,
  usersTable,
  categoriesTable,
  vendorsTable,
  productsTable,
  ordersTable,
  conversationsTable,
  messagesTable,
  sessionTable,
  listingsTable,
  requestsTable,
  offersTable,
  walletsTable,
  walletTransactionsTable,
  referralsTable,
  subscriptionsTable,
} from "@workspace/db";
import type {
  OrderItemRow,
  ShippingAddressRow,
  TimelineEvent,
} from "@workspace/db";
import { logger } from "./logger";

const PLACEHOLDER = "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80";

function img(seed: string, w = 800): string {
  // Deterministic placeholder image service that returns themed photos.
  return `https://picsum.photos/seed/suuqlink-${encodeURIComponent(seed)}/${w}/${Math.round(w * 0.75)}`;
}

function avatar(seed: string): string {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=fde68a,fed7aa,fecaca,c7d2fe,bbf7d0,a7f3d0`;
}

function logo(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f766e,065f46,b91c1c,a16207,7c2d12`;
}

const CATEGORIES = [
  { slug: "fashion", name: "Fashion", icon: "Shirt", accentColor: "#e11d48" },
  { slug: "electronics", name: "Electronics", icon: "Smartphone", accentColor: "#0ea5e9" },
  { slug: "home", name: "Home & Living", icon: "Home", accentColor: "#a16207" },
  { slug: "beauty", name: "Beauty", icon: "Sparkles", accentColor: "#db2777" },
  { slug: "groceries", name: "Groceries", icon: "ShoppingBasket", accentColor: "#16a34a" },
  { slug: "crafts", name: "Local Crafts", icon: "Palette", accentColor: "#7c2d12" },
  { slug: "kids", name: "Kids & Baby", icon: "Baby", accentColor: "#f59e0b" },
  { slug: "sports", name: "Sports", icon: "Dumbbell", accentColor: "#0d9488" },
];

const VENDORS = [
  {
    slug: "hodan-textiles",
    name: "Hodan Textiles",
    tagline: "Handwoven dirac and modern cuts from Mogadishu",
    about:
      "A family-owned atelier in the heart of Mogadishu, Hodan Textiles has been weaving heritage into contemporary silhouettes since 2009. Every piece is finished by hand.",
    city: "Mogadishu",
    country: "Somalia",
    rating: "4.92",
    reviewCount: 1284,
    badges: ["Top Seller", "Verified", "Fast Shipping"],
    featured: true,
    responseTimeMins: 8,
    fulfillmentRate: "0.987",
  },
  {
    slug: "savannah-electronics",
    name: "Savannah Electronics",
    tagline: "Genuine phones, audio and accessories",
    about:
      "Nairobi's trusted source for authentic electronics. Authorized retailer with manufacturer warranties and same-day delivery in CBD.",
    city: "Nairobi",
    country: "Kenya",
    rating: "4.81",
    reviewCount: 2145,
    badges: ["Authorized", "Verified", "Warranty"],
    featured: true,
    responseTimeMins: 12,
    fulfillmentRate: "0.971",
  },
  {
    slug: "addis-coffee-co",
    name: "Addis Coffee Co.",
    tagline: "Single-origin Ethiopian beans, freshly roasted",
    about:
      "Direct-trade specialty coffee sourced from smallholder farms in Yirgacheffe and Sidama. Roasted weekly in small batches in Addis Ababa.",
    city: "Addis Ababa",
    country: "Ethiopia",
    rating: "4.95",
    reviewCount: 876,
    badges: ["Direct Trade", "Verified", "Award-winning"],
    featured: true,
    responseTimeMins: 20,
    fulfillmentRate: "0.992",
  },
  {
    slug: "lagos-leather",
    name: "Lagos Leather Works",
    tagline: "Hand-stitched leather goods, made to last",
    about:
      "Heritage leather workshop in Lagos producing wallets, bags, and accessories from full-grain Nigerian leather. Lifetime repair guarantee on every piece.",
    city: "Lagos",
    country: "Nigeria",
    rating: "4.88",
    reviewCount: 643,
    badges: ["Handmade", "Verified", "Lifetime Warranty"],
    featured: false,
    responseTimeMins: 18,
    fulfillmentRate: "0.965",
  },
  {
    slug: "dhaka-home",
    name: "Dhaka Home Studio",
    tagline: "Modern home essentials with Bengali soul",
    about:
      "Curated home goods that bridge traditional Bangladeshi craft with contemporary minimalism. Every item is sourced from local artisan cooperatives.",
    city: "Dhaka",
    country: "Bangladesh",
    rating: "4.79",
    reviewCount: 412,
    badges: ["Artisan-made", "Verified"],
    featured: true,
    responseTimeMins: 25,
    fulfillmentRate: "0.954",
  },
  {
    slug: "karachi-beauty",
    name: "Karachi Beauty Bar",
    tagline: "Clean beauty, halal-certified, made in Pakistan",
    about:
      "Locally-formulated skincare and beauty products. Cruelty-free, halal-certified, and tested for South Asian skin tones.",
    city: "Karachi",
    country: "Pakistan",
    rating: "4.84",
    reviewCount: 998,
    badges: ["Halal Certified", "Verified", "Cruelty-free"],
    featured: false,
    responseTimeMins: 15,
    fulfillmentRate: "0.979",
  },
  {
    slug: "kampala-crafts",
    name: "Kampala Crafts",
    tagline: "Bark cloth, beadwork, and woven baskets",
    about:
      "A women-led cooperative in Kampala specializing in traditional Ugandan crafts. Every purchase directly supports rural artisans.",
    city: "Kampala",
    country: "Uganda",
    rating: "4.91",
    reviewCount: 521,
    badges: ["Women-led", "Verified", "Fair Trade"],
    featured: false,
    responseTimeMins: 30,
    fulfillmentRate: "0.948",
  },
  {
    slug: "berbera-spice",
    name: "Berbera Spice House",
    tagline: "Frankincense, myrrh and Somali spice blends",
    about:
      "Sourced from the highlands of Somaliland, our spices and resins are graded by hand and shipped fresh worldwide.",
    city: "Berbera",
    country: "Somalia",
    rating: "4.87",
    reviewCount: 312,
    badges: ["Single-origin", "Verified"],
    featured: false,
    responseTimeMins: 22,
    fulfillmentRate: "0.961",
  },
];

type ProductSeed = {
  slug: string;
  title: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  currency: string;
  vendorSlug: string;
  categorySlug: string;
  rating: string;
  reviewCount: number;
  badges: string[];
  shippingDays: number;
  trendingScore: string;
  featured: boolean;
  specs: Array<{ label: string; value: string }>;
  imageSeed: string;
};

const PRODUCTS: ProductSeed[] = [
  {
    slug: "hodan-saffron-dirac",
    title: "Saffron Embroidered Dirac",
    description:
      "A flowing dirac in saffron silk-blend with hand-embroidered gold detailing along the neckline and hem. Loose, elegant, and made to move.",
    price: "89.00",
    compareAtPrice: "120.00",
    currency: "USD",
    vendorSlug: "hodan-textiles",
    categorySlug: "fashion",
    rating: "4.93",
    reviewCount: 184,
    badges: ["Best Seller", "Handmade"],
    shippingDays: 4,
    trendingScore: "98.0",
    featured: true,
    specs: [
      { label: "Material", value: "Silk blend" },
      { label: "Care", value: "Dry clean only" },
      { label: "Origin", value: "Mogadishu, Somalia" },
    ],
    imageSeed: "dirac-saffron",
  },
  {
    slug: "hodan-indigo-guntiino",
    title: "Indigo Guntiino Wrap",
    description:
      "A two-piece guntiino in deep indigo with a contrasting cream sash. Lightweight cotton, hand-finished edges.",
    price: "64.00",
    currency: "USD",
    vendorSlug: "hodan-textiles",
    categorySlug: "fashion",
    rating: "4.89",
    reviewCount: 96,
    badges: ["New"],
    shippingDays: 4,
    trendingScore: "72.0",
    featured: false,
    specs: [
      { label: "Material", value: "Cotton" },
      { label: "Pieces", value: "Top + sash" },
    ],
    imageSeed: "guntiino-indigo",
  },
  {
    slug: "savannah-pixel-pro",
    title: "Pixel Pro 8 — 256GB",
    description:
      "Brand new sealed Pixel Pro 8 with 256GB storage. Authorized retailer with full 24-month warranty and same-day delivery in Nairobi.",
    price: "899.00",
    compareAtPrice: "999.00",
    currency: "USD",
    vendorSlug: "savannah-electronics",
    categorySlug: "electronics",
    rating: "4.85",
    reviewCount: 412,
    badges: ["Warranty", "Authorized"],
    shippingDays: 1,
    trendingScore: "99.0",
    featured: true,
    specs: [
      { label: "Storage", value: "256GB" },
      { label: "Warranty", value: "24 months" },
      { label: "Condition", value: "Sealed new" },
    ],
    imageSeed: "phone-pixel",
  },
  {
    slug: "savannah-jbl-flip",
    title: "JBL Flip 6 Bluetooth Speaker",
    description:
      "Genuine JBL Flip 6 with 12 hours of playtime, IP67 waterproof, and PartyBoost pairing. Includes original box and warranty.",
    price: "129.00",
    currency: "USD",
    vendorSlug: "savannah-electronics",
    categorySlug: "electronics",
    rating: "4.78",
    reviewCount: 287,
    badges: ["Warranty"],
    shippingDays: 2,
    trendingScore: "84.0",
    featured: false,
    specs: [
      { label: "Battery", value: "12 hours" },
      { label: "Rating", value: "IP67 Waterproof" },
    ],
    imageSeed: "speaker-jbl",
  },
  {
    slug: "savannah-airbuds-x",
    title: "Wireless AirBuds X Pro",
    description:
      "True wireless earbuds with active noise cancellation, transparency mode, and 30-hour battery with the charging case.",
    price: "59.00",
    compareAtPrice: "79.00",
    currency: "USD",
    vendorSlug: "savannah-electronics",
    categorySlug: "electronics",
    rating: "4.62",
    reviewCount: 521,
    badges: ["Hot Deal"],
    shippingDays: 1,
    trendingScore: "92.0",
    featured: true,
    specs: [
      { label: "Battery", value: "30 hours total" },
      { label: "Features", value: "ANC + Transparency" },
    ],
    imageSeed: "earbuds",
  },
  {
    slug: "addis-yirgacheffe",
    title: "Yirgacheffe Single-Origin — 250g",
    description:
      "Bright, floral, and citrus-forward beans from the Yirgacheffe region. Roasted within the last 7 days. Whole bean or ground to your spec.",
    price: "18.00",
    currency: "USD",
    vendorSlug: "addis-coffee-co",
    categorySlug: "groceries",
    rating: "4.96",
    reviewCount: 234,
    badges: ["Fresh Roast", "Direct Trade"],
    shippingDays: 3,
    trendingScore: "88.0",
    featured: true,
    specs: [
      { label: "Weight", value: "250g" },
      { label: "Roast", value: "Light-medium" },
      { label: "Origin", value: "Yirgacheffe, Ethiopia" },
    ],
    imageSeed: "coffee-yirgacheffe",
  },
  {
    slug: "addis-sidama-natural",
    title: "Sidama Natural — 250g",
    description:
      "Naturally processed Sidama beans with notes of blueberry, dark chocolate, and red wine. Bold and complex.",
    price: "20.00",
    currency: "USD",
    vendorSlug: "addis-coffee-co",
    categorySlug: "groceries",
    rating: "4.92",
    reviewCount: 178,
    badges: ["Fresh Roast"],
    shippingDays: 3,
    trendingScore: "76.0",
    featured: false,
    specs: [
      { label: "Weight", value: "250g" },
      { label: "Process", value: "Natural" },
    ],
    imageSeed: "coffee-sidama",
  },
  {
    slug: "lagos-cardholder",
    title: "Minimalist Bifold Cardholder",
    description:
      "Hand-stitched bifold cardholder in full-grain Nigerian leather. Holds 8 cards plus folded notes. Patinas beautifully with use.",
    price: "45.00",
    currency: "USD",
    vendorSlug: "lagos-leather",
    categorySlug: "fashion",
    rating: "4.88",
    reviewCount: 142,
    badges: ["Handmade", "Lifetime Warranty"],
    shippingDays: 5,
    trendingScore: "68.0",
    featured: false,
    specs: [
      { label: "Material", value: "Full-grain leather" },
      { label: "Capacity", value: "8 cards + cash" },
    ],
    imageSeed: "leather-wallet",
  },
  {
    slug: "lagos-tote",
    title: "Heritage Leather Tote",
    description:
      "A roomy everyday tote with reinforced handles, interior zip pocket, and brass hardware. Built for daily wear that gets better with age.",
    price: "189.00",
    currency: "USD",
    vendorSlug: "lagos-leather",
    categorySlug: "fashion",
    rating: "4.91",
    reviewCount: 87,
    badges: ["Handmade", "New"],
    shippingDays: 6,
    trendingScore: "65.0",
    featured: true,
    specs: [
      { label: "Material", value: "Full-grain leather" },
      { label: "Hardware", value: "Solid brass" },
    ],
    imageSeed: "leather-tote",
  },
  {
    slug: "dhaka-jute-rug",
    title: "Handwoven Jute Rug — 5x7",
    description:
      "Naturally dyed jute rug woven by a women's cooperative in Dhaka. Soft underfoot, biodegradable, and one-of-a-kind.",
    price: "129.00",
    currency: "USD",
    vendorSlug: "dhaka-home",
    categorySlug: "home",
    rating: "4.82",
    reviewCount: 64,
    badges: ["Artisan-made"],
    shippingDays: 7,
    trendingScore: "58.0",
    featured: false,
    specs: [
      { label: "Size", value: "5x7 ft" },
      { label: "Material", value: "100% jute" },
    ],
    imageSeed: "rug-jute",
  },
  {
    slug: "dhaka-clay-set",
    title: "Stoneware Dinner Set for 4",
    description:
      "Hand-thrown stoneware dinner set including 4 dinner plates, 4 bowls, and 4 cups. Microwave and dishwasher safe.",
    price: "98.00",
    compareAtPrice: "140.00",
    currency: "USD",
    vendorSlug: "dhaka-home",
    categorySlug: "home",
    rating: "4.74",
    reviewCount: 41,
    badges: ["Hot Deal"],
    shippingDays: 6,
    trendingScore: "62.0",
    featured: true,
    specs: [
      { label: "Pieces", value: "12" },
      { label: "Care", value: "Dishwasher safe" },
    ],
    imageSeed: "stoneware-set",
  },
  {
    slug: "karachi-rose-serum",
    title: "Damask Rose Hydrating Serum",
    description:
      "Lightweight hyaluronic-acid serum infused with Damask rose hydrosol. Fragrance-free, halal-certified, and made for sensitive skin.",
    price: "32.00",
    currency: "USD",
    vendorSlug: "karachi-beauty",
    categorySlug: "beauty",
    rating: "4.86",
    reviewCount: 268,
    badges: ["Halal Certified", "Best Seller"],
    shippingDays: 3,
    trendingScore: "82.0",
    featured: true,
    specs: [
      { label: "Volume", value: "30ml" },
      { label: "Skin type", value: "All, including sensitive" },
    ],
    imageSeed: "serum-rose",
  },
  {
    slug: "karachi-kohl",
    title: "Surma Black Kohl Liner",
    description:
      "Traditional surma kohl in a modern twist-up applicator. Smudge-resistant and ophthalmologist-tested for everyday wear.",
    price: "14.00",
    currency: "USD",
    vendorSlug: "karachi-beauty",
    categorySlug: "beauty",
    rating: "4.71",
    reviewCount: 156,
    badges: ["Halal Certified"],
    shippingDays: 3,
    trendingScore: "55.0",
    featured: false,
    specs: [{ label: "Form", value: "Twist-up" }],
    imageSeed: "kohl-liner",
  },
  {
    slug: "kampala-basket",
    title: "Bukedo Woven Storage Basket",
    description:
      "A medium-sized basket woven from raffia and banana fiber by Kampala artisans. Each piece carries the weaver's signature pattern.",
    price: "42.00",
    currency: "USD",
    vendorSlug: "kampala-crafts",
    categorySlug: "crafts",
    rating: "4.94",
    reviewCount: 87,
    badges: ["Fair Trade", "Handmade"],
    shippingDays: 8,
    trendingScore: "60.0",
    featured: false,
    specs: [
      { label: "Diameter", value: "30cm" },
      { label: "Material", value: "Raffia & banana fiber" },
    ],
    imageSeed: "basket-woven",
  },
  {
    slug: "kampala-bark-runner",
    title: "Bark Cloth Table Runner",
    description:
      "Traditional Ugandan bark cloth, hand-beaten and finished with a soft hem. Length 180cm.",
    price: "55.00",
    currency: "USD",
    vendorSlug: "kampala-crafts",
    categorySlug: "home",
    rating: "4.81",
    reviewCount: 34,
    badges: ["Fair Trade"],
    shippingDays: 9,
    trendingScore: "44.0",
    featured: false,
    specs: [{ label: "Length", value: "180cm" }],
    imageSeed: "bark-runner",
  },
  {
    slug: "berbera-frankincense",
    title: "Royal Hojari Frankincense — 100g",
    description:
      "The highest grade of Boswellia sacra resin from the cliffs of Somaliland. Pale green tears with a citrus-pine aroma when burned.",
    price: "28.00",
    currency: "USD",
    vendorSlug: "berbera-spice",
    categorySlug: "groceries",
    rating: "4.92",
    reviewCount: 124,
    badges: ["Single-origin"],
    shippingDays: 6,
    trendingScore: "71.0",
    featured: true,
    specs: [
      { label: "Weight", value: "100g" },
      { label: "Grade", value: "Royal Hojari" },
    ],
    imageSeed: "frankincense",
  },
  {
    slug: "berbera-xawash",
    title: "Xawash Spice Blend — 80g",
    description:
      "The classic Somali spice blend of cumin, coriander, cardamom, cloves, and black pepper. Hand-ground and packed in resealable tins.",
    price: "12.00",
    currency: "USD",
    vendorSlug: "berbera-spice",
    categorySlug: "groceries",
    rating: "4.88",
    reviewCount: 98,
    badges: ["New"],
    shippingDays: 5,
    trendingScore: "48.0",
    featured: false,
    specs: [{ label: "Weight", value: "80g" }],
    imageSeed: "xawash",
  },
];

const REVIEW_AUTHORS = [
  "Amina K.",
  "Yusuf O.",
  "Fartun A.",
  "Mohamed I.",
  "Hawa B.",
  "Daniel M.",
  "Ifra S.",
  "Khalid R.",
  "Zara T.",
];

const REVIEW_BODIES = [
  "Honestly the nicest thing I've bought online in months. Quality felt premium and shipping was fast.",
  "Exactly as pictured. Vendor was responsive and packed everything beautifully.",
  "Great value for the price. Would order from this seller again.",
  "Took a few extra days to arrive but worth the wait. Five stars.",
  "Absolutely beautiful craftsmanship. You can feel the care that went into it.",
  "Solid product, fair price, and great communication from the seller.",
];

function buildReviews(productSlug: string, count: number) {
  const out: Array<{
    id: number;
    author: string;
    rating: number;
    body: string;
    createdAt: string;
  }> = [];
  const base = Date.now();
  for (let i = 0; i < count; i++) {
    out.push({
      id: i + 1,
      author: REVIEW_AUTHORS[(i + productSlug.length) % REVIEW_AUTHORS.length],
      rating: 4 + ((i * 7 + productSlug.length) % 2 === 0 ? 1 : 0.5),
      body: REVIEW_BODIES[(i + productSlug.length) % REVIEW_BODIES.length],
      createdAt: new Date(base - (i + 1) * 86400000 * 3).toISOString(),
    });
  }
  return out;
}

export async function ensureSeedData(): Promise<void> {
  const existingUsers = await db.select().from(usersTable).limit(1);
  if (existingUsers.length > 0) {
    logger.info("Seed: data already present, skipping");
    return;
  }

  logger.info("Seed: populating SuuqLink with starter data");

  // Users
  const [buyer] = await db
    .insert(usersTable)
    .values({
      name: "Amina Yusuf",
      email: "amina@suuqlink.app",
      role: "buyer",
      avatarUrl: avatar("amina"),
      language: "en",
      currency: "USD",
    })
    .returning();

  const [sellerUser] = await db
    .insert(usersTable)
    .values({
      name: "Hodan Mohamed",
      email: "hodan@suuqlink.app",
      role: "seller",
      avatarUrl: avatar("hodan"),
      language: "en",
      currency: "USD",
    })
    .returning();

  const [adminUser] = await db
    .insert(usersTable)
    .values({
      name: "Daniel Operator",
      email: "admin@suuqlink.app",
      role: "admin",
      avatarUrl: avatar("daniel"),
      language: "en",
      currency: "USD",
    })
    .returning();

  // Categories
  await db.insert(categoriesTable).values(CATEGORIES);

  // Vendors
  const insertedVendors = await db
    .insert(vendorsTable)
    .values(
      VENDORS.map((v) => ({
        ...v,
        logoUrl: logo(v.slug),
        coverUrl: img(`cover-${v.slug}`, 1200),
      })),
    )
    .returning();

  const vendorBySlug = new Map(insertedVendors.map((v) => [v.slug, v]));
  // Link the seller user to Hodan Textiles
  const hodanVendor = vendorBySlug.get("hodan-textiles");
  if (hodanVendor) {
    await db
      .update(usersTable)
      .set({ vendorId: hodanVendor.id })
      .where(sql`${usersTable.id} = ${sellerUser.id}`);
  }

  // Products
  const productRows = PRODUCTS.map((p) => {
    const vendor = vendorBySlug.get(p.vendorSlug);
    if (!vendor) throw new Error(`Missing vendor ${p.vendorSlug}`);
    const mainImg = img(p.imageSeed, 800);
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      currency: p.currency,
      imageUrl: mainImg,
      gallery: [
        mainImg,
        img(`${p.imageSeed}-2`, 800),
        img(`${p.imageSeed}-3`, 800),
        img(`${p.imageSeed}-4`, 800),
      ],
      vendorId: vendor.id,
      categorySlug: p.categorySlug,
      rating: p.rating,
      reviewCount: p.reviewCount,
      inStock: true,
      badges: p.badges,
      shippingDays: p.shippingDays,
      trendingScore: p.trendingScore,
      featured: p.featured,
      specs: p.specs,
      reviews: buildReviews(p.slug, 4),
    };
  });

  await db.insert(productsTable).values(productRows);

  // (vendor product counts are computed on read)

  // Sample order
  const sampleProducts = await db.select().from(productsTable).limit(3);
  if (sampleProducts.length >= 2) {
    const items: OrderItemRow[] = sampleProducts.slice(0, 2).map((p, i) => ({
      id: i + 1,
      productId: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
      vendorName:
        insertedVendors.find((v) => v.id === p.vendorId)?.name ?? "Vendor",
      price: Number(p.price),
      currency: p.currency,
      quantity: 1,
    }));
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = 4.99;
    const tax = +(subtotal * 0.05).toFixed(2);
    const total = +(subtotal + shipping + tax).toFixed(2);
    const address: ShippingAddressRow = {
      fullName: buyer.name,
      phone: "+252 61 234 5678",
      line1: "Hamarweyne District, Plot 14",
      line2: null,
      city: "Mogadishu",
      region: "Banaadir",
      country: "Somalia",
      notes: "Call on arrival",
    };
    const now = Date.now();
    const timeline: TimelineEvent[] = [
      {
        status: "placed",
        label: "Order placed",
        at: new Date(now - 86400000 * 2).toISOString(),
        completed: true,
      },
      {
        status: "confirmed",
        label: "Confirmed by seller",
        at: new Date(now - 86400000 * 2 + 3600000).toISOString(),
        completed: true,
      },
      {
        status: "packed",
        label: "Packed",
        at: new Date(now - 86400000).toISOString(),
        completed: true,
      },
      {
        status: "shipped",
        label: "Shipped",
        at: new Date(now - 3600000 * 6).toISOString(),
        completed: true,
      },
      {
        status: "out_for_delivery",
        label: "Out for delivery",
        at: new Date(now + 3600000 * 4).toISOString(),
        completed: false,
      },
      {
        status: "delivered",
        label: "Delivered",
        at: new Date(now + 86400000).toISOString(),
        completed: false,
      },
    ];
    await db.insert(ordersTable).values({
      userId: buyer.id,
      reference: "SQ-100023",
      status: "shipped",
      items,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      currency: "USD",
      shippingAddress: address,
      paymentMethod: "mobile_money",
      estimatedDelivery: new Date(now + 86400000),
      timeline,
    });

    // Older delivered order
    const items2: OrderItemRow[] = [
      {
        id: 1,
        productId: sampleProducts[2]?.id ?? sampleProducts[0].id,
        title:
          sampleProducts[2]?.title ?? sampleProducts[0].title,
        imageUrl:
          sampleProducts[2]?.imageUrl ?? sampleProducts[0].imageUrl,
        vendorName: "SuuqLink Vendor",
        price: Number(sampleProducts[2]?.price ?? sampleProducts[0].price),
        currency: "USD",
        quantity: 2,
      },
    ];
    const sub2 = items2.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax2 = +(sub2 * 0.05).toFixed(2);
    const total2 = +(sub2 + 6.99 + tax2).toFixed(2);
    const t2 = now - 86400000 * 9;
    await db.insert(ordersTable).values({
      userId: buyer.id,
      reference: "SQ-100018",
      status: "delivered",
      items: items2,
      subtotal: sub2.toFixed(2),
      shipping: "6.99",
      tax: tax2.toFixed(2),
      total: total2.toFixed(2),
      currency: "USD",
      shippingAddress: address,
      paymentMethod: "card",
      estimatedDelivery: new Date(t2 + 86400000 * 4),
      timeline: [
        {
          status: "placed",
          label: "Order placed",
          at: new Date(t2).toISOString(),
          completed: true,
        },
        {
          status: "confirmed",
          label: "Confirmed",
          at: new Date(t2 + 3600000).toISOString(),
          completed: true,
        },
        {
          status: "packed",
          label: "Packed",
          at: new Date(t2 + 86400000).toISOString(),
          completed: true,
        },
        {
          status: "shipped",
          label: "Shipped",
          at: new Date(t2 + 86400000 * 2).toISOString(),
          completed: true,
        },
        {
          status: "delivered",
          label: "Delivered",
          at: new Date(t2 + 86400000 * 4).toISOString(),
          completed: true,
        },
      ],
    });
  }

  // Sample conversation
  const featuredVendor = insertedVendors[0];
  const [conversation] = await db
    .insert(conversationsTable)
    .values({
      userId: buyer.id,
      vendorId: featuredVendor.id,
      unreadCount: 1,
    })
    .returning();
  const baseTime = Date.now();
  await db.insert(messagesTable).values([
    {
      conversationId: conversation.id,
      author: "me",
      body: "Hi! Do you have the Saffron Dirac in size M?",
      createdAt: new Date(baseTime - 3600000 * 6),
    },
    {
      conversationId: conversation.id,
      author: "vendor",
      body: "Asalaamu alaikum Amina! Yes, we have one M left in stock — would you like me to reserve it?",
      createdAt: new Date(baseTime - 3600000 * 5),
    },
    {
      conversationId: conversation.id,
      author: "me",
      body: "Yes please. Can you confirm shipping to Mogadishu?",
      createdAt: new Date(baseTime - 3600000 * 4),
    },
    {
      conversationId: conversation.id,
      author: "vendor",
      body: "Of course — same-day pickup or 1-2 day courier. We can also send a photo of the actual piece if you'd like.",
      createdAt: new Date(baseTime - 1800000),
    },
  ]);

  // Singleton session — start as buyer
  await db
    .insert(sessionTable)
    .values({ id: "singleton", userId: buyer.id })
    .onConflictDoUpdate({ target: sessionTable.id, set: { userId: buyer.id } });

  // ===== Local marketplace listings =====
  const listingSeeds = [
    {
      kind: "vehicle",
      title: "Toyota Hilux 2018 — Diesel, Single Cab",
      description:
        "Clean Hilux double cab, single owner, full service history. New tyres, registered in Hargeisa. Inspection welcome.",
      price: "21500",
      condition: "used",
      category: "vehicles",
      city: "Hargeisa",
      area: "26 June",
      sellerName: "Mahad Ali",
      sellerPhone: "+252 63 412 8800",
      contactMethods: ["call", "whatsapp", "chat"],
      featured: true,
      promoted: true,
      attributes: { year: 2018, mileage: "120,000 km", fuel: "Diesel", transmission: "Manual" },
      imageSeed: "hilux-2018",
    },
    {
      kind: "vehicle",
      title: "Hyundai Sonata 2017 — Low Mileage",
      description:
        "Sonata 2.4L, automatic, leather seats, sunroof. Recently serviced. Trade-in possible.",
      price: "14200",
      condition: "used",
      category: "vehicles",
      city: "Mogadishu",
      area: "Wadajir",
      sellerName: "Yusuf Ibrahim",
      sellerPhone: "+252 61 555 2211",
      contactMethods: ["call", "whatsapp"],
      featured: true,
      attributes: { year: 2017, mileage: "78,000 km", fuel: "Petrol", transmission: "Auto" },
      imageSeed: "sonata-2017",
    },
    {
      kind: "property",
      title: "3-bedroom villa for sale — Jigjiga Yar",
      description:
        "Beautiful 3-bed villa with private garden, fenced compound, water tank, and solar inverter. Title deed clean.",
      price: "115000",
      condition: "new",
      category: "property-sale",
      city: "Hargeisa",
      area: "Jigjiga Yar",
      sellerName: "Hodan Estates",
      sellerPhone: "+252 63 991 0011",
      contactMethods: ["call", "chat"],
      featured: true,
      promoted: true,
      attributes: { bedrooms: 3, bathrooms: 2, plot: "300 sqm", parking: "Yes" },
      imageSeed: "villa-jigjiga",
    },
    {
      kind: "rental",
      title: "Furnished apartment, monthly — Taleh",
      description:
        "Modern 2-bed apartment, fully furnished, generator backup, Wi-Fi included. Minimum 1-month stay.",
      price: "650",
      condition: "new",
      category: "rentals",
      city: "Mogadishu",
      area: "Taleh",
      sellerName: "Anisa Property",
      sellerPhone: "+252 61 770 4400",
      contactMethods: ["call", "whatsapp", "chat"],
      attributes: { bedrooms: 2, period: "Monthly", utilities: "Included" },
      imageSeed: "apt-taleh",
      featured: true,
    },
    {
      kind: "rental",
      title: "Shop space for rent — Bakara market",
      description:
        "Ground-floor commercial shop, 25 sqm, foot traffic on main road. Annual lease.",
      price: "1800",
      condition: "new",
      category: "rentals",
      city: "Mogadishu",
      area: "Bakara",
      sellerName: "Bakara Holdings",
      sellerPhone: "+252 61 222 7700",
      contactMethods: ["call"],
      attributes: { size: "25 sqm", period: "Yearly" },
      imageSeed: "shop-bakara",
    },
    {
      kind: "used",
      title: "iPhone 13 Pro 256GB — Excellent condition",
      description:
        "Used 8 months, screen and back perfect, battery 96%. Original box and Apple charger included.",
      price: "640",
      condition: "used",
      category: "phones",
      city: "Hargeisa",
      area: "Bilan",
      sellerName: "Khadar Tech",
      sellerPhone: "+252 63 100 4040",
      contactMethods: ["whatsapp", "chat"],
      attributes: { storage: "256GB", color: "Sierra Blue", battery: "96%" },
      imageSeed: "iphone-13-pro",
      promoted: true,
    },
    {
      kind: "used",
      title: "MacBook Air M2 — barely used",
      description:
        "Mint MacBook Air M2 16GB / 512GB. AppleCare valid until 2026. Comes with sleeve.",
      price: "1080",
      condition: "used",
      category: "computers",
      city: "Mogadishu",
      area: "Hodan",
      sellerName: "Layla Said",
      sellerPhone: "+252 61 333 0099",
      contactMethods: ["call", "whatsapp"],
      attributes: { ram: "16GB", storage: "512GB", warranty: "Yes" },
      imageSeed: "macbook-air-m2",
    },
    {
      kind: "job",
      title: "Hiring: Delivery riders — Mogadishu",
      description:
        "Daily-paid delivery riders needed. Must own motorbike. Earn up to $25/day plus tips.",
      price: "25",
      condition: "new",
      category: "jobs",
      city: "Mogadishu",
      area: "City-wide",
      sellerName: "Suuq Express Logistics",
      sellerPhone: "+252 61 808 0808",
      contactMethods: ["call", "chat"],
      attributes: { type: "Full-time", pay: "Per day" },
      imageSeed: "delivery-job",
      featured: true,
    },
    {
      kind: "job",
      title: "Wanted: English/Somali tutor",
      description:
        "Family looking for an evening tutor for two children (ages 9 and 12). 3 sessions/week.",
      price: "300",
      condition: "new",
      category: "jobs",
      city: "Hargeisa",
      area: "Ahmed Dhagah",
      sellerName: "Mohamoud Family",
      sellerPhone: "+252 63 600 5151",
      contactMethods: ["call", "whatsapp"],
      attributes: { type: "Part-time", pay: "Per month" },
      imageSeed: "tutor-job",
    },
    {
      kind: "service",
      title: "Plumbing & water tank installation",
      description:
        "Licensed plumber with 10+ years experience. Same-day service in Hargeisa. Fair pricing.",
      price: "30",
      condition: "new",
      category: "services",
      city: "Hargeisa",
      area: "Hargeisa & nearby",
      sellerName: "Dahir Plumbing",
      sellerPhone: "+252 63 444 7878",
      contactMethods: ["call", "whatsapp"],
      attributes: { rate: "From $30/visit", emergency: "24/7" },
      imageSeed: "plumber",
    },
    {
      kind: "service",
      title: "Wedding photo & video coverage",
      description:
        "Full-day wedding coverage including drone, edited highlight reel, and 200+ retouched photos.",
      price: "750",
      condition: "new",
      category: "services",
      city: "Mogadishu",
      area: "All districts",
      sellerName: "Sahan Studio",
      sellerPhone: "+252 61 909 0909",
      contactMethods: ["whatsapp", "chat"],
      attributes: { delivery: "10 days", drone: "Included" },
      imageSeed: "wedding-photo",
      promoted: true,
    },
    {
      kind: "used",
      title: "Bedroom set — bed, dresser, two side tables",
      description:
        "Mahogany bedroom set in great condition. Buyer arranges pickup from Hodan.",
      price: "420",
      condition: "used",
      category: "furniture",
      city: "Mogadishu",
      area: "Hodan",
      sellerName: "Faisal H.",
      sellerPhone: "+252 61 121 3434",
      contactMethods: ["call", "whatsapp"],
      attributes: { material: "Mahogany", pieces: 4 },
      imageSeed: "bedroom-set",
    },
    {
      kind: "vehicle",
      title: "Bajaj 3-wheeler 2021 — taxi-ready",
      description:
        "Almost new Bajaj three-wheeler, perfect for taxi business. Fuel-efficient and reliable.",
      price: "3200",
      condition: "used",
      category: "vehicles",
      city: "Hargeisa",
      area: "State House",
      sellerName: "Abdi Auto",
      sellerPhone: "+252 63 552 1212",
      contactMethods: ["call"],
      attributes: { year: 2021, type: "Three-wheeler", fuel: "Petrol" },
      imageSeed: "bajaj-2021",
    },
    {
      kind: "property",
      title: "Plot of land — 600 sqm, Berbera road",
      description:
        "Residential plot with road frontage on the new Berbera highway. Ready for construction.",
      price: "28000",
      condition: "new",
      category: "property-sale",
      city: "Hargeisa",
      area: "Berbera Road",
      sellerName: "Geedi Land Co.",
      sellerPhone: "+252 63 222 9090",
      contactMethods: ["call", "whatsapp"],
      attributes: { plot: "600 sqm", deed: "Yes" },
      imageSeed: "land-plot",
    },
  ];

  await db.insert(listingsTable).values(
    listingSeeds.map((l) => {
      const main = img(l.imageSeed, 1000);
      return {
        kind: l.kind,
        title: l.title,
        description: l.description,
        price: l.price,
        currency: "USD",
        negotiable: true,
        condition: l.condition,
        category: l.category,
        city: l.city,
        area: l.area,
        imageUrl: main,
        gallery: [main, img(`${l.imageSeed}-2`, 1000), img(`${l.imageSeed}-3`, 1000)],
        attributes: l.attributes as unknown as Record<string, string | number | boolean>,
        sellerId: l.sellerName.includes("Hodan") ? sellerUser.id : buyer.id,
        sellerName: l.sellerName,
        sellerPhone: l.sellerPhone,
        contactMethods: l.contactMethods,
        status: "active",
        featured: l.featured ?? false,
        promoted: l.promoted ?? false,
        viewCount: Math.floor(Math.random() * 500) + 30,
        saveCount: Math.floor(Math.random() * 60),
      };
    }),
  );

  // ===== Requests board =====
  const requestSeeds = [
    {
      title: "Looking for: Used Toyota Vitz, automatic, under $7,000",
      description:
        "Need a small reliable car for daily commute. Prefer 2014–2017 model with low mileage. Hargeisa.",
      category: "vehicles",
      city: "Hargeisa",
      budget: "7000",
    },
    {
      title: "Need 50 plastic chairs for event rental",
      description:
        "Rental needed for a wedding next Saturday. Must include delivery and setup.",
      category: "services",
      city: "Mogadishu",
      budget: "200",
    },
    {
      title: "Want to buy: Office desk + chair (used okay)",
      description: "Setting up a small home office. Looking for sturdy desk and ergonomic chair.",
      category: "furniture",
      city: "Hargeisa",
      budget: "180",
    },
    {
      title: "Hiring: Arabic tutor for adult learner",
      description:
        "Two evening sessions per week, conversational focus. Female tutor preferred.",
      category: "jobs",
      city: "Mogadishu",
      budget: "250",
    },
    {
      title: "Looking for 2-bedroom rental in Boondheere",
      description:
        "Family of four, monthly rental, furnished if possible. Long-term tenant.",
      category: "rentals",
      city: "Mogadishu",
      budget: "550",
    },
    {
      title: "Wanted: iPhone 12 or 13 in good condition",
      description: "Cash in hand, can pick up today in Hargeisa center.",
      category: "phones",
      city: "Hargeisa",
      budget: "500",
    },
  ];

  const insertedRequests = await db
    .insert(requestsTable)
    .values(
      requestSeeds.map((r) => ({
        buyerId: buyer.id,
        buyerName: buyer.name,
        title: r.title,
        description: r.description,
        category: r.category,
        city: r.city,
        budget: r.budget,
        currency: "USD",
        status: "open" as const,
        offerCount: 0,
      })),
    )
    .returning();

  // Sample offers on first two requests
  if (insertedRequests.length >= 2) {
    const offerData = [
      {
        requestId: insertedRequests[0].id,
        sellerName: "Mahad Auto",
        price: "6800",
        message:
          "I have a 2016 Vitz automatic with 95,000 km — silver, great condition. Can deliver to Hargeisa.",
      },
      {
        requestId: insertedRequests[0].id,
        sellerName: "Liiban Motors",
        price: "6500",
        message:
          "Vitz 2015, recently serviced, new tyres. Open to inspection at our garage in Ahmed Dhagah.",
      },
      {
        requestId: insertedRequests[1].id,
        sellerName: "Sahan Events",
        price: "180",
        message:
          "We can deliver 50 chairs and set up Friday evening, pickup Sunday morning. All-in price.",
      },
    ];
    await db.insert(offersTable).values(
      offerData.map((o) => ({
        requestId: o.requestId,
        sellerId: sellerUser.id,
        sellerName: o.sellerName,
        sellerRating: "4.85",
        price: o.price,
        currency: "USD",
        message: o.message,
        status: "pending" as const,
      })),
    );
    await db
      .update(requestsTable)
      .set({ offerCount: 2 })
      .where(sql`${requestsTable.id} = ${insertedRequests[0].id}`);
    await db
      .update(requestsTable)
      .set({ offerCount: 1 })
      .where(sql`${requestsTable.id} = ${insertedRequests[1].id}`);
  }

  // ===== Wallets & transactions =====
  await db.insert(walletsTable).values([
    {
      userId: buyer.id,
      balance: "12.50",
      pending: "0",
      lifetimeEarned: "47.00",
      currency: "USD",
      payoutMethod: "evc-plus",
      payoutAccount: "+252 61 234 5678",
    },
    {
      userId: sellerUser.id,
      balance: "1340.75",
      pending: "215.00",
      lifetimeEarned: "8920.00",
      currency: "USD",
      payoutMethod: "zaad",
      payoutAccount: "+252 63 555 1212",
    },
  ]);

  const txSeeds = [
    {
      userId: sellerUser.id,
      amount: "240.00",
      type: "sale",
      description: "Sale of Saffron Embroidered Dirac",
      refId: "SQ-100012",
    },
    {
      userId: sellerUser.id,
      amount: "-25.00",
      type: "commission",
      description: "Platform commission (10%)",
      refId: "SQ-100012",
    },
    {
      userId: sellerUser.id,
      amount: "180.00",
      type: "sale",
      description: "Sale of Indigo Guntiino Wrap",
      refId: "SQ-100015",
    },
    {
      userId: sellerUser.id,
      amount: "-500.00",
      type: "payout",
      description: "Payout to ZAAD +252 63 *** 1212",
      refId: "PYT-9100",
      status: "completed",
    },
    {
      userId: sellerUser.id,
      amount: "215.00",
      type: "sale",
      description: "Order pending settlement",
      refId: "SQ-100023",
      status: "pending",
    },
    {
      userId: buyer.id,
      amount: "5.00",
      type: "referral",
      description: "Referral reward — Yusuf joined SuuqLink",
      refId: "REF-441",
    },
    {
      userId: buyer.id,
      amount: "7.50",
      type: "cashback",
      description: "Cashback on order SQ-100018",
      refId: "SQ-100018",
    },
  ];
  await db.insert(walletTransactionsTable).values(
    txSeeds.map((t) => ({
      userId: t.userId,
      amount: t.amount,
      type: t.type,
      description: t.description,
      refId: t.refId,
      status: t.status ?? "completed",
    })),
  );

  // ===== Referrals =====
  await db.insert(referralsTable).values([
    {
      userId: buyer.id,
      code: "AMINA5",
      referredName: "Yusuf O.",
      reward: "5.00",
      status: "completed",
    },
    {
      userId: buyer.id,
      code: "AMINA5",
      referredName: "Hawa B.",
      reward: "5.00",
      status: "completed",
    },
    {
      userId: buyer.id,
      code: "AMINA5",
      referredName: "Daniel M.",
      reward: "0.00",
      status: "pending",
    },
    {
      userId: sellerUser.id,
      code: "HODAN10",
      referredName: "Karachi Beauty Bar",
      reward: "10.00",
      status: "completed",
    },
  ]);

  // ===== Subscriptions =====
  await db.insert(subscriptionsTable).values({
    userId: sellerUser.id,
    tier: "growth",
    status: "active",
    priceMonthly: "19.00",
    currency: "USD",
    renewsAt: new Date(Date.now() + 86400000 * 22),
  });

  void adminUser;
  void PLACEHOLDER;

  logger.info("Seed: complete");
}
