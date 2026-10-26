import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { IDestination } from "@/lib/types/destinations";
import { FeaturedCarousel } from "./featured-carousel";

async function FeaturedDestinations() {
  let destinations: IDestination[];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-destinations`,);
    if (!response.ok) throw new Error("Failed to load featured destinations");
    destinations = await response.json();
    if (!Array.isArray(destinations)) throw new Error("Invalid destinations");
  } catch {
    return (
      <p role="status" className="py-16 text-center text-muted-foreground">
        Featured destinations are unavailable right now. Please try again later.
      </p>
    );
  }

  if (destinations.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        New adventures are on their way. Check back soon!
      </p>
    );
  }
  return <FeaturedCarousel destinations={destinations} />;
}


function FeaturedSkeleton() {
  return (
    <div role="status" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <span className="sr-only">Loading featured destinations</span>
      {[0, 1].map((item) => (
        <div key={item} className={item === 1 ? "hidden md:block" : ""}>
          <div className="aspect-[11/7] animate-pulse bg-muted" />
          <div className="mt-5 h-4 w-24 animate-pulse bg-muted" />
          <div className="mt-3 h-7 w-2/3 animate-pulse bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function Featured() {
  return (
    <section
      id="featured-destinations"
      aria-labelledby="featured-heading"
      className="w-full bg-background px-6 py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 id="featured-heading" className="text-4xl font-light tracking-tight md:text-5xl">
              Featured Destinations
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>
          <Button
            render={<Link href="/destinations" />}
            nativeButton={false}
            variant="outline"
            className="h-11 gap-5 rounded-none border-travel text-xs font-normal text-travel hover:bg-travel/5 hover:text-travel"
          >
            ALL DESTINATIONS <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedDestinations />
        </Suspense>
      </div>
    </section>
  );
}