"use client";

import Image from "next/image";
import { useState } from "react";
import { buildFallbackImageUrl } from "@/lib/imageRelevance";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fallbackSeed?: string;
  fallbackWidth?: number;
  fallbackHeight?: number;
}

export function ProductImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  fallbackSeed,
  fallbackWidth = 600,
  fallbackHeight = 600,
}: ProductImageProps) {
  const fallbackUrl = buildFallbackImageUrl(
    fallbackSeed ?? `${alt}-${src}`,
    fallbackWidth,
    fallbackHeight,
  );
  const [hasPrimaryFailed, setHasPrimaryFailed] = useState(false);

  const blurDataUrl =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VkZWZlZiIvPjwvc3ZnPg==";
  const safeSrc = hasPrimaryFailed ? fallbackUrl : src;

  return (
    <Image
      src={safeSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      className={`rounded-[8px] object-cover ${className ?? ""}`}
      onError={() => {
        if (!hasPrimaryFailed) {
          setHasPrimaryFailed(true);
        }
      }}
    />
  );
}
