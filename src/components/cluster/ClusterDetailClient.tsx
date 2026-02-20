"use client";

import { ClusterSellerTable } from "@/components/cluster/ClusterSellerTable";
import { ProductImage } from "@/components/common/ProductImage";
import { ComparisonDrawer } from "@/components/search/ComparisonDrawer";
import { SearchChrome } from "@/components/search/SearchChrome";
import { MOCK_LISTINGS } from "@/data/mockCatalog";
import { getClusterMedia } from "@/lib/catalogMedia";
import { analyzeListings } from "@/lib/intentIntegrity";
import type { ProductListing, SortMode } from "@/types/catalog";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ClusterDetailClientProps {
  clusterId: string;
}

function starLine(rating: number) {
  const filled = Math.round(rating);
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

export function ClusterDetailClient({ clusterId }: ClusterDetailClientProps) {
  const searchParams = useSearchParams();
  const query = decodeURIComponent((searchParams.get("q") ?? "oven under 100").replace(/\+/g, " "));

  const analysis = useMemo(() => analyzeListings(query, MOCK_LISTINGS), [query]);
  const cluster = analysis.clusters.find((item) => item.id === clusterId);
  const media = useMemo(() => getClusterMedia(clusterId), [clusterId]);
  const sellersRef = useRef<HTMLDivElement>(null);

  const [sortMode, setSortMode] = useState<SortMode>("lowestPrice");
  const [showSellerTable, setShowSellerTable] = useState(true);
  const [expandedOfferIds, setExpandedOfferIds] = useState<string[]>([]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(media.hero);
  const thumbnailSet = media.gallery.slice(0, 5);
  const imageSet = [media.hero, ...thumbnailSet];
  const displayImage = imageSet.includes(activeImage) ? activeImage : media.hero;

  if (!cluster) {
    return (
      <div className="min-h-screen bg-[#eaeded]">
        <SearchChrome query={query} />
        <main className="mx-auto max-w-[1200px] px-3 py-6">
          <div className="border border-[#d5d9d9] bg-white p-4">
            <h1 className="text-[20px] font-semibold text-[#0f1111]">Cluster not found</h1>
            <p className="mt-1 text-[13px] text-[#565959]">
              The selected canonical cluster is unavailable in this intent result set.
            </p>
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="mt-3 inline-block text-[13px] text-[#007185] hover:underline"
            >
              Back to search results
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const activeCompareIds = selectedCompareIds.filter((id) =>
    cluster.offers.some((offer) => offer.id === id),
  );
  const compareOffers: ProductListing[] = activeCompareIds
    .map((id) => cluster.offers.find((offer) => offer.id === id))
    .filter((offer): offer is ProductListing => Boolean(offer));
  const fastestDelivery = Math.min(...cluster.offers.map((offer) => offer.deliveryDays));
  const verifiedSellerCount = cluster.offers.filter((offer) => offer.verifiedManufacturer).length;
  const primeEligibleCount = cluster.offers.filter((offer) => offer.deliveryDays <= 2).length;

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111]">
      <SearchChrome query={query} />
      <main className="mx-auto max-w-[1500px] space-y-3 px-2 py-3">
        <div className="border border-[#d5d9d9] bg-white px-3 py-2 text-[12px] text-[#565959]">
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="text-[#007185] hover:underline">
            Back to results
          </Link>{" "}
          / Small Appliances / Canonical Variant
        </div>

        <section className="grid gap-3 xl:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
          <div className="border border-[#d5d9d9] bg-white p-3">
            <div className="group relative aspect-square overflow-hidden rounded-md border border-[#d5d9d9] bg-[#f7f7f7]">
              <ProductImage
                src={displayImage}
                alt={cluster.label}
                sizes="(max-width: 1280px) 100vw, 42vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                priority
                category={cluster.offers[0]?.category}
                overlayText={cluster.label}
              />
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {thumbnailSet.map((thumbUrl) => (
                <button
                  key={thumbUrl}
                  type="button"
                  onClick={() => setActiveImage(thumbUrl)}
                  className={`relative aspect-square overflow-hidden rounded border transition ${
                    displayImage === thumbUrl
                      ? "border-[#f90] shadow-[0_0_0_1px_#f90]"
                      : "border-[#d5d9d9] hover:border-[#999]"
                  }`}
                >
                  <ProductImage
                    src={thumbUrl}
                    alt="Product thumbnail"
                    sizes="90px"
                    className="object-cover"
                    category={cluster.offers[0]?.category}
                    overlayText={cluster.label}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="border border-[#d5d9d9] bg-white p-3">
              <h1 className="text-[24px] leading-7 text-[#0f1111]">{cluster.label}</h1>
              <p className="mt-1 text-[13px] text-[#007185]">
                {starLine(cluster.aggregateRating)} ({cluster.offers.length} seller offers)
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="border border-[#007185]/30 bg-[#f0f8fb] px-1.5 py-[1px] text-[11px] text-[#007185]">
                  Prime Eligible Offers: {primeEligibleCount}
                </span>
                <span className="border border-[#067d62]/40 bg-[#f1fff8] px-1.5 py-[1px] text-[11px] text-[#067d62]">
                  Verified Manufacturer Sellers: {verifiedSellerCount}
                </span>
              </div>

              <div className="mt-3 border-y border-[#e7e7e7] py-2">
                <p className="text-[13px] text-[#565959]">Canonical cluster price band:</p>
                <p className="text-[28px] leading-8 text-[#b12704]">
                  ${cluster.minPrice} - ${cluster.maxPrice}
                </p>
                <p className="text-[12px] text-[#565959]">
                  Fastest delivery: {fastestDelivery <= 1 ? "Tomorrow" : `${fastestDelivery} days`}
                </p>
              </div>

              <div className="mt-3">
                <h2 className="text-[14px] font-semibold text-[#0f1111]">Key Features</h2>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-[#0f1111]">
                  {media.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="group relative mt-3 inline-flex items-center text-[12px] text-[#007185]">
                <button type="button" className="hover:underline">
                  Why am I seeing this?
                </button>
                <div className="pointer-events-none absolute left-0 top-[110%] z-20 hidden w-[340px] border border-[#d5d9d9] bg-white p-2 text-[11px] text-[#565959] shadow-md group-hover:block">
                  Intent classifier detected appliance purchase intent and collapsed duplicate
                  listings into this canonical product family. Seller trust and sponsorship remain
                  visible in the comparison table.
                </div>
              </div>
            </div>

            <aside className="sticky top-[96px] self-start border border-[#d5d9d9] bg-white p-3">
              <p className="text-[24px] leading-7 text-[#b12704]">
                ${cluster.minPrice} - ${cluster.maxPrice}
              </p>
              <p className="mt-1 text-[12px] text-[#565959]">
                FREE delivery in {fastestDelivery <= 1 ? "1 day" : `${fastestDelivery} days`}
              </p>
              <p className="mt-1 text-[11px] text-[#067d62]">In stock from multiple sellers.</p>
              <div className="mt-2 space-y-1 text-[11px]">
                <p>
                  <span className="font-semibold">Prime:</span> Eligible offers available
                </p>
                <p>
                  <span className="font-semibold">Verification:</span> {verifiedSellerCount} sellers
                  verified by manufacturer signal
                </p>
              </div>

              <button
                type="button"
                className="mt-3 w-full border border-[#a88734] bg-[#ffd814] px-3 py-1.5 text-[12px] text-[#0f1111] hover:bg-[#f7ca00]"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="mt-2 w-full border border-[#a2a6ac] bg-[#f0f2f2] px-3 py-1.5 text-[12px] text-[#0f1111] hover:bg-[#e7e9ec]"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeCompareIds.length === 0 && cluster.offers.length >= 2) {
                    setSelectedCompareIds([cluster.offers[0].id, cluster.offers[1].id]);
                  }
                }}
                className="mt-2 w-full border border-[#a2a6ac] bg-white px-3 py-1.5 text-[12px] text-[#0f1111] hover:bg-[#f7fafa]"
              >
                Compare ({activeCompareIds.length}/2)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSellerTable((prev) => !prev);
                  sellersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="mt-2 w-full border border-[#a2a6ac] bg-white px-3 py-1.5 text-[12px] text-[#0f1111] hover:bg-[#f7fafa]"
              >
                {showSellerTable ? "Hide Sellers" : "View Sellers"}
              </button>
            </aside>
          </div>
        </section>

        <div ref={sellersRef}>
          {showSellerTable ? (
            <section className="space-y-2">
              <div className="border border-[#d5d9d9] bg-white px-3 py-2">
                <h2 className="text-[17px] font-semibold text-[#0f1111]">Offer table by seller</h2>
                <p className="text-[12px] text-[#565959]">
                  Sponsored bids, reliability tiering, delivery speed, and manufacturer verification
                  are all visible in-context.
                </p>
              </div>
              <ClusterSellerTable
                offers={cluster.offers}
                sortMode={sortMode}
                onSortChange={setSortMode}
                expandedOfferIds={expandedOfferIds}
                onToggleExpanded={(offerId) =>
                  setExpandedOfferIds((prev) =>
                    prev.includes(offerId)
                      ? prev.filter((existing) => existing !== offerId)
                      : [...prev, offerId],
                  )
                }
                selectedCompareIds={activeCompareIds}
                onToggleCompare={(offerId) =>
                  setSelectedCompareIds((prev) => {
                    if (prev.includes(offerId)) {
                      return prev.filter((existing) => existing !== offerId);
                    }
                    if (prev.length === 2) {
                      return [prev[1], offerId];
                    }
                    return [...prev, offerId];
                  })
                }
              />
            </section>
          ) : null}
        </div>
      </main>

      <ComparisonDrawer
        offers={compareOffers}
        onRemove={(listingId) =>
          setSelectedCompareIds((prev) => prev.filter((id) => id !== listingId))
        }
        onClear={() => setSelectedCompareIds([])}
      />
    </div>
  );
}
