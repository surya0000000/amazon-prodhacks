"use client";

import { ClusterSellerTable } from "@/components/cluster/ClusterSellerTable";
import { ComparisonDrawer } from "@/components/search/ComparisonDrawer";
import { SearchChrome } from "@/components/search/SearchChrome";
import { MOCK_LISTINGS } from "@/data/mockCatalog";
import { getClusterMedia } from "@/lib/catalogMedia";
import { analyzeListings } from "@/lib/intentIntegrity";
import type { ProductListing, SortMode } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

function starLine(rating: number) {
  const filled = Math.round(rating);
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

function ClusterDetailContent() {
  const params = useParams<{ clusterId: string }>();
  const searchParams = useSearchParams();
  const query = decodeURIComponent((searchParams.get("q") ?? "oven under 100").replace(/\+/g, " "));
  const clusterId = params.clusterId;

  const analysis = useMemo(() => analyzeListings(query, MOCK_LISTINGS), [query]);
  const cluster = analysis.clusters.find((item) => item.id === clusterId);
  const media = useMemo(() => getClusterMedia(clusterId), [clusterId]);
  const sellersRef = useRef<HTMLDivElement>(null);

  const [sortMode, setSortMode] = useState<SortMode>("lowestPrice");
  const [showSellerTable, setShowSellerTable] = useState(true);
  const [expandedOfferIds, setExpandedOfferIds] = useState<string[]>([]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(media.hero);
  const imageSet = [media.hero, ...media.gallery];
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

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111]">
      <SearchChrome query={query} />
      <main className="mx-auto max-w-[1450px] space-y-3 px-2 py-3">
        <div className="border border-[#d5d9d9] bg-white px-3 py-2 text-[12px] text-[#565959]">
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="text-[#007185] hover:underline">
            Back to results
          </Link>{" "}
          / Small Appliances / Canonical Variant
        </div>

        <section className="border border-[#d5d9d9] bg-white p-3">
          <div className="grid gap-4 lg:grid-cols-[460px_1fr]">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-md border border-[#d5d9d9] bg-[#f7f7f7]">
                <Image
                  src={displayImage}
                  alt={cluster.label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover"
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {imageSet.slice(0, 4).map((thumbUrl) => (
                  <button
                    key={thumbUrl}
                    type="button"
                    onClick={() => setActiveImage(thumbUrl)}
                    className={`relative aspect-square overflow-hidden rounded border ${
                      displayImage === thumbUrl ? "border-[#f90]" : "border-[#d5d9d9]"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt="Product thumbnail"
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-[24px] leading-7 text-[#0f1111]">{cluster.label}</h1>
              <p className="mt-1 text-[13px] text-[#007185]">
                {starLine(cluster.aggregateRating)} ({cluster.offers.length} seller offers)
              </p>
              <div className="mt-2 border-t border-b border-[#e7e7e7] py-2">
                <p className="text-[14px] text-[#565959]">Price range in this canonical cluster:</p>
                <p className="text-[28px] leading-8 text-[#b12704]">
                  ${cluster.minPrice} - ${cluster.maxPrice}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="border border-[#067d62]/40 bg-[#f1fff8] px-1.5 py-[1px] text-[11px] text-[#067d62]">
                    Verified manufacturer coverage
                  </span>
                  <span className="border border-[#007185]/30 bg-[#f0f8fb] px-1.5 py-[1px] text-[11px] text-[#007185]">
                    Prime-ready fulfillment signals
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <h2 className="text-[14px] font-semibold text-[#0f1111]">Key Features</h2>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-[#0f1111]">
                  {media.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeCompareIds.length === 0 && cluster.offers.length >= 2) {
                      setSelectedCompareIds([cluster.offers[0].id, cluster.offers[1].id]);
                    }
                  }}
                  className="border border-[#a88734] bg-[#ffd814] px-3 py-1.5 text-[12px] text-[#0f1111] hover:bg-[#f7ca00]"
                >
                  Compare ({activeCompareIds.length}/2)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSellerTable((prev) => !prev);
                    sellersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="border border-[#a2a6ac] bg-[#f0f2f2] px-3 py-1.5 text-[12px] text-[#0f1111] hover:bg-[#e7e9ec]"
                >
                  {showSellerTable ? "Hide Sellers" : "View Sellers"}
                </button>

                <div className="group relative inline-flex items-center text-[12px] text-[#007185]">
                  <button type="button" className="hover:underline">
                    Why am I seeing this?
                  </button>
                  <div className="pointer-events-none absolute left-0 top-[110%] z-20 hidden w-[320px] border border-[#d5d9d9] bg-white p-2 text-[11px] text-[#565959] shadow-md group-hover:block">
                    Intent classifier detected appliance purchase intent and collapsed duplicate
                    listings into this canonical product family. Seller trust and sponsorship are
                    shown transparently in the table below.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div ref={sellersRef}>
          {showSellerTable ? (
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

export default function ClusterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eaeded] p-4 text-[13px] text-[#565959]">
          Loading canonical product...
        </div>
      }
    >
      <ClusterDetailContent />
    </Suspense>
  );
}
