import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Three months in and I've hit PRs I didn't think were possible. The programming is dialled in.",
    name: "Laura",
    age: 29,
    role: "Product Manager",
  },
  {
    quote: "Finally a coach who respects my schedule. 55 minutes, no fluff, real results.",
    name: "Marc",
    age: 35,
    role: "Architect",
  },
  {
    quote: "The outdoor sessions at Ciutadella are the highlight of my week. Structured but never boring.",
    name: "Sofía",
    age: 31,
    role: "UX Designer",
  },
  {
    quote: "Moved to Barcelona as an expat — Alex's training gave me both routine and community.",
    name: "James",
    age: 38,
    role: "Software Engineer",
  },
];

const photos = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80",
  "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&q=80",
];

const SocialProof = () => (
  <section id="proof" className="border-t border-border py-20 sm:py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
        What Clients Say
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <Card key={t.name} className="border-border bg-card">
            <CardContent className="p-5">
              <p className="mb-4 text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span>, {t.age} · {t.role}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Photo strip */}
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Community training"
            className="h-40 w-full rounded-lg object-cover sm:h-48"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
