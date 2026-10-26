"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import type { IDestination } from "@/lib/types/destinations";

function FeaturedControls({ count }: { count: number }) {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="mt-8 flex items-center gap-6 md:gap-8">
      <p aria-live="polite" aria-atomic="true" className="min-w-8 text-xl tabular-nums">
        <span className="sr-only">Destination </span>{selected + 1}/{count}
      </p>
      <div aria-hidden="true" className="h-px flex-1 bg-border" />
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous featured destination"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          className="size-11 rounded-full text-muted-foreground hover:border-travel hover:text-travel"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next featured destination"
          disabled={!canScrollNext}
          onClick={scrollNext}
          className="size-11 rounded-full text-muted-foreground hover:border-travel hover:text-travel"
        >
          <ArrowRight aria-hidden="true" className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function DestinationCard({ destination }: { destination: IDestination }) {
  const [imageFailed, setImageFailed] = useState(false);
  const href = `/destinations/${destination._id}`;

  return (
    <Card className="h-full gap-0 rounded-none bg-transparent py-0 ring-0">
      <Link href={href} className="group relative block aspect-[11/7] overflow-hidden bg-muted">
        {imageFailed ? (
          <span className="flex h-full items-center justify-center text-muted-foreground">
            {destination.name} — image unavailable
          </span>
        ) : (
          <Image
            src={destination.imageUrl}
            alt={`${destination.name}, ${destination.country}`}
            fill
            sizes="(max-width: 767px) 90vw, (max-width: 1328px) 50vw, 632px"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col px-0 pt-5">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin aria-hidden="true" className="size-4" />
          {destination.country}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="text-2xl font-normal tracking-tight">
            <Link href={href} className="hover:text-travel">{destination.name}</Link>
          </h3>
          <p className="whitespace-nowrap">
            <span className="text-2xl tracking-tight">${Number(destination.price).toLocaleString("en-US")}</span>
            <span className="text-xs text-muted-foreground">/Person</span>
          </p>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          {destination.duration}
        </p>
        <Button
          render={<Link href={href} />}
          nativeButton={false}
          variant="link"
          className="mt-5 h-auto self-start rounded-none p-0 text-xs font-normal text-travel"
          aria-label={`Book now: ${destination.name}`}
        >
          BOOK NOW <ArrowUpRight aria-hidden="true" className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function FeaturedCarousel({ destinations }: { destinations: IDestination[] }) {
  return (
    <Carousel
      opts={{ align: "start", loop: destinations.length > 2, slidesToScroll: 1 }}
      aria-label="Featured destinations"
      tabIndex={0}
    >
      <CarouselContent className="-ml-4">
        {destinations.map((destination, index) => (
          <CarouselItem
            key={destination._id}
            aria-label={`${index + 1} of ${destinations.length}`}
            className="basis-[90%] pl-4 md:basis-1/2"
          >
            <DestinationCard destination={destination} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <FeaturedControls count={destinations.length} />
    </Carousel>
  );
}