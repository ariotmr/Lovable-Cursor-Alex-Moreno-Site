import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BookingManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bookings').select(`
        *,
        sessions(title, start_date),
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
      toast({ title: "Booking Updated", description: "The booking status has been updated." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const userName = `${booking.profiles?.first_name || ''} ${booking.profiles?.last_name || ''}`.toLowerCase();
    const sessionName = (booking.sessions?.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = userName.includes(query) || sessionName.includes(query);
    return matchesStatus && matchesSearch;
  });

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
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading bookings...</p>
        ) : filteredBookings && filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => (
              <div key={booking.id} className="flex flex-col sm:flex-row justify-between sm:items-center border p-4 rounded-lg gap-4">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                       {booking.sessions?.title || 'Unknown Session'}
                    </h3>
                    <p className="text-sm text-foreground font-medium">
                       {booking.profiles?.first_name || 'Anonymous'} {booking.profiles?.last_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reserved for: {booking.sessions?.start_date ? new Date(booking.sessions.start_date).toLocaleString() : 'TBD'} • Booked on: {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Select value={booking.status} onValueChange={(val) => updateStatusMutation.mutate({ id: booking.id, status: val })}>
                    <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold
                      ${booking.status === 'confirmed' ? 'bg-green-100/50 text-green-800 border-green-200' : ''}
                      ${booking.status === 'pending' ? 'bg-yellow-100/50 text-yellow-800 border-yellow-200' : ''}
                      ${booking.status === 'completed' ? 'bg-blue-100/50 text-blue-800 border-blue-200' : ''}
                      ${booking.status === 'cancelled' ? 'bg-red-100/50 text-red-800 border-red-200' : ''}
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
                  
                  <Button variant="ghost" size="icon" title="View Details">
                    <FileText className="h-4 w-4" />
                  </Button>
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
      </CardContent>
    </Card>
  );
};
