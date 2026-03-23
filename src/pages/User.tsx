import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { 
  User, 
  Settings, 
  History, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  MapPin, 
  CreditCard, 
  Activity, 
  CalendarCheck,
  Ticket,
  ChevronRight,
  TrendingUp,
  Award,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow, isAfter, isBefore, addHours } from "date-fns";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);

  const incomingSessionId = location.state?.bookSessionId;

  const { data: targetSession, refetch: refetchTarget } = useQuery({
    queryKey: ['target_booking_session', incomingSessionId],
    queryFn: async () => {
      if (!incomingSessionId) return null;
      const { data, error } = await supabase
        .from('sessions')
        .select('*, session_types(*)')
        .eq('id', incomingSessionId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!incomingSessionId
  });

  useEffect(() => {
    if (incomingSessionId && targetSession) {
      setIsBookingSheetOpen(true);
    }
  }, [incomingSessionId, targetSession]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          setProfile(data);
        });
      }
    });
  }, []);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['user_bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          sessions (
            *,
            session_types (name, description)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const upcomingBookings = bookings?.filter(b => 
    b.status !== 'cancelled' && isAfter(new Date(b.sessions?.start_date), new Date())
  ).sort((a,b) => new Date(a.sessions?.start_date).getTime() - new Date(b.sessions?.start_date).getTime());

  const pastBookings = bookings?.filter(b => 
    b.status === 'completed' || isBefore(new Date(b.sessions?.start_date), new Date())
  );

  const nextSession = upcomingBookings?.[0];

  const stats = [
    { label: "Confirmed", value: upcomingBookings?.length || 0, icon: CalendarCheck, color: "text-primary" },
    { label: "Completed", value: pastBookings?.length || 0, icon: Award, color: "text-green-500" },
    { label: "Total Points", value: (pastBookings?.length || 0) * 10, icon: TrendingUp, color: "text-amber-500" },
    { label: "Active Plan", value: "Premium", icon: Ticket, color: "text-purple-500" },
  ];

  const handleConfirmBooking = async () => {
    if (!user || !targetSession) return;
    
    setIsBookingInProgress(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          { user_id: user.id, session_id: targetSession.id, status: 'confirmed' }
        ]);

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: `Your session for ${targetSession.title} is all set.`,
      });

      setIsBookingSheetOpen(false);
      // Replace state to avoid re-opening on refresh
      navigate("/user", { replace: true, state: {} });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsBookingInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 pt-24 space-y-8 animate-fade-in relative">
      
      {/* Target Booking Sheet */}
      <Sheet open={isBookingSheetOpen} onOpenChange={(open) => {
        if (!open) {
          setIsBookingSheetOpen(false);
          navigate("/user", { replace: true, state: {} });
        }
      }}>
        <SheetContent className="bg-card border-border w-full sm:max-w-md">
          <SheetHeader className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
               <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-black uppercase text-foreground">Confirm Booking</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Please review the session details before confirming your spot.
            </SheetDescription>
          </SheetHeader>

          {targetSession && (
            <div className="mt-8 space-y-8 py-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                   <h3 className="font-bold text-lg text-foreground">{targetSession.title}</h3>
                   <div className="flex items-center gap-3 text-sm text-muted-foreground uppercase font-bold tracking-wider">
                      <Clock className="h-4 w-4 text-primary" />
                      {format(new Date(targetSession.start_date), "EEEE, MMMM do @ HH:mm")}
                   </div>
                   <div className="flex items-center gap-3 text-sm text-muted-foreground uppercase font-bold tracking-wider">
                      <MapPin className="h-4 w-4 text-primary" />
                      {targetSession.location || "Studio"}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-background border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Duration</p>
                      <p className="text-sm font-black text-foreground">55 Minutes</p>
                   </div>
                   <div className="p-4 rounded-xl bg-background border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Coach</p>
                      <p className="text-sm font-black text-foreground">Alex Moreno</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4 pt-10 border-t border-border">
                <Button 
                  className="w-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] py-6 shadow-xl shadow-primary/20 hover:opacity-90 h-auto"
                  onClick={handleConfirmBooking}
                  disabled={isBookingInProgress}
                >
                  {isBookingInProgress ? "Confirming..." : "Confirm Booking"}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground hover:text-foreground font-bold"
                  onClick={() => {
                     setIsBookingSheetOpen(false);
                     navigate("/user", { replace: true, state: {} });
                  }}
                  disabled={isBookingInProgress}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-4 border-card shadow-2xl">
              <AvatarImage src={profile?.avatar_url} className="object-cover" />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
                Welcome, {profile?.first_name || "Athlete"}!
              </h1>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Your account is active and optimized
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none gap-2 border-border hover:bg-white/5" onClick={() => navigate("/profile")}>
              <Settings className="h-4 w-4" /> Edit Profile
            </Button>
            <Button 
              className="flex-1 md:flex-none gap-2 bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20"
              onClick={() => navigate("/#schedule")}
            >
              <Plus className="h-4 w-4" /> Book New Session
            </Button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-border shadow-sm bg-card hover:border-primary/30 transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-background border border-border ${stat.color} shadow-sm`}>
                   <stat.icon className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                   <p className="text-lg font-black text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Next Session Highlight */}
            {nextSession ? (
              <Card className="border-none bg-gradient-to-br from-card to-background text-foreground overflow-hidden shadow-2xl relative border border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Activity className="h-32 w-32" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                    <Clock className="h-3 w-3" /> Upcoming Next
                  </div>
                  <CardTitle className="text-2xl font-black mt-2 leading-tight text-foreground">
                    {nextSession.sessions?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">When</p>
                      <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                        <Calendar className="h-4 w-4 text-primary" /> 
                        {format(new Date(nextSession.sessions?.start_date), "EEEE, MMM do @ HH:mm")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Where</p>
                      <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                        <MapPin className="h-4 w-4 text-primary" /> 
                        {nextSession.sessions?.location || "Studio"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button className="bg-primary hover:opacity-90 text-primary-foreground font-bold px-6">
                      View Details
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5 border border-border">
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
                <div className="h-2 bg-secondary absolute bottom-0 left-0 right-0">
                   <div className="h-full bg-primary animate-pulse" style={{ width: '45%' }} />
                </div>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-border shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center border border-border">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">No sessions scheduled</h3>
                    <p className="text-sm text-muted-foreground w-64 mx-auto">
                      Ready to get back in the game? Browse our latest availability.
                    </p>
                  </div>
                  <Button onClick={() => navigate("/#schedule")} className="bg-primary text-primary-foreground font-bold">
                    Browse Schedule
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tabs for Detailed Booking Lists */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-[400px] grid-cols-2 mb-6 bg-card border border-border p-1 rounded-xl">
                <TabsTrigger value="upcoming" className="rounded-lg font-bold uppercase text-[10px] data-[state=active]:bg-background">Upcoming Sessions</TabsTrigger>
                <TabsTrigger value="past" className="rounded-lg font-bold uppercase text-[10px] data-[state=active]:bg-background">History & Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="grid gap-4">
                  {upcomingBookings && upcomingBookings.length > 0 ? (
                    upcomingBookings.map((b) => (
                      <Card key={b.id} className="border-border shadow-sm hover:border-primary/30 transition-all group overflow-hidden bg-card">
                        <CardContent className="p-0 flex flex-col sm:flex-row">
                          <div className="w-1.5 bg-primary" />
                          <div className="p-6 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <h4 className="font-black text-lg group-hover:text-primary transition-colors text-foreground">{b.sessions?.title}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" /> 
                                {format(new Date(b.sessions?.start_date), "MMMM do @ HH:mm")}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <Badge variant="outline" className="px-3 py-1 font-bold uppercase text-[9px] tracking-widest border-border text-muted-foreground">{b.status}</Badge>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground italic text-sm">You have no upcoming sessions.</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="grid gap-3">
                  {pastBookings && pastBookings.length > 0 ? (
                    pastBookings.map((b) => (
                      <Card key={b.id} className="border-border bg-card/50 group">
                        <CardContent className="p-4 flex justify-between items-center text-foreground">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-background border border-border rounded-lg flex items-center justify-center">
                               <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{b.sessions?.title}</p>
                              <p className="text-[10px] text-muted-foreground">{format(new Date(b.sessions?.start_date), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-background text-foreground text-[9px] font-black uppercase tracking-tighter border-border">Completed</Badge>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground italic text-sm">No past session history yet.</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Links */}
            <Card className="border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">Account & Support</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {[
                  { label: "My Profile", icon: User, path: "/profile" },
                  { label: "Payment Methods", icon: CreditCard, path: "#" },
                  { label: "Support Chat", icon: History, path: "#" },
                  { label: "App Settings", icon: Settings, path: "#" },
                ].map((link, idx) => (
                  <button 
                    key={idx} 
                    className="w-full flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors border-t border-border text-sm font-medium text-foreground"
                    onClick={() => link.path !== '#' && navigate(link.path)}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      {link.label}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Motivation Quote */}
            <div className="p-8 rounded-3xl bg-primary text-primary-foreground text-center space-y-4 shadow-xl shadow-primary/20">
               < Award className="h-10 w-10 mx-auto text-primary-foreground/50 animate-bounce" />
               <p className="text-sm font-black uppercase tracking-widest opacity-80 italic">"The only bad workout is the one that didn't happen."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
