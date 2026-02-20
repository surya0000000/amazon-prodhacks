import type { CanonicalCluster, ProductListing } from "@/types/catalog";

interface ClusterMedia {
  hero: string;
  gallery: string[];
  features: string[];
}

const DEFAULT_HERO_IMAGE =
  "https://source.unsplash.com/featured/900x900/?kitchen,appliance";

const CLUSTER_MEDIA: Record<string, ClusterMedia> = {
  "budget-compact": {
    hero: "https://source.unsplash.com/featured/900x900/?countertop,oven&sig=11",
    gallery: [
      "https://source.unsplash.com/featured/400x400/?oven,compact&sig=12",
      "https://source.unsplash.com/featured/400x400/?toaster,oven&sig=13",
      "https://source.unsplash.com/featured/400x400/?kitchen,countertop,appliance&sig=14",
      "https://source.unsplash.com/featured/400x400/?electric,oven&sig=15",
    ],
    features: [
      "Fast preheat with compact countertop footprint",
      "Multi-rack baking and toast settings",
      "Intent Integrity verified across equivalent listings",
      "Optimized for sub-$100 appliance intent",
    ],
  },
  "budget-smart": {
    hero: "https://source.unsplash.com/featured/900x900/?smart,oven&sig=21",
    gallery: [
      "https://source.unsplash.com/featured/400x400/?oven,digital,display&sig=22",
      "https://source.unsplash.com/featured/400x400/?kitchen,smart,appliance&sig=23",
      "https://source.unsplash.com/featured/400x400/?countertop,smart,oven&sig=24",
      "https://source.unsplash.com/featured/400x400/?baking,appliance&sig=25",
    ],
    features: [
      "Digital controls with programmable presets",
      "Auto-shutoff and overheat protection",
      "Seller-tier transparency for every option",
      "Canonical grouping reduces duplicate shopping effort",
    ],
  },
  "countertop-family": {
    hero: "https://source.unsplash.com/featured/900x900/?kitchen,oven,steel&sig=31",
    gallery: [
      "https://source.unsplash.com/featured/400x400/?countertop,steel,oven&sig=32",
      "https://source.unsplash.com/featured/400x400/?oven,home,kitchen&sig=33",
      "https://source.unsplash.com/featured/400x400/?bake,oven&sig=34",
      "https://source.unsplash.com/featured/400x400/?small,appliance,oven&sig=35",
    ],
    features: [
      "Higher capacity interior with family-size trays",
      "Even heat distribution for roasting and baking",
      "Reliable fulfillment from ranked marketplace sellers",
      "Delivery-aware offer ranking inside this variant family",
    ],
  },
  "premium-mini": {
    hero: "https://source.unsplash.com/featured/900x900/?premium,mini,oven&sig=41",
    gallery: [
      "https://source.unsplash.com/featured/400x400/?mini,oven,kitchen&sig=42",
      "https://source.unsplash.com/featured/400x400/?compact,appliance,metal&sig=43",
      "https://source.unsplash.com/featured/400x400/?kitchen,premium,appliance&sig=44",
      "https://source.unsplash.com/featured/400x400/?small,smart,oven&sig=45",
    ],
    features: [
      "Premium compact design with rapid convection mode",
      "Precision temperature control and timer memory",
      "Verified manufacturer options highlighted first",
      "Intent-aware ranking prevents accessory noise pollution",
    ],
  },
};

const ACCESSORY_MEDIA_BY_KEYWORD: Array<[RegExp, string]> = [
  [/glove|mitt/i, "https://source.unsplash.com/featured/600x600/?oven,gloves&sig=101"],
  [/cover/i, "https://source.unsplash.com/featured/600x600/?appliance,cover&sig=102"],
  [/clean|spray|scrubber|kit/i, "https://source.unsplash.com/featured/600x600/?cleaning,kit&sig=103"],
  [/tray|liner|sheet|rack/i, "https://source.unsplash.com/featured/600x600/?baking,tray&sig=104"],
];

const DEFAULT_ACCESSORY_IMAGE =
  "https://source.unsplash.com/featured/600x600/?kitchen,accessory&sig=105";

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
  if (listing.category === "accessory" || listing.miscategorized) {
    const matched = ACCESSORY_MEDIA_BY_KEYWORD.find(([pattern]) => pattern.test(listing.title));
    return matched?.[1] ?? DEFAULT_ACCESSORY_IMAGE;
  }

  return getClusterMedia(listing.canonicalGroup).hero;
}

export function getClusterHeroImage(cluster: CanonicalCluster): string {
  return getClusterMedia(cluster.id).hero;
}
