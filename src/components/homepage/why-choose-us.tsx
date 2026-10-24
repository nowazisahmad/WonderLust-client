import { ShieldCheck, Map, Headphones } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck size={36} strokeWidth={1.5} className="text-[#1AA6BA]" />,
      title: "Safe & Secure",
      description:
        "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
    },
    {
      icon: <Map size={36} strokeWidth={1.5} className="text-[#1AA6BA]" />,
      title: "Expert Guides",
      description:
        "Local experts who bring destinations to life with authentic cultural insights.",
    },
    {
      icon: <Headphones size={36} strokeWidth={1.5} className="text-[#1AA6BA]" />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer service to assist you wherever your journey takes you.",
    },
  ];

  return (
    <section className="w-full bg-[#EAF8FA] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-3 tracking-tight">
            Why Choose Wanderlust
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 md:p-10 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}