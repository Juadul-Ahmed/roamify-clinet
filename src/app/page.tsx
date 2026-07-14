
import Categories from "@/Components/Categories";
import FeaturedTours from "@/Components/FeaturedTours";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/NavBar";
import Newsletter from "@/Components/Newsletter";
import Testimonials from "@/Components/Testimonials";
import WhyChooseUs from "@/Components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Categories/>
      <WhyChooseUs/>
      <FeaturedTours/>
      <Testimonials/>
      <Newsletter/>
    </div>
  );
}
