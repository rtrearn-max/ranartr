import { useState, useEffect } from 'react';
import { db } from '../db';
import { useAuth } from '../auth-context';
import { useSettings } from './useSettings';

export function useSpinWheel() {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const [spinsToday, setSpinsToday] = useState(0);
  const [canSpin, setCanSpin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkCanSpin = async () => {
    if (!currentUser?.id) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySpins = await db.spinResults
      .where('userId')
      .equals(currentUser.id)
      .and(spin => spin.spunAt >= today)
      .count();

    setSpinsToday(todaySpins);
    setCanSpin(todaySpins < 1);
    setIsLoading(false);
  };

  const spin = async () => {
    if (!currentUser?.id || !settings || !canSpin) return null;

    const values = settings.spinWheelValues;
    const wonAmount = values[Math.floor(Math.random() * values.length)];

    const user = await db.users.get(currentUser.id);
    if (!user) return null;

    await db.users.update(currentUser.id, {
      coinBalance: user.coinBalance + wonAmount,
    });

    await db.spinResults.add({
      userId: currentUser.id,
      amount: wonAmount,
      spunAt: new Date(),
    });

    await db.transactions.add({
      userId: currentUser.id,
      type: 'spin_wheel',
      amount: wonAmount,
      description: `Won ${wonAmount} coins from spin wheel`,
      createdAt: new Date(),
    });

    await checkCanSpin();
    return wonAmount;
  };

  useEffect(() => {
    checkCanSpin();
  }, [currentUser?.id]);

  return {
    canSpin,
    spinsToday,
    isLoading,
    spin,
    values: settings?.spinWheelValues || [],
  };
}
