import { sql } from "drizzle-orm";
import { db, productsTable, vendorsTable } from "@workspace/db";
import type { Product, Vendor } from "@workspace/db";

let _vendorCache: Map<number, Vendor> | null = null;

async function getVendorMap(): Promise<Map<number, Vendor>> {
  if (_vendorCache) return _vendorCache;
  const vendors = await db.select().from(vendorsTable);
  _vendorCache = new Map(vendors.map((v) => [v.id, v]));
  return _vendorCache;
}

export function invalidateVendorCache() {
  _vendorCache = null;
}

export async function productCountMap(): Promise<Map<number, number>> {
  const rows = await db
    .select({
      vendorId: productsTable.vendorId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(productsTable)
    .groupBy(productsTable.vendorId);
  return new Map(rows.map((r) => [r.vendorId, Number(r.count)]));
}

export function serializeVendor(
  v: Vendor,
  counts: Map<number, number>,
): {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  logoUrl: string;
  coverUrl: string;
  verified: boolean;
  badges: string[];
} {
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    tagline: v.tagline,
    city: v.city,
    country: v.country,
    rating: Number(v.rating),
    reviewCount: v.reviewCount,
    productCount: counts.get(v.id) ?? 0,
    logoUrl: v.logoUrl,
    coverUrl: v.coverUrl,
    verified: v.verified,
    badges: v.badges,
  };
}

type SerializedProduct = {
  id: number;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  imageUrl: string;
  vendorId: number;
  vendorName: string;
  rating: number;
  reviewCount: number;
  categorySlug: string;
  categoryName: string;
  inStock: boolean;
  badges: string[];
};

const CATEGORY_NAMES: Record<string, string> = {
  fashion: "Fashion",
  electronics: "Electronics",
  home: "Home & Living",
  beauty: "Beauty",
  groceries: "Groceries",
  crafts: "Local Crafts",
  kids: "Kids & Baby",
  sports: "Sports",
};

export function serializeProduct(
  p: Product,
  vendorName?: string,
): SerializedProduct {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice == null ? null : Number(p.compareAtPrice),
    currency: p.currency,
    imageUrl: p.imageUrl,
    vendorId: p.vendorId,
    vendorName: vendorName ?? "Vendor",
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    categorySlug: p.categorySlug,
    categoryName: CATEGORY_NAMES[p.categorySlug] ?? p.categorySlug,
    inStock: p.inStock,
    badges: p.badges,
  };
}

export async function serializeProductsWithVendor(
  rows: Product[],
): Promise<SerializedProduct[]> {
  const vendors = await getVendorMap();
  return rows.map((p) =>
    serializeProduct(p, vendors.get(p.vendorId)?.name ?? "Vendor"),
  );
}

export async function getVendorById(id: number): Promise<Vendor | undefined> {
  const map = await getVendorMap();
  return map.get(id);
}
