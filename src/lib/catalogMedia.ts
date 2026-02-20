import type { CanonicalCluster, ProductListing } from "@/types/catalog";

interface ClusterMedia {
  hero: string;
  gallery: string[];
  features: string[];
}

const DEFAULT_HERO_IMAGE =
  "https://picsum.photos/seed/default-oven-hero/900/900";

const CLUSTER_MEDIA: Record<string, ClusterMedia> = {
  "budget-compact": {
    hero: "https://picsum.photos/seed/budget-compact-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/budget-compact-gallery-1/420/420",
      "https://picsum.photos/seed/budget-compact-gallery-2/420/420",
      "https://picsum.photos/seed/budget-compact-gallery-3/420/420",
      "https://picsum.photos/seed/budget-compact-gallery-4/420/420",
    ],
    features: [
      "Fast preheat with compact countertop footprint",
      "Multi-rack baking and toast settings",
      "Intent Integrity verified across equivalent listings",
      "Optimized for sub-$100 appliance intent",
    ],
  },
  "budget-smart": {
    hero: "https://picsum.photos/seed/budget-smart-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/budget-smart-gallery-1/420/420",
      "https://picsum.photos/seed/budget-smart-gallery-2/420/420",
      "https://picsum.photos/seed/budget-smart-gallery-3/420/420",
      "https://picsum.photos/seed/budget-smart-gallery-4/420/420",
    ],
    features: [
      "Digital controls with programmable presets",
      "Auto-shutoff and overheat protection",
      "Seller-tier transparency for every option",
      "Canonical grouping reduces duplicate shopping effort",
    ],
  },
  "countertop-family": {
    hero: "https://picsum.photos/seed/countertop-family-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/countertop-family-gallery-1/420/420",
      "https://picsum.photos/seed/countertop-family-gallery-2/420/420",
      "https://picsum.photos/seed/countertop-family-gallery-3/420/420",
      "https://picsum.photos/seed/countertop-family-gallery-4/420/420",
    ],
    features: [
      "Higher capacity interior with family-size trays",
      "Even heat distribution for roasting and baking",
      "Reliable fulfillment from ranked marketplace sellers",
      "Delivery-aware offer ranking inside this variant family",
    ],
  },
  "premium-mini": {
    hero: "https://picsum.photos/seed/premium-mini-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/premium-mini-gallery-1/420/420",
      "https://picsum.photos/seed/premium-mini-gallery-2/420/420",
      "https://picsum.photos/seed/premium-mini-gallery-3/420/420",
      "https://picsum.photos/seed/premium-mini-gallery-4/420/420",
    ],
    features: [
      "Premium compact design with rapid convection mode",
      "Precision temperature control and timer memory",
      "Verified manufacturer options highlighted first",
      "Intent-aware ranking prevents accessory noise pollution",
    ],
  },
  "convection-value": {
    hero: "https://picsum.photos/seed/convection-value-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/convection-value-gallery-1/420/420",
      "https://picsum.photos/seed/convection-value-gallery-2/420/420",
      "https://picsum.photos/seed/convection-value-gallery-3/420/420",
      "https://picsum.photos/seed/convection-value-gallery-4/420/420",
    ],
    features: [
      "Convection airflow improves crispness and bake consistency",
      "Balanced thermal profile for multi-rack cooking",
      "Offer clustering removes near-duplicate seller noise",
      "Transparent seller quality and sponsored positioning",
    ],
  },
  "airfry-combo": {
    hero: "https://picsum.photos/seed/airfry-combo-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/airfry-combo-gallery-1/420/420",
      "https://picsum.photos/seed/airfry-combo-gallery-2/420/420",
      "https://picsum.photos/seed/airfry-combo-gallery-3/420/420",
      "https://picsum.photos/seed/airfry-combo-gallery-4/420/420",
    ],
    features: [
      "Dual heating mode for air fry and conventional baking",
      "Budget-compatible options within appliance intent scope",
      "Delivery-aware seller sorting inside canonical view",
      "Strong fit for compact kitchen workflows",
    ],
  },
  "digital-precision": {
    hero: "https://picsum.photos/seed/digital-precision-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/digital-precision-gallery-1/420/420",
      "https://picsum.photos/seed/digital-precision-gallery-2/420/420",
      "https://picsum.photos/seed/digital-precision-gallery-3/420/420",
      "https://picsum.photos/seed/digital-precision-gallery-4/420/420",
    ],
    features: [
      "Tight digital temperature control and timer management",
      "Reliable manufacturer validation across top offers",
      "Trust signals surfaced before checkout decisions",
      "Intent-first ranking prioritizes relevant appliances",
    ],
  },
  "family-xl": {
    hero: "https://picsum.photos/seed/family-xl-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/family-xl-gallery-1/420/420",
      "https://picsum.photos/seed/family-xl-gallery-2/420/420",
      "https://picsum.photos/seed/family-xl-gallery-3/420/420",
      "https://picsum.photos/seed/family-xl-gallery-4/420/420",
    ],
    features: [
      "Larger cavity for family-size tray and roast workflows",
      "Canonical cluster bundles equivalent high-capacity models",
      "Seller options include fast-ship and trusted-market tiers",
      "Improved decision speed for high-volume home cooks",
    ],
  },
  "dorm-essentials": {
    hero: "https://picsum.photos/seed/dorm-essentials-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/dorm-essentials-gallery-1/420/420",
      "https://picsum.photos/seed/dorm-essentials-gallery-2/420/420",
      "https://picsum.photos/seed/dorm-essentials-gallery-3/420/420",
      "https://picsum.photos/seed/dorm-essentials-gallery-4/420/420",
    ],
    features: [
      "Compact footprint tuned for dorm and studio kitchens",
      "Low-power operation with fast preheat profiles",
      "Accessories automatically separated from core intent results",
      "Budget-first ranking with transparent seller quality",
    ],
  },
  "chef-pro-countertop": {
    hero: "https://picsum.photos/seed/chef-pro-countertop-hero/900/900",
    gallery: [
      "https://picsum.photos/seed/chef-pro-countertop-gallery-1/420/420",
      "https://picsum.photos/seed/chef-pro-countertop-gallery-2/420/420",
      "https://picsum.photos/seed/chef-pro-countertop-gallery-3/420/420",
      "https://picsum.photos/seed/chef-pro-countertop-gallery-4/420/420",
    ],
    features: [
      "Precision controls optimized for high-repeat cooking tasks",
      "Enhanced insulation for stable thermal performance",
      "Sponsored and organic offers remain clearly labeled",
      "Dense comparison grid supports fast buy-box evaluation",
    ],
  },
};

