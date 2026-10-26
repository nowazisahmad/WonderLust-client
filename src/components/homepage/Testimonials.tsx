"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

const testimonials = [
    {
      quote: '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
      name: "Sarah Johnson",
      location: "New York, USA",
      image: "/images/person1.png",
    },
    {
      quote: '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
      name: "Michael Chen",
      location: "Singapore",
      image: "/images/person2.png",
    },
    {
      quote: '"A seamless experience from start to finish. The local food tours in Italy were the highlight of our trip. I will definitely book again."',
      name: "Emma Thompson",
      location: "London, UK",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote: '"Japan in cherry blossom season was a dream come true. The itinerary was well-balanced, giving us both guided tours and free time to explore."',
      name: "David Rodriguez",
      location: "Madrid, Spain",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function Controls() {
  const { scrollPrev, scrollNext } = useCarousel();

  return (
    <div className="flex shrink-0 items-center gap-3">
      <Button
        type="button"
        aria-label="Previous testimonials"
        variant="outline"
        size="icon-sm"
        onClick={scrollPrev}
        className="size-11 rounded-full border-border text-muted-foreground hover:border-[#00A8E8] hover:text-[#00A8E8]"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <Button
        type="button"
        aria-label="Next testimonials"
        variant="outline"
        size="icon-sm"
        onClick={scrollNext}
        className="size-11 rounded-full border-border text-muted-foreground hover:border-[#00A8E8] hover:text-[#00A8E8]"
      >
        <ArrowRight className="size-5" />
      </Button>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="w-full border-t border-[#00A8E8] bg-background px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          {/* Heading + carousel controls */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
                What Travelers Say
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Real experiences from our happy travelers
              </p>
            </div>
            <Controls />
          </div>

          {/* Cards */}
          <CarouselContent className="mt-10 ml-0">
            {testimonials.map((item) => (
              <CarouselItem
                key={item.name}
                className="basis-full pl-0 pr-0 md:basis-1/2 md:pl-8 md:first:pl-0"
              >
                <figure className="flex h-full flex-col justify-between gap-6 rounded-sm border border-border bg-white p-7 shadow-sm sm:flex-row">
                  <div className="flex flex-1 flex-col">
                    <blockquote className="text-base leading-relaxed text-foreground">
                      {item.quote}
                    </blockquote>
                    <figcaption className="mt-auto pt-8">
                      <p className="text-sm text-[#00A8E8]">— {item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.location}
                      </p>
                    </figcaption>
                  </div>
                  <div className="size-44 shrink-0 overflow-hidden rounded-sm bg-muted sm:size-auto sm:w-44">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={176}
                        height={196}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex size-full items-center justify-center",
                          "bg-linear-to-br from-[#00A8E8] to-[#0076a8]",
                          "text-3xl font-light text-white",
                        )}
                      >
                        {initials(item.name)}
                      </div>
                    )}
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}