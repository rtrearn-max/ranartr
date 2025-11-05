import { useState, useEffect } from 'react';
import { db, type Deposit, type User, type Transaction } from '../db';
import { useAuth } from '../auth-context';
import { useSettings } from './useSettings';

export function useDeposits() {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDeposits = async () => {
    if (!currentUser?.id) return;

    const userDeposits = await db.deposits
      .where('userId')
      .equals(currentUser.id)
      .reverse()
      .sortBy('createdAt');
    
    setDeposits(userDeposits);
    setIsLoading(false);
  };

  const createDeposit = async (data: {
    amount: number;
    method: string;
    transactionId: string;
    screenshot: File | null;
  }) => {
    if (!currentUser?.id) return;

    const screenshotBase64 = data.screenshot ? await fileToBase64(data.screenshot) : '';

    const depositId = await db.deposits.add({
      userId: currentUser.id,
      amount: data.amount,
      method: data.method,
      transactionId: data.transactionId,
      screenshot: screenshotBase64,
      status: 'pending',
      createdAt: new Date(),
    });

    await refreshDeposits();
    return depositId;
  };

  const approveDeposit = async (depositId: number) => {
    const deposit = await db.deposits.get(depositId);
    if (!deposit || deposit.status !== 'pending') return;

    const user = await db.users.get(deposit.userId);
    if (!user) return;

    const referralPercentage = settings?.referralPercentage || 50;

    let referralCommission = 0;
    let referrerId: number | undefined;

    if (user.referredBy) {
      const referrer = await db.users.where('referralCode').equals(user.referredBy).first();
      if (referrer && referrer.id) {
        const isFirstDeposit = await db.deposits
          .where('userId')
          .equals(deposit.userId)
          .and(d => d.status === 'approved')
          .count() === 0;

        if (isFirstDeposit) {
          referralCommission = (deposit.amount * referralPercentage) / 100;
          await db.users.update(referrer.id, {
            pkrBalance: referrer.pkrBalance + referralCommission,
          });

          await db.transactions.add({
            userId: referrer.id,
            type: 'referral_commission',
            amount: referralCommission,
            description: `Referral commission from ${user.name}`,
            createdAt: new Date(),
          });

          referrerId = referrer.id;
        }
      }
    }

    await db.users.update(deposit.userId, {
      pkrBalance: user.pkrBalance + deposit.amount,
    });

    await db.deposits.update(depositId, {
      status: 'approved',
      processedAt: new Date(),
    });

    await db.transactions.add({
      userId: deposit.userId,
      type: 'deposit',
      amount: deposit.amount,
      description: `Deposit via ${deposit.method}`,
      createdAt: new Date(),
    });

    await refreshDeposits();
  };

  const rejectDeposit = async (depositId: number) => {
    await db.deposits.update(depositId, {
      status: 'rejected',
      processedAt: new Date(),
    });

    await refreshDeposits();
  };

  useEffect(() => {
    refreshDeposits();
  }, [currentUser?.id]);

  return {
    deposits,
    isLoading,
    createDeposit,
    approveDeposit,
    rejectDeposit,
    refreshDeposits,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
