
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Edit,
  Settings
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHabits } from "@/hooks/useHabits";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useNotifications } from "@/hooks/useNotifications";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { useUnifiedStats } from "@/hooks/useUnifiedStats";
import { ProfileStats } from "@/components/ProfileStats";
import { ProfileTabs } from "@/components/ProfileTabs";

const Profile = () => {
  const { habits, completeHabit, addHabit, deleteHabit, getHabitStats } = useHabits();
  const { progressStats, loading: progressLoading } = useProgressTracking();
  const { checkDailyProgress } = useNotifications();
  const { profile, loading: profileLoading } = useProfile();
  const { stats: unifiedStats, getLevelInfo } = useUnifiedStats();
  const { userAchievements, getAchievementProgress } = useAchievements();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", description: "", color: "bg-blue-500", goal: "daily" as const });

  const stats = getHabitStats();
  const achievementProgress = getAchievementProgress(stats);
  const levelInfo = getLevelInfo();

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;
    await addHabit(newHabit);
    setNewHabit({ name: "", description: "", color: "bg-blue-500", goal: "daily" });
    setShowAddHabit(false);
  };

  const handleCompleteHabit = async (habitId: string) => {
    await completeHabit(habitId);
    await checkDailyProgress();
  };

  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"];

  const profileStats = {
    longestStreak: stats.longestStreak,
    completionRate: stats.completionRate,
    totalHabits: habits.length,
    level: levelInfo.level || 0,
    totalExp: unifiedStats?.total_exp || 0,
    lunarCrystals: unifiedStats?.lunar_crystals || 0,
    diamonds: unifiedStats?.diamonds || 0
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-16 safe-area-inset-top">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gradient animate-slideInUp">Profile</h1>
          <Link to="/settings">
            <Button variant="outline" size="sm" className="hover-glow">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Enhanced User Profile Card */}
        <Card className="card-elegant p-6 mb-6 animate-fadeInScale">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 animate-glowPulse ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl">
                {profile?.display_name?.[0] || profile?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {profile?.display_name || profile?.email?.split('@')[0] || 'User'}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg text-primary font-semibold">
                  Level {levelInfo.level || 0}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-blue-400 font-medium">
                  {unifiedStats?.lunar_crystals || 0} Crystals
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-amber-400 font-medium">
                  {unifiedStats?.diamonds || 0} Diamonds
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
            <Link to="/profile-edit">
              <Button variant="outline" size="sm" className="hover-glow">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Profile Stats Component */}
        {!progressLoading && (
          <ProfileStats 
            stats={profileStats}
            levelInfo={levelInfo}
            progressStats={progressStats}
          />
        )}
      </div>

      <div className="px-4 -mt-4">
        {/* Profile Tabs Component */}
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          habits={habits}
          userAchievements={userAchievements}
          achievementProgress={achievementProgress}
          progressStats={progressStats}
          showAddHabit={showAddHabit}
          setShowAddHabit={setShowAddHabit}
          newHabit={newHabit}
          setNewHabit={setNewHabit}
          handleAddHabit={handleAddHabit}
          handleCompleteHabit={handleCompleteHabit}
          deleteHabit={deleteHabit}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default Profile;
