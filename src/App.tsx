import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Motivation from "./pages/Motivation";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Rewards from "./pages/Rewards";
import LevelHistory from "./pages/LevelHistory";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import { useLunarCrystalIntegration } from "@/hooks/useLunarCrystalIntegration";
import { useEXPIntegration } from "@/hooks/useEXPIntegration";

const queryClient = new QueryClient();

function App() {
  useLunarCrystalIntegration();
  useEXPIntegration();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/motivation" element={<Motivation />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/level-history" element={<LevelHistory />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNav />
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
