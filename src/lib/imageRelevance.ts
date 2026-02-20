type ImageCategory = "core_oven" | "smart_oven" | "accessory";

interface BuildRelevantImageUrlOptions {
  text: string;
  category: ImageCategory;
  seed?: number | string;
  id?: string;
}

const STOP_WORDS = new Set([
  "budget",
  "cheap",
  "premium",
  "family",
  "value",
  "essential",
  "deluxe",
  "select",
  "edition",
  "standard",
  "lite",
  "plus",
  "max",
  "the",
  "and",
  "for",
  "with",
  "under",
  "over",
  "best",
  "new",
]);

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function extractNounLikeTokens(rawText: string) {
  const tokens = normalizeText(rawText)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
  return [...new Set(tokens)];
}

function categoryPreset(category: ImageCategory, text: string) {
  if (category === "accessory") {
    if (/glove|mitt/i.test(text)) return "accessory-gloves";
    if (/cover/i.test(text)) return "accessory-cover";
    if (/clean|spray|scrubber|kit/i.test(text)) return "accessory-cleaning";
    if (/tray|liner|sheet|rack/i.test(text)) return "accessory-tray";
    return "accessory-oven";
  }
  if (category === "smart_oven") {
    return "smart-oven";
  }
  if (/mini|compact|dorm|studio/i.test(text)) {
    return "mini-oven";
  }
  return "countertop-oven";
}

const IMAGE_COUNT_BY_CATEGORY: Record<ImageCategory, number> = {
  core_oven: 60,
  smart_oven: 60,
  accessory: 60,
};

function indexToFilename(category: ImageCategory, index: number) {
  return `/images/catalog/${category}/${category}-${String(index).padStart(2, "0")}.jpg`;
}

function toStableNumber(seed: number | string) {
  const normalized = String(seed);
  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) % 1000003;
  }
  return Math.abs(hash) || 1;
}

export function buildRelevantImageUrl({
  text,
  category,
  seed = 1,
  id,
}: BuildRelevantImageUrlOptions): string {
  const uniqueId = id ?? String(seed);
  const max = IMAGE_COUNT_BY_CATEGORY[category];
  const explicitNumber = uniqueId.match(/-(\d+)/)?.[1];

  if (explicitNumber) {
    const normalized = Number(explicitNumber);
    if (Number.isFinite(normalized) && normalized > 0) {
      const index = ((normalized - 1) % max) + 1;
      return indexToFilename(category, index);
    }
  }

  const preset = categoryPreset(category, text);
  const nouns = extractNounLikeTokens(text).slice(0, 3).join("-");
  const entropy = toStableNumber(`${preset}-${uniqueId}-${nouns}-${seed}`);
  const index = (entropy % max) + 1;
  return indexToFilename(category, index);
}

export function buildFallbackImageUrl() {
  return "/oven-placeholder.jpg";
}

export function getOverlayImage(category: ImageCategory, text: string) {
  if (category === "accessory") {
    return "/images/overlays/accessory-overlay.png";
  }
  if (category === "smart_oven") {
    return "/images/overlays/smart-oven-overlay.png";
  }
  if (/mini|compact|dorm|studio/i.test(text)) {
    return "/images/overlays/mini-oven-overlay.png";
  }
  return "/images/overlays/countertop-oven-overlay.png";
}

