import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SessionTypeManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "", description: "", base_price: "", category_id: "" });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: sessionTypes, isLoading } = useQuery({
    queryKey: ['session_types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('session_types').select(`*, category:categories(name)`).order('name');
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('session_types').insert([payload]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_types'] });
      setIsAdding(false);
      resetForm();
      toast({ title: "Session Template added", description: "The template was successfully created." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('session_types').update(payload).eq('id', editingId).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_types'] });
      setEditingId(null);
      resetForm();
      toast({ title: "Template updated", description: "The template was successfully updated." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('session_types').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_types'] });
      toast({ title: "Template deleted", description: "The template was successfully removed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const resetForm = () => setFormData({ name: "", description: "", base_price: "", category_id: "" });

  const handleSave = () => {
    const payload = { ...formData, base_price: parseFloat(formData.base_price) || 0 };
    if (!payload.name || !payload.category_id) {
      toast({ title: "Missing fields", description: "Name and Category are required.", variant: "destructive" });
      return;
    }
    if (editingId) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  const startEdit = (type: any) => {
    setEditingId(type.id);
    setIsAdding(false);
    setFormData({ name: type.name, description: type.description || "", base_price: type.base_price.toString(), category_id: type.category_id });
  };

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Session Templates</CardTitle>
        {!isAdding && !editingId && (
          <Button size="sm" onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Template
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
            <h4 className="font-semibold">{editingId ? 'Edit Template' : 'New Template'}</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Template Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <Select value={formData.category_id} onValueChange={(val) => setFormData({ ...formData, category_id: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input type="number" placeholder="Base Price" className="md:col-span-1" value={formData.base_price} onChange={e => setFormData({ ...formData, base_price: e.target.value })} />
              <Input placeholder="Description (optional)" className="md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading templates...</p>
        ) : sessionTypes && sessionTypes.length > 0 ? (
          <ul className="space-y-2">
            {sessionTypes.map((type: any) => (
              <li key={type.id} className="flex justify-between items-center border p-3 rounded-lg">
                  <div>
                    <span className="font-medium block">{type.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Category: {type.category?.name || 'N/A'} • Price: ${type.base_price}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(type)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { if(confirm("Are you sure?")) deleteMutation.mutate(type.id) }}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No templates found. Create your first one!</p>
        )}
      </CardContent>
    </Card>
  );
};
