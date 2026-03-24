import * as React from "react";
import { InlineWidget } from "react-calendly";
import { notifyN8n } from "@/lib/notifyN8n";

const BookingSession = () => {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/arioteimuri/new-meeting";
  const primaryColor = import.meta.env.VITE_BRAND_PRIMARY || "f97316";
  const textColor = import.meta.env.VITE_BRAND_TEXT || "f8fafc";
  const bgColor = import.meta.env.VITE_BRAND_BG || "0b1120";
  const hideGdpr = import.meta.env.VITE_CALENDLY_HIDE_GDPR === "true";

  // Fire a notify event when this section is viewed or loaded
  React.useEffect(() => {
    notifyN8n({ event_type: "booking_session_view", source: "alex-moreno-site" });
  }, []);

  return (
    <section id="book-session" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center mb-12">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl uppercase tracking-tight">
          Book Your Training Session
        </h2>
        <p className="mt-4 text-muted-foreground mx-auto max-w-2xl leading-relaxed">
          Select a time that works for you. Structured sessions range from 55 minutes of intense 
          strength work to recovery conditioning. No preparation needed — just show up.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <div className="min-h-[700px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <InlineWidget
            url={calendlyUrl}
            styles={{ height: "700px", width: "100%" }}
            pageSettings={{
              backgroundColor: bgColor,
              hideEventTypeDetails: false,
              hideLandingPageDetails: true,
              primaryColor: primaryColor,
              textColor: textColor,
              hideGdprBanner: hideGdpr,
            }}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Eixample Studio or Outdoor Barcelona
          </div>
          <div className="hidden sm:block text-border">|</div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Equipment provided
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSession;
