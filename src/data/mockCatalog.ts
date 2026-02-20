import type { ProductListing } from "@/types/catalog";
import { buildRelevantImageUrl } from "@/lib/imageRelevance";

interface ClusterSeed {
  id: string;
  label: string;
  basePrice: number;
  baseWeight: number;
  dimensions: string;
  models: string[];
  brands: string[];
}

const CLUSTER_SEEDS: ClusterSeed[] = [
  {
    id: "budget-compact",
    label: "Budget Compact Electric Ovens",
    basePrice: 72,
    baseWeight: 15.4,
    dimensions: '15" x 12" x 11"',
    models: ["Compact Electric Oven", "Countertop Oven A", "Urban Mini Oven"],
    brands: ["HearthPeak", "EmberCook", "NovaHeat"],
  },
  {
    id: "budget-smart",
    label: "Budget Smart Ovens",
    basePrice: 78,
    baseWeight: 16.8,
    dimensions: '16" x 12" x 12"',
    models: ["Budget Smart Oven", "Smart Dial Oven", "Connected Mini Oven"],
    brands: ["NovaHeat", "KinetiCook", "PulseBake"],
  },
  {
    id: "countertop-family",
    label: "Countertop Family Ovens",
    basePrice: 84,
    baseWeight: 18.9,
    dimensions: '17" x 13" x 12"',
    models: ["Countertop Oven Family", "Countertop Oven Plus", "XL Counter Oven"],
    brands: ["HearthPeak", "EmberCook", "RangeBloom"],
  },
  {
    id: "premium-mini",
    label: "Premium Mini Ovens",
    basePrice: 89,
    baseWeight: 14.2,
    dimensions: '14" x 11" x 11"',
    models: ["Premium Mini Oven", "Mini Oven Luxe", "Compact Oven Pro"],
    brands: ["ForgeWave", "LuxeHeat", "MetroTherm"],
  },
  {
    id: "convection-value",
    label: "Value Convection Countertop Ovens",
    basePrice: 92,
    baseWeight: 19.6,
    dimensions: '17" x 14" x 12"',
    models: ["Convection Value Oven", "Air Convection Oven", "TurboBake Countertop"],
    brands: ["AeroCook", "HeatBridge", "KinetiCook"],
  },
  {
    id: "airfry-combo",
    label: "Air Fry + Oven Combo Units",
    basePrice: 95,
    baseWeight: 18.3,
    dimensions: '16" x 13" x 13"',
    models: ["Air Fry Combo Oven", "DualCook Crisp Oven", "CrispWave Oven"],
    brands: ["CrispWave", "PulseBake", "NovaHeat"],
  },
  {
    id: "digital-precision",
    label: "Digital Precision Ovens",
    basePrice: 97,
    baseWeight: 17.5,
    dimensions: '16" x 12" x 12"',
    models: ["Digital Precision Oven", "SmartTemp Oven", "ExactHeat Mini Oven"],
    brands: ["ExactHeat", "PulseBake", "ForgeWave"],
  },
  {
    id: "family-xl",
    label: "Family XL Countertop Ovens",
    basePrice: 88,
    baseWeight: 20.8,
    dimensions: '18" x 14" x 13"',
    models: ["Family XL Oven", "Large Tray Counter Oven", "XL Bake Oven"],
    brands: ["RangeBloom", "HearthPeak", "AeroCook"],
  },
  {
    id: "dorm-essentials",
    label: "Dorm & Studio Compact Ovens",
    basePrice: 76,
    baseWeight: 13.8,
    dimensions: '14" x 11" x 10"',
    models: ["Dorm Compact Oven", "Studio Mini Oven", "SpaceSaver Oven"],
    brands: ["HomeNook", "UrbanBake", "KinetiCook"],
  },
  {
    id: "chef-pro-countertop",
    label: "Chef Pro Countertop Ovens",
    basePrice: 90,
    baseWeight: 19.1,
    dimensions: '17" x 13" x 12"',
    models: ["Chef Pro Counter Oven", "ProBake Mini Oven", "Chef Edition Oven"],
    brands: ["ChefStone", "ForgeWave", "RangeBloom"],
  },
];

const SELLERS = [
  "North Retail",
  "PrimeHome Direct",
  "ValueKitchen",
  "HomeCircle",
  "CityAppliance",
  "TechPantry",
  "BigBox Outlet",
  "SmartHome Deals",
  "CookHub",
  "DailySupply",
  "Ultra Appliances",
  "RapidFulfill",
  "Neighborhood Shop",
  "MetroElectrics",
  "MainStreet Appliance",
  "FlashSavings",
  "Warehouse Select",
  "Trusted Kitchen Hub",
];

const DELIVERY_PATTERN = [1, 2, 2, 3, 3, 4, 5, 2, 1, 6];
const RELIABILITY_PATTERN = [96, 91, 88, 84, 80, 76, 71, 66, 61, 57];
const SMART_CLUSTER_IDS = new Set(["budget-smart", "airfry-combo", "digital-precision"]);

function resolveCoreCategory(clusterId: string): "core_oven" | "smart_oven" {
  return SMART_CLUSTER_IDS.has(clusterId) ? "smart_oven" : "core_oven";
}

