
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  DollarSign,
  Globe2,
  HardDrive,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Plane,
  Ticket,
  TrendingUp,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { IBooking } from "@/lib/types/booking";

type ProfileForm = {
  name: string;
  image: string;
  address: string;
  country: string;
  birthDate: string;
};

function formatMemberSince(value: string | Date | undefined) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploadMethod, setImageUploadMethod] =
    useState<"file" | "link">("file");

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [localAvatarPreview, setLocalAvatarPreview] = useState("");

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Set today's date after mounting, not during prerender.
  const [today, setToday] = useState<Date | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    image: "",
    address: "",
    country: "",
    birthDate: "",
  });

useEffect(() => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  setToday(currentDate);
}, []);

  // Load additional profile information.
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) return;

        const data = await response.json();

        if (isMounted) {
          setAddress(data.address || "");
          setCountry(data.country || "");
          setBirthDate(data.birthDate || "");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Load bookings when the user's email becomes available.
  useEffect(() => {
    const userEmail = user?.email;

    if (!userEmail) return;

    let isMounted = true;

    async function fetchBookings() {
      try {
        setBookingsLoading(true);

        const token = await getTokenFromClient();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/my-bookings/${encodeURIComponent(userEmail ?? "")}`,
          {
            headers: {
              ...(token
                ? { authorization: `Bearer ${token}` }
                : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        if (isMounted && Array.isArray(data)) {
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        if (isMounted) {
          setBookingsLoading(false);
        }
      }
    }

    void fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // Calculate upcoming trips outside the stats useMemo.
  const upcomingTrips = useMemo(() => {
    if (!today) return 0;

    return bookings.filter((booking) => {
      if (!booking.departureDate) return false;

      const tripDate = new Date(booking.departureDate);

      return (
        !Number.isNaN(tripDate.getTime()) &&
        tripDate >= today
      );
    }).length;
  }, [bookings, today]);

  // Calculate statistics without nesting React Hooks.
  const stats = useMemo(() => {
    const countriesSet = new Set(
      bookings
        .map((booking) => booking.country?.trim())
        .filter((value): value is string => Boolean(value))
    );

    const totalSpent = bookings.reduce((total, booking) => {
      const price = Number(
        String(booking.price ?? "").replace(/[^0-9.]/g, "")
      );

      return total + (Number.isNaN(price) ? 0 : price);
    }, 0);

    return [
      {
        label: "Total Bookings",
        value: String(bookings.length),
        icon: Plane,
        tint: "bg-sky-100 text-sky-500",
      },
      {
        label: "Countries Visited",
        value: String(countriesSet.size),
        icon: Globe2,
        tint: "bg-green-100 text-green-500",
      },
      {
        label: "Upcoming Trips",
        value: String(upcomingTrips),
        icon: TrendingUp,
        tint: "bg-orange-100 text-orange-500",
      },
      {
        label: "Total Spent",
        value: `$${totalSpent.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}`,
        icon: DollarSign,
        tint: "bg-fuchsia-100 text-fuchsia-500",
      },
    ];
  }, [bookings, upcomingTrips]);

  const openDialog = () => {
    setForm({
      name: user?.name || "",
      image: localAvatarPreview || user?.image || "",
      address,
      country,
      birthDate,
    });

    setOpen(true);
  };

  const update = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      update("image", String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please sign in first.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: form.name.trim(),
        image: form.image.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: form.address.trim(),
          country: form.country.trim(),
          birthDate: form.birthDate.trim(),
          image: form.image.trim(),
        }),
      });

      if (!response.ok) {
        toast.error("Failed to save additional profile details.");
        return;
      }

      setAddress(form.address.trim());
      setCountry(form.country.trim());
      setBirthDate(form.birthDate.trim());
      setLocalAvatarPreview(form.image.trim());

      toast.success("Profile updated successfully.");
      setOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Something went wrong while saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#00A8E8]" />
          <p className="text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  const avatarUrl =
    localAvatarPreview ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=00A8E8&color=fff`;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-4xl font-light tracking-tight text-foreground md:text-5xl">
          My Profile
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Manage your account settings, personal details, and travel preferences.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[330px_1fr] lg:gap-8">
        {/* Profile card */}
        <section className="h-fit rounded-sm border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={avatarUrl}
                alt={user?.name || "Profile Photo"}
                width={96}
                height={96}
                className="size-24 rounded-full border border-slate-200 object-cover"
                unoptimized
              />

              <button
                type="button"
                onClick={openDialog}
                aria-label="Change profile photo"
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-[#00A8E8] text-white shadow-md hover:bg-[#0095d1]"
              >
                <Camera size={15} />
              </button>
            </div>

            <h2 className="mt-4 text-center text-xl font-semibold">
              {user?.name || "Traveler"}
            </h2>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail size={13} />
              {user?.email || "No email available"}
            </p>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={15} />
              {address || "No address specified"}
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-border pt-5">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Country</span>
              <span className="font-semibold">{country || "Not specified"}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Date of Birth</span>
              <span className="font-semibold">{birthDate || "Not specified"}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-semibold">
                {formatMemberSince(user?.createdAt)}
              </span>
            </div>
          </div>

          <Button
            onClick={openDialog}
            className="mt-6 h-10 w-full gap-2 bg-[#00A8E8] text-white hover:bg-[#0095d1]"
          >
            <Pencil size={15} />
            Edit Profile
          </Button>
        </section>

        {/* Statistics and bookings */}
        <div className="flex flex-col gap-8">
          <section>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Travel Statistics</h2>
                <p className="text-xs text-muted-foreground">
                  Calculated from your booked itineraries
                </p>
              </div>

              {bookingsLoading && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin text-[#00A8E8]" />
                  Loading bookings...
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-start justify-between rounded-sm border border-border bg-white p-5 shadow-sm"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  </div>

                  <span className={`flex size-10 items-center justify-center rounded-full ${stat.tint}`}>
                    <stat.icon size={18} />
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-sm border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <h3 className="text-lg font-semibold">Your Booked Trips</h3>

              <Link
                href="/my-bookings"
                className="text-sm font-medium text-[#00A8E8] hover:underline"
              >
                View all bookings →
              </Link>
            </div>

            <div className="mt-4">
              {bookings.length > 0 ? (
                <div className="divide-y divide-border">
                  {bookings.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.country} · Departure: {item.departureDate}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-[#00A8E8]">
                        ${item.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Ticket className="mb-2 size-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t booked any trips yet.
                  </p>
                  <Link
                    href="/destinations"
                    className="mt-3 text-xs font-semibold text-[#00A8E8] hover:underline"
                  >
                    Explore Destinations
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Edit profile dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your photo and personal details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-1">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Profile Picture</Label>

              <div className="flex gap-1 rounded-md border border-border bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setImageUploadMethod("file")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium ${
                    imageUploadMethod === "file"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <HardDrive size={14} />
                  Upload from PC
                </button>

                <button
                  type="button"
                  onClick={() => setImageUploadMethod("link")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium ${
                    imageUploadMethod === "link"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <LinkIcon size={14} />
                  Image URL
                </button>
              </div>

              {imageUploadMethod === "file" ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-border px-3 py-4 text-center hover:border-[#00A8E8]"
                  >
                    <Upload className="mb-1.5 size-6 text-muted-foreground" />
                    <span className="text-xs font-medium">
                      Click to choose an image
                    </span>
                    <span className="mt-1 text-[11px] text-muted-foreground">
                      PNG, JPG or WEBP up to 2MB
                    </span>
                  </button>
                </>
              ) : (
                <Input
                  id="profile-image-url"
                  type="url"
                  value={form.image}
                  onChange={(event) => update("image", event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              )}

              {form.image && (
                <div className="flex items-center gap-3 rounded border border-border bg-slate-50 p-2">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border">
                    <Image
                      src={form.image}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    Image preview
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-address">Address</Label>
              <Input
                id="profile-address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                placeholder="Your address"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="profile-country">Country</Label>
                <Input
                  id="profile-country"
                  value={form.country}
                  onChange={(event) => update("country", event.target.value)}
                  placeholder="e.g. Bangladesh"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-birth-date">Date of Birth</Label>
                <Input
                  id="profile-birth-date"
                  type="date"
                  value={form.birthDate}
                  onChange={(event) => update("birthDate", event.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="bg-[#00A8E8] text-white hover:bg-[#0095d1]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
