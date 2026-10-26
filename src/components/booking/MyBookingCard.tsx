"use client"

import { useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Calendar, Eye, Ticket, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { IBooking } from "@/lib/types/booking";

const MyBookingCard = ({ booking }: { booking: IBooking }) => {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (cancelling) return;
    setCancelling(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${booking._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message || "Failed to cancel the booking.");
        return;
      }

      toast.success(`Booking for ${booking.name} cancelled.`);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Card
      key={booking._id}
      className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative h-50 w-full shrink-0 md:w-75">
          <Image
            height={400}
            width={400}
            src={booking.imageUrl}
            alt={booking.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          {/* Top section: Status & Details */}
          <div>
            <h2 className="text-xl font-medium text-slate-900 sm:text-2xl">
              {booking.name}
            </h2>

            <div className="mt-3 space-y-1.5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                <span>Departure: {booking.departureDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="size-4 shrink-0" />
                <span className="break-all">Booking ID: {booking._id}</span>
              </div>
            </div>

            <div className="mt-4 text-2xl font-medium text-blue-500">
              ${booking.price}
            </div>
          </div>

          {/* Bottom section: Action Buttons */}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button
              onClick={handleCancelBooking}
              disabled={cancelling}
              variant="outline"
              className="gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <XCircle className="size-4" />
              {cancelling ? "Cancelling..." : "Cancel"}
            </Button>
            <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
              <Eye className="size-4" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MyBookingCard;
