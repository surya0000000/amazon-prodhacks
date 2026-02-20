import type { CanonicalCluster, ProductListing } from "@/types/catalog";
import { buildRelevantImageUrl } from "@/lib/imageRelevance";

interface ClusterMedia {
  hero: string;
  gallery: string[];
  features: string[];
}

interface ClusterMediaSeed {
  query: string;
  features: string[];
}

const SMART_CLUSTER_IDS = new Set(["budget-smart", "airfry-combo", "digital-precision"]);

function resolveClusterCategory(clusterId: string): ProductListing["category"] {
  return SMART_CLUSTER_IDS.has(clusterId) ? "smart_oven" : "core_oven";
}

const CLUSTER_MEDIA_SEEDS: Record<string, ClusterMediaSeed> = {
  "budget-compact": {
    query: "compact countertop oven kitchen appliance",
    features: [
      "Fast preheat with compact countertop footprint",
      "Multi-rack baking and toast settings",
      "Intent Integrity verified across equivalent listings",
      "Optimized for sub-$100 appliance intent",
    ],
  },
  "budget-smart": {
    query: "smart oven digital kitchen appliance",
    features: [
      "Digital controls with programmable presets",
      "Auto-shutoff and overheat protection",
      "Seller-tier transparency for every option",
      "Canonical grouping reduces duplicate shopping effort",
    ],
  },
  "countertop-family": {
    query: "family countertop oven kitchen appliance",
    features: [
      "Higher capacity interior with family-size trays",
      "Even heat distribution for roasting and baking",
      "Reliable fulfillment from ranked marketplace sellers",
      "Delivery-aware offer ranking inside this variant family",
    ],
  },
  "premium-mini": {
    query: "premium mini oven kitchen appliance",
    features: [
      "Premium compact design with rapid convection mode",
      "Precision temperature control and timer memory",
      "Verified manufacturer options highlighted first",
      "Intent-aware ranking prevents accessory noise pollution",
    ],
  },
  "convection-value": {
    query: "convection countertop oven stainless steel",
    features: [
      "Convection airflow improves crispness and bake consistency",
      "Balanced thermal profile for multi-rack cooking",
      "Offer clustering removes near-duplicate seller noise",
      "Transparent seller quality and sponsored positioning",
    ],
  },
  "airfry-combo": {
    query: "air fry oven combo kitchen appliance",
    features: [
      "Dual heating mode for air fry and conventional baking",
      "Budget-compatible options within appliance intent scope",
      "Delivery-aware seller sorting inside canonical view",
      "Strong fit for compact kitchen workflows",
    ],
  },
  "digital-precision": {
    query: "digital precision oven kitchen appliance",
    features: [
      "Tight digital temperature control and timer management",
      "Reliable manufacturer validation across top offers",
      "Trust signals surfaced before checkout decisions",
      "Intent-first ranking prioritizes relevant appliances",
    ],
  },
  "family-xl": {
    query: "large family countertop oven appliance",
    features: [
      "Larger cavity for family-size tray and roast workflows",
      "Canonical cluster bundles equivalent high-capacity models",
      "Seller options include fast-ship and trusted-market tiers",
      "Improved decision speed for high-volume home cooks",
    ],
  },
  "dorm-essentials": {
    query: "compact dorm oven kitchen appliance",
    features: [
      "Compact footprint tuned for dorm and studio kitchens",
      "Low-power operation with fast preheat profiles",
      "Accessories automatically separated from core intent results",
      "Budget-first ranking with transparent seller quality",
    ],
  },
  "chef-pro-countertop": {
    query: "professional countertop oven kitchen",
    features: [
      "Precision controls optimized for high-repeat cooking tasks",
      "Enhanced insulation for stable thermal performance",
      "Sponsored and organic offers remain clearly labeled",
      "Dense comparison grid supports fast buy-box evaluation",
    ],
  },
};

function stringToSeed(input: string) {
  return [...input].reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
}

export function getClusterMedia(clusterId: string): ClusterMedia {
  const clusterSeed = CLUSTER_MEDIA_SEEDS[clusterId] ?? {
    query: "countertop oven kitchen appliance",
    features: [
      "Canonical offer set generated from intent-aware matching",
      "Seller and fulfillment details retained for comparison",
    ],
  };
  const seed = stringToSeed(clusterId || "cluster");

  return {
    hero: buildRelevantImageUrl({
      text: clusterSeed.query,
      category: resolveClusterCategory(clusterId),
      seed,
      id: `${clusterId}-hero`,
      width: 900,
      height: 900,
    }),
    gallery: Array.from({ length: 5 }, (_, index) =>
      buildRelevantImageUrl({
        text: clusterSeed.query,
        category: resolveClusterCategory(clusterId),
        seed: `${clusterId}-gallery-${index + 1}`,
        id: `${clusterId}-${index + 1}`,
        width: 420,
        height: 420,
      }),
    ),
    features: clusterSeed.features,
  };
}

export function getListingImage(listing: ProductListing): string {
  if (listing.imageUrl) {
    return listing.imageUrl;
  }
  if (listing.category === "accessory" || listing.miscategorized) {
    return buildRelevantImageUrl({
      text: listing.title,
      category: "accessory",
      seed: stringToSeed(listing.id),
      id: listing.id,
    });
  }

  return getClusterMedia(listing.canonicalGroup).hero;
}

export function getClusterHeroImage(cluster: CanonicalCluster): string {
  return cluster.offers[0]?.imageUrl ?? getClusterMedia(cluster.id).hero;
}