const ACCESSORY_MEDIA_BY_KEYWORD: Array<[RegExp, string]> = [
  [/glove|mitt/i, "https://picsum.photos/seed/accessory-gloves/600/600"],
  [/cover/i, "https://picsum.photos/seed/accessory-cover/600/600"],
  [/clean|spray|scrubber|kit/i, "https://picsum.photos/seed/accessory-clean/600/600"],
  [/tray|liner|sheet|rack/i, "https://picsum.photos/seed/accessory-tray/600/600"],
];

const DEFAULT_ACCESSORY_IMAGE =
  "https://picsum.photos/seed/accessory-default/600/600";

export function getClusterMedia(clusterId: string): ClusterMedia {
  return (
    CLUSTER_MEDIA[clusterId] ?? {
      hero: DEFAULT_HERO_IMAGE,
      gallery: [DEFAULT_HERO_IMAGE, DEFAULT_HERO_IMAGE, DEFAULT_HERO_IMAGE, DEFAULT_HERO_IMAGE],
      features: [
        "Canonical offer set generated from intent-aware matching",
        "Seller and fulfillment details retained for comparison",
      ],
    }
  );
}

export function getListingImage(listing: ProductListing): string {
  if (listing.imageUrl) {
    return listing.imageUrl;
  }
  if (listing.category === "accessory" || listing.miscategorized) {
    const matched = ACCESSORY_MEDIA_BY_KEYWORD.find(([pattern]) => pattern.test(listing.title));
    return matched?.[1] ?? DEFAULT_ACCESSORY_IMAGE;
  }

  return getClusterMedia(listing.canonicalGroup).hero;
}

export function getClusterHeroImage(cluster: CanonicalCluster): string {
  return cluster.offers[0]?.imageUrl ?? getClusterMedia(cluster.id).hero;
}
