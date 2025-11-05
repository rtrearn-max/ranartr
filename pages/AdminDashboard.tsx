import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, FileText, Settings, LogOut, TrendingUp, DollarSign, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useAdminStats } from '@/lib/hooks/useAdminStats';
import { useAdminRequests } from '@/lib/hooks/useAdminRequests';
import { useAdminUsers } from '@/lib/hooks/useAdminUsers';
import { useSettings } from '@/lib/hooks/useSettings';
import { usePlans } from '@/lib/hooks/usePlans';
import { useBackup } from '@/lib/hooks/useBackup';
import { useToast } from '@/hooks/use-toast';
import { PAGE_KEYS } from '@/lib/db';
import { PageBackground } from '@/components/PageBackground';
import StatCard from '@/components/StatCard';
import AdminRequestTable from '@/components/AdminRequestTable';
import AdminUserTable from '@/components/AdminUserTable';
import AdminSettings from '@/components/AdminSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const { stats, refreshStats } = useAdminStats();
  const { requests, approveRequest, rejectRequest, refreshRequests } = useAdminRequests();
  const { users, updateUserBalance, deleteUser, refreshUsers } = useAdminUsers();
  const { settings, updateSettings } = useSettings();
  const { plans, createPlan, updatePlan, deletePlan } = usePlans();
  const { exportData, importData } = useBackup();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleApprove = async (id: number) => {
    const request = requests.find(r => r.id === id);
    if (!request) return;

    const requestTypeLabel = 
      request.type === 'deposit' ? 'Deposit' :
      request.type === 'withdrawal' ? 'Withdrawal' :
      'Coin Purchase';
    
    try {
      await approveRequest(id, request.type);
      toast({
        title: 'Request Approved',
        description: `${requestTypeLabel} has been approved successfully.`,
      });
      await refreshStats();
      await refreshUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve request',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: number) => {
    const request = requests.find(r => r.id === id);
    if (!request) return;

    const requestTypeLabel = 
      request.type === 'deposit' ? 'Deposit' :
      request.type === 'withdrawal' ? 'Withdrawal' :
      'Coin Purchase';
    
    try {
      await rejectRequest(id, request.type);
      toast({
        title: 'Request Rejected',
        description: `${requestTypeLabel} has been rejected.`,
      });
      await refreshRequests();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUserBalance = async (userId: number, pkrDelta: number, coinDelta: number) => {
    try {
      await updateUserBalance(userId, pkrDelta, coinDelta);
      toast({
        title: 'Balance Updated',
        description: 'User balance has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user balance',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteUser(userId);
      toast({
        title: 'User Deleted',
        description: 'User has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = async () => {
    try {
      await exportData();
      toast({
        title: 'Data Exported',
        description: 'Backup file has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  const handleImportData = async (file: File) => {
    try {
      await importData(file);
      toast({
        title: 'Data Imported',
        description: 'Backup has been restored successfully. Refreshing...',
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import data',
        variant: 'destructive',
      });
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', value: 'overview' },
    { icon: FileText, label: 'Requests', value: 'requests' },
    { icon: Users, label: 'Users', value: 'users' },
    { icon: Settings, label: 'Settings', value: 'settings' },
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
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-heading font-bold">RTR Admin</h2>
              </div>
              <p className="text-sm text-muted-foreground">Administrator Panel</p>
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
              <PageBackground pageKey={PAGE_KEYS.ADMIN_OVERVIEW}>
                <div className="space-y-8 max-w-7xl mx-auto p-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold mb-4">Platform Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      title="Total Users" 
                      value={stats.totalUsers} 
                      icon={Users} 
                    />
                    <StatCard 
                      title="Total Deposits" 
                      value={`₨ ${stats.totalDeposits.toLocaleString()}`} 
                      icon={DollarSign} 
                    />
                    <StatCard 
                      title="Total Withdrawals" 
                      value={`₨ ${stats.totalWithdrawals.toLocaleString()}`} 
                      icon={TrendingUp} 
                    />
                    <StatCard 
                      title="Admin Profit" 
                      value={`₨ ${stats.adminProfit.toLocaleString()}`} 
                      icon={Coins} 
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-heading font-semibold mb-4">Additional Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      title="Referral Payouts" 
                      value={`₨ ${stats.totalReferralPayouts.toLocaleString()}`} 
                      icon={Users} 
                    />
                    <StatCard 
                      title="Plans Sold" 
                      value={stats.totalPlansSold} 
                      icon={TrendingUp} 
                    />
                    <StatCard 
                      title="User Profit" 
                      value={`₨ ${stats.totalUserProfit.toLocaleString()}`} 
                      icon={DollarSign} 
                    />
                    <StatCard 
                      title="Coins Earned" 
                      value={stats.totalCoinsEarned.toLocaleString()} 
                      icon={Coins} 
                    />
                  </div>
                </div>
                </div>
              </PageBackground>
            )}

            {activeTab === 'requests' && (
              <PageBackground pageKey={PAGE_KEYS.ADMIN_REQUESTS}>
                <div className="max-w-7xl mx-auto space-y-6 p-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold mb-2">Pending Requests</h2>
                  <p className="text-sm text-muted-foreground mb-6">Review and manage deposit and withdrawal requests</p>
                </div>
                <AdminRequestTable
                  requests={requests}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'users' && (
              <PageBackground pageKey={PAGE_KEYS.ADMIN_USERS}>
                <div className="max-w-7xl mx-auto space-y-6 p-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold mb-2">User Management</h2>
                  <p className="text-sm text-muted-foreground mb-6">View and manage all registered users</p>
                </div>
                <AdminUserTable
                  users={users}
                  onUpdateBalance={handleUpdateUserBalance}
                  onDeleteUser={handleDeleteUser}
                />
                </div>
              </PageBackground>
            )}

            {activeTab === 'settings' && (
              <PageBackground pageKey={PAGE_KEYS.ADMIN_SETTINGS}>
                <div className="max-w-7xl mx-auto space-y-6 p-6">
                <div>
                  <h2 className="text-lg font-heading font-semibold mb-2">System Settings</h2>
                  <p className="text-sm text-muted-foreground mb-6">Configure platform settings and investment plans</p>
                </div>
                {settings && (
                  <AdminSettings
                    settings={settings}
                    plans={plans}
                    onUpdateSettings={updateSettings}
                    onCreatePlan={createPlan}
                    onUpdatePlan={updatePlan}
                    onDeletePlan={deletePlan}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                  />
                )}
                </div>
              </PageBackground>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
