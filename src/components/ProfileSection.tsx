import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, Camera } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { toast } from 'sonner';

export function ProfileSection({ userHandle, userEmail }: { userHandle: string, userEmail: string }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open]);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.user_metadata) {
      setFullName(user.user_metadata.full_name || '');
      setMobile(user.user_metadata.mobile || user.user_metadata.phone || '');
      setAvatarUrl(user.user_metadata.avatar_url || '');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, mobile: mobile, avatar_url: avatarUrl }
      });
      if (error) throw error;
      toast.success('Profile updated successfully');
      setOpen(false);
    } catch (e: any) {
      toast.error('Failed to update profile: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      toast.info('Uploading photo...');
      
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload to Supabase Storage (assuming a bucket named 'avatars' exists, else fallback to base64 for demo)
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // Fallback to base64 if bucket doesn't exist
        const reader = new FileReader();
        reader.onloadend = async () => {
          setAvatarUrl(reader.result as string);
          await supabase.auth.updateUser({ data: { avatar_url: reader.result } });
          toast.success('Photo updated (saved locally to profile)');
          setLoading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(publicUrl);
      
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      toast.success('Photo updated successfully');
    } catch (e: any) {
      toast.error('Error uploading photo: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--line)] border border-[var(--line)] px-2 py-1 rounded-full select-none transition-colors">
          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border border-[var(--line)]">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-[var(--secondary)] text-white text-[10px]">{userHandle.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[120px]">{fullName || userHandle}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[var(--surface)] border-[var(--line)] text-[var(--ink)]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-24 w-24 border-2 border-[var(--secondary)] cursor-pointer">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-[var(--secondary)] text-white text-2xl">
                {fullName ? fullName.charAt(0).toUpperCase() : userHandle.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white h-6 w-6 mb-1" />
              <span className="text-white text-[10px] font-medium">Upload</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
          </div>

          <div className="w-full space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                value={userEmail} 
                disabled 
                className="bg-[var(--surface)] border-[var(--line)] text-[var(--muted)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name" 
                className="bg-[var(--surface)] border-[var(--line)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input 
                id="mobile" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number" 
                className="bg-[var(--surface)] border-[var(--line)]"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full mt-4 bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
