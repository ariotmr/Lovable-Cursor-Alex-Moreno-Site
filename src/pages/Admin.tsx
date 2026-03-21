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

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, description: "+12.5%", isPositive: true },
    { title: "Active Bookings", value: "856", icon: Activity, description: "24 new today", isPositive: true },
    { title: "Recent Revenue", value: "$45,231.89", icon: DollarSign, description: "+20.1%", isPositive: true },
    { title: "Cancellation Rate", value: "4.2%", icon: CreditCard, description: "-1.1%", isPositive: true },
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium">New booking for "HIIT Core"</p>
                        <p className="text-xs text-muted-foreground">client{i}@example.com • Mon, 10:00 AM</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{i}h ago</span>
                  </div>
                ))}
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
