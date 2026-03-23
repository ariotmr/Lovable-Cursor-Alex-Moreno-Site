import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Eye, CreditCard, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const BookingManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bookings').select(`
        *,
        sessions(title, start_date, location, price, session_types(name)),
        profiles(first_name, last_name, email)
      `).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      let payload: any = { status };
      if (status === 'cancelled') {
         payload.cancelled_at_datetime = new Date().toISOString();
         payload.cancel_reason = "Cancelled by Admin";
      }
      const { data, error } = await supabase.from('bookings').update(payload).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions_public'] });
      toast({ title: "Booking Updated", description: "The booking status has been updated." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesType = filterType === "all" || booking.sessions?.session_types?.name === filterType;
    
    // Date filter logic
    let matchesDate = true;
    if (filterDate === "today") {
      const today = new Date().toLocaleDateString();
      const sessionDate = new Date(booking.sessions?.start_date).toLocaleDateString();
      matchesDate = today === sessionDate;
    } else if (filterDate === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(booking.sessions?.start_date) >= weekAgo;
    }

    const userName = `${booking.profiles?.first_name || ''} ${booking.profiles?.last_name || ''}`.toLowerCase();
    const sessionName = (booking.sessions?.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = userName.includes(query) || sessionName.includes(query);
    
    return matchesStatus && matchesType && matchesDate && matchesSearch;
  });

  const sessionTypes = Array.from(new Set(bookings?.map((b: any) => b.sessions?.session_types?.name).filter(Boolean)));

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle>All Bookings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search user or session..." 
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Session Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {sessionTypes.map((type: any) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 border-b text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
           <div className="col-span-1">Client</div>
           <div className="col-span-2">Session</div>
           <div className="col-span-1">Schedule</div>
           <div className="col-span-1 text-center">Price</div>
           <div className="col-span-1 text-right pr-4">Status & Action</div>
        </div>
        <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading bookings...</p>
        ) : filteredBookings && filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => (
              <div key={booking.id} className="grid grid-cols-1 md:grid-cols-6 items-center border p-4 rounded-xl gap-4 hover:shadow-sm transition-all bg-card/50">
                {/* Client Column */}
                <div className="col-span-1 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {(booking.profiles?.first_name?.[0] || 'U')}{(booking.profiles?.last_name?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate leading-none">
                       {booking.profiles?.first_name} {booking.profiles?.last_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-1">
                      {booking.profiles?.email}
                    </p>
                  </div>
                </div>

                {/* Session Column */}
                <div className="col-span-2">
                  <h3 className="font-bold text-sm leading-tight text-foreground line-clamp-1">
                     {booking.sessions?.title}
                  </h3>
                  <Badge variant="outline" className="text-[10px] h-4 mt-1 px-1.5 font-medium border-primary/20 text-primary bg-primary/5">
                    {booking.sessions?.session_types?.name}
                  </Badge>
                </div>

                {/* Schedule Column */}
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {booking.sessions?.start_date ? new Date(booking.sessions.start_date).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {booking.sessions?.start_date ? new Date(booking.sessions.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </div>
                </div>

                {/* Price Column */}
                <div className="col-span-1 text-center">
                   <p className="text-sm font-bold text-primary">€{booking.sessions?.price || '0.00'}</p>
                   <p className="text-[10px] text-muted-foreground">Base Rate</p>
                </div>

                {/* Status & Actions Column */}
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <Select value={booking.status} onValueChange={(val) => updateStatusMutation.mutate({ id: booking.id, status: val })}>
                    <SelectTrigger className={`w-[110px] h-7 text-[10px] font-bold uppercase tracking-wider
                      ${booking.status === 'confirmed' ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700' : ''}
                      ${booking.status === 'pending' ? 'bg-amber-500 text-white border-amber-400 hover:bg-amber-600' : ''}
                      ${booking.status === 'completed' ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700' : ''}
                      ${booking.status === 'cancelled' ? 'bg-slate-500 text-white border-slate-400 hover:bg-slate-600' : ''}
                    `}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-7 w-7 border-muted-foreground/20 hover:text-primary hover:border-primary/50" title="View Details">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    {/* ... (DialogContent content remains similar but I'll ensure it matches the new style) */}
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                             <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          Booking Summary
                        </DialogTitle>
                        <DialogDescription>
                          Full details for reservation on {booking.sessions?.start_date ? new Date(booking.sessions.start_date).toLocaleDateString() : 'N/A'}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-5 py-4">
                        <div className="flex justify-between items-start bg-muted/30 p-4 rounded-lg border border-border/50">
                          <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Client</p>
                            <p className="text-sm font-bold">{booking.profiles?.first_name} {booking.profiles?.last_name}</p>
                            <p className="text-xs text-muted-foreground">{booking.profiles?.email}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Pricing</p>
                            <p className="text-xl font-black text-primary">€{booking.sessions?.price}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-1">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                <Calendar className="h-3 w-3" /> Date
                              </div>
                              <p className="text-sm font-medium">{booking.sessions?.start_date ? new Date(booking.sessions.start_date).toLocaleDateString() : 'TBD'}</p>
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                <Clock className="h-3 w-3" /> Time
                              </div>
                              <p className="text-sm font-medium">{booking.sessions?.start_date ? new Date(booking.sessions.start_date).toLocaleTimeString() : 'TBD'}</p>
                           </div>
                           <div className="col-span-2 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                <MapPin className="h-3 w-3" /> Location
                              </div>
                              <p className="text-sm font-medium">{booking.sessions?.location || 'TBD'}</p>
                           </div>
                           <div className="col-span-2 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                <CreditCard className="h-3 w-3" /> Payment Status
                              </div>
                              <p className="text-sm font-medium">{booking.payment_method || 'Unspecified'}</p>
                           </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <h3 className="text-lg font-semibold">No bookings found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
};
