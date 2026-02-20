import { sortClusterOffers } from "@/lib/intentIntegrity";
import type { ProductListing, SortMode } from "@/types/catalog";
import { ReliabilityBadge } from "@/components/search/ReliabilityBadge";

interface ClusterSellerTableProps {
  offers: ProductListing[];
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  expandedOfferIds: string[];
  onToggleExpanded: (offerId: string) => void;
  selectedCompareIds: string[];
  onToggleCompare: (offerId: string) => void;
}

function deliveryText(days: number) {
  if (days <= 1) return "Tomorrow";
  if (days === 2) return "2-day";
  return `${days}-day`;
}

export function ClusterSellerTable({
  offers,
  sortMode,
  onSortChange,
  expandedOfferIds,
  onToggleExpanded,
  selectedCompareIds,
  onToggleCompare,
}: ClusterSellerTableProps) {
  const sortedOffers = sortClusterOffers(offers, sortMode);

  return (
    <section className="border border-[#d5d9d9] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e7e7e7] px-3 py-2">
        <h2 className="text-[16px] font-semibold text-[#0f1111]">Seller Comparison</h2>
        <div className="ml-auto flex items-center gap-2 text-[12px]">
          <label htmlFor="cluster-sort">Sort By:</label>
          <select
            id="cluster-sort"
            value={sortMode}
            onChange={(event) => onSortChange(event.target.value as SortMode)}
            className="border border-[#a2a6ac] bg-white px-2 py-[3px]"
          >
            <option value="lowestPrice">Lowest Price</option>
            <option value="sellerReliability">Seller Reliability</option>
            <option value="deliverySpeed">Delivery Speed</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto px-3 py-2">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[2fr_1.1fr_1fr_1fr_106px_80px] gap-2 border-b border-[#e7e7e7] pb-1 text-[10px] font-semibold uppercase tracking-wide text-[#565959]">
            <span>Seller Offer</span>
            <span>Reliability</span>
            <span>Manufacturer</span>
            <span>Delivery</span>
            <span className="text-right">Price</span>
            <span className="text-right">Actions</span>
          </div>

          {sortedOffers.map((offer) => {
            const expanded = expandedOfferIds.includes(offer.id);
            return (
              <div key={offer.id} className="border-b border-[#ececec] py-1.5 last:border-b-0">
                <div className="grid grid-cols-[2fr_1.1fr_1fr_1fr_106px_80px] items-center gap-2 text-[12px]">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0f1111]">{offer.sellerName}</span>
                      {offer.sponsored ? (
                        <span className="border border-[#c7c7c7] bg-[#f7f7f7] px-1 py-[1px] text-[10px] text-[#555]">
                          Sponsored
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#565959]">
                      Brand {offer.brand} • Fulfillment {offer.fulfillmentHistory}%
                    </div>
                  </div>

                  <ReliabilityBadge score={offer.sellerReliability} />

                  <div>
                    {offer.verifiedManufacturer ? (
                      <span className="border border-[#067d62]/40 bg-[#f1fff8] px-1 py-[1px] text-[10px] text-[#067d62]">
                        Verified
                      </span>
                    ) : (
                      <span className="border border-[#d5d9d9] bg-[#f7fafa] px-1 py-[1px] text-[10px] text-[#565959]">
                        Marketplace
                      </span>
                    )}
                  </div>

                  <div className="text-[#565959]">
                    <div className="text-[11px]">{deliveryText(offer.deliveryDays)}</div>
                    <div className="text-[10px]">{offer.deliveryDays} day estimate</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[18px] leading-4 text-[#b12704]">${offer.price}</div>
                  </div>

                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onToggleExpanded(offer.id)}
                      className="border border-[#a2a6ac] bg-[#f0f2f2] px-1.5 py-[2px] text-[10px] hover:bg-[#e7e9ec]"
                    >
                      {expanded ? "Hide" : "More"}
                    </button>
                    <label className="inline-flex items-center gap-1 border border-[#a2a6ac] bg-white px-1.5 py-[2px] text-[10px]">
                      <input
                        type="checkbox"
                        checked={selectedCompareIds.includes(offer.id)}
                        onChange={() => onToggleCompare(offer.id)}
                      />
                      Compare
                    </label>
                  </div>
                </div>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mt-1.5 grid grid-cols-1 gap-1 border border-[#ececec] bg-[#fafafa] px-2 py-2 text-[11px] text-[#565959] md:grid-cols-3">
                      <p>
                        <span className="font-semibold text-[#0f1111]">Dimensions:</span>{" "}
                        {offer.dimensions}
                      </p>
                      <p>
                        <span className="font-semibold text-[#0f1111]">Weight:</span>{" "}
                        {offer.weightLb} lb
                      </p>
                      <p>
                        <span className="font-semibold text-[#0f1111]">Reliability:</span>{" "}
                        Score {offer.sellerReliability} with {offer.fulfillmentHistory}% fulfillment
                        history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
