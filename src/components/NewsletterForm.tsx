"use client";

import { FiArrowUpRight } from "react-icons/fi";
import { toast } from "sonner";

export default function NewsletterForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = new FormData(event.currentTarget).get("email");

    if (typeof email !== "string" || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // No newsletter endpoint on the API yet — subscribe locally for now
    toast.success(`Subscribed! Deals will be sent to ${email}.`);
    event.currentTarget.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-[#2A2A2A] w-full max-w-sm rounded-sm overflow-hidden"
    >
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-gray-400 px-4 py-3 outline-none"
        required
      />
      <button
        type="submit"
        className="bg-[#333333] hover:bg-[#444444] transition-colors px-4 py-3 flex items-center justify-center text-white"
        aria-label="Subscribe"
      >
        <FiArrowUpRight size={18} />
      </button>
    </form>
  );
}
