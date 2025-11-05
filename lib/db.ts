import Dexie, { type EntityTable } from 'dexie';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  referralCode: string;
  referredBy?: string;
  pkrBalance: number;
  coinBalance: number;
  createdAt: Date;
}

export interface Deposit {
  id?: number;
  userId: number;
  amount: number;
  method: string;
  transactionId: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
}

export interface Withdrawal {
  id?: number;
  userId: number;
  amount: number;
  method: string;
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
}

export interface Plan {
  id?: number;
  name: string;
  description: string;
  price: number;
  coinRequirement: number;
  duration: number;
  profitRate: number;
  isActive: boolean;
}

export interface UserPlan {
  id?: number;
  userId: number;
  planId: number;
  purchaseDate: Date;
  expiryDate: Date;
  totalProfit: number;
  profitClaimed: number;
}

export interface DailyRewardClaim {
  id?: number;
  userId: number;
  amount: number;
  claimedAt: Date;
}

export interface SpinResult {
  id?: number;
  userId: number;
  amount: number;
  spunAt: Date;
}

export interface SystemSettings {
  id?: number;
  coinRate: number;
  referralPercentage: number;
  dailyRewardAmount: number;
  dailyRewardEnabled: boolean;
  spinWheelEnabled: boolean;
  spinWheelValues: number[];
  minWithdrawal: number;
  maxWithdrawal: number;
  depositAccounts: {
    easypaisa: { name: string; number: string };
    sadapay: { name: string; number: string };
  };
}

export interface CoinPurchase {
  id?: number;
  userId: number;
  pkrAmount: number;
  coinAmount: number;
  method: string;
  transactionId: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
}

export interface Transaction {
  id?: number;
  userId: number;
  type: 'deposit' | 'withdrawal' | 'coin_purchase' | 'plan_purchase' | 'daily_reward' | 'spin_wheel' | 'referral_commission' | 'plan_profit';
  amount: number;
  description: string;
  createdAt: Date;
}

export interface PageTheme {
  id?: number;
  pageKey: string;
  imageData: string;
  updatedAt: Date;
}

export const PAGE_KEYS = {
  ADMIN_OVERVIEW: 'admin-overview',
  ADMIN_REQUESTS: 'admin-requests',
  ADMIN_USERS: 'admin-users',
  ADMIN_SETTINGS: 'admin-settings',
  USER_OVERVIEW: 'user-overview',
  USER_PLANS: 'user-plans',
  USER_DEPOSIT: 'user-deposit',
  USER_BUY_COINS: 'user-buy-coins',
  USER_WITHDRAW: 'user-withdraw',
  USER_DAILY_REWARD: 'user-daily-reward',
  USER_SPIN_WHEEL: 'user-spin-wheel',
  USER_REFERRALS: 'user-referrals',
} as const;

export type PageKey = typeof PAGE_KEYS[keyof typeof PAGE_KEYS];

const db = new Dexie('RTROfficialEarningsDB') as Dexie & {
  users: EntityTable<User, 'id'>;
  deposits: EntityTable<Deposit, 'id'>;
  withdrawals: EntityTable<Withdrawal, 'id'>;
  plans: EntityTable<Plan, 'id'>;
  userPlans: EntityTable<UserPlan, 'id'>;
  dailyRewardClaims: EntityTable<DailyRewardClaim, 'id'>;
  spinResults: EntityTable<SpinResult, 'id'>;
  systemSettings: EntityTable<SystemSettings, 'id'>;
  transactions: EntityTable<Transaction, 'id'>;
  coinPurchases: EntityTable<CoinPurchase, 'id'>;
  pageThemes: EntityTable<PageTheme, 'id'>;
};

db.version(1).stores({
  users: '++id, email, referralCode, referredBy',
  deposits: '++id, userId, status, createdAt',
  withdrawals: '++id, userId, status, createdAt',
  plans: '++id, isActive',
  userPlans: '++id, userId, planId, expiryDate',
  dailyRewardClaims: '++id, userId, claimedAt',
  spinResults: '++id, userId, spunAt',
  systemSettings: '++id',
  transactions: '++id, userId, type, createdAt',
});

