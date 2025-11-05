import { useState, useEffect } from 'react';
import { db, type Deposit, type Withdrawal, type CoinPurchase, type User } from '../db';
import { useDeposits } from './useDeposits';
import { useWithdrawals } from './useWithdrawals';
import { useCoinPurchases } from './useCoinPurchases';
import { useSettings } from './useSettings';

export interface RequestWithUser {
  id: number;
  userId: number;
  userName: string;
  type: 'deposit' | 'withdrawal' | 'coin_purchase';
  amount: number;
  method: string;
  details: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export function useAdminRequests() {
  const [requests, setRequests] = useState<RequestWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { approveDeposit: approveDepositHook, rejectDeposit: rejectDepositHook } = useDeposits();
  const { approveWithdrawal: approveWithdrawalHook, rejectWithdrawal: rejectWithdrawalHook } = useWithdrawals();
  const { approveCoinPurchase: approveCoinPurchaseHook, rejectCoinPurchase: rejectCoinPurchaseHook } = useCoinPurchases();

  const refreshRequests = async () => {
    const deposits = await db.deposits.toArray();
    const withdrawals = await db.withdrawals.toArray();
    const coinPurchases = await db.coinPurchases.toArray();

    const depositRequests = await Promise.all(
      deposits.map(async (d) => {
        const user = await db.users.get(d.userId);
        return {
          id: d.id!,
          userId: d.userId,
          userName: user?.name || 'Unknown',
          type: 'deposit' as const,
          amount: d.amount,
          method: d.method,
          details: `Transaction ID: ${d.transactionId}`,
          date: d.createdAt,
          status: d.status,
        };
      })
    );

    const withdrawalRequests = await Promise.all(
      withdrawals.map(async (w) => {
        const user = await db.users.get(w.userId);
        return {
          id: w.id!,
          userId: w.userId,
          userName: user?.name || 'Unknown',
          type: 'withdrawal' as const,
          amount: w.amount,
          method: w.method,
          details: w.accountDetails,
          date: w.createdAt,
          status: w.status,
        };
      })
    );

    const coinPurchaseRequests = await Promise.all(
      coinPurchases.map(async (c) => {
        const user = await db.users.get(c.userId);
        return {
          id: c.id!,
          userId: c.userId,
          userName: user?.name || 'Unknown',
          type: 'coin_purchase' as const,
          amount: c.coinAmount,
          method: c.method,
          details: `₨${c.pkrAmount} for ${c.coinAmount} coins | Transaction ID: ${c.transactionId}`,
          date: c.createdAt,
          status: c.status,
        };
      })
    );

    const allRequests = [...depositRequests, ...withdrawalRequests, ...coinPurchaseRequests]
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    setRequests(allRequests);
    setIsLoading(false);
  };

  const approveRequest = async (id: number, type: 'deposit' | 'withdrawal' | 'coin_purchase') => {
    if (type === 'deposit') {
      await approveDepositHook(id);
    } else if (type === 'withdrawal') {
      await approveWithdrawalHook(id);
    } else if (type === 'coin_purchase') {
      await approveCoinPurchaseHook(id);
    }
    await refreshRequests();
  };

  const rejectRequest = async (id: number, type: 'deposit' | 'withdrawal' | 'coin_purchase') => {
    if (type === 'deposit') {
      await rejectDepositHook(id);
    } else if (type === 'withdrawal') {
      await rejectWithdrawalHook(id);
    } else if (type === 'coin_purchase') {
      await rejectCoinPurchaseHook(id);
    }
    await refreshRequests();
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  return {
    requests,
    isLoading,
    approveRequest,
    rejectRequest,
    refreshRequests,
  };
}
