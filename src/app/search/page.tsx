"use client";

import { CanonicalClusterCard } from "@/components/search/CanonicalClusterCard";
import { ComparisonDrawer } from "@/components/search/ComparisonDrawer";
import { SearchChrome } from "@/components/search/SearchChrome";
import { TraditionalList } from "@/components/search/TraditionalList";
import { MOCK_LISTINGS } from "@/data/mockCatalog";
import { analyzeListings } from "@/lib/intentIntegrity";
import type { ProductListing, SortMode } from "@/types/catalog";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ViewMode = "traditional" | "intent";

export default function SearchPage() {
  const params = useSearchParams();
  const rawQuery = params.get("q") ?? "oven under 100";
  const query = decodeURIComponent(rawQuery.replace(/\+/g, " "));

  const analysis = useMemo(() => analyzeListings(query, MOCK_LISTINGS), [query]);

  const [viewMode, setViewMode] = useState<ViewMode>("intent");
  const [sortMode, setSortMode] = useState<SortMode>("lowestPrice");
  const [expandedClusters, setExpandedClusters] = useState<string[]>([]);
  const [showIntentInfo, setShowIntentInfo] = useState(false);
  const [showValidationOverlay, setShowValidationOverlay] = useState(false);
  const [showAccessories, setShowAccessories] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (analysis.clusters.length > 0 && expandedClusters.length === 0) {
      setExpandedClusters([analysis.clusters[0].id]);
    }
  }, [analysis.clusters, expandedClusters.length]);

  useEffect(() => {
    setSelectedCompareIds((prev) =>
      prev.filter((id) => analysis.coreResults.some((offer) => offer.id === id)),
    );
  }, [analysis.coreResults]);

  const compareOffers = useMemo(
    () =>
      selectedCompareIds
        .map((id) => analysis.coreResults.find((offer) => offer.id === id))
        .filter((offer): offer is ProductListing => Boolean(offer)),
    [analysis.coreResults, selectedCompareIds],
  );

  const priceCap = analysis.intent.maxPrice
    ? `under $${analysis.intent.maxPrice}`
    : "for your request";

  const ovenCoverSignal = analysis.validationSignals.find((item) =>
    item.title.toLowerCase().includes("cover"),
  );

  const toggleCluster = (clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.includes(clusterId) ? prev.filter((id) => id !== clusterId) : [...prev, clusterId],
    );
  };

  const toggleCompare = (listingId: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(listingId)) {
        return prev.filter((id) => id !== listingId);
      }
      if (prev.length === 2) {
        return [prev[1], listingId];
      }
      return [...prev, listingId];
    });
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-[13px] text-[#0f1111]">
      <SearchChrome query={query} />

      <div className="mx-auto flex w-full max-w-[1500px] gap-3 px-2 py-3">
        <aside className="hidden w-[220px] shrink-0 space-y-2 xl:block">
          <div className="border border-[#d5d9d9] bg-white p-3">
            <h2 className="text-[13px] font-semibold">Departments</h2>
            <ul className="mt-2 space-y-1 text-[12px]">
              {[
                "Small Appliances",
                "Countertop Ovens",
                "Smart Kitchen",
                "Home & Kitchen",
                "Accessories",
              ].map((label) => (
                <li key={label}>
                  <button type="button" className="text-[#0f1111] hover:text-[#c7511f]">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#d5d9d9] bg-white p-3">
            <h2 className="text-[13px] font-semibold">Fulfillment</h2>
            <div className="mt-2 space-y-1 text-[12px] text-[#565959]">
              <p>Prime eligible</p>
              <p>Free delivery by tomorrow</p>
              <p>Ships from local warehouse</p>
            </div>
          </div>
          <div className="border border-[#d5d9d9] bg-white p-3">
            <h2 className="text-[13px] font-semibold">Intent Layer Signals</h2>
            <div className="mt-2 space-y-1 text-[11px] text-[#565959]">
              <p>Core appliance confidence: High</p>
              <p>Accessory suppression enabled</p>
              <p>Duplicate collapse: active</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-2">
          <section className="border border-[#d5d9d9] bg-white px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-[20px] leading-6">
                  Results for{" "}
                  <span className="text-[#c7511f]">"{analysis.intent.rawQuery}"</span>
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
                  <button
                    type="button"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#a2a6ac] bg-white text-[12px] hover:bg-[#f0f2f2]"
                    onClick={() => setShowIntentInfo(true)}
                    aria-label="Open Intent Integrity explanation"
                  >
                    i
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#565959]">
                  Results structured using Intent Integrity Layer.
                </p>
              </section>

              <section className="flex flex-wrap items-center gap-2 border border-[#d5d9d9] bg-white px-3 py-2">
                <button
                  type="button"
                  className="border border-[#a2a6ac] bg-[#f0f2f2] px-2 py-1 text-[12px] hover:bg-[#e7e9ec]"
                  onClick={() => setShowValidationOverlay(true)}
                >
                  Show Intent Validation
                </button>
                <button
                  type="button"
                  className="border border-[#a2a6ac] bg-[#f0f2f2] px-2 py-1 text-[12px] hover:bg-[#e7e9ec]"
                  onClick={() => {
                    if (selectedCompareIds.length === 0 && analysis.coreResults[0]) {
                      setSelectedCompareIds([analysis.coreResults[0].id]);
                    }
                  }}
                >
                  Compare Top Options ({selectedCompareIds.length}/2)
                </button>
                <div className="ml-auto flex items-center gap-2 text-[12px]">
                  <label htmlFor="sort-mode">Sort By:</label>
                  <select
                    id="sort-mode"
                    className="border border-[#a2a6ac] bg-white px-2 py-[3px]"
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value as SortMode)}
                  >
                    <option value="lowestPrice">Lowest Price</option>
                    <option value="sellerReliability">Seller Reliability</option>
                    <option value="deliverySpeed">Delivery Speed</option>
                  </select>
                </div>
              </section>

              <section className="space-y-2">
                {analysis.clusters.map((cluster) => (
                  <CanonicalClusterCard
                    key={cluster.id}
                    cluster={cluster}
                    sortMode={sortMode}
                    expanded={expandedClusters.includes(cluster.id)}
                    onToggle={() => toggleCluster(cluster.id)}
                    selectedCompareIds={selectedCompareIds}
                    onToggleCompare={toggleCompare}
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
                      <div className="grid gap-2 md:grid-cols-2">
                        {analysis.relatedAccessories.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-[1fr_auto] items-center border border-[#d5d9d9] bg-white px-2 py-2 text-[12px]"
                          >
                            <div>
                              <p className="text-[#0f1111]">{item.title}</p>
                              <p className="text-[10px] text-[#565959]">
                                Sold by {item.sellerName}
                              </p>
                            </div>
                            <div className="text-[15px] text-[#b12704]">${item.price}</div>
                          </div>
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

      <ComparisonDrawer
        offers={compareOffers}
        onRemove={(id) =>
          setSelectedCompareIds((prev) => prev.filter((listingId) => listingId !== id))
        }
        onClear={() => setSelectedCompareIds([])}
      />

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
              <li>Seller tiering and fulfillment reliability surfaced before click-through.</li>
              <li>Sponsored placements remain visible inside each canonical cluster.</li>
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
