import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MapPin, TreePine } from "lucide-react";

type ClassSession = {
  name: string;
  focus: "Strength" | "Conditioning" | "Mobility";
  location: "Studio" | "Outdoor";
  time: string;
  duration: string;
  spots: number;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const schedule: Record<string, ClassSession[]> = {
  Mon: [
    { name: "Barbell Foundations", focus: "Strength", location: "Studio", time: "07:00", duration: "55 min", spots: 3 },
    { name: "Conditioning Circuit", focus: "Conditioning", location: "Outdoor", time: "12:30", duration: "55 min", spots: 5 },
    { name: "Upper Body Strength", focus: "Strength", location: "Studio", time: "18:30", duration: "55 min", spots: 2 },
  ],
  Tue: [
    { name: "Mobility Flow", focus: "Mobility", location: "Studio", time: "07:00", duration: "55 min", spots: 6 },
    { name: "Beach HIIT", focus: "Conditioning", location: "Outdoor", time: "10:00", duration: "55 min", spots: 4 },
    { name: "Deadlift & Pull", focus: "Strength", location: "Studio", time: "19:00", duration: "55 min", spots: 1 },
  ],
  Wed: [
    { name: "Push & Press", focus: "Strength", location: "Studio", time: "07:00", duration: "55 min", spots: 4 },
    { name: "Park Conditioning", focus: "Conditioning", location: "Outdoor", time: "12:30", duration: "55 min", spots: 6 },
    { name: "Lower Body Strength", focus: "Strength", location: "Studio", time: "18:30", duration: "55 min", spots: 3 },
  ],
  Thu: [
    { name: "Mobility & Recovery", focus: "Mobility", location: "Studio", time: "07:00", duration: "55 min", spots: 8 },
    { name: "Sprint Training", focus: "Conditioning", location: "Outdoor", time: "10:00", duration: "55 min", spots: 5 },
    { name: "Full Body Strength", focus: "Strength", location: "Studio", time: "19:00", duration: "55 min", spots: 2 },
  ],
  Fri: [
    { name: "Olympic Lifts", focus: "Strength", location: "Studio", time: "07:00", duration: "55 min", spots: 3 },
    { name: "Beach Circuit", focus: "Conditioning", location: "Outdoor", time: "12:30", duration: "55 min", spots: 4 },
    { name: "Squat & Hinge", focus: "Strength", location: "Studio", time: "18:30", duration: "55 min", spots: 2 },
  ],
  Sat: [
    { name: "Weekend Strength", focus: "Strength", location: "Studio", time: "09:00", duration: "55 min", spots: 5 },
    { name: "Outdoor Endurance", focus: "Conditioning", location: "Outdoor", time: "11:00", duration: "55 min", spots: 6 },
  ],
};

const focusColor: Record<string, string> = {
  Strength: "bg-primary/20 text-primary border-primary/30",
  Conditioning: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Mobility: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

const handleBook = (name: string, day: string, time: string) => {
  toast({
    title: "Demo — Booking confirmed",
    description: `${name} · ${day} at ${time}`,
  });
};

const ClassCard = ({ session, day }: { session: ClassSession; day: string }) => (
  <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40">
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-muted-foreground">{session.time}</span>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {session.location === "Studio" ? (
          <MapPin className="h-3 w-3" />
        ) : (
          <TreePine className="h-3 w-3" />
        )}
        {session.location}
      </span>
    </div>

    <h4 className="font-heading text-sm font-semibold text-foreground leading-snug">
      {session.name}
    </h4>

    <div className="flex items-center gap-2">
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${focusColor[session.focus]}`}>
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
        onClick={() => handleBook(session.name, day, session.time)}
      >
        Book
      </Button>
    </div>
  </div>
);

const Schedule = () => (
  <section id="schedule" className="py-20 sm:py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Weekly Schedule
        </h2>
        <p className="mt-3 text-muted-foreground">
          All sessions 55 min · Select a slot to book
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden overflow-x-auto lg:block">
        <div className="grid min-w-[900px] grid-cols-6 gap-3">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-col gap-3">
              <div className="rounded-md bg-secondary py-2 text-center text-sm font-semibold text-secondary-foreground">
                {day}
              </div>
              {schedule[day].map((session, i) => (
                <ClassCard key={i} session={session} day={day} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="flex flex-col gap-6 lg:hidden">
        {DAYS.map((day) => (
          <div key={day}>
            <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{day}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {schedule[day].map((session, i) => (
                <ClassCard key={i} session={session} day={day} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Schedule;
