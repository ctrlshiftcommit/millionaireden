
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useResetStats } from '@/hooks/useResetStats';

interface ResetStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResetStatsDialog: React.FC<ResetStatsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [resetCrystals, setResetCrystals] = useState(false);
  const { resetStats, isResetting } = useResetStats();

  const handleConfirm = async () => {
    await resetStats(resetCrystals);
    onOpenChange(false);
    setResetCrystals(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setResetCrystals(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Reset All Stats
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-2">
            <p>
              Are you sure you want to reset your stats? This action cannot be undone and will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Reset your EXP to 0</li>
              <li>Reset your level to 0</li>
              <li>Clear all habit completions</li>
              <li>Clear all achievements</li>
              <li>Clear level history</li>
              <li>Clear reward purchases</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reset-crystals"
              checked={resetCrystals}
              onCheckedChange={setResetCrystals}
            />
            <label
              htmlFor="reset-crystals"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Also reset Lunar Crystals
            </label>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1"
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Confirm Reset'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
