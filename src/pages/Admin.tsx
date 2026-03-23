import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, DollarSign, CalendarPlus, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [profiles, bookings] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('status, sessions(price)')
      ]);

      const totalUsers = profiles.count || 0;
      const activeBookings = bookings.data?.filter(b => b.status === 'confirmed' || b.status === 'pending').length || 0;
      const totalRevenue = bookings.data?.filter(b => b.status === 'confirmed').reduce((sum, b) => {
        const price = (b.sessions as any)?.price || 0;
        return sum + (Number(price) || 0);
      }, 0) || 0;
      const cancellationRate = bookings.data?.length ? ((bookings.data.filter(b => b.status === 'cancelled').length / bookings.data.length) * 100).toFixed(1) : "0";

      return {
        totalUsers,
        activeBookings,
        totalRevenue: `€${totalRevenue.toLocaleString()}`,
        cancellationRate: `${cancellationRate}%`
      };
    }
  });

  const { data: recentBookings, isLoading: isRecentLoading } = useQuery({
    queryKey: ['admin-recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bookings').select(`
        id, created_at, status, user_id,
        sessions(title, start_date),
        profiles(first_name, last_name, email)
      `).order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    }
  });

  const stats = [
    { title: "Total Clients", value: statsData?.totalUsers || "0", icon: Users, description: "Active members", isPositive: true },
    { title: "Active Bookings", value: statsData?.activeBookings || "0", icon: Activity, description: "Confirmed & Pending", isPositive: true },
    { title: "Confirmed Revenue", value: statsData?.totalRevenue || "€0", icon: DollarSign, description: "From paid sessions", isPositive: true },
    { title: "Cancellation Rate", value: statsData?.cancellationRate || "0%", icon: CreditCard, description: "Based on all time", isPositive: false },
  ];

  const breadcrumbs = (
    <>
      <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
      <span>/</span>
      <span className="text-foreground font-medium">Dashboard Overview</span>
    </>
  );

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 md:p-10 space-y-8 animate-fade-in max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Platform overview and management.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            <Button>Export Data</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border hover:border-primary/30 transition-all hover:shadow-md bg-background">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.description} <span className="text-muted-foreground font-normal">from last period</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="gap-2" variant="default">
              <Link to="/admin/sessions">
                <CalendarPlus className="h-4 w-4" />
                Add Session
              </Link>
            </Button>
            <Button asChild className="gap-2" variant="secondary">
              <Link to="/admin/clients">
                <UserPlus className="h-4 w-4" />
                Invite Client
              </Link>
            </Button>
            <Button asChild className="gap-2" variant="outline">
              <Link to="/admin/bookings">
                <FileText className="h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4 border-border bg-background">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity Overview</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/bookings">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isRecentLoading ? (
                  <p className="text-sm text-muted">Loading activity...</p>
                ) : recentBookings && recentBookings.length > 0 ? (
                  recentBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-sm font-medium">
                            {booking.profiles?.first_name} {booking.profiles?.last_name} booked "{booking.sessions?.title}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.profiles?.email} • {format(new Date(booking.sessions?.start_date), "MMM d, HH:mm")}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                         {booking.status.toUpperCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 italic">No recent activity found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-border bg-background">
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span>Server Status</span>
                    <span className="text-green-600 font-medium font-mono">99.9%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[99.9%]" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span className="text-primary font-medium font-mono">120ms</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
