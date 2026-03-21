import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CategoryManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from('categories').insert([{ name }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAdding(false);
      setNewCategoryName("");
      toast({ title: "Category added", description: "The new category was successfully created." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      toast({ title: "Category updated", description: "The category was successfully updated." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Category deleted", description: "The category was successfully removed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const handleCreate = () => {
    if (newCategoryName.trim()) createMutation.mutate(newCategoryName.trim());
  };

  const handleUpdate = (id: string) => {
    if (editedName.trim()) updateMutation.mutate({ id, name: editedName.trim() });
  };

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Categories</CardTitle>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="flex items-center gap-2 border p-3 rounded-lg bg-muted/20">
            <Input 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              placeholder="e.g. Boxing, Yoga..."
              autoFocus
            />
            <Button size="icon" onClick={handleCreate} disabled={createMutation.isPending || !newCategoryName.trim()}>
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading categories...</p>
        ) : categories && categories.length > 0 ? (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id} className="flex justify-between items-center border p-3 rounded-lg">
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 w-full mr-2">
                    <Input 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)}
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleUpdate(cat.id)} disabled={updateMutation.isPending || !editedName.trim()}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{cat.name}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingId(cat.id); setEditedName(cat.name); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { if(confirm("Are you sure?")) deleteMutation.mutate(cat.id) }}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No categories found. Create your first one!</p>
        )}
      </CardContent>
    </Card>
  );
};
