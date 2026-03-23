import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";

export const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  return (
    <section id="categories" className="py-12 bg-muted/30 border-y border-border/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Training Categories
          </h2>
          <p className="text-muted-foreground mt-1">Explore our specialized coaching programs.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : (
            categories?.map((cat: any) => (
              <Card key={cat.id} className="group hover:border-primary/50 transition-all cursor-default overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
