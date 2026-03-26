import * as React from "react";
import { Button } from "@/components/ui/button";
import { notifyN8n } from "@/lib/notifyN8n";
import { toast } from "sonner";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const EmailInquiry = () => {
  const [status, setStatus] = React.useState<Status>("idle");
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "", // Newly added field
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");

    try {
      await notifyN8n({
        eventType: "email_inquiry",
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        subject: form.subject, // Include subject in payload
        message: form.message,
      });

      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("[EmailInquiry] Submit error:", err);
      setStatus("error");
      toast.error("Form submission failed. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      className="border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Get in Touch
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl leading-tight">
              Have a question or a specific need?
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Whether you're looking for a custom corporate package, group
              session, or just want to know if this is right for you — send a
              message and Alex will get back to you personally within 24 hours.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Corporate & group session packages",
                "Questions about programming or methodology",
                "Session location or logistics",
                "Anything else on your mind",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Message received!
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Alex will get back to you within 24 hours. Keep an eye on your inbox.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-primary hover:text-primary"
                  onClick={() => setStatus("idle")}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="inq-firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="inq-firstName"
                      name="firstName"
                      required
                      disabled={status === "loading"}
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="inq-lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="inq-lastName"
                      name="lastName"
                      required
                      disabled={status === "loading"}
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inq-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="inq-email"
                    name="email"
                    type="email"
                    required
                    disabled={status === "loading"}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inq-subject"
                    className="text-sm font-medium text-foreground"
                  >
                    Subject <span className="text-primary">*</span>
                  </label>
                  <input
                    id="inq-subject"
                    name="subject"
                    required
                    disabled={status === "loading"}
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Enquiry about corporate sessions..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inq-message"
                    className="text-sm font-medium text-foreground"
                  >
                    Your Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="inq-message"
                    name="message"
                    required
                    rows={5}
                    disabled={status === "loading"}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for — corporate sessions, specific training goals, logistics questions..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="w-full font-semibold gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  We'll respond within 24 hours. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailInquiry;
