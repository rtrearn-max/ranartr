import { useState, useEffect } from 'react';
import { db, type User, type Transaction } from '../db';
import { useAuth } from '../auth-context';

export interface UserStats {
  totalDeposit: number;
  totalWithdrawal: number;
  totalProfit: number;
  totalInvested: number;
  totalReferrals: number;
  totalReferralEarnings: number;
}

export function useUserData() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalDeposit: 0,
    totalWithdrawal: 0,
    totalProfit: 0,
    totalInvested: 0,
    totalReferrals: 0,
    totalReferralEarnings: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }

    const userData = await db.users.get(currentUser.id);
    if (userData) {
      setUser(userData);
    }

    const userTransactions = await db.transactions
      .where('userId')
      .equals(currentUser.id)
      .reverse()
      .sortBy('createdAt');
    
    setTransactions(userTransactions);

    const approvedDeposits = await db.deposits
      .where('userId')
      .equals(currentUser.id)
      .and(d => d.status === 'approved')
      .toArray();
    
    const approvedWithdrawals = await db.withdrawals
      .where('userId')
      .equals(currentUser.id)
      .and(w => w.status === 'approved')
      .toArray();

    const userPlans = await db.userPlans
      .where('userId')
      .equals(currentUser.id)
      .toArray();

    const referrals = await db.users
      .where('referredBy')
      .equals(userData?.referralCode || '')
      .toArray();

    const referralTransactions = await db.transactions
      .where('userId')
      .equals(currentUser.id)
      .and(t => t.type === 'referral_commission')
      .toArray();

    const profitTransactions = await db.transactions
      .where('userId')
      .equals(currentUser.id)
      .and(t => t.type === 'plan_profit')
      .toArray();

    const totalInvested = await Promise.all(
      userPlans.map(async (up) => {
        const plan = await db.plans.get(up.planId);
        return plan?.price || 0;
      })
    ).then(prices => prices.reduce((sum, price) => sum + price, 0));

    setStats({
      totalDeposit: approvedDeposits.reduce((sum, d) => sum + d.amount, 0),
      totalWithdrawal: approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      totalProfit: profitTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalInvested,
      totalReferrals: referrals.length,
      totalReferralEarnings: referralTransactions.reduce((sum, t) => sum + t.amount, 0),
    });

    setIsLoading(false);
  };

  useEffect(() => {
    refreshUserData();
  }, [currentUser?.id]);

  return {
    user,
    stats,
    transactions,
    isLoading,
    refreshUserData,
  };
}
