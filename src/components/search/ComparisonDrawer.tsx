import type { ProductListing } from "@/types/catalog";

interface ComparisonDrawerProps {
  offers: ProductListing[];
  onRemove: (listingId: string) => void;
  onClear: () => void;
}

export function ComparisonDrawer({ offers, onRemove, onClear }: ComparisonDrawerProps) {
  const open = offers.length > 0;

  return (
    <aside
      className={`fixed right-0 top-0 z-40 h-full w-[360px] border-l border-[#d5d9d9] bg-white shadow-xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-[#d5d9d9] px-3 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#0f1111]">Compare Top Options</h2>
            <button
              type="button"
              className="text-[11px] text-[#007185] hover:underline"
              onClick={onClear}
            >
              Clear all
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[#565959]">
            {offers.length < 2
              ? "Select one more seller option to complete side-by-side comparison."
              : "Intent-aware comparison of canonical seller options."}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {offers.length === 0 ? null : (
            <div className="space-y-3">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="border border-[#d5d9d9] bg-[#f7fafa] p-1 text-left">Attribute</th>
                    {offers.map((offer) => (
                      <th
                        key={offer.id}
                        className="border border-[#d5d9d9] bg-[#f7fafa] p-1 text-left"
                      >
                        <div className="line-clamp-2">{offer.sellerName}</div>
                        <button
                          className="mt-1 text-[10px] text-[#007185] hover:underline"
                          type="button"
                          onClick={() => onRemove(offer.id)}
                        >
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Model",
                      value: (offer: ProductListing) => offer.title,
                    },
                    {
                      label: "Price",
                      value: (offer: ProductListing) => `$${offer.price.toFixed(2)}`,
                    },
                    {
                      label: "Seller Reliability",
                      value: (offer: ProductListing) => `${offer.sellerReliability}`,
                    },
                    {
                      label: "Delivery",
                      value: (offer: ProductListing) => `${offer.deliveryDays} day(s)`,
                    },
                    {
                      label: "Fulfillment History",
                      value: (offer: ProductListing) => `${offer.fulfillmentHistory}%`,
                    },
                    {
                      label: "Verified Manufacturer",
                      value: (offer: ProductListing) =>
                        offer.verifiedManufacturer ? "Yes" : "No",
                    },
                    {
                      label: "Weight",
                      value: (offer: ProductListing) => `${offer.weightLb} lb`,
                    },
                    {
                      label: "Dimensions",
                      value: (offer: ProductListing) => offer.dimensions,
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="border border-[#d5d9d9] bg-[#fcfcfc] p-1 font-semibold text-[#565959]">
                        {row.label}
                      </td>
                      {offers.map((offer) => (
                        <td key={`${row.label}-${offer.id}`} className="border border-[#d5d9d9] p-1">
                          {row.value(offer)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
