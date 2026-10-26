"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera,
  DollarSign,
  Globe2,
  MapPin,
  Pencil,
  Plane,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const fallbackProfile = {
  name: "Sarah Mitchell",
  image: "https://randomuser.me/api/portraits/women/44.jpg",
  location: "San Francisco, CA",
  nationality: "United States",
  memberSince: "Mar 2024",
};

const stats = [
  { label: "Total Bookings", value: "12", icon: Plane, tint: "bg-sky-100 text-sky-500" },
  { label: "Countries Visited", value: "18", icon: Globe2, tint: "bg-green-100 text-green-500" },
  { label: "Upcoming Trips", value: "2", icon: TrendingUp, tint: "bg-orange-100 text-orange-500" },
  { label: "Total Spent", value: "$15,750", icon: DollarSign, tint: "bg-fuchsia-100 text-fuchsia-500" },
];

type ProfileForm = {
  name: string;
  image: string;
  location: string;
  nationality: string;
};

function formatMemberSince(value: string | Date | undefined) {
  if (!value) return fallbackProfile.memberSince;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallbackProfile.memberSince;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: fallbackProfile.name,
    image: fallbackProfile.image,
    location: fallbackProfile.location,
    nationality: fallbackProfile.nationality,
  });

  const profile = {
    name: user?.name || fallbackProfile.name,
    image: user?.image || fallbackProfile.image,
    location: fallbackProfile.location,
    nationality: fallbackProfile.nationality,
    memberSince: formatMemberSince(user?.createdAt),
  };

  const openDialog = () => {
    setForm({
      name: profile.name,
      image: profile.image,
      location: profile.location,
      nationality: profile.nationality,
    });
    setOpen(true);
  };

  const update = (field: keyof ProfileForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("You must be signed in to edit your profile.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: form.name,
        image: form.image,
      });

      if (error) {
        toast.error(error.message || "Failed to update your profile.");
        return;
      }

      toast.success("Profile updated successfully.");
      setOpen(false);
    } catch {
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Heading */}
      <header>
        <h1 className="text-4xl font-light tracking-tight text-foreground md:text-5xl">
          My Profile
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Manage your account settings and travel preferences
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
        {/* Profile card */}
        <section className="h-fit rounded-sm border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={profile.image}
                alt={profile.name}
                width={96}
                height={96}
                className="size-24 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={openDialog}
                aria-label="Change profile photo"
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-[#00A8E8] text-white shadow-md transition-colors hover:bg-[#0095d1]"
              >
                <Camera size={15} />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {profile.name}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={15} />
              {profile.location}
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-border pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-semibold text-foreground">
                {profile.memberSince}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nationality</span>
              <span className="font-semibold text-foreground">
                {profile.nationality}
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

        {/* Travel statistics */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Travel Statistics
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-start justify-between rounded-sm border border-border bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${stat.tint}`}
                >
                  <stat.icon size={18} />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Edit dialog (shared by the camera badge and Edit Profile button) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal details. Changes are saved to your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-image">Image URL</Label>
              <Input
                id="profile-image"
                type="url"
                value={form.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="https://example.com/photo.jpg"
                required
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="profile-location">Location</Label>
                <Input
                  id="profile-location"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-nationality">Nationality</Label>
                <Input
                  id="profile-nationality"
                  value={form.nationality}
                  onChange={(event) =>
                    update("nationality", event.target.value)
                  }
                  placeholder="United States"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#00A8E8] text-white hover:bg-[#0095d1]"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
