import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { User, Settings, History, Calendar, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setEmail(session?.user?.email || null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const dashboardItems = [
    { title: "Profile", icon: User, description: "Manage your personal information." },
    { title: "Bookings", icon: Calendar, description: "View and manage your upcoming appointments." },
    { title: "History", icon: History, description: "See your past session history." },
    { title: "Settings", icon: Settings, description: "Manage your account preferences." },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 pt-24 space-y-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {email?.split("@")[0] || "User"}!</h1>
          <p className="text-muted-foreground mt-1 text-sm">{email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <Card key={index} className="border-secondary hover:border-primary/20 transition-all hover:shadow-md cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-secondary overflow-hidden">
        <div className="aspect-[21/9] flex items-center justify-center bg-gradient-to-r from-background to-secondary/50">
          <div className="text-center p-6 space-y-2">
            <h2 className="text-xl font-medium">Ready for your next session?</h2>
            <p className="text-sm text-muted-foreground">Book a new session with our experts today.</p>
            <Button className="mt-4 shadow-lg shadow-primary/20">Book Now</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;
