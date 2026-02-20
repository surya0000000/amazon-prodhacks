"use client";

import { ProductImage } from "@/components/common/ProductImage";
import { SearchChrome } from "@/components/search/SearchChrome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const POPULAR_CATEGORIES = [
  { title: "Countertop Ovens", query: "countertop oven under 100", seed: "home-category-1" },
  { title: "Smart Kitchen", query: "smart oven under 120", seed: "home-category-2" },
  { title: "Compact Appliances", query: "compact mini oven", seed: "home-category-3" },
  { title: "Accessories", query: "oven gloves and cover", seed: "home-category-4" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("oven under 100");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query || "oven under 100")}`);
  };

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <SearchChrome query={query} />
      <main className="mx-auto max-w-[1500px] space-y-3 px-2 py-3">
        <section className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative h-[260px] overflow-hidden rounded-[8px] border border-[#d5d9d9] bg-white">
            <ProductImage
              src="https://picsum.photos/seed/home-kitchen-hero/1400/520"
              alt="Kitchen appliances hero"
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <h1 className="text-[24px] font-semibold">Kitchen Appliances</h1>
              <p className="text-[13px]">
                Discover intent-structured appliance search across trusted marketplace sellers.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="border border-[#d5d9d9] bg-white p-3">
            <h2 className="text-[16px] font-semibold text-[#0f1111]">Start searching appliances</h2>
            <p className="mt-1 text-[12px] text-[#565959]">
              Try intent-aware discovery with canonical product clusters.
            </p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-3 w-full border border-[#a2a6ac] px-2 py-2 text-[14px] outline-none focus:border-[#f90]"
              placeholder="Search products"
            />
            <button
              type="submit"
              className="mt-2 w-full border border-[#a88734] bg-[#ffd814] px-3 py-2 text-[13px] text-[#0f1111] hover:bg-[#f7ca00]"
            >
              Search
            </button>
            <Link
              href="/search?q=oven%20under%20100"
              className="mt-2 inline-block text-[12px] text-[#007185] hover:underline"
            >
              Jump to oven under $100 example
            </Link>
          </form>
        </section>

        <section className="border border-[#d5d9d9] bg-white p-3">
          <h2 className="text-[16px] font-semibold text-[#0f1111]">Popular categories</h2>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={`/search?q=${encodeURIComponent(category.query)}`}
                className="group rounded-[8px] border border-[#d5d9d9] bg-[#fafafa] p-2 transition hover:shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden rounded border border-[#ddd]">
                  <ProductImage
                    src={`https://picsum.photos/seed/${category.seed}/400/400`}
                    alt={category.title}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-2 text-[13px] text-[#0f1111] group-hover:text-[#c7511f]">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
