import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, ShieldAlert, BadgeCheck, Search, ShieldBan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ClientManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => {
      const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({ title: "Role Updated", description: "The user's role has been updated successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const updateBanMutation = useMutation({
    mutationFn: async ({ id, is_banned }: { id: string, is_banned: boolean }) => {
      const payload = is_banned ? { is_banned: true, banned_at: new Date().toISOString() } : { is_banned: false, banned_at: null };
      const { data, error } = await supabase.from('profiles').update(payload).eq('id', id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({ title: "Status Updated", description: `The user has been ${data[0].is_banned ? 'banned' : 'unbanned'}.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const filteredProfiles = profiles?.filter((profile: any) => {
    const matchesRole = filterRole === "all" || profile.role === filterRole;
    const searchString = `${profile.first_name || ''} ${profile.last_name || ''} ${profile.email || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle>Client Directory</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="user">Users (Pending)</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading users...</p>
        ) : filteredProfiles && filteredProfiles.length > 0 ? (
          <div className="space-y-4">
            {filteredProfiles.map((profile: any) => (
              <div key={profile.id} className={`flex flex-col sm:flex-row justify-between sm:items-center border p-4 rounded-lg gap-4 ${profile.is_banned ? 'bg-destructive/10 border-destructive/20 opacity-75' : ''}`}>
                <div className="flex gap-4 items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || ''} />
                    <AvatarFallback>{profile.first_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {profile.first_name || 'Anonymous'} {profile.last_name || 'User'}
                      {profile.role === 'admin' && <ShieldAlert className="h-4 w-4 text-primary" />}
                      {profile.role === 'client' && <BadgeCheck className="h-4 w-4 text-green-600" />}
                      {profile.is_banned && <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full uppercase border border-red-200">Banned</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.email || 'No email provided'} • Joined {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Select value={profile.role} onValueChange={(val) => updateRoleMutation.mutate({ id: profile.id, role: val })}>
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={profile.is_banned ? "text-green-600 hover:text-green-700" : "text-destructive"} 
                    onClick={() => {
                        if (confirm(`Are you sure you want to ${profile.is_banned ? 'unban' : 'ban'} this user?`)) {
                            updateBanMutation.mutate({ id: profile.id, is_banned: !profile.is_banned })
                        }
                    }}
                    title={profile.is_banned ? "Unban User" : "Ban User"}
                  >
                    <ShieldBan className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <h3 className="text-lg font-semibold">No users found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
