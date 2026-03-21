import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Save, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const SessionManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const { data, error } = await supabase.from('sessions').select(`*, session_types(name)`).order('start_date', { ascending: false });
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
      type_id: formData.type_id || null,
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
  };

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Scheduled Events</CardTitle>
        {!isAdding && !editingId && (
          <Button size="sm" onClick={() => { setIsAdding(true); setFormData(initialForm); }} className="gap-2">
            <Plus className="h-4 w-4" /> Schedule Session
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <div className="space-y-4 border p-4 rounded-lg bg-muted/20 animate-in fade-in-50">
            <h4 className="font-semibold text-lg">{editingId ? 'Edit Session' : 'Schedule New Session'}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session Title</Label>
                <Input placeholder="e.g. Saturday Morning HIIT" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Template (Optional)</Label>
                <Select value={formData.type_id} onValueChange={(val) => setFormData({ ...formData, type_id: val })}>
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
                <Label>Custom Price ($)</Label>
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
        )}

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading schedule...</p>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <div key={session.id} className={`flex justify-between items-center border p-4 rounded-lg ${!session.is_active ? 'opacity-70 bg-muted/30' : ''}`}>
                <div className="flex gap-4 items-center">
                  {session.image_url ? (
                    <img src={session.image_url} alt={session.title} className="h-12 w-12 object-cover rounded-md border" />
                  ) : (
                    <div className="h-12 w-12 flex flex-col items-center justify-center bg-primary/10 rounded-md border border-primary/20 text-primary">
                      <span className="text-xs font-bold leading-none">{new Date(session.start_date).getDate()}</span>
                      <span className="text-[10px] uppercase leading-none mt-1">{new Date(session.start_date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {session.title} 
                      {!session.is_active && <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full uppercase">Inactive</span>}
                      {session.recurrence_rule && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase border border-blue-200">Repeats {session.recurrence_rule.frequency}</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.start_date).toLocaleString()} • {session.location || "No location set"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Template: {session.session_types?.name || 'Custom'} • Slots: {session.max_slots} • ${session.price || 'Default Price'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(session)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm("Delete this session?")) deleteMutation.mutate(session.id) }}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <h3 className="text-lg font-semibold">No Sessions Scheduled</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first class or availability block!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
