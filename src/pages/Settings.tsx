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
  Gem
} from 'lucide-react';
import { useLunarCrystals } from '@/hooks/useLunarCrystals';
import { LunarCrystalLogo } from '@/components/LunarCrystalLogo';

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
    name: 'Millionaire Den User',
    email: 'user@example.com',
    avatar: '',
  });

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
            <TabsTrigger value="points" className="text-xs">Points</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">Alerts</TabsTrigger>
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

          {/* Points Tab */}
          <TabsContent value="points" className="space-y-4">
            <Card className="card-elegant p-4">
              <div className="flex items-center gap-2 mb-4">
                <LunarCrystalLogo size={20} />
                <h3 className="font-semibold text-foreground">Lunar Crystal Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Crystals per completed task</Label>
                  <Input
                    type="number"
                    value={settings.crystalsPerTask}
                    onChange={(e) => updateSettings({ crystalsPerTask: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Crystals per completed habit</Label>
                  <Input
                    type="number"
                    value={settings.crystalsPerHabit}
                    onChange={(e) => updateSettings({ crystalsPerHabit: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Bonus crystals per streak day</Label>
                  <Input
                    type="number"
                    value={settings.crystalsPerStreak}
                    onChange={(e) => updateSettings({ crystalsPerStreak: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="card-elegant p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Notification Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Daily Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded to complete your habits</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Streak Alerts</p>
                    <p className="text-sm text-muted-foreground">Celebrate your achievements</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Reward Notifications</p>
                    <p className="text-sm text-muted-foreground">Know when you can buy rewards</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
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