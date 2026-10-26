import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import MyBookingCard from "@/components/booking/MyBookingCard";
import { IBooking } from "@/lib/types/booking";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import Link from "next/link";
import { Ticket } from "lucide-react";

function BookingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-40 w-full animate-pulse rounded-sm border border-border bg-border/40"
        />
      ))}
    </div>
  );
}

const MyBookingsList = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  let bookings: IBooking[] = [];

  if (user?.email) {
    try {
      const token = await getTokenFromServer();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${user.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (Array.isArray(data)) bookings = data;
    } catch {
      bookings = [];
    }
  }

  return (
    <>{bookings.length > 0 ? (
        <div className="flex flex-col gap-6">
          {bookings.map((booking) => (
            <MyBookingCard booking={booking} key={booking._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-sm border border-border bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex size-12 items-center justify-center rounded-full bg-sky-100 text-sky-500">
            <Ticket size={22} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              No bookings yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              When you book a trip, it will show up here.
            </p>
          </div>
          <Link
            href="/destinations"
            className="mt-2 bg-[#00A8E8] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0095d1]"
          >
            Explore Destinations
          </Link>
        </div>
      )}</>
  );
};

const MyBookingsPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal tracking-tight">My Bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage and view your upcoming travel plans
        </p>
      </div>

      {/* Bookings List */}
      <Suspense fallback={<BookingsSkeleton />}>
        <MyBookingsList />
      </Suspense>
    </div>
  );
};

export default MyBookingsPage;
