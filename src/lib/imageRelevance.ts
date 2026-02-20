type ImageCategory = "core" | "accessory";

interface BuildRelevantImageUrlOptions {
  text: string;
  category: ImageCategory;
  seed?: number | string;
  width?: number;
  height?: number;
}

const CORE_RULES: Array<[RegExp, string]> = [
  [/air\s?fry|crisp/i, "air fry oven kitchen appliance"],
  [/smart|digital|precision/i, "smart oven digital kitchen appliance"],
  [/convection/i, "convection countertop oven stainless steel"],
  [/mini|compact|dorm|studio/i, "compact countertop mini oven kitchen"],
  [/family|xl|large/i, "large countertop oven kitchen appliance"],
  [/chef|pro/i, "professional countertop oven kitchen appliance"],
];

const ACCESSORY_RULES: Array<[RegExp, string]> = [
  [/glove|mitt/i, "oven gloves kitchen accessory"],
  [/cover/i, "appliance cover kitchen"],
  [/clean|spray|scrubber|kit/i, "oven cleaning kit kitchen"],
  [/tray|liner|sheet|rack/i, "oven tray liner kitchen accessory"],
];

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

export function inferRelevantImageQuery(text: string, category: ImageCategory): string {
  const normalized = normalizeText(text);
  const rules = category === "core" ? CORE_RULES : ACCESSORY_RULES;
  const matched = rules.find(([pattern]) => pattern.test(normalized));
  if (matched) return matched[1];

  if (category === "core") {
    if (normalized.includes("oven")) return "countertop oven kitchen appliance";
    return "kitchen appliance";
  }

  return "kitchen accessory";
}

function toKeywordList(rawQuery: string, category: ImageCategory): string[] {
  const inferredTokens = normalizeText(rawQuery)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

  const requiredBase =
    category === "core"
      ? ["countertop", "oven", "kitchen", "appliance", "stainless", "steel"]
      : ["oven", "kitchen", "accessory", "tool"];

  const deduped = [...new Set([...inferredTokens, ...requiredBase])];
  return deduped.slice(0, 8);
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
  width = 600,
  height = 600,
}: BuildRelevantImageUrlOptions): string {
  const query = inferRelevantImageQuery(text, category);
  const keywords = toKeywordList(`${text} ${query}`, category);
  const keywordQuery = keywords.map((token) => encodeURIComponent(token)).join("+");
  const normalizedSeed = toStableNumber(seed) % 1000;
  return `https://source.unsplash.com/featured/${width}x${height}/?${keywordQuery}&sig=${normalizedSeed}`;
}

export function buildFallbackImageUrl(
  seed: string | number,
  width = 600,
  height = 600,
): string {
  const normalizedSeed = encodeURIComponent(String(seed).toLowerCase().replace(/\s+/g, "-"));
  return `https://picsum.photos/seed/${normalizedSeed}/${width}/${height}`;
}

