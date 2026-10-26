import { Suspense } from "react";

import { DestinationsGrid } from "@/components/destination/destinations-grid";
import type { IDestination } from "@/lib/types/destinations";

async function Destinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations`, {
    cache: 'no-store'
  });
  const data: IDestination[] = await res.json();

  return <DestinationsGrid destinations={data} />;
}

function DestinationsSkeleton() {
  return (
    <section className="w-full bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="h-12 w-96 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded-lg border border-border bg-muted/50"
            />
          ))}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-sm border border-border bg-muted/50"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AllDestinationsPage() {
  return (
    <main>
      <Suspense fallback={<DestinationsSkeleton />}>
        <Destinations />
      </Suspense>
    </main>
  );
}