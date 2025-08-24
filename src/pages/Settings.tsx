import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Gift, 
  Crown,
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Gem,
  Download,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useLunarCrystals } from '@/hooks/useLunarCrystals';
import { useEXPSystem } from '@/hooks/useEXPSystem';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { useResetStats } from '@/hooks/useResetStats';
import { LunarCrystalLogo } from '@/components/LunarCrystalLogo';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

const Settings = () => {
  const { 
    crystals, 
    rewards, 
    settings, 
    addReward, 
    updateReward, 
    deleteReward, 
    updateSettings,
    getLevelInfo,
    resetPurchasedRewards
  } = useLunarCrystals();
  
  const { 
    totalEXP, 
    expTransactions,
    levelHistory,
    getLevelInfo: getEXPLevelInfo
  } = useEXPSystem();
  
  const { habits, getHabitStats } = useHabits();
  const { user, signOut } = useAuth();
  const { resetStats, isResetting } = useResetStats();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    cost: 50,
    icon: 'Gift',
    category: 'entertainment' as const
  });
  const [showAddReward, setShowAddReward] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.user_metadata?.display_name || 'Millionaire Den User',
    email: user?.email || 'user@example.com',
    avatar: user?.user_metadata?.avatar_url || '',
  });
  const [resetCrystals, setResetCrystals] = useState(true);

  const handleExportData = () => {
    try {
      const expLevel = getEXPLevelInfo();
      const habitStats = getHabitStats();
      const currentDate = new Date().toISOString();
      
      // Level definitions
      const levelDefinitions = [
        { id: 1, name: "Peasant", req_exp: 1000, image: "assets/levels/1.png" },
        { id: 2, name: "Servant", req_exp: 5000, image: "assets/levels/2.png" },
        { id: 3, name: "Merchant", req_exp: 10000, image: "assets/levels/3.png" },
        { id: 4, name: "Noble", req_exp: 20000, image: "assets/levels/4.png" },
        { id: 5, name: "Baron", req_exp: 40000, image: "assets/levels/5.png" },
        { id: 6, name: "Earl", req_exp: 80000, image: "assets/levels/6.png" },
        { id: 7, name: "Duke", req_exp: 160000, image: "assets/levels/7.png" },
        { id: 8, name: "Prince", req_exp: 320000, image: "assets/levels/8.png" },
        { id: 9, name: "King", req_exp: 640000, image: "assets/levels/9.png" },
        { id: 10, name: "Emperor", req_exp: 1000000, image: "assets/levels/10.png" }
      ];

      const exportData = `# APP_EXPORT v2
exported_at: ${currentDate}

## user
name: ${userProfile.name}
level: ${expLevel.level}
exp_current: ${totalEXP}
lunar_crystals: ${crystals}

---

## levels
${levelDefinitions.map(level => `- id: ${level.id}
  name: ${level.name}
  req_exp: ${level.req_exp}
  image: ${level.image}`).join('\n')}

---

## rewards
${rewards.map(reward => `- id: ${reward.id}
  name: ${reward.name}
  price_crystals: ${reward.cost}
  enabled: true`).join('\n')}

---

## reward_history
# No reward purchase history available

---

## tasks
${habits.map(habit => `- id: ${habit.id}
  title: ${habit.name}
  points_exp: 200
  color: "${habit.color}"
  schedule: ${habit.goal}
  history:
${habit.completedDates.map(date => `    - date: ${date}
      status: done`).join('\n')}`).join('\n')}

---

## conversions_exp_to_crystals
${expTransactions
  .filter(tx => tx.type === 'conversion_loss')
  .map(tx => `- ts: ${tx.timestamp}
  exp_spent: ${Math.abs(tx.amount)}
  crystals_gained: ${Math.floor(Math.abs(tx.amount) / 100)}`).join('\n')}

---

## analytics
weekly_success_rate: ${habitStats.completionRate}%
monthly_success_rate: ${habitStats.completionRate}%
all_time_success_rate: ${habitStats.completionRate}%

---

## logs
${[
  ...expTransactions.map(tx => `- ts: ${tx.timestamp}
  type: ${tx.type === 'task_completed' || tx.type === 'habit_completed' ? 'exp_gained' : 'exp_spent'}
  ${tx.type === 'task_completed' || tx.type === 'habit_completed' ? 'exp_gained' : 'exp_spent'}: ${Math.abs(tx.amount)}
  source: ${tx.source || 'Unknown'}
  description: ${tx.description}`),
  
  ...levelHistory.map(lh => `- ts: ${lh.timestamp}
  type: level_up
  old_level: ${lh.oldLevel}
  new_level: ${lh.newLevel}
  exp_required: ${lh.expAtLevelUp}
  exp_at_levelup: ${lh.expAtLevelUp}`)
].slice(0, 20).join('\n\n')}`;

      // Create and download the file
      const blob = new Blob([exportData], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `millionaire_den_export_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful!",
        description: "Your account data has been exported to a markdown file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const levelInfo = getLevelInfo();

  const handleSaveReward = () => {
    if (newReward.name.trim()) {
      addReward(newReward);
      setNewReward({
        name: '',
        description: '',
        cost: 50,
        icon: 'Gift',
        category: 'entertainment'
      });
      setShowAddReward(false);
    }
  };

  const rewardIcons = ['Gift', 'Play', 'Coffee', 'Film', 'Cookie', 'Waves', 'GameController2', 'Music'];
  const rewardCategories = ['entertainment', 'food', 'wellness', 'experiences', 'items'];

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <div className="px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">Customize your Millionaire Den experience</p>
        </div>

        {/* Level & Crystals Overview */}
        <Card className="card-elegant p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{levelInfo.title}</h2>
                <p className="text-sm text-muted-foreground">Level {levelInfo.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LunarCrystalLogo size={24} />
              <span className="text-xl font-bold text-primary">{crystals}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to {levelInfo.level < 10 ? `Level ${levelInfo.level + 1}` : 'Max Level'}</span>
              <span className="text-primary font-medium">
                {crystals} / {levelInfo.nextLevelPoints}
              </span>
            </div>
            <Progress 
              value={Math.min(100, ((crystals - levelInfo.pointsRequired) / (levelInfo.nextLevelPoints - levelInfo.pointsRequired)) * 100)} 
              className="h-3" 
            />
          </div>
        </Card>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs">Rewards</TabsTrigger>
            <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
            <TabsTrigger value="account" className="text-xs">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="card-elegant p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Profile Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Manage Rewards</h3>
              <Button 
                size="sm" 
                onClick={() => setShowAddReward(true)}
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Reward
              </Button>
            </div>

            {/* Add Reward Form */}
            {showAddReward && (
              <Card className="card-elegant p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Reward name..."
                    value={newReward.name}
                    onChange={(e) => setNewReward(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Description..."
                    value={newReward.description}
                    onChange={(e) => setNewReward(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Cost (Lunar Crystals)</Label>
                      <Input
                        type="number"
                        value={newReward.cost}
                        onChange={(e) => setNewReward(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select 
                        className="w-full mt-1 p-2 rounded-md bg-input border border-border"
                        value={newReward.category}
                        onChange={(e) => setNewReward(prev => ({ ...prev, category: e.target.value as any }))}
                      >
                        {rewardCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveReward} size="sm">Save</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddReward(false)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Rewards List */}
            <div className="space-y-3">
              {rewards.map((reward) => (
                <Card key={reward.id} className="card-elegant p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Gem className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <LunarCrystalLogo size={16} />
                          <span className="text-sm font-medium text-primary">{reward.cost}</span>
                          <Badge variant="outline" className="text-xs">
                            {reward.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteReward(reward.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={resetPurchasedRewards}
              className="w-full"
            >
              Reset All Purchased Rewards
            </Button>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card className="card-elegant p-4">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Export Account Data</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Export all your account data including habits, rewards, transactions, and progress history in markdown format.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Export includes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• User profile and current stats</li>
                    <li>• Level definitions and progress</li>
                    <li>• Custom rewards and purchase history</li>
                    <li>• Habits and completion data</li>
                    <li>• EXP transactions and conversions</li>
                    <li>• Analytics and success rates</li>
                    <li>• Complete activity logs</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleExportData}
                  className="w-full gradient-primary text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Account Data
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card className="card-elegant p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Account Management</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Signed in as</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        disabled={isResetting}
                        variant="destructive" 
                        className="w-full mb-3"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                        {isResetting ? 'Resetting...' : 'Reset All Stats'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset all stats?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently reset your progress, habits, EXP, levels, and history. Do you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="flex items-center justify-between p-3 rounded-md border">
                          <div>
                            <p className="font-medium text-foreground">Download your data</p>
                            <p className="text-sm text-muted-foreground">Export a full backup before resetting.</p>
                          </div>
                          <Button onClick={handleExportData} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id="reset-crystals"
                            checked={resetCrystals}
                            onCheckedChange={(v) => setResetCrystals(Boolean(v))}
                          />
                          <Label htmlFor="reset-crystals">Also reset Lunar Crystals to 0</Label>
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => resetStats(resetCrystals)}
                        >
                          Reset Now
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;