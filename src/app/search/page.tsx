"use client";

import { ClusterGridCard } from "@/components/search/ClusterGridCard";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { SearchChrome } from "@/components/search/SearchChrome";
import { TraditionalList } from "@/components/search/TraditionalList";
import { MOCK_LISTINGS } from "@/data/mockCatalog";
import { getListingImage } from "@/lib/catalogMedia";
import { analyzeListings } from "@/lib/intentIntegrity";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type ViewMode = "traditional" | "intent";

function SearchPageContent() {
  const params = useSearchParams();
  const rawQuery = params.get("q") ?? "oven under 100";
  const query = decodeURIComponent(rawQuery.replace(/\+/g, " "));

  const analysis = useMemo(() => analyzeListings(query, MOCK_LISTINGS), [query]);

  const [viewMode, setViewMode] = useState<ViewMode>("intent");
  const [showIntentInfo, setShowIntentInfo] = useState(false);
  const [showValidationOverlay, setShowValidationOverlay] = useState(false);
  const [showAccessories, setShowAccessories] = useState(false);

  const priceCap = analysis.intent.maxPrice
    ? `under $${analysis.intent.maxPrice}`
    : "for your request";

  const ovenCoverSignal = analysis.validationSignals.find((item) =>
    item.title.toLowerCase().includes("cover"),
  );

  return (
    <div className="min-h-screen bg-[#eaeded] text-[13px] text-[#0f1111]">
      <SearchChrome query={query} />

      <div className="mx-auto flex w-full max-w-[1500px] gap-3 px-2 py-3">
        <FilterSidebar />

        <main className="flex-1 space-y-2">
          <section className="border border-[#d5d9d9] bg-white px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-[20px] leading-6">
                  Results for{" "}
                  <span className="text-[#c7511f]">
                    &quot;{analysis.intent.rawQuery}&quot;
                  </span>
                </h1>
                <p className="mt-1 text-[12px] text-[#565959]">
                  {analysis.traditionalResults.length} matched listings before intent structuring.
                </p>
              </div>
              <div className="inline-flex border border-[#a2a6ac] bg-[#f0f2f2] p-[2px] text-[12px]">
                <button
                  type="button"
                  className={`px-3 py-1 ${
                    viewMode === "traditional"
                      ? "bg-white font-semibold text-[#0f1111]"
                      : "text-[#565959]"
                  }`}
                  onClick={() => setViewMode("traditional")}
                >
                  Traditional List
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 ${
                    viewMode === "intent"
                      ? "bg-white font-semibold text-[#0f1111]"
                      : "text-[#565959]"
                  }`}
                  onClick={() => setViewMode("intent")}
                >
                  Intent Integrity View
                </button>
              </div>
            </div>
          </section>

          {viewMode === "traditional" ? (
            <TraditionalList listings={analysis.traditionalResults} />
          ) : (
            <>
              <section className="border border-[#d5d9d9] bg-[#f7fafa] px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px]">
                    <span className="font-semibold">Showing Core Appliances {priceCap}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="group relative inline-flex items-center text-[12px] text-[#007185]">
                      <button type="button" className="hover:underline">
                        Why am I seeing this?
                      </button>
                      <div className="pointer-events-none absolute right-0 top-[115%] z-30 hidden w-72 border border-[#d5d9d9] bg-white p-2 text-[11px] text-[#565959] shadow-md group-hover:block">
                        Intent classifier identified core appliance intent and suppressed accessory
                        listings that matched only by keyword.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#a2a6ac] bg-white text-[12px] hover:bg-[#f0f2f2]"
                      onClick={() => setShowIntentInfo(true)}
                      aria-label="Open Intent Integrity explanation"
                    >
                      i
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-[#565959]">
                  Results structured using Intent Integrity Layer.
                </p>
              </section>

              <section className="flex flex-wrap items-center gap-2 border border-[#d5d9d9] bg-white px-3 py-2 text-[12px]">
                <button
                  type="button"
                  className="border border-[#a2a6ac] bg-[#f0f2f2] px-2 py-1 text-[12px] hover:bg-[#e7e9ec]"
                  onClick={() => setShowValidationOverlay(true)}
                >
                  Show Intent Validation
                </button>
                <span className="text-[#565959]">
                  {analysis.clusters.length} canonical product families
                </span>
                <span className="ml-auto text-[#565959]">
                  Click any product card to open seller variants and comparisons.
                </span>
              </section>

              <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {analysis.clusters.map((cluster) => (
                  <ClusterGridCard
                    key={cluster.id}
                    cluster={cluster}
                    query={query}
                  />
                ))}
              </section>

              <section className="border border-[#d5d9d9] bg-white">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f7fafa]"
                  onClick={() => setShowAccessories((prev) => !prev)}
                >
                  <span className="text-[14px] font-semibold">Related Accessories</span>
                  <span className="text-[12px] text-[#565959]">
                    {showAccessories ? "Hide" : "Show"}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    showAccessories ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-[#d5d9d9] bg-[#fafafa] p-2">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {analysis.relatedAccessories.map((item) => (
                          <article
                            key={item.id}
                            className="grid grid-cols-[68px_1fr_auto] items-center gap-2 border border-[#ddd] bg-[#fdfdfd] px-2 py-2 text-[11px] opacity-90 hover:opacity-100"
                          >
                            <div className="relative h-[56px] w-[56px] overflow-hidden rounded border border-[#ddd]">
                              <Image
                                src={getListingImage(item)}
                                alt={item.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="line-clamp-2 text-[#565959]">{item.title}</p>
                              <p className="text-[10px] text-[#565959]">
                                Sold by {item.sellerName}
                              </p>
                            </div>
                            <div className="text-[14px] text-[#b12704]">${item.price}</div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {showIntentInfo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3">
          <div className="w-full max-w-[560px] border border-[#d5d9d9] bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-[18px] font-semibold text-[#0f1111]">Intent Integrity Layer</h2>
              <button
                type="button"
                className="text-[12px] text-[#565959] hover:text-[#0f1111]"
                onClick={() => setShowIntentInfo(false)}
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-[12px] text-[#565959]">
              Results structured using Intent Integrity Layer. The system predicts shopper
              objective first, then rebuilds ranking around canonical appliance groups.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-[12px] text-[#0f1111]">
              <li>Core appliance intent isolated from accessory keyword noise.</li>
              <li>Equivalent products collapsed into canonical product cards.</li>
              <li>Product-first browsing with seller detail on cluster page click.</li>
              <li>Seller tiering and sponsored placements stay transparent in cluster tables.</li>
              <li>Sort controls apply only inside cluster options.</li>
            </ul>
          </div>
        </div>
      ) : null}

      {showValidationOverlay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3">
          <div className="w-full max-w-[640px] border border-[#d5d9d9] bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-[17px] font-semibold text-[#0f1111]">Intent Validation</h2>
              <button
                type="button"
                className="text-[12px] text-[#565959] hover:text-[#0f1111]"
                onClick={() => setShowValidationOverlay(false)}
              >
                Close
              </button>
            </div>

            {ovenCoverSignal ? (
              <div className="mt-3 border border-[#f0c14b] bg-[#fff8e7] p-2 text-[12px]">
                <p className="font-semibold text-[#6b4f00]">
                  Oven Cover - classified as Accessory
                </p>
                <p className="mt-1 text-[#6b4f00]">{ovenCoverSignal.reason}</p>
              </div>
            ) : null}

            <p className="mt-3 text-[12px] text-[#565959]">
              Accessory and gaming listings are removed from primary oven ranking when signals
              indicate mismatch with core appliance intent.
            </p>
            <div className="mt-2 max-h-64 overflow-auto border border-[#d5d9d9]">
              {analysis.validationSignals.map((signal) => (
                <div
                  key={signal.listingId}
                  className="border-b border-[#ececec] px-2 py-2 text-[12px] last:border-b-0"
                >
                  <p className="text-[#0f1111]">{signal.title}</p>
                  <p className="text-[11px] text-[#565959]">{signal.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eaeded] p-4 text-[13px] text-[#565959]">
          Loading search results...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
