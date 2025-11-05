import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyRewardProps {
  rewardAmount: number;
  enabled: boolean;
  lastClaimTime?: Date;
  onClaim?: () => void;
}

export default function DailyReward({ rewardAmount, enabled, lastClaimTime, onClaim }: DailyRewardProps) {
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      if (!lastClaimTime) {
        setCanClaim(true);
        return;
      }

      const nextClaimTime = new Date(lastClaimTime);
      nextClaimTime.setHours(nextClaimTime.getHours() + 24);
      const now = new Date();
      const diff = nextClaimTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCanClaim(true);
        setTimeUntilNext('');
      } else {
        setCanClaim(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastClaimTime]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Daily Reward
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: canClaim ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: canClaim ? Infinity : 0, duration: 2 }}
            className="inline-block"
          >
            <div className="text-5xl font-bold font-mono text-primary">
              {rewardAmount}
            </div>
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2">Coins per day</p>
        </div>

        {!canClaim && timeUntilNext && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Next claim in: {timeUntilNext}</span>
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={!enabled || !canClaim}
          onClick={onClaim}
          data-testid="button-claim-daily-reward"
        >
          {!enabled ? 'Temporarily Disabled' : canClaim ? 'Claim Reward' : 'Come Back Later'}
        </Button>
      </CardContent>
    </Card>
  );
}
