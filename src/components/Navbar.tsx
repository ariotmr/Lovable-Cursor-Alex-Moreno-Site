import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const navigate = useNavigate();

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarSrc(url);
    } catch (error) {
      console.error("Error downloading image: ", error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase
          .from("profiles")
          .select("first_name, role, avatar_url")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
              setRole(null);
            } else {
              setRole(data?.role);
              setFirstName(data?.first_name || "");
              if (data?.avatar_url) {
                downloadImage(data.avatar_url);
              }
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
          .select("first_name, role, avatar_url")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile on state change:", error);
              setRole(null);
            } else {
              setRole(data?.role);
              setFirstName(data?.first_name || "");
              if (data?.avatar_url) {
                downloadImage(data.avatar_url);
              }
            }
          });
      } else {
        setRole(null);
        setFirstName("");
        setAvatarSrc("");
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

        <div className="flex items-center gap-4">
          {session && <NotificationCenter />}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarSrc} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {firstName?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-card border-border/50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal pb-3 pt-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{firstName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer gap-3 py-2.5">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(role === "admin" ? "/admin" : "/user")} className="cursor-pointer gap-3 py-2.5">
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/");
                }} className="cursor-pointer gap-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAuthClick}
              className="font-medium text-sm transition-all hover:bg-primary/10 hover:text-primary"
            >
              Sign In
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => scrollTo("schedule")}
            className="font-semibold shadow-sm transition-transform active:scale-95 bg-[#FF6600] text-white hover:bg-[#E65C00]"
          >
            Book Session
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
