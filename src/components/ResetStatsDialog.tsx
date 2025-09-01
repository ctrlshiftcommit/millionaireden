
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useResetStats } from "@/hooks/useResetStats";

interface ResetStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResetStatsDialog: React.FC<ResetStatsDialogProps> = ({ open, onOpenChange }) => {
  const [resetLunarCrystals, setResetLunarCrystals] = useState(false);
  const { resetStats, isResetting } = useResetStats();

  const handleReset = async () => {
    await resetStats();
    onOpenChange(false);
    setResetLunarCrystals(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Reset All Stats
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset your stats? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reset-crystals"
              checked={resetLunarCrystals}
              onCheckedChange={(checked) => setResetLunarCrystals(checked as boolean)}
            />
            <label
              htmlFor="reset-crystals"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Also reset Lunar Crystals
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {resetLunarCrystals 
              ? "All stats including Lunar Crystals will be reset to zero."
              : "EXP and level will be reset, but Lunar Crystals will be kept."
            }
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={isResetting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isResetting ? "Resetting..." : "Confirm Reset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
