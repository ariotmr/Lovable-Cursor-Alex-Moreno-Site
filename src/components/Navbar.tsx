import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching role:", error);
              setRole(null);
            } else {
              setRole(data?.role);
            }
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching role on state change:", error);
              setRole(null);
            } else {
              setRole(data?.role);
            }
          });
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#" + id);
    }
  };

  const handleAuthClick = () => {
    if (session) {
      navigate(role === "admin" ? "/admin" : "/user");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-heading text-lg font-bold tracking-tight text-foreground uppercase">
          ALEX MORENO
        </Link>

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

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAuthClick}
            className="font-medium text-sm transition-all hover:bg-primary/10 hover:text-primary"
          >
            {session ? "Dashboard" : "Sign In"}
          </Button>
          <Button
            size="sm"
            onClick={() => scrollTo("schedule")}
            className="font-semibold shadow-sm transition-transform active:scale-95"
          >
            Book Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
