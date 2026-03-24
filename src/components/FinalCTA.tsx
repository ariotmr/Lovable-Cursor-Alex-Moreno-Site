import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const FinalCTA = () => {
  const handleBook = () => {
    const element = document.getElementById("book-session");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Ready to train?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Book your next session and get started.
        </p>
        <Button
          size="lg"
          onClick={handleBook}
          className="mt-8 px-10 text-base font-semibold"
        >
          Book Your Session
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
