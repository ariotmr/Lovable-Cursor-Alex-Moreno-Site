import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Save, Image as ImageIcon, Calendar as CalendarIcon, Clock as ClockIcon, MapPin as MapPinIcon, Users, List, CalendarRange } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfToday } from "date-fns";

export const SessionManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());

  const initialForm = {
    title: "", description: "", type_id: "", max_slots: 10, price: "", 
    location: "", image_url: "", is_active: true, 
    start_date: "", end_date: "", recurrence: "none"
  };
  const [formData, setFormData] = useState(initialForm);

  // Fetch session templates to map to sessions
  const { data: sessionTypes } = useQuery({
    queryKey: ['session_types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('session_types').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sessions').select(`
        *, 
        session_types(name),
        bookings(*, profiles(first_name, last_name, email, avatar_url))
      `).order('start_date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        const { data, error } = await supabase.from('sessions').update(payload).eq('id', editingId).select();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('sessions').insert([payload]).select();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setIsAdding(false);
      setEditingId(null);
      setFormData(initialForm);
      toast({ title: "Session Saved", description: "The session has been successfully recorded." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sessions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({ title: "Session Deleted", description: "The session was completely removed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (!formData.title || !formData.start_date) {
      toast({ title: "Missing fields", description: "Title and Start Date are required.", variant: "destructive" });
      return;
    }
    
    // Construct recurrence rule JSONB
    let recurrence_rule = null;
    if (formData.recurrence !== 'none') {
      recurrence_rule = { frequency: formData.recurrence };
    }

    const payload = {
      title: formData.title,
      description: formData.description || null,
      type_id: formData.type_id === "none" ? null : (formData.type_id || null),
      max_slots: formData.max_slots,
      price: formData.price ? parseFloat(formData.price) : null,
      location: formData.location || null,
      image_url: formData.image_url || null,
      is_active: formData.is_active,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      recurrence_rule
    };

    saveMutation.mutate(payload);
  };

  const startEdit = (session: any) => {
    setEditingId(session.id);
    setIsAdding(false);
    setFormData({
      title: session.title,
      description: session.description || "",
      type_id: session.type_id || "",
      max_slots: session.max_slots,
      price: session.price?.toString() || "",
      location: session.location || "",
      image_url: session.image_url || "",
      is_active: session.is_active,
      start_date: session.start_date ? new Date(session.start_date).toISOString().slice(0, 16) : "",
      end_date: session.end_date ? new Date(session.end_date).toISOString().slice(0, 16) : "",
      recurrence: session.recurrence_rule?.frequency || "none"
    });
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter sessions for the selected day for the calendar view
  const daySessions = sessions?.filter(s => {
    if (!selectedDate) return false;
    return format(new Date(s.start_date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
  }).sort((a,b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle>Session Schedule</CardTitle>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isAdding && !editingId && (
            <Button size="sm" onClick={() => { setIsAdding(true); setFormData(initialForm); }} className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Schedule Session
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) ? (
          // Form view when adding/editing
          <div className="space-y-4 border p-4 rounded-lg bg-muted/20 animate-in fade-in-50">
            <h4 className="font-semibold text-lg">{editingId ? 'Edit Session' : 'Schedule New Session'}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session Title</Label>
                <input placeholder="e.g. Saturday Morning HIIT" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Template (Optional)</Label>
                <Select 
                  value={formData.type_id} 
                  onValueChange={(val) => {
                    const selectedType = sessionTypes?.find(t => t.id === val);
                    setFormData({ 
                      ...formData, 
                      type_id: val,
                      max_slots: selectedType?.capacity || formData.max_slots,
                      price: selectedType?.base_price?.toString() || formData.price
                    });
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select Template" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Custom Session)</SelectItem>
                    {sessionTypes?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <Input type="datetime-local" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <Input type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Max Slots</Label>
                <Input type="number" min="1" value={formData.max_slots} onChange={e => setFormData({ ...formData, max_slots: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-2">
                <Label>Custom Price (€)</Label>
                <Input type="number" placeholder="Leave empty for template price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Recurrence Rule</Label>
                <Select value={formData.recurrence} onValueChange={(val) => setFormData({ ...formData, recurrence: val })}>
                  <SelectTrigger><SelectValue placeholder="Repeats" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Does not repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="e.g. Central Park or Zoom Link" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <Input placeholder="https://example.com/image.jpg" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                {formData.image_url ? (
                   <img src={formData.image_url} alt="Preview" className="h-10 w-10 object-cover rounded border" />
                ) : (
                   <div className="h-10 w-10 flex items-center justify-center border rounded bg-muted"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Specific details for this session..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
              <Label htmlFor="active">Session is actively accepting bookings</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); setFormData(initialForm); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" /> Save Session
              </Button>
            </div>
          </div>
        ) : (
          // View Toggle and Main Content
          <Tabs defaultValue="list" className="w-full">
            <div className="flex justify-start mb-6">
              <TabsList className="grid w-[240px] grid-cols-2">
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" /> List
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarRange className="h-4 w-4" /> Calendar
                </TabsTrigger>
              </TabsList>
            </div>

            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading schedule...</p>
            ) : (
              <>
                <TabsContent value="list" className="space-y-4">
                  <div className="border rounded-md overflow-hidden bg-card/50">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="w-[200px]">Session Name</TableHead>
                          <TableHead>Schedule</TableHead>
                          <TableHead className="w-[150px]">Occupancy</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions?.map((session: any) => {
                          const bookedCount = session.bookings?.filter((b: any) => b.status !== 'cancelled').length || 0;
                          const capacity = session.max_slots || 1;
                          const occupancy = (bookedCount / capacity) * 100;
                          
                          return (
                            <TableRow key={session.id} className={!session.is_active ? 'opacity-70 bg-muted/20' : ''}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col gap-1">
                                  <span className="flex items-center gap-2">
                                    {session.title}
                                    {!session.is_active && <Badge variant="secondary" className="text-[9px] h-4">Inactive</Badge>}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-normal line-clamp-1">
                                    {session.description || "No description"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col text-xs">
                                  <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3 text-primary" /> {new Date(session.start_date).toLocaleDateString()}</span>
                                  <span className="flex items-center gap-1 text-muted-foreground"><ClockIcon className="h-3 w-3" /> {new Date(session.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <div className="space-y-1.5 cursor-pointer hover:bg-muted/30 p-1.5 rounded transition-colors group">
                                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>{bookedCount} / {capacity}</span>
                                        <span className={occupancy >= 90 ? 'text-destructive' : occupancy >= 60 ? 'text-amber-600' : 'text-primary'}>
                                          {Math.round(occupancy)}%
                                        </span>
                                      </div>
                                      <Progress 
                                        value={occupancy} 
                                        className={`h-1.5 [&>div]:transition-all
                                          ${occupancy >= 90 ? '[&>div]:bg-destructive' : occupancy >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-primary'}
                                        `}
                                      />
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Attendees - {session.title}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                      {session.bookings && session.bookings.length > 0 ? (
                                        <div className="space-y-3">
                                          {session.bookings.map((booking: any) => (
                                            <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                              <div className="flex flex-col">
                                                <span className="text-sm font-bold">
                                                  {booking.profiles?.first_name} {booking.profiles?.last_name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {booking.profiles?.email}
                                                </span>
                                              </div>
                                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px] capitalize">
                                                {booking.status}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-6 text-muted-foreground text-sm">
                                          No clients have booked this session yet.
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs flex items-center gap-1 max-w-[120px] truncate">
                                  <MapPinIcon className="h-3 w-3 text-muted-foreground" /> {session.location || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell className="font-black text-primary">€{session.price || '0.00'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(session)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => { if(confirm("Delete this session?")) deleteMutation.mutate(session.id) }}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="calendar" className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                    <div className="border rounded-lg p-2 bg-card h-fit">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg border-b pb-2 flex items-center justify-between">
                         {selectedDate ? format(selectedDate, "EEEE, MMMM do") : "Select a day"}
                         <Badge variant="outline">{daySessions?.length || 0} Sessions</Badge>
                      </h3>
                      
                      {daySessions && daySessions.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {daySessions.map((session: any) => {
                             const bookedCount = session.bookings?.filter((b: any) => b.status !== 'cancelled').length || 0;
                             const capacity = session.max_slots || 1;
                             const occupancy = (bookedCount / capacity) * 100;
                             
                             return (
                               <div key={session.id} className="border rounded-xl p-4 bg-card/50 flex flex-col gap-3 hover:shadow-md transition-all relative group">
                                 <div className="flex justify-between items-start">
                                   <div className="flex flex-col">
                                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                                        <ClockIcon className="h-3 w-3" />
                                        {format(new Date(session.start_date), "HH:mm")}
                                      </span>
                                      <h4 className="font-bold text-base leading-tight mt-1 line-clamp-2">{session.title}</h4>
                                   </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(session)}>
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if(confirm("Delete this?")) deleteMutation.mutate(session.id) }}>
                                        <Trash className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPinIcon className="h-3 w-3" />
                                    {session.location || "No Location"}
                                 </div>

                                 <div className="mt-auto pt-3 border-t space-y-2">
                                   <Dialog>
                                      <DialogTrigger asChild>
                                        <div className="space-y-1.5 cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors">
                                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            <span>Occupancy: {bookedCount} / {capacity}</span>
                                            <span className={occupancy >= 90 ? 'text-destructive' : occupancy >= 60 ? 'text-amber-600' : 'text-primary'}>
                                              {Math.round(occupancy)}%
                                            </span>
                                          </div>
                                          <Progress value={occupancy} className={`h-1 ${occupancy >= 90 ? '[&>div]:bg-destructive' : occupancy >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-primary'}`} />
                                        </div>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Attendees - {session.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-2 py-4">
                                          {session.bookings?.map((b: any) => (
                                            <div key={b.id} className="flex justify-between items-center p-2 rounded bg-muted/30 text-sm">
                                              <span>{b.profiles?.first_name} {b.profiles?.last_name}</span>
                                              <Badge className="text-[10px]">{b.status}</Badge>
                                            </div>
                                          ))}
                                          {(!session.bookings || session.bookings.length === 0) && <p className="text-center text-muted-foreground text-sm">No bookings yet.</p>}
                                        </div>
                                      </DialogContent>
                                   </Dialog>
                                   <div className="flex justify-between items-center">
                                      <span className="text-sm font-black text-primary">€{session.price}</span>
                                      {!session.is_active && <Badge variant="secondary" className="text-[9px]">Inactive</Badge>}
                                   </div>
                                 </div>
                               </div>
                             );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
                           <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                           </div>
                           <p className="text-muted-foreground">No sessions scheduled for this day.</p>
                           <Button variant="outline" size="sm" className="mt-4" onClick={() => { setIsAdding(true); setFormData({ ...initialForm, start_date: format(selectedDate || startOfToday(), "yyyy-MM-dd") + "T09:00"}); }}>
                             <Plus className="h-3 w-3 mr-2" /> Schedule Here
                           </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
