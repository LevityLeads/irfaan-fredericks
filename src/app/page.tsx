import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Network from "@/components/Network";
import Questions from "@/components/Questions";
import Services from "@/components/Services";
import Work from "@/components/Work";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="film-grain">
      <Navbar />
      <Hero />
      <Network />
      <Questions />
      <Services />
      <Work />
      <CTA />
      <Footer />
    </main>
  );
}
