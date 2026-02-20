export type CatalogCategory = "core_oven" | "smart_oven" | "accessory";

export type SortMode = "lowestPrice" | "sellerReliability" | "deliverySpeed";

export type SellerTier = "trusted" | "new" | "unverified";

export interface ProductListing {
  id: string;
  title: string;
  category: CatalogCategory;
  imageUrl: string;
  canonicalGroup: string;
  canonicalLabel: string;
  sellerName: string;
  brand: string;
  verifiedManufacturer: boolean;
  sellerReliability: number;
  fulfillmentHistory: number;
  deliveryDays: number;
  price: number;
  weightLb: number;
  dimensions: string;
  sponsored?: boolean;
  rating: number;
  reviewCount: number;
  imageTone: string;
  miscategorized?: boolean;
}

export interface IntentModel {
  rawQuery: string;
  normalizedQuery: string;
  maxPrice?: number;
  targetType: "core-appliance" | "unknown";
}

export interface ValidationSignal {
  listingId: string;
  title: string;
  reason: string;
}

export interface CanonicalCluster {
  id: string;
  label: string;
  offers: ProductListing[];
  minPrice: number;
  maxPrice: number;
  aggregateRating: number;
  verifiedManufacturers: number;
  sellerCount: number;
  imageTone: string;
}
