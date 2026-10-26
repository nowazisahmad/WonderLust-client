"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IDestination } from "@/lib/types/destinations";
import { authClient } from "@/lib/auth-client";

const perks = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];

const BookingCard = ({ destination }: { destination: IDestination }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [booking, setBooking] = useState(false);

  const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (booking) return;

    if (!user) {
      toast.error("Please sign in to book this trip.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const departureDate = formData.get("departureDate");

    if (!departureDate) {
      toast.error("Please choose a departure date.");
      return;
    }

    setBooking(true);
    try {
      const data = {
        username: user.name,
        email: user.email,
        image: user.image,
        ...destination,
        departureDate: departureDate as string,
        bookingDate: new Date(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const bookingRes = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(bookingRes?.message || "Booking failed. Please try again.");
        return;
      }

      toast.success(`Your trip to ${destination.name} is booked!`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <aside className="h-fit rounded-sm border border-border p-5">
      <p className="text-sm text-muted-foreground">Starting from</p>
      <p className="mt-1 text-3xl font-semibold text-[#00A8E8]">
        ${destination.price}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">per person</p>
      <form onSubmit={handleBooking}>
        <Input
          type="date"
          name="departureDate"
          aria-label="Departure date"
          defaultValue={destination.departureDate}
          className="mt-4"
        />

        <Button
          type="submit"
          disabled={booking}
          className="mt-4 w-full bg-[#00A8E8] text-white hover:bg-[#0095d1]"
        >
          {booking ? "Booking..." : "Book Now"}
          <ArrowRight />
        </Button>
      </form>

      <ul className="mt-5 space-y-3 border-t border-border pt-5">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Check className="size-4 shrink-0 text-green-600" />
            {perk}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default BookingCard;