db.version(2).stores({
  users: '++id, email, referralCode, referredBy',
  deposits: '++id, userId, status, createdAt',
  withdrawals: '++id, userId, status, createdAt',
  plans: '++id, isActive',
  userPlans: '++id, userId, planId, expiryDate',
  dailyRewardClaims: '++id, userId, claimedAt',
  spinResults: '++id, userId, spunAt',
  systemSettings: '++id',
  transactions: '++id, userId, type, createdAt',
});

db.version(3).stores({
  users: '++id, email, referralCode, referredBy',
  deposits: '++id, userId, status, createdAt',
  withdrawals: '++id, userId, status, createdAt',
  plans: '++id, isActive',
  userPlans: '++id, userId, planId, expiryDate',
  dailyRewardClaims: '++id, userId, claimedAt',
  spinResults: '++id, userId, spunAt',
  systemSettings: '++id',
  transactions: '++id, userId, type, createdAt',
  pageThemes: '++id, pageName',
  coinPurchases: '++id, userId, status, createdAt',
});

db.version(4).stores({
  users: '++id, email, referralCode, referredBy',
  deposits: '++id, userId, status, createdAt',
  withdrawals: '++id, userId, status, createdAt',
  plans: '++id, isActive',
  userPlans: '++id, userId, planId, expiryDate',
  dailyRewardClaims: '++id, userId, claimedAt',
  spinResults: '++id, userId, spunAt',
  systemSettings: '++id',
  transactions: '++id, userId, type, createdAt',
  pageThemes: null,
  coinPurchases: '++id, userId, status, createdAt',
});

db.version(5).stores({
  users: '++id, email, referralCode, referredBy',
  deposits: '++id, userId, status, createdAt',
  withdrawals: '++id, userId, status, createdAt',
  plans: '++id, isActive',
  userPlans: '++id, userId, planId, expiryDate',
  dailyRewardClaims: '++id, userId, claimedAt',
  spinResults: '++id, userId, spunAt',
  systemSettings: '++id',
  transactions: '++id, userId, type, createdAt',
  coinPurchases: '++id, userId, status, createdAt',
  pageThemes: '++id, pageKey, updatedAt',
});

export async function initializeDatabase() {
  const settingsCount = await db.systemSettings.count();
  
  if (settingsCount === 0) {
    await db.systemSettings.add({
      coinRate: 10,
      referralPercentage: 50,
      dailyRewardAmount: 100,
      dailyRewardEnabled: true,
      spinWheelEnabled: true,
      spinWheelValues: [50, 100, 150, 200, 250, 300, 500, 1000],
      minWithdrawal: 500,
      maxWithdrawal: 50000,
      depositAccounts: {
        easypaisa: { name: 'Muhammad Rizwan Tariq', number: '03325382626' },
        sadapay: { name: 'Muhammad Rizwan Tariq', number: '03325382626' },
      },
    });
  }

  const adminCount = await db.users.filter(user => user.isAdmin === true).count();
  
  if (adminCount === 0) {
    await db.users.add({
      email: 'ranarizwanlucky@gmail.com',
      password: 'Rana786@gmail.com',
      name: 'Admin',
      isAdmin: true,
      referralCode: 'ADMIN2024',
      pkrBalance: 0,
      coinBalance: 0,
      createdAt: new Date(),
    });
  }

  const planCount = await db.plans.count();
  
  if (planCount === 0) {
    await db.plans.bulkAdd([
      {
        name: 'Starter Plan',
        description: 'Perfect for beginners looking to start their earning journey',
        price: 1000,
        coinRequirement: 50,
        duration: 30,
        profitRate: 10,
        isActive: true,
      },
      {
        name: 'Growth Plan',
        description: 'Accelerate your earnings with better returns',
        price: 5000,
        coinRequirement: 200,
        duration: 45,
        profitRate: 15,
        isActive: true,
      },
      {
        name: 'Premium Plan',
        description: 'Maximum profits for serious investors',
        price: 10000,
        coinRequirement: 500,
        duration: 60,
        profitRate: 20,
        isActive: true,
      },
    ]);
  }
}

export { db };
