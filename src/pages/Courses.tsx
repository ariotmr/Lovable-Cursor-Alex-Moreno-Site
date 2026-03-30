import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  MessageCircle, 
  Users, 
  Apple, 
  Trophy,
  ArrowRight,
  Clock,
  Gem
} from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  duration: string;
  features: string[];
  longDescription: string;
  results: string[];
}

const featuredCourses: Course[] = [
  {
    id: "transformation-plan",
    title: "12-Week Transformation Plan",
    description: "Total physical and mental overhaul with 24/7 support and custom planning.",
    price: "$1.00",
    originalPrice: "$299.00",
    duration: "12 Weeks",
    features: [
      "24/7 Priority Support",
      "Weekly 1-on-1 Calls",
      "Custom Meal Plan",
      "Elite Accountability"
    ],
    longDescription: "A total physical and mental overhaul including 24/7 dedicated support, private weekly strategy calls, and a custom nutritional architecture. This program isn't about short-term fixes; it's about a fundamental shift in how you move, fuel, and think. You provide the grit, we provide the elite framework and support.",
    results: [
      "Optimized Body Composition",
      "Enhanced Peak Performance",
      "Sustainable Lifestyle Habits",
      "Elite Mindset Development"
    ]
  }
];

const Courses = () => {
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
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.name.split(' ')[0] || '',
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          email: form.email,
          planType: '12-Week Transformation Plan',
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
    } catch (err: unknown) {
      const error = err as Error;
      console.error("[Courses] Submit error:", error);
      setStatus("error");
      toast.error(error.message || "Checkout failed. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      <Navbar />
      
      {/* Search/Filter Header */}
      <header className="py-16 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-foreground">
              Our Programs & Courses
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl px-4">
              Select a module below to view details and begin your transformation journey.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <Dialog key={course.id}>
                <DialogTrigger asChild>
                  <Card className="group relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardHeader className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Gem className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Flagship</span>
                          <span className="text-xl font-bold text-foreground">{course.price}</span>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-heading mb-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {course.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-2.5">
                        {course.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto gap-1 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
                  <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
                    <div className="relative h-32 bg-primary/10 flex items-center px-8">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
                       <div className="relative space-y-1">
                          <DialogTitle className="text-2xl font-bold font-heading">{course.title}</DialogTitle>
                          <div className="flex items-center gap-4 text-sm font-medium text-primary">
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
                            <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4" /> Certification Included</span>
                          </div>
                       </div>
                    </div>

                    <div className="p-8 lg:p-10 space-y-8">
                      <div className="grid lg:grid-cols-2 gap-10">
                        {/* Details Side */}
                        <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">About the Program</h4>
                              <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/30 pl-4">
                                "{course.longDescription}"
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Included in this tier</h4>
                              <ul className="grid gap-3">
                                {[
                                  { icon: MessageCircle, label: "24/7 Priority Support", color: "text-orange-500", bg: "bg-orange-500/10" },
                                  { icon: Users, label: "Weekly 1-on-1 Calls", color: "text-blue-500", bg: "bg-blue-500/10" },
                                  { icon: Apple, label: "Custom Meal Plan", color: "text-green-500", bg: "bg-green-500/10" },
                                  { icon: Sparkles, label: "Elite Tools & Apps", color: "text-purple-500", bg: "bg-purple-500/10" }
                                ].map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 transition-all hover:bg-muted/50">
                                    <div className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                                      <item.icon className={`h-4 w-4 ${item.color}`} />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">What you'll achieve</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {course.results.map((result, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-[11px] text-foreground/70 bg-primary/5 px-2 py-1.5 rounded-lg border border-primary/10">
                                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                                    <span>{result}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="space-y-6 flex flex-col justify-center">
                          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col items-center text-center">
                              <span className="text-muted-foreground line-through text-xs mb-1 opacity-50">{course.originalPrice}</span>
                              <span className="text-3xl font-bold text-foreground mb-1">{course.price}</span>
                              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">Special Launch Rate</span>
                          </div>

                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <input
                                name="name"
                                required
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                className="h-10 w-full rounded-xl border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <input
                                name="email"
                                type="email"
                                required
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="h-10 w-full rounded-xl border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                              />
                            </div>
                            <Button 
                              type="submit" 
                              className="w-full h-12 rounded-xl font-bold gap-2 text-base shadow-lg transition-transform active:scale-95"
                              disabled={status === "loading"}
                            >
                              {status === "loading" ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <>
                                  <CreditCard className="h-4 w-4" />
                                  Enroll Now
                                </>
                              )}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 pt-2 opacity-50">
                              <CreditCard className="h-3 w-3" />
                              Secure Checkout via Stripe
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
