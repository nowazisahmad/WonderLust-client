import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full h-100 md:h-125 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/CTA.png" // Path based on your VS Code screenshot
          alt="Airplane flying over tropical island"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay to make text readable (matches the dark tint in the screenshot) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-tight mb-4 drop-shadow-md">
          Ready To Start Your Journey?
        </h2>
        <p className="text-white/90 text-sm md:text-base mb-8 font-light drop-shadow">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="/book"
          className="group flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-3 transition-all duration-300 hover:bg-gray-100"
        >
          <span className="uppercase text-sm tracking-wider font-semibold">
            Book Your Trip Today
          </span>
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}