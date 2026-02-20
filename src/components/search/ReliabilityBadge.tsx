import { SELLER_TIER_COPY, toSellerTier } from "@/lib/intentIntegrity";

interface ReliabilityBadgeProps {
  score: number;
}

const tierClassMap = {
  trusted: "border-[#2e7d32] bg-[#edf7ed] text-[#1b5e20]",
  new: "border-[#e0a800] bg-[#fff8e1] text-[#8a6d1d]",
  unverified: "border-[#9e9e9e] bg-[#f5f5f5] text-[#616161]",
};

const labelMap = {
  trusted: "Trusted Seller",
  new: "New Seller",
  unverified: "Unverified",
};

export function ReliabilityBadge({ score }: ReliabilityBadgeProps) {
  const tier = toSellerTier(score);

  return (
    <div className="group relative inline-flex items-center">
      <span
        className={`inline-flex items-center gap-1 border px-1.5 py-[1px] text-[11px] ${tierClassMap[tier]}`}
      >
        <span className="font-semibold">{labelMap[tier]}</span>
        <span className="text-[10px]">{score}</span>
      </span>
      <div className="pointer-events-none absolute left-1/2 top-[115%] z-30 hidden w-56 -translate-x-1/2 border border-black/20 bg-white px-2 py-1 text-[10px] text-[#333] shadow-md group-hover:block">
        {SELLER_TIER_COPY[tier]}
      </div>
    </div>
  );
}
