import { useState, useEffect } from 'react';
import { db, type Withdrawal } from '../db';
import { useAuth } from '../auth-context';

export function useWithdrawals() {
  const { currentUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWithdrawals = async () => {
    if (!currentUser?.id) return;

    const userWithdrawals = await db.withdrawals
      .where('userId')
      .equals(currentUser.id)
      .reverse()
      .sortBy('createdAt');
    
    setWithdrawals(userWithdrawals);
    setIsLoading(false);
  };

  const createWithdrawal = async (data: {
    amount: number;
    method: string;
    accountDetails: string;
  }) => {
    if (!currentUser?.id) return;

    const user = await db.users.get(currentUser.id);
    if (!user || user.pkrBalance < data.amount) {
      throw new Error('Insufficient balance');
    }

    const withdrawalId = await db.withdrawals.add({
      userId: currentUser.id,
      amount: data.amount,
      method: data.method,
      accountDetails: data.accountDetails,
      status: 'pending',
      createdAt: new Date(),
    });

    await refreshWithdrawals();
    return withdrawalId;
  };

  const approveWithdrawal = async (withdrawalId: number) => {
    const withdrawal = await db.withdrawals.get(withdrawalId);
    if (!withdrawal || withdrawal.status !== 'pending') return;

    const user = await db.users.get(withdrawal.userId);
    if (!user || user.pkrBalance < withdrawal.amount) {
      throw new Error('Insufficient balance');
    }

    await db.users.update(withdrawal.userId, {
      pkrBalance: user.pkrBalance - withdrawal.amount,
    });

    await db.withdrawals.update(withdrawalId, {
      status: 'approved',
      processedAt: new Date(),
    });

    await db.transactions.add({
      userId: withdrawal.userId,
      type: 'withdrawal',
      amount: withdrawal.amount,
      description: `Withdrawal via ${withdrawal.method}`,
      createdAt: new Date(),
    });

    await refreshWithdrawals();
  };

  const rejectWithdrawal = async (withdrawalId: number) => {
    await db.withdrawals.update(withdrawalId, {
      status: 'rejected',
      processedAt: new Date(),
    });

    await refreshWithdrawals();
  };

  useEffect(() => {
    refreshWithdrawals();
  }, [currentUser?.id]);

  return {
    withdrawals,
    isLoading,
    createWithdrawal,
    approveWithdrawal,
    rejectWithdrawal,
    refreshWithdrawals,
  };
}
