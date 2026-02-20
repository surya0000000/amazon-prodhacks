import { getClusterHeroImage } from "@/lib/catalogMedia";
import type { CanonicalCluster } from "@/types/catalog";
import { ProductImage } from "@/components/common/ProductImage";
import Link from "next/link";

interface ClusterGridCardProps {
  cluster: CanonicalCluster;
  query: string;
}

function ratingLine(rating: number) {
  const rounded = Math.round(rating);
  return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
}

export function ClusterGridCard({ cluster, query }: ClusterGridCardProps) {
  const href = `/cluster/${cluster.id}?q=${encodeURIComponent(query)}`;

  return (
    <Link
      href={href}
      className="group block cursor-pointer rounded-[10px] border border-[#d5d9d9] bg-white shadow-[0_1px_2px_rgba(15,17,17,0.08)] transition-all duration-150 hover:-translate-y-[2px] hover:border-[#b7bfc7] hover:shadow-[0_4px_10px_rgba(15,17,17,0.14)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-[10px] border-b border-[#e7e7e7] bg-[#f6f7f7]">
        <ProductImage
          src={getClusterHeroImage(cluster)}
          alt={cluster.label}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-1.5 p-2.5">
        <h3 className="line-clamp-2 min-h-[34px] text-[13px] leading-[17px] text-[#0f1111] group-hover:text-[#c7511f]">
          {cluster.label}
        </h3>
        <p className="text-[11px] text-[#007185]">
          {ratingLine(cluster.aggregateRating)} ({cluster.sellerCount} seller offers)
        </p>
        <p className="text-[17px] leading-5 text-[#b12704]">
          ${cluster.minPrice} - ${cluster.maxPrice}
        </p>
        <div className="flex flex-wrap gap-1">
          <span className="border border-[#007185]/30 bg-[#f0f8fb] px-1.5 py-[1px] text-[10px] text-[#007185]">
            Prime Eligible
          </span>
          <span className="border border-[#067d62]/30 bg-[#f1fff8] px-1.5 py-[1px] text-[10px] text-[#067d62]">
            {cluster.verifiedManufacturers} Verified Brands
          </span>
          <span className="border border-[#d5d9d9] bg-[#f7fafa] px-1.5 py-[1px] text-[10px] text-[#565959]">
            {cluster.sellerCount} Sellers
          </span>
        </div>
      </div>
    </Link>
  );
}
