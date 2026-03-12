import { Button } from "@/components/ui/button";

const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          ALEX MORENO
        </span>

        <div className="hidden items-center gap-8 md:flex">
          {[
            ["Schedule", "schedule"],
            ["About", "trust"],
            ["Reviews", "proof"],
            ["Info", "logistics"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => scrollTo("schedule")}
          className="font-semibold"
        >
          Book Now
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
