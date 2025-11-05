import { useState, useEffect } from 'react';
import { db } from '../db';
import { useAuth } from '../auth-context';
import { useSettings } from './useSettings';

export function useDailyReward() {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkCanClaim = async () => {
    if (!currentUser?.id) return;

    const lastClaim = await db.dailyRewardClaims
      .where('userId')
      .equals(currentUser.id)
      .reverse()
      .sortBy('claimedAt');

    if (lastClaim.length > 0) {
      const lastClaimDate = lastClaim[0].claimedAt;
      setLastClaimTime(lastClaimDate);

      const now = new Date();
      const hoursSinceLastClaim = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
      setCanClaim(hoursSinceLastClaim >= 24);
    } else {
      setLastClaimTime(null);
      setCanClaim(true);
    }

    setIsLoading(false);
  };

  const claimReward = async () => {
    if (!currentUser?.id || !settings || !canClaim) return;

    const user = await db.users.get(currentUser.id);
    if (!user) return;

    await db.users.update(currentUser.id, {
      coinBalance: user.coinBalance + settings.dailyRewardAmount,
    });

    await db.dailyRewardClaims.add({
      userId: currentUser.id,
      amount: settings.dailyRewardAmount,
      claimedAt: new Date(),
    });

    await db.transactions.add({
      userId: currentUser.id,
      type: 'daily_reward',
      amount: settings.dailyRewardAmount,
      description: 'Daily reward claimed',
      createdAt: new Date(),
    });

    await checkCanClaim();
  };

  useEffect(() => {
    checkCanClaim();
    const interval = setInterval(checkCanClaim, 1000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  return {
    canClaim,
    lastClaimTime,
    isLoading,
    claimReward,
  };
}
