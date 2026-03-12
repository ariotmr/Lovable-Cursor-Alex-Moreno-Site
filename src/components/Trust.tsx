import { CheckCircle } from "lucide-react";

const bullets = [
  "10+ years coaching strength & conditioning",
  "Structured periodized programming for every client",
  "500+ clients trained across all fitness levels",
];

const Trust = () => (
  <section id="trust" className="border-t border-border py-20 sm:py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Coach info */}
        <div>
          <div className="mb-8 flex items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80"
              alt="Alex Moreno, Strength & Conditioning Coach"
              className="h-24 w-24 rounded-full object-cover ring-2 ring-primary/30 sm:h-28 sm:w-28"
            />
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Alex Moreno
              </h2>
              <p className="text-sm text-primary font-medium">
                Strength & Conditioning Coach
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Barcelona, Spain
              </p>
            </div>
          </div>

          <p className="mb-6 text-muted-foreground leading-relaxed">
            I help busy professionals build real strength through structured, efficient training — in my Eixample studio or outdoors across Barcelona.
          </p>

          <ul className="space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
            alt="Clean modern training studio"
            className="h-64 w-full rounded-lg object-cover sm:h-72"
          />
          <img
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80"
            alt="Outdoor training in Barcelona park"
            className="h-64 w-full rounded-lg object-cover sm:h-72"
          />
        </div>
      </div>
    </div>
  </section>
);

export default Trust;
