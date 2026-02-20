import { sortClusterOffers } from "@/lib/intentIntegrity";
import type { CanonicalCluster, SortMode } from "@/types/catalog";
import { ReliabilityBadge } from "./ReliabilityBadge";

interface CanonicalClusterCardProps {
  cluster: CanonicalCluster;
  sortMode: SortMode;
  expanded: boolean;
  onToggle: () => void;
  selectedCompareIds: string[];
  onToggleCompare: (listingId: string) => void;
}

function aggregateStars(rating: number) {
  const rounded = Math.round(rating);
  return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
}

function deliveryText(days: number) {
  if (days <= 1) return "Tomorrow";
  if (days === 2) return "2-day";
  return `${days}-day`;
}

export function CanonicalClusterCard({
  cluster,
  sortMode,
  expanded,
  onToggle,
  selectedCompareIds,
  onToggleCompare,
}: CanonicalClusterCardProps) {
  const offers = sortClusterOffers(cluster.offers, sortMode);

  return (
    <article className="border border-[#d5d9d9] bg-white">
      <div className="grid grid-cols-[120px_1fr_auto] gap-3 px-3 py-3">
        <div
          className={`h-[88px] border border-[#d5d9d9] bg-gradient-to-b ${cluster.imageTone} p-2 text-[10px] text-[#333]`}
        >
          Canonical
          <br />
          Product
        </div>
        <div>
          <h3 className="text-[16px] leading-5 text-[#0f1111]">{cluster.label}</h3>
          <p className="mt-1 text-[12px] text-[#565959]">
            Verified Manufacturers + {cluster.sellerCount} Sellers
          </p>
          <p className="mt-1 text-[12px] text-[#0f1111]">
            Price Range:{" "}
            <span className="font-semibold text-[#b12704]">
              ${cluster.minPrice} - ${cluster.maxPrice}
            </span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#565959]">
            <span>{aggregateStars(cluster.aggregateRating)} (aggregate)</span>
            <span className="border border-[#d5d9d9] bg-[#f7fafa] px-1.5 py-[1px]">
              Functional equivalence cluster
            </span>
            <span className="border border-[#d5d9d9] bg-[#f7fafa] px-1.5 py-[1px]">
              Attribute validation pass
            </span>
          </div>
        </div>
        <div className="flex items-start">
          <button
            type="button"
            onClick={onToggle}
            className="border border-[#a2a6ac] bg-[#f0f2f2] px-3 py-1 text-[12px] text-[#0f1111] hover:bg-[#e7e9ec]"
          >
            {expanded ? "Hide Options" : "View Options"}
          </button>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#d5d9d9] bg-[#fbfbfb] px-3 py-2">
            <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_90px] gap-2 border-b border-[#e7e7e7] pb-1 text-[10px] font-semibold uppercase tracking-wide text-[#565959]">
              <span>Seller</span>
              <span>Reliability</span>
              <span>Manufacturer</span>
              <span>Delivery</span>
              <span className="text-right">Price</span>
            </div>
            <div className="space-y-1 pt-1">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="grid grid-cols-[2fr_1.2fr_1fr_1fr_90px] items-center gap-2 border-b border-[#ececec] py-1.5 text-[12px] last:border-b-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#0f1111]">{offer.sellerName}</span>
                      {offer.sponsored ? (
                        <span className="border border-[#c7c7c7] bg-[#f7f7f7] px-1 py-[1px] text-[10px] text-[#555]">
                          Sponsored
                        </span>
                      ) : null}
                    </div>
                    {offer.sponsored ? (
                      <div className="text-[10px] text-[#565959]">
                        Bid-adjusted slot inside canonical cluster
                      </div>
                    ) : null}
                  </div>
                  <ReliabilityBadge score={offer.sellerReliability} />
                  <div>
                    {offer.verifiedManufacturer ? (
                      <span className="border border-[#007600] bg-[#f1fff1] px-1 py-[1px] text-[10px] text-[#067d62]">
                        Verified Manufacturer
                      </span>
                    ) : (
                      <span className="border border-[#d5d9d9] bg-[#f7fafa] px-1 py-[1px] text-[10px] text-[#565959]">
                        Marketplace Seller
                      </span>
                    )}
                  </div>
                  <div className="text-[#565959]">
                    <div className="text-[11px]">{deliveryText(offer.deliveryDays)}</div>
                    <div className="text-[10px]">Fulfillment {offer.fulfillmentHistory}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[16px] leading-4 text-[#b12704]">${offer.price}</div>
                    <label className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#565959]">
                      <input
                        type="checkbox"
                        checked={selectedCompareIds.includes(offer.id)}
                        onChange={() => onToggleCompare(offer.id)}
                      />
                      Compare
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
