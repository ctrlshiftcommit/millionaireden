import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Gift,
  Trophy,
  Clock,
  CheckCircle,
  Calendar,
  Star,
  Filter,
  RefreshCw
} from "lucide-react";
import { useLunarCrystals } from "@/hooks/useLunarCrystals";
import { LunarCrystalLogo } from "@/components/LunarCrystalLogo";

const Rewards = () => {
  const { 
    crystals, 
    rewards, 
    purchaseReward,
    resetPurchasedRewards
  } = useLunarCrystals();

  const [filter, setFilter] = useState<'all' | 'available' | 'purchased'>('all');
  const [purchaseHistory, setPurchaseHistory] = useState<Array<{
    id: string;
    rewardId: string;
    rewardName: string;
    cost: number;
    purchasedAt: string;
    isUsed: boolean;
    usedAt?: string;
  }>>([]);

  const filteredRewards = rewards.filter(reward => {
    if (filter === 'available') return !reward.purchased;
    if (filter === 'purchased') return reward.purchased;
    return true;
  });

  const handlePurchase = (rewardId: string) => {
    const success = purchaseReward(rewardId);
    if (success) {
      const reward = rewards.find(r => r.id === rewardId);
      if (reward) {
        const purchase = {
          id: Date.now().toString(),
          rewardId,
          rewardName: reward.name,
          cost: reward.cost,
          purchasedAt: new Date().toISOString(),
          isUsed: false,
        };
        setPurchaseHistory(prev => [purchase, ...prev]);
      }
    }
  };

  const handleMarkAsUsed = (purchaseId: string) => {
    setPurchaseHistory(prev => 
      prev.map(purchase => 
        purchase.id === purchaseId 
          ? { ...purchase, isUsed: true, usedAt: new Date().toISOString() }
          : purchase
      )
    );
  };

  const availableRewards = rewards.filter(r => !r.purchased);
  const purchasedRewards = rewards.filter(r => r.purchased);

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
          </div>
          <p className="text-muted-foreground">Spend your Lunar Crystals on amazing rewards</p>
        </div>

        {/* Current Balance */}
        <Card className="card-elegant p-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <LunarCrystalLogo size={32} />
              <span className="text-3xl font-bold text-primary">{crystals}</span>
            </div>
            <p className="text-muted-foreground">Available Lunar Crystals</p>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Rewards
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('available')}
          >
            <Star className="w-4 h-4 mr-2" />
            Available ({availableRewards.length})
          </Button>
          <Button
            variant={filter === 'purchased' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('purchased')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            My Rewards ({purchasedRewards.length})
          </Button>
        </div>

        {/* Rewards Grid */}
        <div className="space-y-4 mb-8">
          {filteredRewards.length === 0 ? (
            <Card className="card-elegant p-8 text-center">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {filter === 'purchased' 
                  ? "No rewards purchased yet" 
                  : filter === 'available' 
                    ? "All rewards have been purchased!" 
                    : "No rewards available"
                }
              </p>
              <Button variant="outline" onClick={() => setFilter('all')}>
                View All Rewards
              </Button>
            </Card>
          ) : (
            filteredRewards.map((reward) => (
              <Card key={reward.id} className="card-elegant p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      reward.purchased ? 'bg-green-500/20' : 'bg-primary/20'
                    }`}>
                      {reward.purchased ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Gift className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{reward.name}</h3>
                        {reward.purchased && (
                          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                            Owned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <LunarCrystalLogo size={16} />
                          <span className="text-sm font-medium text-primary">{reward.cost}</span>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {reward.category}
                        </Badge>
                        
                        {reward.purchased && reward.purchasedAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(reward.purchasedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!reward.purchased ? (
                      <Button
                        size="sm"
                        onClick={() => handlePurchase(reward.id)}
                        disabled={crystals < reward.cost}
                        className="gradient-primary text-white"
                      >
                        {crystals < reward.cost ? 'Insufficient Crystals' : 'Purchase'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Used
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Purchase History */}
        {purchaseHistory.length > 0 && (
          <Card className="card-elegant p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Recent Purchases</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetPurchasedRewards}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
            
            <div className="space-y-3">
              {purchaseHistory.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{purchase.rewardName}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <LunarCrystalLogo size={12} />
                        <span>{purchase.cost}</span>
                      </div>
                      {purchase.isUsed && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">Used</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {!purchase.isUsed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsUsed(purchase.id)}
                    >
                      Mark as Used
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Rewards;