import Image from "next/image";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
];

export function Banner() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Background */}
      <Image
        src="/images/Banner.png"
        alt="Aerial view of a hidden beach cove"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 pb-48 text-center text-white">
        <h1 className="text-5xl leading-[1.1] font-light tracking-tight md:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/90">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/destinations"
            className="flex items-center gap-3 bg-[#00A8E8] px-7 py-3.5 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-[#0095d1]"
          >
            Explore Now
            <ArrowRight className="size-4" />
          </a>
          <a
            href="/destinations"
            className="bg-white/30 px-7 py-3.5 text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/40"
          >
            View Destination
          </a>
        </div>
      </div>

      {/* Search bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex w-full">
        {searchFields.map((field) => (
          <div
            key={field.label}
            className="flex-1 border-r border-white/20 bg-black/40 px-6 py-3.5 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold text-white">{field.label}</p>
            <p className="mt-0.5 text-xs text-white/70">{field.placeholder}</p>
          </div>
        ))}
        <button
          type="button"
          className="bg-[#00A8E8] px-12 text-sm font-semibold text-white transition-colors hover:bg-[#0095d1]"
        >
          Search
        </button>
      </div>
    </section>
  );
}