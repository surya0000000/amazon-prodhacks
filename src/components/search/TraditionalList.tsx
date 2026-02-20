import type { ProductListing } from "@/types/catalog";
import { getListingImage } from "@/lib/catalogMedia";
import { ProductImage } from "@/components/common/ProductImage";

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
        Traditional list mode: mixed accessory noise, duplicate sellers, and sponsored rank shifts.
      </div>
      {listings.map((listing) => (
        <article
          key={listing.id}
          className="grid grid-cols-[124px_1fr_136px] gap-3 border border-[#d5d9d9] bg-white px-3 py-3 text-[12px] hover:border-[#b7bfc7]"
        >
          <div className="relative h-[112px] overflow-hidden rounded border border-[#d5d9d9] bg-[#f7f7f7]">
            <ProductImage
              src={getListingImage(listing)}
              alt={listing.title}
              sizes="124px"
              className="object-cover transition-transform duration-200 hover:scale-[1.03]"
              fallbackSeed={listing.id}
            />
          </div>
          <div>
            <h3 className="text-[14px] leading-5 text-[#0f1111] hover:text-[#c7511f]">
              {listing.title}
            </h3>
            <p className="mt-1 text-[12px] text-[#565959]">
              {starLine(listing.rating)}{" "}
              <span className="text-[#007185]">({listing.reviewCount.toLocaleString()})</span>
            </p>
            <p className="mt-1 text-[11px] text-[#565959]">
              Sold by <span className="text-[#0f1111]">{listing.sellerName}</span> • Brand{" "}
              {listing.brand}
            </p>
            <p className="mt-1 text-[10px] text-[#565959]">
              {listing.dimensions} • {listing.weightLb} lb
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {listing.verifiedManufacturer ? (
                <span className="border border-[#067d62]/40 bg-[#f1fff8] px-1 py-[1px] text-[10px] text-[#067d62]">
                  Verified Manufacturer
                </span>
              ) : null}
              <span className="border border-[#007185]/30 bg-[#f0f8fb] px-1 py-[1px] text-[10px] text-[#007185]">
                Prime
              </span>
            </div>
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
            <button
              type="button"
              className="mt-2 border border-[#888c8c] bg-[#ffd814] px-2 py-[3px] text-[11px] text-[#0f1111] hover:bg-[#f7ca00]"
            >
              Add to Cart
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
