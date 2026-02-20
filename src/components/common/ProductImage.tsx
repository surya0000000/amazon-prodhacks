"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/fallback-appliance.svg";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: ProductImageProps) {
  const [failedSources, setFailedSources] = useState<Record<string, true>>({});
  const safeSrc = failedSources[src] ? FALLBACK_IMAGE : src || FALLBACK_IMAGE;

  return (
    <Image
      src={safeSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        setFailedSources((current) =>
          current[src] ? current : { ...current, [src]: true },
        );
      }}
    />
  );
}
