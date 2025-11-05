import { useState, useEffect } from 'react';
import { db, type User } from '../db';

export interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  pkrBalance: number;
  coinBalance: number;
  referralCode: string;
  referredBy: string | null;
  isAdmin: boolean;
  createdAt: Date;
  totalDeposit: number;
  totalWithdrawal: number;
  referrals: number;
  joinDate: Date;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUsers = async () => {
    const allUsers = await db.users.filter(u => !u.isAdmin).toArray();

    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const deposits = await db.deposits
          .where('userId')
          .equals(user.id!)
          .and(d => d.status === 'approved')
          .toArray();

        const withdrawals = await db.withdrawals
          .where('userId')
          .equals(user.id!)
          .and(w => w.status === 'approved')
          .toArray();

        const referrals = await db.users
          .where('referredBy')
          .equals(user.referralCode)
          .count();

        return {
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
          pkrBalance: user.pkrBalance,
          coinBalance: user.coinBalance,
          referralCode: user.referralCode,
          referredBy: user.referredBy || null,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          totalDeposit: deposits.reduce((sum, d) => sum + d.amount, 0),
          totalWithdrawal: withdrawals.reduce((sum, w) => sum + w.amount, 0),
          referrals,
          joinDate: user.createdAt,
        };
      })
    );

    setUsers(usersWithStats);
    setIsLoading(false);
  };

  const updateUserBalance = async (userId: number, pkrDelta: number, coinDelta: number) => {
    const user = await db.users.get(userId);
    if (!user) return;

    await db.users.update(userId, {
      pkrBalance: user.pkrBalance + pkrDelta,
      coinBalance: user.coinBalance + coinDelta,
    });

    if (pkrDelta !== 0) {
      await db.transactions.add({
        userId,
        type: pkrDelta > 0 ? 'deposit' : 'withdrawal',
        amount: Math.abs(pkrDelta),
        description: `Admin ${pkrDelta > 0 ? 'credit' : 'debit'} of PKR`,
        createdAt: new Date(),
      });
    }

    if (coinDelta !== 0) {
      await db.transactions.add({
        userId,
        type: 'daily_reward',
        amount: Math.abs(coinDelta),
        description: `Admin ${coinDelta > 0 ? 'credit' : 'debit'} of coins`,
        createdAt: new Date(),
      });
    }

    await refreshUsers();
  };

  const deleteUser = async (userId: number) => {
    await db.users.delete(userId);
    await db.deposits.where('userId').equals(userId).delete();
    await db.withdrawals.where('userId').equals(userId).delete();
    await db.userPlans.where('userId').equals(userId).delete();
    await db.transactions.where('userId').equals(userId).delete();
    await db.dailyRewardClaims.where('userId').equals(userId).delete();
    await db.spinResults.where('userId').equals(userId).delete();
    await refreshUsers();
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  return {
    users,
    isLoading,
    updateUserBalance,
    deleteUser,
    refreshUsers,
  };
}
