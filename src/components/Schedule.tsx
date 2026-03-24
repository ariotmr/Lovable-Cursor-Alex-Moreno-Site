import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { MapPin, TreePine } from "lucide-react";
import { format, startOfToday } from "date-fns";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { InlineWidget } from "react-calendly";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const focusColor: Record<string, string> = {
  Strength: "bg-primary/15 text-primary border-primary/25",
  Conditioning: "bg-accent/15 text-accent border-accent/25",
  Mobility: "bg-secondary text-secondary-foreground border-border",
};



const dayKeyFromDate = (date: Date): (typeof DAYS)[number] | null => {
  // JS: Sun=0 ... Sat=6
  const idx = date.getDay();
  const map: Record<number, (typeof DAYS)[number]> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };
  return map[idx] ?? null;
};

type ClassSession = {
  id: string;
  name: string;
  focus: "Strength" | "Conditioning" | "Mobility";
  location: "Studio" | "Outdoor" | string;
  time: string;
  duration: string;
  spots: number;
};

const ClassCard = ({ session, onBook }: { session: ClassSession; onBook: (id: string) => void }) => (
  <div className="flex h-[152px] flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs font-medium text-foreground">{session.time}</span>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {session.location === "Studio" ? (
          <MapPin className="h-3 w-3" />
        ) : (
          <TreePine className="h-3 w-3" />
        )}
        {session.location}
      </span>
    </div>

    <h4 className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground">
      {session.name}
    </h4>

    <div className="flex items-center gap-2">
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${focusColor[session.focus] || focusColor.Strength}`}>
        {session.focus}
      </span>
      <span className="text-[10px] text-muted-foreground">{session.duration}</span>
    </div>

    <div className="mt-auto flex items-center justify-between pt-1">
      <span className={`text-xs font-medium ${session.spots <= 2 ? "text-primary" : "text-muted-foreground"}`}>
        {session.spots} spot{session.spots !== 1 ? "s" : ""} left
      </span>
      <Button
        size="sm"
        className="h-7 px-3 text-xs font-semibold"
        onClick={() => onBook(session.id)}
      >
        Book
      </Button>
    </div>
  </div>
);

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Schedule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    reason: "",
  });
  const [showCalendar, setShowCalendar] = React.useState(false);

  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/arioteimuri/new-meeting";
  const primaryColor = import.meta.env.VITE_BRAND_PRIMARY || "f97316";
  const textColor = import.meta.env.VITE_BRAND_TEXT || "f8fafc";
  const bgColor = import.meta.env.VITE_BRAND_BG || "0b1120";
  const hideGdpr = import.meta.env.VITE_CALENDLY_HIDE_GDPR === "true";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.firstName) {
      setShowCalendar(true);
    }
  };

  return (
    <section id="schedule" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center mb-12">
        <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          {showCalendar ? "Pick a Time" : "Book Your Training"}
        </h2>
        <p className="mt-2 text-muted-foreground mx-auto max-w-2xl">
          {showCalendar 
            ? "Your details are pre-filled. Just select a slot below." 
            : "Tell us a bit about yourself first so we can prepare for our session."}
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {!showCalendar ? (
          <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <form onSubmit={handleContinue} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Organization (Optional)</label>
                <input
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Reason for session</label>
                <textarea
                  name="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g., Weight loss, Strength training, etc."
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold mt-6 shadow-lg shadow-primary/20">
                Continue to Schedule
              </Button>
            </form>
          </div>
        ) : (
          <div className="min-h-[700px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <span className="text-sm text-foreground">Booking for: <strong>{formData.firstName} {formData.lastName}</strong></span>
              <button onClick={() => setShowCalendar(false)} className="text-xs text-primary hover:underline">Change details</button>
            </div>
            <InlineWidget
              url={calendlyUrl}
              styles={{ height: "700px", width: "100%" }}
              prefill={{
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
              }}
              pageSettings={{
                backgroundColor: bgColor,
                hideEventTypeDetails: true,
                hideLandingPageDetails: true,
                primaryColor: primaryColor,
                textColor: textColor,
                hideGdprBanner: hideGdpr,
              }}
            />
          </div>
        )}

        <div className="mt-10 rounded-lg border border-border bg-card p-4 sm:p-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Looking for a custom group session or corporate package?
          </div>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => navigate("/#contact")}
          >
            Contact for Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
