import { useState } from 'react';
import { Menu, Bell, Settings, X, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LunarCrystalLogo } from './LunarCrystalLogo';
import { useLunarCrystals } from '@/hooks/useLunarCrystals';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { crystals, getLevelInfo } = useLunarCrystals();
  const levelInfo = getLevelInfo();

  const notifications = [
    { id: 1, message: "Don't forget to complete your morning workout!", time: "2 hours ago", read: false },
    { id: 2, message: "Great job! You're on a 7-day streak!", time: "1 day ago", read: true },
    { id: 3, message: "New achievement unlocked: Week Warrior", time: "1 day ago", read: false },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border safe-area-inset-top">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Menu Button */}
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-primary/10 min-w-[44px] min-h-[44px] flex sm:flex"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Lunar Crystals Display */}
          <div className="flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full">
            <LunarCrystalLogo size={20} />
            <span className="text-sm font-bold text-primary">{crystals}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="hover:bg-primary/10 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <Card className="absolute right-0 top-12 w-80 max-w-[90vw] card-elegant p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read 
                          ? 'bg-muted/30 border-border/30' 
                          : 'bg-primary/5 border-primary/20'
                      }`}
                    >
                      <p className="text-sm text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </header>

      {/* Burger Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <Card className="fixed top-14 left-4 right-4 card-elegant p-6 z-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Level Info */}
            <div className="glass-effect p-4 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{levelInfo.level}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{levelInfo.title}</h3>
                  <p className="text-sm text-muted-foreground">Level {levelInfo.level}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to next level</span>
                  <span className="text-primary font-medium">
                    {crystals} / {levelInfo.nextLevelPoints}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((crystals - levelInfo.pointsRequired) / (levelInfo.nextLevelPoints - levelInfo.pointsRequired)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-primary/10"
                asChild
              >
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-primary/10"
                asChild
              >
                <Link to="/level-history" onClick={() => setIsMenuOpen(false)}>
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Progress & History
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-primary/10"
                asChild
              >
                <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                  <Settings className="w-5 h-5 mr-3" />
                  Settings & Rewards
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  // Navigate to notifications settings
                }}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notification Settings
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};