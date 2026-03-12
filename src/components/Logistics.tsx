import { MapPin, TreePine, Clock, Backpack, CheckCircle, XCircle } from "lucide-react";

const items = [
  {
    icon: MapPin,
    title: "Base Location",
    desc: "Eixample district studio, Barcelona",
  },
  {
    icon: TreePine,
    title: "Outdoor Sessions",
    desc: "Ciutadella Park · Barceloneta Beach · Montjuïc",
  },
  {
    icon: Clock,
    title: "Session Length",
    desc: "55 minutes, structured warm-up to cool-down",
  },
  {
    icon: Backpack,
    title: "What to Bring",
    desc: "Training shoes, water, towel. Equipment provided.",
  },
];

const Logistics = () => (
  <section id="logistics" className="border-t border-border py-20 sm:py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Practical Info
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4 rounded-lg border border-border bg-card p-5">
            <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* For / Not for */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            Who It's For
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Busy professionals who value structured training</li>
            <li>Intermediate to advanced lifters</li>
            <li>Expats looking for consistent coaching</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            Not the Right Fit
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Looking for group fitness classes</li>
            <li>Need rehabilitation or clinical support</li>
            <li>Want a casual, unstructured approach</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Logistics;
