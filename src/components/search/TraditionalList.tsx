import type { ProductListing } from "@/types/catalog";

interface TraditionalListProps {
  listings: ProductListing[];
}

function starLine(rating: number) {
  const filled = Math.round(rating);
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

export function TraditionalList({ listings }: TraditionalListProps) {
  return (
    <section className="space-y-2">
      <div className="border border-[#d5d9d9] bg-white px-3 py-2 text-[12px] text-[#565959]">
        Traditional list view mixes accessories, duplicated sellers, and ad-ranked listings.
      </div>
      {listings.map((listing) => (
        <article
          key={listing.id}
          className="grid grid-cols-[96px_1fr_140px] gap-3 border border-[#d5d9d9] bg-white px-3 py-3 text-[12px]"
        >
          <div
            className={`h-24 border border-[#d5d9d9] bg-gradient-to-b ${listing.imageTone} p-2 text-[10px] text-[#333]`}
          >
            {listing.title}
          </div>
          <div>
            <h3 className="text-[14px] leading-5 text-[#0f1111] hover:text-[#c7511f]">
              {listing.title}
            </h3>
            <p className="mt-1 text-[12px] text-[#565959]">
              {starLine(listing.rating)} <span className="text-[#007185]">({listing.reviewCount})</span>
            </p>
            <p className="mt-1 text-[12px] text-[#565959]">
              Sold by {listing.sellerName} • Brand {listing.brand}
            </p>
            <p className="mt-1 text-[11px] text-[#565959]">
              {listing.dimensions} • {listing.weightLb} lb
            </p>
            {listing.category === "accessory" || listing.miscategorized ? (
              <span className="mt-1 inline-flex border border-[#f0c14b] bg-[#fff8e7] px-1.5 py-[1px] text-[10px] text-[#6b4f00]">
                Accessory appears due keyword match
              </span>
            ) : null}
          </div>
          <div className="text-right">
            {listing.sponsored ? (
              <div className="mb-1 inline-block border border-[#c7c7c7] bg-[#f7f7f7] px-1.5 py-[1px] text-[10px] text-[#555]">
                Sponsored
              </div>
            ) : null}
            <div className="text-[20px] leading-5 text-[#b12704]">${listing.price.toFixed(2)}</div>
            <p className="mt-1 text-[11px] text-[#565959]">Delivery in {listing.deliveryDays} days</p>
          </div>
        </article>
      ))}
    </section>
  );
}
