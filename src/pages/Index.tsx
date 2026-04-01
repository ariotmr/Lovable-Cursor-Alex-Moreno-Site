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
import TransformationPlan from "@/components/TransformationPlan";
import { FAQ } from "@/components/FAQ";
import { SEO } from "@/components/SEO";

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "Alex Moreno",
    "image": "https://alexmoreno.space/og-preview.png",
    "@id": "https://alexmoreno.space",
    "url": "https://alexmoreno.space",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barcelona",
      "addressCountry": "ES"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does the 12-Week Transformation Plan include?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The program includes a complete physical and mental overhaul with 24/7 dedicated support, private weekly strategy calls, and a custom nutritional architecture tailored to your goals."
        }
      },
      {
        "@type": "Question",
        "name": "Where do training sessions take place in Barcelona?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer both premium indoor studio sessions and structured outdoor workouts across various adaptable locations in Barcelona, ensuring a fresh and highly-effective training environment."
        }
      },
      {
        "@type": "Question",
        "name": "Are these sessions suitable for beginners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our programs are fundamentally structured to meet you where you are. Whether you're a complete beginner or an advanced athlete, the programming scales to your current fitness level while pushing you to achieve results."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I train?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For optimal results, we typically recommend starting with 3 sessions per week. However, the schedule will be strictly customized based on your goals, capacity, and current lifestyle."
        }
      }
    ]
  }
];

const Index = () => {
  return (
    <>
      <SEO structuredData={homeSchema} />
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <TransformationPlan />
        <BookingSession />
        <Trust />
        <SocialProof />
        <FAQ />
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
