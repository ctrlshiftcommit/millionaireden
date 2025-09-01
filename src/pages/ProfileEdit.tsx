
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const ProfileEdit = () => {
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    email: profile?.email || '',
    phone_number: profile?.phone_number || ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || ''
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const success = await updateProfile(formData);
    if (success) {
      // Profile updated successfully
    }
    
    setSaving(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-16 safe-area-inset-top">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient">Edit Profile</h1>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-2 ring-primary/20">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      {profile?.display_name?.[0] || profile?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-white" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {uploading ? 'Uploading...' : 'Click camera icon to change avatar'}
                  <br />
                  <span className="text-xs">Max 5MB • JPG, PNG, GIF</span>
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      display_name: e.target.value
                    }))}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    placeholder="Enter your email"
                  />
                  <p className="text-xs text-muted-foreground">
                    Changing email requires verification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      phone_number: e.target.value
                    }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary"
                disabled={saving || uploading}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEdit;
