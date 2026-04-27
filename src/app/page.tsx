import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Network from "@/components/Network";
import Stats from "@/components/Stats";
import Questions from "@/components/Questions";
import Services from "@/components/Services";
import Work from "@/components/Work";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  return (
    <main className="film-grain">
      <CursorGlow />
      <Navbar />
      <Hero />
      <Marquee />
      <Network />
      <Stats />
      <Questions />
      <Services />
      <Work />
      <CTA />
      <Footer />
    </main>
  );
}
