import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Loader2, User, Mail, Save, Shield, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarSrc(url);
    } catch (error) {
      console.error("Error downloading image: ", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data, error } = await supabase
            .from("profiles")
            .select("first_name, last_name, email, role, avatar_url")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            setProfile(data);
            setFirstName(data.first_name || "");
            if (data.avatar_url) {
              downloadImage(data.avatar_url);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const filePath = `${session.user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', session.user.id);

      if (updateError) throw updateError;
      
      setProfile(prev => prev ? ({ ...prev, avatar_url: filePath }) : null);
      downloadImage(filePath);
      toast.success("Profile picture updated successfully!");

    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const { error } = await supabase
        .from('profiles')
        .update({ first_name: firstName })
        .eq('id', session.user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? ({ ...prev, first_name: firstName }) : null);
      toast.success("Profile details saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error saving profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 mt-24">
        <Skeleton className="h-[400px] w-full max-w-2xl rounded-xl bg-card" />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6 md:p-12 mt-16 min-h-screen bg-background text-foreground">
      <div className="w-full max-w-2xl space-y-8">
        
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ml-3">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-2 border-border/50">
              <AvatarImage src={avatarSrc} className="object-cover" />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex items-center justify-center p-2 bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 shadow-md"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-primary-foreground" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {profile?.first_name || "User"}
            </h1>
            <p className="text-muted-foreground">{profile?.email || "No email available"}</p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase flex items-center gap-1.5 text-xs">
                <Shield className="w-3 h-3" />
                {profile?.role || "User"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Form Details Card */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Profile Details</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Manage your personal information and account settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/90">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/30 rounded-lg h-11"
                  placeholder="Enter your first name" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/90">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile?.email || ""} 
                  disabled
                  className="pl-10 bg-background/50 border-border/50 opacity-70 rounded-lg h-11"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed currently.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pb-6">
            <Button 
              onClick={handleSaveProfile} 
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 rounded-lg flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
