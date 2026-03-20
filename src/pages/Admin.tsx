import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, description: "+12.5% from last month" },
    { title: "Active Bookings", value: "856", icon: Activity, description: "24 new today" },
    { title: "Recent Revenue", value: "$45,231.89", icon: DollarSign, description: "+20.1% from last month" },
    { title: "Engagement Rate", value: "78.4%", icon: CreditCard, description: "+4% from last week" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
          <Button>Export Data</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-secondary pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-primary/20" />
                    <div>
                      <p className="text-sm font-medium">New user sign up</p>
                      <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{i}h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-primary/10">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span>Server Status</span>
                  <span className="text-green-500 font-medium font-inter">99.9%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[99.9%]" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span>API Response Time</span>
                  <span className="text-primary font-medium font-inter">120ms</span>
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
  );
};

export default AdminDashboard;
