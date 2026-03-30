import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Loader2, Sparkles } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const TransformationPlan = () => {
  const [status, setStatus] = React.useState<Status>("idle");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    try {
      // Send data to our Vercel Serverless Function to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.name.split(' ')[0] || '',
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          email: form.email,
          planType: 'Transformation Plan',
        }),
      });

      if (response.status === 404) {
        throw new Error("API Route Not Found (404). If you are testing locally, make sure to run 'vercel dev' instead of 'npm run dev' to enable backend functions.");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned an invalid response. Check your server logs.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from Stripe');
      }
    } catch (err: any) {
      console.error("[TransformationPlan] Submit error:", err);
      setStatus("error");
      toast.error(err.message || "Checkout failed. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <section id="transformation-plan" className="py-20 sm:py-28 bg-muted/20 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Premium Program</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-5xl leading-tight">
              The Transformation Plan
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Unlock your peak potential with our comprehensive Transformation Plan. 
              This isn't just a workout routine — it's a complete overhaul of your 
              strength, conditioning, and mobility designed to deliver guaranteed results.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-lg bg-card border border-border flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Custom Programming</h4>
                  <p className="text-sm text-muted-foreground mt-1">Tailored specifically to your current fitness level and goals.</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Direct Coaching Access</h4>
                  <p className="text-sm text-muted-foreground mt-1">Weekly check-ins and form reviews to keep you accountable.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <h3 className="font-heading text-xl font-bold text-foreground mb-6">
              Apply & Secure Your Spot
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  name="name"
                  required
                  disabled={status === "loading"}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="First and Last Name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={status === "loading"}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="w-full h-12 text-lg font-bold gap-2 shadow-lg hover:scale-[1.02] transition-transform"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Continue to Payment
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                Payments secured by <strong className="text-foreground">Stripe</strong>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationPlan;