const CORE_LISTINGS: ProductListing[] = CLUSTER_SEEDS.flatMap((seed, clusterIndex) =>
  Array.from({ length: 6 }, (_, offerIndex) => {
    const listingIndex = clusterIndex * 6 + offerIndex;
    const reliability = RELIABILITY_PATTERN[(listingIndex + offerIndex) % RELIABILITY_PATTERN.length];
    const deliveryDays = DELIVERY_PATTERN[(offerIndex + clusterIndex) % DELIVERY_PATTERN.length];
    const priceDelta = ((clusterIndex * 3 + offerIndex * 4) % 15) - 7;
    const brand = seed.brands[(offerIndex + clusterIndex) % seed.brands.length];
    const title = `${seed.models[offerIndex % seed.models.length]} ${
      ["Standard", "Plus", "Lite", "Max", "Edition", "Select"][offerIndex]
    }`;
    return {
      id: `core-${String(listingIndex + 1).padStart(3, "0")}`,
      title,
      category: resolveCoreCategory(seed.id),
      imageUrl: buildRelevantImageUrl({
        text: `${brand} ${title}`,
        category: resolveCoreCategory(seed.id),
        seed: listingIndex + 1,
        id: `core-${String(listingIndex + 1).padStart(3, "0")}`,
      }),
      canonicalGroup: seed.id,
      canonicalLabel: seed.label,
      sellerName: SELLERS[(listingIndex + offerIndex) % SELLERS.length],
      brand,
      verifiedManufacturer: offerIndex % 3 !== 2,
      sellerReliability: reliability,
      fulfillmentHistory: Math.min(99, reliability + 7 + (offerIndex % 3)),
      deliveryDays,
      price: Math.max(49, seed.basePrice + priceDelta),
      weightLb: Number((seed.baseWeight + (offerIndex % 4) * 0.6).toFixed(1)),
      dimensions: seed.dimensions,
      sponsored: offerIndex === 1,
      rating: Number((4.1 + ((clusterIndex + offerIndex) % 7) * 0.1).toFixed(1)),
      reviewCount: 420 + listingIndex * 39 + offerIndex * 17,
      imageTone: "from-gray-200 to-gray-100",
    };
  }),
);

const GAMING_LISTINGS: ProductListing[] = Array.from({ length: 6 }, (_, index) => {
  const targetCluster = CLUSTER_SEEDS[index % 3];
  const title = [
    "Universal Oven Cover promo",
    "Budget Oven Gloves pair",
    "Mini Oven Cleaning Kit",
    "Oven Liner Value Pack",
    "Oven Protector Sheet ad",
    "Quick Oven Scrubber tool",
  ][index];
  return {
    id: `core-gaming-${index + 1}`,
    title,
    category: resolveCoreCategory(targetCluster.id),
    imageUrl: buildRelevantImageUrl({
      text: title,
      category: "accessory",
      seed: 700 + index,
      id: `core-gaming-${index + 1}`,
    }),
    canonicalGroup: targetCluster.id,
    canonicalLabel: targetCluster.label,
    sellerName: SELLERS[(index * 2 + 5) % SELLERS.length],
    brand: "QuickLoom",
    verifiedManufacturer: false,
    sellerReliability: 47 + index * 2,
    fulfillmentHistory: 62 + index * 3,
    deliveryDays: 7 + (index % 2),
    price: index % 2 === 0 ? 2 : 3,
    weightLb: 0.4 + index * 0.1,
    dimensions: '10" x 8" x 1"',
    rating: 3.0,
    reviewCount: 80 + index * 21,
    imageTone: "from-amber-100 to-yellow-50",
    miscategorized: true,
  };
});

const ACCESSORY_NAMES = [
  "Oven Cover",
  "Oven Gloves",
  "Oven Cleaning Kit",
  "Oven Liner Mats",
  "Oven Protector Sheet",
  "Oven Rack Scrubber",
  "Oven Tray Replacement",
  "Oven Spray Refill",
  "Heat Resistant Mitts",
  "Countertop Oven Stand Mat",
];

const ACCESSORY_PREFIXES = [
  "Essential",
  "Value",
  "Quick",
  "Premium",
  "Daily",
  "Home",
  "Ultra",
  "Compact",
  "Safe",
  "Chef",
];

const ACCESSORY_BRANDS = [
  "SafeMitts",
  "SparkleCore",
  "LineGuard",
  "CoverCrafted",
  "TrayWorks",
  "RackAid",
  "QuickLoom",
  "CleanNest",
];

const ACCESSORY_LISTINGS: ProductListing[] = Array.from({ length: 30 }, (_, index) => {
  const accessoryName = ACCESSORY_NAMES[index % ACCESSORY_NAMES.length];
  const prefix = ACCESSORY_PREFIXES[index % ACCESSORY_PREFIXES.length];
  const sellerReliability = 58 + ((index * 5) % 36);
  const price = [2, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18][index % 12];
  const brand = ACCESSORY_BRANDS[index % ACCESSORY_BRANDS.length];
  const title = `${prefix} ${accessoryName}`;

  return {
    id: `acc-${String(index + 1).padStart(3, "0")}`,
    title,
    category: "accessory",
    imageUrl: buildRelevantImageUrl({
      text: `${brand} ${title}`,
      category: "accessory",
      seed: 900 + index,
      id: `acc-${String(index + 1).padStart(3, "0")}`,
    }),
    canonicalGroup: "related-accessories",
    canonicalLabel: "Related Accessories",
    sellerName: SELLERS[(index + 8) % SELLERS.length],
    brand,
    verifiedManufacturer: index % 3 !== 1,
    sellerReliability,
    fulfillmentHistory: Math.min(99, sellerReliability + 9),
    deliveryDays: 2 + (index % 6),
    price,
    weightLb: Number((0.3 + (index % 6) * 0.25).toFixed(1)),
    dimensions: '10" x 7" x 2"',
    rating: Number((3.8 + ((index + 2) % 8) * 0.1).toFixed(1)),
    reviewCount: 140 + index * 47,
    imageTone: "from-amber-100 to-yellow-50",
  };
});

export const MOCK_LISTINGS: ProductListing[] = [
  ...CORE_LISTINGS,
  ...GAMING_LISTINGS,
  ...ACCESSORY_LISTINGS,
];
