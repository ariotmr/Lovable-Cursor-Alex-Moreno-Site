import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import Trust from "@/components/Trust";
import SocialProof from "@/components/SocialProof";
import Logistics from "@/components/Logistics";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

import { Categories } from "@/components/Categories";
import CalendlyBadge from "@/components/CalendlyBadge";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Schedule />
        <Trust />
        <SocialProof />
        <Logistics />
        <FinalCTA />
      </main>
      <Footer />
      <CalendlyBadge />
    </>
  );
};

export default Index;
