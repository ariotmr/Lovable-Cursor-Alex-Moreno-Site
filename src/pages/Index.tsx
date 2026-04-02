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
    "name": "Alex Moreno — Strength & Conditioning",
    "image": "https://alexmoreno.space/og-preview.png",
    "@id": "https://alexmoreno.space/#business",
    "url": "https://alexmoreno.space",
    "telephone": "",
    "description": "Personal strength and conditioning training in Barcelona. Indoor studio and outdoor sessions designed for busy professionals who want structured, efficient results.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Eixample",
      "addressLocality": "Barcelona",
      "addressRegion": "Catalonia",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.3874,
      "longitude": 2.1686
    },
    "areaServed": {
      "@type": "City",
      "name": "Barcelona"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "07:00",
      "closes": "20:00"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Alex Moreno",
    "jobTitle": "Strength & Conditioning Coach",
    "url": "https://alexmoreno.space",
    "image": "https://alexmoreno.space/og-preview.png",
    "description": "Alex Moreno is a strength and conditioning coach based in Barcelona with over 10 years of experience training 500+ clients across all fitness levels.",
    "knowsAbout": ["Strength Training", "Conditioning", "Personal Training", "Sports Performance", "Nutrition Planning"],
    "worksFor": {
      "@id": "https://alexmoreno.space/#business"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barcelona",
      "addressCountry": "ES"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Alex Moreno — Strength & Conditioning",
    "url": "https://alexmoreno.space",
    "description": "Personal strength training and conditioning coaching in Barcelona for busy professionals."
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "12-Week Transformation Plan",
    "provider": {
      "@id": "https://alexmoreno.space/#business"
    },
    "description": "A complete 12-week physical and mental overhaul including 24/7 dedicated support, private weekly strategy calls, and a custom nutritional architecture tailored to your goals.",
    "areaServed": {
      "@type": "City",
      "name": "Barcelona"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://alexmoreno.space/courses",
      "priceCurrency": "USD",
      "price": "1.00",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-01-01"
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
          "text": "Alex Moreno offers both premium indoor studio sessions in the Eixample district and structured outdoor workouts at Ciutadella Park, Barceloneta Beach, and Montjuïc, providing a versatile training environment across Barcelona."
        }
      },
      {
        "@type": "Question",
        "name": "Are these sessions suitable for beginners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All programs by Alex Moreno are structured to meet you at your current fitness level. Whether you're a complete beginner or an advanced athlete, the programming scales accordingly while pushing you to achieve measurable results."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I train per week?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For optimal results, Alex Moreno typically recommends starting with 3 sessions per week. However, the schedule is strictly customized based on your individual goals, recovery capacity, and lifestyle."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a personal trainer cost in Barcelona?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Personal training rates in Barcelona vary by coach and program type. Alex Moreno's flagship 12-Week Transformation Plan is currently available at a special launch rate. Visit the Courses page for current pricing and what's included."
        }
      },
      {
        "@type": "Question",
        "name": "What qualifications does Alex Moreno have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Alex Moreno is a certified Strength & Conditioning Coach with over 10 years of professional experience and 500+ clients trained across all fitness levels. He specializes in structured periodized programming for busy professionals."
        }
      },
      {
        "@type": "Question",
        "name": "How long is each training session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each session is 55 minutes long, structured from warm-up to cool-down. Every minute is planned in advance to maximize efficiency — ideal for professionals with tight schedules."
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
