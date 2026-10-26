"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/destinations", label: "Destinations", active: false },
  { href: "/add-destination", label: "Add Destination", active: false },
  { href: "/my-bookings", label: "My Bookings", active: false },
];

export default function Navbar() {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const handleSignout = () => {
    authClient.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: primary links */}
        <ul className="flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-[#00A8E8]",
                  link.active
                    ? "border-b-2 border-[#00A8E8] pb-0.5 font-medium text-[#00A8E8]"
                    : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Center: logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold tracking-tight text-[#00A8E8]"
        >
          Wanderlast
        </Link>

        {/* Right: account links */}
        <div className="flex items-center gap-6">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-[#00A8E8]"
          >
            <User className="size-4" />
            Profile
          </Link>

          {user ? (
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open user menu"
                  >
                    <Avatar>
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image as string}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>{user.name}</PopoverTitle>
                  <PopoverDescription>
                    <p>{user.email}</p>
                    <Button onClick={handleSignout} variant="destructive">
                      SignOut
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-foreground transition-colors hover:text-[#00A8E8]"
              >
                LogIn
              </Link>
              <Link
                href="/signup"
                className="text-sm text-foreground transition-colors hover:text-[#00A8E8]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}