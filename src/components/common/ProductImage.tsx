"use client";

import Image from "next/image";
import { useState } from "react";
import { buildFallbackImageUrl, getOverlayImage } from "@/lib/imageRelevance";
import type { CatalogCategory } from "@/types/catalog";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  category?: CatalogCategory;
  overlayText?: string;
  showOverlay?: boolean;
  fallbackSrc?: string;
}

export function ProductImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  category,
  overlayText,
  showOverlay = false,
  fallbackSrc = buildFallbackImageUrl(),
}: ProductImageProps) {
  const [hasPrimaryFailed, setHasPrimaryFailed] = useState(false);

  const blurDataUrl =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VkZWZlZiIvPjwvc3ZnPg==";
  const safeSrc = hasPrimaryFailed ? fallbackSrc : src;
  const overlaySrc =
    category && showOverlay ? getOverlayImage(category, overlayText ?? alt) : null;

  return (
    <>
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        className={`rounded-[8px] bg-white object-cover ${className ?? ""}`}
        onError={() => {
          if (!hasPrimaryFailed) {
            setHasPrimaryFailed(true);
          }
        }}
      />
      {overlaySrc ? (
        <Image
          src={overlaySrc}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className="pointer-events-none rounded-[8px] object-contain p-[8%]"
        />
      ) : null}
    </>
  );
}
