import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Structured Strength Training
          <span className="block text-primary"> in Barcelona</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
          Indoor studio and outdoor sessions. Built for busy professionals who want consistent, efficient results.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => scrollTo("schedule")}
            className="px-8 text-base font-semibold"
          >
            Book Your Session
          </Button>

          <button
            onClick={() => scrollTo("schedule")}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View Schedule
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
