import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, AlertTriangle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEXPSystem } from "@/hooks/useEXPSystem";
import { useLunarCrystals } from "@/hooks/useLunarCrystals";
import { LunarCrystalLogo } from "@/components/LunarCrystalLogo";

const Shop = () => {
  const { totalEXP, getLevelInfo, removeEXP } = useEXPSystem();
  const { crystals, settings, earnCrystals } = useLunarCrystals();
  const [expToConvert, setExpToConvert] = useState(100);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentLevel = getLevelInfo();
  const crystalsToGain = Math.floor(expToConvert / settings.expToLunarCrystalRate);
  const newEXP = totalEXP - expToConvert;
  const newLevel = getLevelInfo(newEXP);
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
      </div>

      <div className="px-4 -mt-4">
        {/* Current Status */}
        <Card className="card-elegant p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalEXP.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Available EXP</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <LunarCrystalLogo size={20} />
                <span className="text-2xl font-bold text-primary">{crystals}</span>
              </div>
              <p className="text-sm text-muted-foreground">Lunar Crystals</p>
            </div>
          </div>

          <div className="text-center">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {currentLevel.title} - Level {currentLevel.level}
            </Badge>
          </div>
        </Card>

        {/* Conversion Rate Info */}
        <Card className="card-elegant p-4 mb-6 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Exchange Rate</p>
                <p className="text-sm text-muted-foreground">
                  {settings.expToLunarCrystalRate} EXP = 1 Lunar Crystal
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Conversion Packages */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Quick Conversion Packages</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {conversionPackages.map((pkg) => (
              <Card 
                key={pkg.exp} 
                className={`card-interactive p-4 ${pkg.popular ? 'border-primary/50' : ''}`}
                onClick={() => setExpToConvert(pkg.exp)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-bold text-foreground">{pkg.exp}</p>
                      <p className="text-xs text-muted-foreground">EXP</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      <LunarCrystalLogo size={16} />
                      <span className="font-bold text-primary">{pkg.crystals}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pkg.popular && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        Popular
                      </Badge>
                    )}
                    <Button 
                      size="sm"
                      disabled={totalEXP < pkg.exp}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpToConvert(pkg.exp);
                        setShowConfirmation(true);
                      }}
                    >
                      Convert
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Conversion */}
        <Card className="card-elegant p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Custom Conversion</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                EXP to Convert (max: {totalEXP.toLocaleString()})
              </label>
              <Input
                type="number"
                min="1"
                max={totalEXP}
                value={expToConvert}
                onChange={(e) => setExpToConvert(Math.min(totalEXP, Math.max(1, parseInt(e.target.value) || 0)))}
                className="text-center text-lg"
              />
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <LunarCrystalLogo size={24} />
                <span className="text-2xl font-bold text-primary">{crystalsToGain}</span>
              </div>
              <p className="text-sm text-muted-foreground">Lunar Crystals</p>
            </div>

            {willLevelDown && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <p className="text-sm font-medium text-destructive">Level Down Warning</p>
                </div>
                <p className="text-sm text-destructive/80">
                  This conversion will reduce your level from {currentLevel.level} ({currentLevel.title}) 
                  to {newLevel.level} ({newLevel.title})
                </p>
              </div>
            )}

            <Button 
              onClick={() => setShowConfirmation(true)}
              disabled={expToConvert <= 0 || totalEXP < expToConvert}
              className="w-full gradient-primary text-white"
            >
              Convert {expToConvert} EXP → {crystalsToGain} Crystals
            </Button>
          </div>
        </Card>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="card-elegant p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Conversion</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EXP to spend:</span>
                  <span className="font-medium text-foreground">{expToConvert}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crystals to gain:</span>
                  <div className="flex items-center gap-1">
                    <LunarCrystalLogo size={16} />
                    <span className="font-medium text-primary">{crystalsToGain}</span>
                  </div>
                </div>
                {willLevelDown && (
                  <div className="flex justify-between text-destructive">
                    <span>Level change:</span>
                    <span className="font-medium">
                      {currentLevel.level} → {newLevel.level}
                    </span>
                  </div>
                )}
              </div>

              {willLevelDown && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-destructive">
                    ⚠️ This action will reduce your level and cannot be undone.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConversion}
                  className="flex-1 gradient-primary text-white"
                >
                  Confirm
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;