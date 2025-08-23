import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gift, 
  ShoppingBag, 
  Sparkles, 
  Crown,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useLunarCrystals } from '@/hooks/useLunarCrystals';
import { LunarCrystalLogo } from '@/components/LunarCrystalLogo';
import { useToast } from '@/hooks/use-toast';

const Rewards = () => {
  const { 
    crystals, 
    rewards, 
    purchaseReward,
    getLevelInfo
  } = useLunarCrystals();
  
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const levelInfo = getLevelInfo();

  const categories = [
    { id: 'all', name: 'All', icon: Gift },
    { id: 'entertainment', name: 'Fun', icon: Sparkles },
    { id: 'food', name: 'Food', icon: Gift },
    { id: 'wellness', name: 'Wellness', icon: Crown },
    { id: 'experiences', name: 'Experiences', icon: ShoppingBag },
  ];

  const filteredRewards = activeCategory === 'all' 
    ? rewards 
    : rewards.filter(r => r.category === activeCategory);

  const availableRewards = filteredRewards.filter(r => !r.purchased);
  const purchasedRewards = filteredRewards.filter(r => r.purchased);

  const handlePurchase = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (crystals < reward.cost) {
      toast({
        title: "Not enough Lunar Crystals",
        description: `You need ${reward.cost - crystals} more crystals to purchase this reward.`,
        variant: "destructive",
      });
      return;
    }

    if (purchaseReward(rewardId)) {
      toast({
        title: "Reward Purchased!",
        description: `You've unlocked: ${reward.name}. Enjoy your reward! 🎉`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <div className="px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Rewards Store</h1>
          </div>
          <p className="text-muted-foreground">Spend your Lunar Crystals on awesome rewards</p>
        </div>

        {/* Crystal Balance & Level */}
        <Card className="card-elegant p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <LunarCrystalLogo size={32} className="animate-pulse-glow" />
              <div>
                <h2 className="text-2xl font-bold text-primary">{crystals}</h2>
                <p className="text-sm text-muted-foreground">Lunar Crystals</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-foreground">{levelInfo.title}</h3>
              <p className="text-sm text-muted-foreground">Level {levelInfo.level}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to next level</span>
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

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(({ id, name, icon: Icon }) => (
            <Button
              key={id}
              variant={activeCategory === id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(id)}
              className="flex-shrink-0"
            >
              <Icon className="w-4 h-4 mr-2" />
              {name}
            </Button>
          ))}
        </div>

        {/* Available Rewards */}
        {availableRewards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Available Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRewards.map((reward) => (
                <Card key={reward.id} className="card-interactive p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Gift className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reward.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LunarCrystalLogo size={18} />
                      <span className="font-bold text-primary">{reward.cost}</span>
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(reward.id)}
                      disabled={crystals < reward.cost}
                      className={crystals >= reward.cost ? "gradient-primary text-white" : ""}
                    >
                      {crystals >= reward.cost ? (
                        <>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Purchase
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Need {reward.cost - crystals} more
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Purchased Rewards */}
        {purchasedRewards.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Purchased Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedRewards.map((reward) => (
                <Card key={reward.id} className="card-elegant p-4 opacity-75">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      Owned
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LunarCrystalLogo size={18} />
                      <span className="font-bold text-muted-foreground line-through">{reward.cost}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Purchased {reward.purchasedAt ? new Date(reward.purchasedAt).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredRewards.length === 0 && (
          <Card className="card-elegant p-8 text-center">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No rewards available</h3>
            <p className="text-muted-foreground">Check back later or adjust your category filter.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Rewards;