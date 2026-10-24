import { Banner } from "@/components/homepage/Banner";
import CTA from "@/components/homepage/CTA";
import { Testimonials } from "@/components/homepage/Testimonials";
import WhyChooseUs from "@/components/homepage/why-choose-us";


export default function Home() {
  return (
    <div>
      <Banner/>
      <WhyChooseUs/>
      <Testimonials/>
      <CTA/>
    </div>
  );
}
