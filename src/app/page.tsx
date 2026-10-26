import { Banner } from "@/components/homepage/Banner";
import CTA from "@/components/homepage/CTA";
import Featured from "@/components/homepage/featured";
import { Testimonials } from "@/components/homepage/Testimonials";
import WhyChooseUs from "@/components/homepage/why-choose-us";


export default function Home() {
  return (
    <div>
      <Banner/>
      <Featured/>
      <WhyChooseUs/>
      <Testimonials/>
      <CTA/>
    </div>
  );
}
