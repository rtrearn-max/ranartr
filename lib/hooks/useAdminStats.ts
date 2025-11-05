import { useState, useEffect } from 'react';
import { db } from '../db';

export interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  adminProfit: number;
  totalReferralPayouts: number;
  totalCoinsBought: number;
  totalCoinsEarned: number;
  totalPlansSold: number;
  totalUserProfit: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    adminProfit: 0,
    totalReferralPayouts: 0,
    totalCoinsBought: 0,
    totalCoinsEarned: 0,
    totalPlansSold: 0,
    totalUserProfit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = async () => {
    const users = await db.users.filter(u => !u.isAdmin).toArray();
    
    const approvedDeposits = await db.deposits
      .filter(d => d.status === 'approved')
      .toArray();
    
    const approvedWithdrawals = await db.withdrawals
      .filter(w => w.status === 'approved')
      .toArray();

    const referralTransactions = await db.transactions
      .where('type')
      .equals('referral_commission')
      .toArray();

    const profitTransactions = await db.transactions
      .where('type')
      .equals('plan_profit')
      .toArray();

    const dailyRewards = await db.dailyRewardClaims.toArray();
    const spinResults = await db.spinResults.toArray();
    const plansPurchased = await db.userPlans.toArray();

    const totalDeposits = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);
    const totalWithdrawals = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const totalReferralPayouts = referralTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalUserProfit = profitTransactions.reduce((sum, t) => sum + t.amount, 0);

    setStats({
      totalUsers: users.length,
      totalDeposits,
      totalWithdrawals,
      adminProfit: totalDeposits - totalWithdrawals - totalReferralPayouts,
      totalReferralPayouts,
      totalCoinsBought: 0,
      totalCoinsEarned: dailyRewards.reduce((sum, r) => sum + r.amount, 0) + 
                        spinResults.reduce((sum, s) => sum + s.amount, 0),
      totalPlansSold: plansPurchased.length,
      totalUserProfit,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return {
    stats,
    isLoading,
    refreshStats,
  };
}
