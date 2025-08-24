import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Upload, Database, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnifiedStats } from "@/hooks/useUnifiedStats";
import { useProfile } from "@/hooks/useProfile";
import { useJournalLocal } from "@/hooks/useJournalLocal";
import { useSupabaseRewards } from "@/hooks/useSupabaseRewards";
import { useAchievements } from "@/hooks/useAchievements";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

const ExportData = () => {
  const { stats } = useUnifiedStats();
  const { profile, userExp } = useProfile();
  const { entries, exportEntries, importEntries } = useJournalLocal();
  const { purchases } = useSupabaseRewards();
  const { userAchievements } = useAchievements();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportAllData = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: profile,
      stats: {
        totalExp: stats?.total_exp || 0,
        currentLevel: stats?.current_level || 0,
        lunarCrystals: stats?.lunar_crystals || 0,
      },
      journal: {
        entries,
        stats: entries ? {
          totalEntries: entries.length,
          totalWords: entries.reduce((sum, entry) => sum + entry.word_count, 0)
        } : null
      },
      achievements: userAchievements,
      rewards: {
        purchases: purchases
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `millionaire-den-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your data has been exported successfully!",
    });
  };

  const exportJournalOnly = () => {
    const jsonString = exportEntries();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Journal Exported",
      description: "Your journal entries have been exported!",
    });
  };

  const handleImportJournal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importEntries(content);
        if (success) {
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to read the import file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-16 safe-area-inset-top">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient">Export Data</h1>
        </div>

        {/* Data Overview */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Your Data Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats?.current_level || 0}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats?.total_exp || 0}</div>
                <div className="text-sm text-muted-foreground">Total EXP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats?.lunar_crystals || 0}</div>
                <div className="text-sm text-muted-foreground">Crystals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{entries?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Journal Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Complete Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Export all your data including profile, stats, achievements, and rewards history from the backend database.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>Profile</Badge>
                <Badge>Stats & Levels</Badge>
                <Badge>Achievements</Badge>
                <Badge>Rewards</Badge>
                <Badge>Journal Entries</Badge>
              </div>
              <Button onClick={exportAllData} className="gradient-primary w-full">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Journal Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-4">
                  Export only your journal entries (stored locally on your device).
                </p>
                <Button onClick={exportJournalOnly} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Journal Only
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-muted-foreground mb-4">
                  Import journal entries from a previously exported file.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportJournal}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  variant="outline" 
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Journal
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-amber-200/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300">Data Storage Info</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Backend Data:</strong> Profile, stats, achievements, and rewards are stored in Supabase and synced across devices.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Local Data:</strong> Journal entries are stored on your device for privacy and can be exported/imported separately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportData;