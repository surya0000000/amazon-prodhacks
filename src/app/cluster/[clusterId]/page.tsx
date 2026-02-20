import { ClusterDetailClient } from "@/components/cluster/ClusterDetailClient";
import { MOCK_LISTINGS } from "@/data/mockCatalog";
import { Suspense } from "react";

export const dynamicParams = false;

export function generateStaticParams() {
  const clusterIds = Array.from(
    new Set(
      MOCK_LISTINGS.filter(
        (item) => item.category === "core_oven" || item.category === "smart_oven",
      ).map((item) => item.canonicalGroup),
    ),
  );
  return clusterIds.map((clusterId) => ({ clusterId }));
}

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ clusterId: string }>;
}) {
  const { clusterId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eaeded] p-4 text-[13px] text-[#565959]">
          Loading canonical product...
        </div>
      }
    >
      <ClusterDetailClient clusterId={clusterId} />
    </Suspense>
  );
}
