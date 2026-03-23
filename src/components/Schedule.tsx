import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { MapPin, TreePine } from "lucide-react";
import { format, startOfToday } from "date-fns";
import * as React from "react";

// (Original hardcoded data removed in favor of Supabase useQuery)


const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const focusColor: Record<string, string> = {
  Strength: "bg-primary/15 text-primary border-primary/25",
  Conditioning: "bg-accent/15 text-accent border-accent/25",
  Mobility: "bg-secondary text-secondary-foreground border-border",
};

const handleBook = (name: string, day: string, time: string) => {
  toast({
    title: "Demo — Booking confirmed",
    description: `${name} · ${day} at ${time}`,
  });
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

const ClassCard = ({ session, day }: { session: ClassSession; day: string }) => (
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
        onClick={() => handleBook(session.name, day, session.time)}
      >
        Book
      </Button>
    </div>
  </div>
);

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

type ClassSession = {
  name: string;
  focus: "Strength" | "Conditioning" | "Mobility";
  location: "Studio" | "Outdoor" | string;
  time: string;
  duration: string;
  spots: number;
};

const Schedule = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => startOfToday());

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions_public'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sessions').select(`
        *,
        session_types(name, category_id, categories(name))
      `).eq('is_active', true).order('start_date');
      if (error) throw error;
      return data;
    }
  });

  const getSessionsForDay = (dayKey: string) => {
     if (!sessions) return [];
     return sessions.filter(s => {
       const date = new Date(s.start_date);
       return dayKeyFromDate(date) === dayKey;
     }).map(s => ({
       name: s.title,
       focus: (s.session_types?.categories?.name || "Strength") as any,
       location: s.location || "Studio",
       time: format(new Date(s.start_date), "HH:mm"),
       duration: "55 min",
       spots: s.max_slots
     }));
  };

  const selectedDayKey = selectedDate ? dayKeyFromDate(selectedDate) : null;
  const selectedSessions = selectedDayKey ? getSessionsForDay(selectedDayKey) : [];

  const subtitle =
    selectedDayKey && selectedSessions.length
      ? `${selectedDayKey} · ${selectedSessions.length} session${selectedSessions.length === 1 ? "" : "s"}`
      : "All sessions are 55 min · Pick a slot to book";

  return (
    <section id="schedule" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Tabs defaultValue="grid" className="w-full">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                Schedule
              </h2>
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            </div>

            <TabsList className="w-full md:w-auto">
              <TabsTrigger className="flex-1 md:flex-none" value="grid">
                Grid
              </TabsTrigger>
              <TabsTrigger className="flex-1 md:flex-none" value="calendar">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-0">
            {/* Keep it full-width and scrollable on small screens */}
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <div className="grid min-w-[960px] grid-cols-6 gap-4">
                {DAYS.map((day) => (
                  <div key={day} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                      <span className="text-sm font-semibold text-foreground">{day}</span>
                      <span className="text-xs text-muted-foreground">
                        {getSessionsForDay(day).length} slot{getSessionsForDay(day).length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {getSessionsForDay(day).length > 0 ? (
                        getSessionsForDay(day).map((session, i) => (
                           <ClassCard key={i} session={session} day={day} />
                        ))
                      ) : (
                         <div className="text-[10px] text-muted-foreground italic text-center py-4 border border-dashed rounded opacity-60">No sessions</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  fromDate={startOfToday()}
                  disabled={(date) => {
                    const dayKey = dayKeyFromDate(date);
                    if (!dayKey) return true; // Sundays
                    return getSessionsForDay(dayKey).length === 0;
                  }}
                />
                <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                  Tip: disabled days have no sessions (Sunday).
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date"}
                  </h3>
                  {selectedDayKey ? (
                    <span className="text-sm text-muted-foreground">{selectedDayKey}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No sessions</span>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedDayKey && selectedSessions.length ? (
                    selectedSessions.map((session, i) => (
                      <ClassCard key={i} session={session} day={selectedDayKey} />
                    ))
                  ) : (
                    <div className="rounded-md border border-border bg-background/40 p-4 text-sm text-muted-foreground sm:col-span-2">
                      No sessions for this day. Try another date (Mon–Sat).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10 rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Want a personalized plan instead of a class slot?
            </div>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => handleBook("1:1 Intro Call", "Any day", "Choose a time")}
            >
              Request 1:1 intro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
