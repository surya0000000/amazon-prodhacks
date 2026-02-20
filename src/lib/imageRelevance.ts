type ImageCategory = "core" | "accessory";

interface BuildRelevantImageUrlOptions {
  text: string;
  category: ImageCategory;
  seed?: number;
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
  "the",
  "and",
  "for",
  "with",
  "plus",
  "max",
  "pro",
  "select",
  "edition",
  "standard",
  "lite",
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

function toKeywordCsv(rawQuery: string, category: ImageCategory): string {
  const baseKeywords =
    category === "core"
      ? ["countertop", "oven", "kitchen", "appliance", "photo"]
      : ["oven", "kitchen", "accessory", "tool", "photo"];
  const inferredTokens = normalizeText(rawQuery)
    .split(" ")
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
  const keywordSet = new Set([...inferredTokens, ...baseKeywords]);
  return [...keywordSet].slice(0, 7).join(",");
}

export function buildRelevantImageUrl({
  text,
  category,
  seed = 1,
  width = 600,
  height = 600,
}: BuildRelevantImageUrlOptions): string {
  const query = inferRelevantImageQuery(text, category);
  const normalizedSeed = Math.max(1, Math.abs(seed % 1000));
  const keywordCsv = toKeywordCsv(`${text} ${query}`, category);
  return `https://source.unsplash.com/random/${width}x${height}/?${keywordCsv}&sig=${normalizedSeed}`;
}

