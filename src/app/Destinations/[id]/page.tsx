import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Star,
} from "lucide-react";

import type { IDestination } from "@/lib/types/destinations";
import BookingCard from "@/components/booking/BookingCard";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import DeleteDestinationDialog from "@/components/destination/DeleteDestinationDialog";
import EditDestinationDialog from "@/components/destination/EditDestinationDialog";

const highlights = [
  "Professional local guide",
  "Comfortable accommodation",
  "Daily breakfast included",
  "Small group experience",
  "All entrance fees covered",
];

function rating(id: string) {
  const sum = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (4 + (sum % 10) / 10).toFixed(1);
}

function reviews(id: string) {
  const sum = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return 120 + ((sum * 7) % 380);
}

function DestinationDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="h-4 w-48 animate-pulse rounded-sm bg-border" />
      <div className="mt-6 h-72 w-full animate-pulse rounded-sm bg-border md:h-80" />
      <div className="mt-6 rounded-sm border border-border bg-white p-6">
        <div className="h-4 w-32 animate-pulse rounded-sm bg-border" />
        <div className="mt-3 h-10 w-2/3 animate-pulse rounded-sm bg-border" />
        <div className="mt-8 h-40 w-full animate-pulse rounded-sm bg-border" />
      </div>
    </main>
  );
}

const DestinationDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const token = await getTokenFromServer()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/${id}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) notFound();
  const destination: IDestination = await res.json();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/destinations"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Destinations
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <EditDestinationDialog destination={destination} />

          <DeleteDestinationDialog id={id} />
        </div>
      </div>

      {/* Hero image */}
      <div className="relative mt-6 h-72 w-full overflow-hidden rounded-sm md:h-80">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="mt-6 rounded-sm border border-border bg-white p-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main */}
          <div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {destination.country}
            </p>

            <h1 className="mt-2 text-4xl font-light tracking-tight text-foreground md:text-5xl">
              {destination.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-green-600 text-green-600" />
                <span className="font-semibold text-foreground">
                  {rating(destination._id)}
                </span>
                <span className="text-muted-foreground">
                  ({reviews(destination._id)} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="size-4" />
                {destination.duration}
              </span>
            </div>

            <h2 className="mt-8 text-xl font-semibold text-foreground">
              Overview
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {destination.description}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">
              Highlights
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {destination.description}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-4 shrink-0 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <BookingCard destination={destination} />
        </div>
      </div>
    </main>
  );
};

const DestinationDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense fallback={<DestinationDetailsSkeleton />}>
      <DestinationDetails params={params} />
    </Suspense>
  );
};

export default DestinationDetailsPage;