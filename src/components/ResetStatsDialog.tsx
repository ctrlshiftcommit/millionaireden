
import { useState } from 'react';
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
import { Label } from "@/components/ui/label";
import { useResetStats } from "@/hooks/useResetStats";

interface ResetStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResetStatsDialog = ({ open, onOpenChange }: ResetStatsDialogProps) => {
  const [resetCrystals, setResetCrystals] = useState(false);
  const { resetStats, isResetting } = useResetStats();

  const handleReset = async () => {
    const success = await resetStats(resetCrystals);
    if (success) {
      onOpenChange(false);
      setResetCrystals(false);
    }
  };

  const handleCheckedChange = (checked: boolean) => {
    setResetCrystals(checked);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="card-elegant border-destructive/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            ⚠️ Reset All Stats
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to reset your stats? This action cannot be undone and will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Reset your EXP to 0</li>
              <li>Reset your level to 0</li>
              <li>Reset diamonds to 0</li>
              <li>Clear all habit completions</li>
              <li>Clear level history</li>
              <li>Clear achievements</li>
              <li>Clear reward purchases</li>
            </ul>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="reset-crystals"
                checked={resetCrystals}
                onCheckedChange={handleCheckedChange}
              />
              <Label htmlFor="reset-crystals" className="text-sm">
                Also reset Lunar Crystals
              </Label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isResetting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={isResetting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isResetting ? 'Resetting...' : 'Confirm Reset'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
