import { AdminLayout } from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Edit, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SessionTypeManager } from "@/components/admin/SessionTypeManager";
import { SessionManager } from "@/components/admin/SessionManager";

export default function Sessions() {
  const breadcrumbs = (
    <>
      <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
      <span>/</span>
      <span className="text-foreground font-medium">Sessions & Categories</span>
    </>
  );

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sessions Management</h1>
            <p className="text-muted-foreground mt-1">Manage categories, session templates, and schedule events.</p>
          </div>
          <Button className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Schedule Session
          </Button>
        </header>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="schedule">Scheduled Sessions</TabsTrigger>
            <TabsTrigger value="types">Session Templates</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
             <SessionManager />
          </TabsContent>

          <TabsContent value="types" className="space-y-4 animate-in fade-in-50">
             <SessionTypeManager />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4 animate-in fade-in-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <CategoryManager />
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold">How Categories Work</h3>
                 <p className="text-sm text-muted-foreground">Categories are the highest-level grouping (e.g., "Cardiovascular", "Strength").</p>
                 <p className="text-sm text-muted-foreground">You assign Session Types (e.g., "HIIT Bootcamp") to a Category, which helps clients filter sessions.</p>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
