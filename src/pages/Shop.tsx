import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, AlertTriangle, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEXPSystem } from "@/hooks/useEXPSystem";
import { useLunarCrystals } from "@/hooks/useLunarCrystals";
import { LunarCrystalLogo } from "@/components/LunarCrystalLogo";

const Shop = () => {
  const { 
    crystals, 
    rewards, 
    purchaseReward,
    getLevelInfo,
    resetPurchasedRewards,
    earnCrystals
  } = useLunarCrystals();
  
  const { totalEXP, removeEXP, getLevelInfo: getEXPLevelInfo } = useEXPSystem();
  const [expToConvert, setExpToConvert] = useState(100);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentLevel = getLevelInfo();
  const expToLunarCrystalRate = 100; // 100 EXP = 1 Crystal
  const crystalsToGain = Math.floor(expToConvert / expToLunarCrystalRate);
  const newEXP = totalEXP - expToConvert;
  const newLevel = getEXPLevelInfo(newEXP);
  const willLevelDown = newLevel.level < currentLevel.level;

  const handleConversion = () => {
    if (totalEXP >= expToConvert) {
      removeEXP(expToConvert, 'EXP to Lunar Crystals conversion');
      earnCrystals(crystalsToGain, `Converted ${expToConvert} EXP`);
      setShowConfirmation(false);
      setExpToConvert(100);
    }
  };

  const conversionPackages = [
    { exp: 100, crystals: 1, popular: false },
    { exp: 500, crystals: 5, popular: false },
    { exp: 1000, crystals: 10, popular: true },
    { exp: 2500, crystals: 25, popular: false },
    { exp: 5000, crystals: 50, popular: false },
  ];

  const levelInfo = getLevelInfo();

  return (
    <div className="min-h-screen bg-background pt-14 pb-20 safe-area-inset-top">
      {/* Header */}
      <div className="gradient-hero px-4 pt-4 pb-6">
        <div className="text-center mb-6">
          <Link to="/rewards">
            <Button variant="ghost" size="sm" className="mb-4 text-foreground/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rewards
            </Button>
          </Link>
          
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center glow-effect">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Crystal Shop</h1>
          </div>
          <p className="text-muted-foreground text-lg">Convert your EXP into Lunar Crystals</p>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-elegant p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <LunarCrystalLogo size={18} />
              <span className="text-lg font-bold text-primary">{crystals}</span>
            </div>
            <p className="text-xs text-muted-foreground">Crystals</p>
          </Card>
          
          <Card className="card-elegant p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold text-primary">{totalEXP}</span>
            </div>
            <p className="text-xs text-muted-foreground">EXP</p>
          </Card>
          
          <Card className="card-elegant p-3 text-center">
            <p className="text-lg font-bold text-foreground">{levelInfo.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
        </div>
      </div>

      <div className="px-4 -mt-2">
        {/* EXP to Crystals Conversion */}
        <Card className="card-elegant p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Convert EXP to Crystals</h2>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Conversion Rate</span>
              <span className="text-sm text-primary">100 EXP = 1 Crystal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available EXP: {totalEXP}</span>
              <span className="text-sm text-muted-foreground">Max Crystals: {Math.floor(totalEXP / 100)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000].map((exp) => (
                <Button
                  key={exp}
                  variant="outline"
                  size="sm"
                  disabled={totalEXP < exp}
                  onClick={() => {
                    if (removeEXP(exp, 'EXP to Crystal conversion')) {
                      earnCrystals(Math.floor(exp / 100), 'EXP conversion');
                    }
                  }}
                  className="flex flex-col gap-1 h-auto p-2"
                >
                  <span className="text-xs">{exp} EXP</span>
                  <span className="text-xs font-bold text-primary">
                    {Math.floor(exp / 100)} <LunarCrystalLogo size={12} className="inline" />
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          {totalEXP < 100 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>Complete more habits and tasks to earn EXP!</span>
            </div>
          )}
        </Card>
        
        {/* Rewards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Available Rewards</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetPurchasedRewards}
            >
              Reset Used
            </Button>
          </div>
          
          <div className="space-y-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="card-elegant p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reward.purchased ? 'bg-green-500/20' : 'bg-primary/20'
                    }`}>
                      <span className="text-lg">{reward.purchased ? '✓' : '🎁'}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{reward.name}</h3>
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
                  {!reward.purchased ? (
                    <Button
                      size="sm"
                      onClick={() => purchaseReward(reward.id)}
                      disabled={crystals < reward.cost}
                      className="gradient-primary text-white"
                    >
                      {crystals < reward.cost ? 'Need More' : 'Buy'}
                    </Button>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                      Owned
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;