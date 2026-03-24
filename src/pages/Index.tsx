import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BookingSession from "@/components/BookingSession";
import Trust from "@/components/Trust";
import SocialProof from "@/components/SocialProof";
import Logistics from "@/components/Logistics";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

import { Categories } from "@/components/Categories";
import CalendlyBadge from "@/components/CalendlyBadge";
import EmailInquiry from "@/components/EmailInquiry";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <BookingSession />
        <Trust />
        <SocialProof />
        <EmailInquiry />
        <Logistics />
        <FinalCTA />
      </main>
      <Footer />
      <CalendlyBadge />
    </>
  );
};

export default Index;
