import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  Sun,
  Moon,
  Volume2,
  Trash2,
  Download,
  RotateCcw,
  Settings as SettingsIcon,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUnifiedStats } from "@/hooks/useUnifiedStats";
import { useTheme } from "@/hooks/useTheme";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { ResetStatsDialog } from "@/components/ResetStatsDialog";
import { Link } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { stats } = useUnifiedStats();
  const { theme, setTheme } = useTheme();
  const { playClick } = useSoundEffects();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (setting: string, value: boolean) => {
    playClick();
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value,
    }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    playClick();
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="px-4">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        {/* User Info */}
        <Card className="card-elegant p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Level</span>
              <Badge className="bg-primary/20 text-primary">{stats?.current_level || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total EXP</span>
              <span className="text-foreground">{stats?.total_exp?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </Card>

        {/* App Settings */}
        <Card className="card-elegant p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive habit reminders</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun className="w-4 h-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-foreground">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">Play sounds for actions</p>
                </div>
              </div>
              <Switch
                checked={settings.sounds}
                onCheckedChange={(checked) => handleSettingChange('sounds', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="card-elegant p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Data Management</h2>
          <div className="space-y-3">
            <Link to="/export-data">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Data
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
              onClick={() => setResetDialogOpen(true)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All Stats
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="card-elegant p-6 border-destructive/20">
          <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <Button 
              variant="destructive" 
              onClick={signOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </Card>

        <ResetStatsDialog 
          open={resetDialogOpen} 
          onOpenChange={setResetDialogOpen} 
        />
      </div>
    </div>
  );
};

export default Settings;
