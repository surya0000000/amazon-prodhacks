import type {
  CanonicalCluster,
  IntentModel,
  ProductListing,
  SellerTier,
  SortMode,
  ValidationSignal,
} from "@/types/catalog";

const ACCESSORY_PATTERN =
  /cover|glove|clean|kit|liner|tray|protector|scrubber|sheet|refill/i;
const isCoreApplianceCategory = (category: ProductListing["category"]) =>
  category === "core_oven" || category === "smart_oven";

export interface IntentAnalysis {
  intent: IntentModel;
  traditionalResults: ProductListing[];
  coreResults: ProductListing[];
  clusters: CanonicalCluster[];
  relatedAccessories: ProductListing[];
  validationSignals: ValidationSignal[];
}

export function parseIntent(query: string): IntentModel {
  const normalizedQuery = query.trim().toLowerCase();
  const priceMatch = normalizedQuery.match(/under\s+\$?\s*(\d+)/i);
  const fallbackPriceMatch = normalizedQuery.match(/\$?\s*(\d+)\s*(or less|max)/i);
  const maxPrice = priceMatch
    ? Number(priceMatch[1])
    : fallbackPriceMatch
      ? Number(fallbackPriceMatch[1])
      : undefined;

  return {
    rawQuery: query,
    normalizedQuery,
    maxPrice,
    targetType: normalizedQuery.includes("oven") ? "core-appliance" : "unknown",
  };
}

function classifyAccessorySignals(listing: ProductListing) {
  const reasons: string[] = [];
  const hasAccessoryTerm = ACCESSORY_PATTERN.test(listing.title);
  const hasPriceWeightMismatch = listing.price <= 12 && listing.weightLb <= 1.5;

  if (listing.category === "accessory") {
    reasons.push("Catalog taxonomy classified this listing as accessory");
  }
  if (hasAccessoryTerm) {
    reasons.push("Accessory keyword pattern detected in title");
  }
  if (listing.miscategorized) {
    reasons.push("Seller taxonomy conflicts with appliance intent");
  }
  if (hasPriceWeightMismatch) {
    reasons.push("Price-to-weight mismatch detected");
  }

  const shouldBeAccessory =
    listing.category === "accessory" ||
    hasAccessoryTerm ||
    listing.miscategorized ||
    hasPriceWeightMismatch;

  return { shouldBeAccessory, reasons };
}

export function analyzeListings(
  query: string,
  listings: ProductListing[],
): IntentAnalysis {
  const intent = parseIntent(query);
  const maxPrice = intent.maxPrice;
  const withinBudget = (listing: ProductListing) =>
    maxPrice === undefined ? true : listing.price <= maxPrice;
  const keyword = intent.normalizedQuery.includes("oven") ? "oven" : "";

  const traditionalResults = listings
    .filter((listing) => {
      const matchesKeyword = keyword ? listing.title.toLowerCase().includes(keyword) : true;
      return matchesKeyword && withinBudget(listing);
    })
    .sort((a, b) => Number(Boolean(b.sponsored)) - Number(Boolean(a.sponsored)) || a.price - b.price);

  const coreResults: ProductListing[] = [];
  const relatedAccessories: ProductListing[] = [];
  const validationSignals: ValidationSignal[] = [];

  for (const listing of traditionalResults) {
    const { shouldBeAccessory, reasons } = classifyAccessorySignals(listing);
    if (intent.targetType === "core-appliance" && shouldBeAccessory) {
      relatedAccessories.push(listing);
      validationSignals.push({
        listingId: listing.id,
        title: listing.title,
        reason: reasons.join(" • "),
      });
      continue;
    }
    if (isCoreApplianceCategory(listing.category)) {
      coreResults.push(listing);
    }
  }

  const clustersById = new Map<string, ProductListing[]>();
  for (const listing of coreResults) {
    const current = clustersById.get(listing.canonicalGroup) ?? [];
    current.push(listing);
    clustersById.set(listing.canonicalGroup, current);
  }

  const clusters: CanonicalCluster[] = [...clustersById.entries()]
    .map(([id, offers]) => {
      const totalRating = offers.reduce((sum, offer) => sum + offer.rating, 0);
      const brands = new Set(
        offers.filter((offer) => offer.verifiedManufacturer).map((offer) => offer.brand),
      );
      return {
        id,
        label: offers[0].canonicalLabel,
        offers,
        minPrice: Math.min(...offers.map((offer) => offer.price)),
        maxPrice: Math.max(...offers.map((offer) => offer.price)),
        aggregateRating: Number((totalRating / offers.length).toFixed(1)),
        verifiedManufacturers: brands.size,
        sellerCount: offers.length,
        imageTone: offers[0].imageTone,
      };
    })
    .sort((a, b) => a.minPrice - b.minPrice);

  const dedupedAccessories = Object.values(
    relatedAccessories.reduce<Record<string, ProductListing>>((acc, listing) => {
      if (!acc[listing.title]) {
        acc[listing.title] = listing;
      }
      return acc;
    }, {}),
  ).sort((a, b) => a.price - b.price);

  const dedupedSignals = Object.values(
    validationSignals.reduce<Record<string, ValidationSignal>>((acc, signal) => {
      if (!acc[signal.title]) {
        acc[signal.title] = signal;
      }
      return acc;
    }, {}),
  );

  return {
    intent,
    traditionalResults,
    coreResults,
    clusters,
    relatedAccessories: dedupedAccessories,
    validationSignals: dedupedSignals,
  };
}

export function sortClusterOffers(
  offers: ProductListing[],
  mode: SortMode,
): ProductListing[] {
  const sorted = [...offers];
  if (mode === "lowestPrice") {
    sorted.sort((a, b) => a.price - b.price || b.sellerReliability - a.sellerReliability);
  } else if (mode === "sellerReliability") {
    sorted.sort(
      (a, b) => b.sellerReliability - a.sellerReliability || a.price - b.price,
    );
  } else {
    sorted.sort((a, b) => a.deliveryDays - b.deliveryDays || b.sellerReliability - a.sellerReliability);
  }

  const sponsoredIndex = sorted.findIndex((offer) => offer.sponsored);
  if (sponsoredIndex > 0) {
    const [sponsoredOffer] = sorted.splice(sponsoredIndex, 1);
    sorted.splice(1, 0, sponsoredOffer);
  }

  return sorted;
}

export function toSellerTier(score: number): SellerTier {
  if (score >= 85) return "trusted";
  if (score >= 65) return "new";
  return "unverified";
}

export const SELLER_TIER_COPY: Record<SellerTier, string> = {
  trusted: "Trusted Seller: high reliability, stable fulfillment history.",
  new: "New Seller: moderate track record with growing fulfillment history.",
  unverified: "Unverified: limited historical signals or low consistency.",
};
