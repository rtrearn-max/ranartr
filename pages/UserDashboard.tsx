import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Wallet, TrendingUp, Gift, Users, LogOut, Sparkles, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useUserData } from '@/lib/hooks/useUserData';
import { useSettings } from '@/lib/hooks/useSettings';
import { useDeposits } from '@/lib/hooks/useDeposits';
import { useWithdrawals } from '@/lib/hooks/useWithdrawals';
import { usePlans } from '@/lib/hooks/usePlans';
import { useDailyReward } from '@/lib/hooks/useDailyReward';
import { useSpinWheel } from '@/lib/hooks/useSpinWheel';
import { useCoinPurchases } from '@/lib/hooks/useCoinPurchases';
import { useProfitCalculation } from '@/lib/hooks/useProfitCalculation';
import { useToast } from '@/hooks/use-toast';
import { PAGE_KEYS } from '@/lib/db';
import { PageBackground } from '@/components/PageBackground';
import StatCard from '@/components/StatCard';
import PlanCard from '@/components/PlanCard';
import DailyReward from '@/components/DailyReward';
import SpinWheel from '@/components/SpinWheel';
import DepositForm from '@/components/DepositForm';
import WithdrawalForm from '@/components/WithdrawalForm';
import CoinPurchaseForm from '@/components/CoinPurchaseForm';
import TransactionList from '@/components/TransactionList';
import ReferralStats from '@/components/ReferralStats';
import ActivePlans from '@/components/ActivePlans';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLocation] = useLocation();
  const { currentUser, logout } = useAuth();
  const { user, stats, transactions, refreshUserData } = useUserData();
  const { settings } = useSettings();
  const { createDeposit, refreshDeposits } = useDeposits();
  const { createWithdrawal, refreshWithdrawals } = useWithdrawals();
  const { plans, userPlans, purchasePlan, refreshPlans } = usePlans();
  const { canClaim, lastClaimTime, claimReward } = useDailyReward();
  const { canSpin, spin, values } = useSpinWheel();
  const { createCoinPurchase, refreshCoinPurchases } = useCoinPurchases();
  const { toast } = useToast();

  useProfitCalculation();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleDeposit = async (data: {
    amount: number;
    method: string;
    transactionId: string;
    screenshot: File | null;
  }) => {
    try {
      await createDeposit(data);
      toast({
        title: 'Deposit Request Submitted',
        description: 'Your deposit request has been submitted and is pending approval.',
      });
      await refreshUserData();
      await refreshDeposits();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit deposit request',
        variant: 'destructive',
      });
    }
  };

  const handleWithdrawal = async (data: {
    amount: number;
    method: string;
    accountDetails: string;
  }) => {
    try {
      await createWithdrawal(data);
      toast({
        title: 'Withdrawal Request Submitted',
        description: 'Your withdrawal request has been submitted and is pending approval.',
      });
      await refreshUserData();
      await refreshWithdrawals();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit withdrawal request',
        variant: 'destructive',
      });
    }
  };

  const handlePlanPurchase = async (planId: number) => {
    try {
      await purchasePlan(planId);
      toast({
        title: 'Plan Purchased',
        description: 'Your plan has been purchased successfully!',
      });
      await refreshUserData();
      await refreshPlans();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to purchase plan',
        variant: 'destructive',
      });
    }
  };

  const handleClaimReward = async () => {
    try {
      await claimReward();
      toast({
        title: 'Reward Claimed',
        description: `You received ${settings?.dailyRewardAmount} coins!`,
      });
      await refreshUserData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim reward',
        variant: 'destructive',
      });
    }
  };

  const handleSpin = async () => {
    try {
      const wonAmount = await spin();
      if (wonAmount !== null) {
        toast({
          title: 'Congratulations!',
          description: `You won ${wonAmount} coins!`,
        });
        await refreshUserData();
      }
      return wonAmount || 0;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to spin wheel',
        variant: 'destructive',
      });
      return 0;
    }
  };

  const handleCoinPurchase = async (data: {
    pkrAmount: number;
    method: string;
    transactionId: string;
    screenshot: File | null;
  }) => {
    try {
      await createCoinPurchase(data);
      toast({
        title: 'Purchase Request Submitted',
        description: 'Your coin purchase request has been submitted and is pending approval.',
      });
      await refreshUserData();
      await refreshCoinPurchases();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit coin purchase request',
        variant: 'destructive',
      });
    }
  };

  const activePlansData = userPlans.map((up) => {
    const plan = plans.find((p) => p.id === up.planId);
    if (!plan) return null;

    const now = new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((up.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return {
      id: up.id!,
      name: plan.name,
      investment: plan.price,
      profitRate: plan.profitRate,
      totalProfit: up.totalProfit,
      profitEarned: up.profitClaimed,
      daysRemaining,
      totalDays: plan.duration,
    };
  }).filter(Boolean) as any[];

  const referralStats = {
    totalReferrals: stats.totalReferrals,
    totalEarned: stats.totalReferralEarnings,
    recentReferrals: [],
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', value: 'overview' },
    { icon: TrendingUp, label: 'Plans', value: 'plans' },
    { icon: Wallet, label: 'Deposit', value: 'deposit' },
    { icon: Coins, label: 'Buy Coins', value: 'buy-coins' },
    { icon: Wallet, label: 'Withdraw', value: 'withdraw' },
    { icon: Gift, label: 'Daily Reward', value: 'daily-reward' },
    { icon: Sparkles, label: 'Spin Wheel', value: 'spin-wheel' },
    { icon: Users, label: 'Referrals', value: 'referrals' },
  ];

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-heading font-bold">RTR Earnings</h2>
              </div>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name || currentUser?.name}!</p>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-muted-foreground mb-1">PKR Balance</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  ₨{(user?.pkrBalance || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground mb-1">Coin Balance</p>
                <p className="text-2xl font-mono font-bold">
                  {(user?.coinBalance || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <SidebarGroup className="px-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.value)}
                        isActive={activeTab === item.value}
                        data-testid={`nav-${item.value}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t">
              <Button variant="outline" className="w-full" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h1 className="text-2xl font-heading font-bold">{menuItems.find(i => i.value === activeTab)?.label}</h1>
                <p className="text-sm text-muted-foreground">Manage your {menuItems.find(i => i.value === activeTab)?.label.toLowerCase()}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <PageBackground pageKey={PAGE_KEYS.USER_OVERVIEW}>
                <div className="space-y-8 max-w-7xl mx-auto p-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold mb-4">Account Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      title="PKR Balance" 
                      value={`₨ ${(user?.pkrBalance || 0).toLocaleString()}`} 
                      icon={Wallet} 
                    />
                    <StatCard 
                      title="Coin Balance" 
                      value={(user?.coinBalance || 0).toLocaleString()} 
                      icon={Gift} 
                    />
                    <StatCard 
                      title="Total Profit" 
                      value={`₨ ${stats.totalProfit.toLocaleString()}`} 
                      icon={TrendingUp} 
                    />
                    <StatCard 
                      title="Total Invested" 
                      value={`₨ ${stats.totalInvested.toLocaleString()}`} 
                      icon={LayoutDashboard} 
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-heading font-semibold mb-4">Activity</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ActivePlans plans={activePlansData} />
                    <TransactionList transactions={transactions.filter(t => t.id !== undefined).map(t => ({
                      ...t,
                      id: t.id!,
                      date: t.createdAt,
                    }))} />
                  </div>
                </div>
                </div>
              </PageBackground>
            )}

            {activeTab === 'plans' && (
              <PageBackground pageKey={PAGE_KEYS.USER_PLANS}>
                <div className="max-w-7xl mx-auto space-y-6 p-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold mb-2">Investment Plans</h2>
                  <p className="text-sm text-muted-foreground mb-6">Choose a plan that fits your investment goals</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.filter(p => p.isActive).map((plan, index) => (
                    <PlanCard
                      key={plan.id}
                      name={plan.name}
                      description={plan.description}
                      price={plan.price}
                      coinRequirement={plan.coinRequirement}
                      duration={plan.duration}
                      profitRate={plan.profitRate}
                      isActive={plan.isActive}
                      isBestValue={index === 1}
                      onPurchase={() => handlePlanPurchase(plan.id!)}
                    />
                  ))}
                </div>
                </div>
              </PageBackground>
            )}

            {activeTab === 'deposit' && (
              <PageBackground pageKey={PAGE_KEYS.USER_DEPOSIT}>
                <div className="max-w-2xl mx-auto p-6">
                <DepositForm
                  onSubmit={handleDeposit}
                  depositAccounts={settings?.depositAccounts}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'buy-coins' && (
              <PageBackground pageKey={PAGE_KEYS.USER_BUY_COINS}>
                <div className="max-w-2xl mx-auto p-6">
                <CoinPurchaseForm
                  coinRate={settings?.coinRate || 10}
                  onSubmit={handleCoinPurchase}
                  depositAccounts={settings?.depositAccounts}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'withdraw' && (
              <PageBackground pageKey={PAGE_KEYS.USER_WITHDRAW}>
                <div className="max-w-2xl mx-auto p-6">
                <WithdrawalForm
                  onSubmit={handleWithdrawal}
                  currentBalance={user?.pkrBalance || 0}
                  minWithdrawal={settings?.minWithdrawal}
                  maxWithdrawal={settings?.maxWithdrawal}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'daily-reward' && (
              <PageBackground pageKey={PAGE_KEYS.USER_DAILY_REWARD}>
                <div className="max-w-xl mx-auto p-6">
                <DailyReward
                  rewardAmount={settings?.dailyRewardAmount || 0}
                  enabled={settings?.dailyRewardEnabled || false}
                  lastClaimTime={lastClaimTime || undefined}
                  onClaim={handleClaimReward}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'spin-wheel' && (
              <PageBackground pageKey={PAGE_KEYS.USER_SPIN_WHEEL}>
                <div className="max-w-xl mx-auto p-6">
                <SpinWheel
                  values={values}
                  enabled={settings?.spinWheelEnabled || false}
                  spinsRemaining={canSpin ? 1 : 0}
                  onSpin={handleSpin}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'referrals' && (
              <PageBackground pageKey={PAGE_KEYS.USER_REFERRALS}>
                <div className="max-w-2xl mx-auto p-6">
                <ReferralStats
                  referralCode={user?.referralCode || ''}
                  totalReferrals={referralStats.totalReferrals}
                  totalEarned={referralStats.totalEarned}
                  recentReferrals={referralStats.recentReferrals}
                />
                </div>
              </PageBackground>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
