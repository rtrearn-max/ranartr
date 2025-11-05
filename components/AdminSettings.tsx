import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, Plus, Trash2, Edit, Download, Upload, Package, ImageIcon, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePageThemes } from '@/lib/hooks/usePageThemes';
import type { Plan, SystemSettings } from '@/lib/db';
import { PAGE_KEYS } from '@/lib/db';

interface AdminSettingsProps {
  settings: SystemSettings;
  plans: Plan[];
  onUpdateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  onCreatePlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
  onUpdatePlan: (id: number, plan: Partial<Plan>) => Promise<void>;
  onDeletePlan: (id: number) => Promise<void>;
  onExportData: () => Promise<void>;
  onImportData: (file: File) => Promise<void>;
}

export default function AdminSettings({
  settings: initialSettings,
  plans,
  onUpdateSettings,
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
  onExportData,
  onImportData,
}: AdminSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: 1000,
    coinRequirement: 50,
    duration: 30,
    profitRate: 10,
    isActive: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { themes, setTheme, removeTheme, convertImageToBase64 } = usePageThemes();

  const handleSaveSettings = async () => {
    try {
      await onUpdateSettings(settings);
      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePlan = async () => {
    try {
      await onCreatePlan(newPlan);
      setIsCreatePlanOpen(false);
      setNewPlan({
        name: '',
        description: '',
        price: 1000,
        coinRequirement: 50,
        duration: 30,
        profitRate: 10,
        isActive: true,
      });
      toast({
        title: 'Plan Created',
        description: 'New plan has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create plan',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan?.id) return;
    try {
      await onUpdatePlan(editingPlan.id, editingPlan);
      setEditingPlan(null);
      toast({
        title: 'Plan Updated',
        description: 'Plan has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update plan',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await onDeletePlan(id);
      toast({
        title: 'Plan Deleted',
        description: 'Plan has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete plan',
        variant: 'destructive',
      });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
    }
  };

  const handleSpinValueChange = (index: number, value: string) => {
    const newValues = [...settings.spinWheelValues];
    newValues[index] = parseInt(value) || 0;
    setSettings({ ...settings, spinWheelValues: newValues });
  };

  const addSpinValue = () => {
    setSettings({
      ...settings,
      spinWheelValues: [...settings.spinWheelValues, 100],
    });
  };

  const removeSpinValue = (index: number) => {
    const newValues = settings.spinWheelValues.filter((_, i) => i !== index);
    setSettings({ ...settings, spinWheelValues: newValues });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="spin">Spin Wheel</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coin-rate">Coin Rate (PKR per Coin)</Label>
                <Input
                  id="coin-rate"
                  type="number"
                  value={settings.coinRate}
                  onChange={(e) =>
                    setSettings({ ...settings, coinRate: parseFloat(e.target.value) })
                  }
                  data-testid="input-coin-rate"
                />
                <p className="text-xs text-muted-foreground">
                  1 Coin = ₨{settings.coinRate}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral-percentage">Referral Commission (%)</Label>
                <Input
                  id="referral-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.referralPercentage}
                  onChange={(e) =>
                    setSettings({ ...settings, referralPercentage: parseFloat(e.target.value) })
                  }
                  data-testid="input-referral-percentage"
                />
                <p className="text-xs text-muted-foreground">
                  Referrer gets {settings.referralPercentage}%, Admin gets{' '}
                  {100 - settings.referralPercentage}%
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSettings} data-testid="button-save-general">
                  <Save className="w-4 h-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward Settings</CardTitle>
              <CardDescription>Configure daily rewards and gamification features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div className="flex-1">
                  <Label htmlFor="daily-reward-toggle">Daily Reward</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable daily rewards</p>
                </div>
                <Switch
                  id="daily-reward-toggle"
                  checked={settings.dailyRewardEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, dailyRewardEnabled: checked })
                  }
                  data-testid="switch-daily-reward"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-reward-amount">Daily Reward Amount (Coins)</Label>
                <Input
                  id="daily-reward-amount"
                  type="number"
                  value={settings.dailyRewardAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, dailyRewardAmount: parseFloat(e.target.value) })
                  }
                  disabled={!settings.dailyRewardEnabled}
                  data-testid="input-daily-reward-amount"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div className="flex-1">
                  <Label htmlFor="spin-wheel-toggle">Spin Wheel</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable spin wheel</p>
                </div>
                <Switch
                  id="spin-wheel-toggle"
                  checked={settings.spinWheelEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, spinWheelEnabled: checked })
                  }
                  data-testid="switch-spin-wheel"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSettings} data-testid="button-save-rewards">
                  <Save className="w-4 h-4 mr-2" />
                  Save Reward Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Limits</CardTitle>
              <CardDescription>Set minimum and maximum withdrawal amounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-withdrawal">Minimum Withdrawal (PKR)</Label>
                <Input
                  id="min-withdrawal"
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) =>
                    setSettings({ ...settings, minWithdrawal: parseFloat(e.target.value) })
                  }
                  data-testid="input-min-withdrawal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-withdrawal">Maximum Withdrawal (PKR)</Label>
                <Input
                  id="max-withdrawal"
                  type="number"
                  value={settings.maxWithdrawal}
                  onChange={(e) =>
                    setSettings({ ...settings, maxWithdrawal: parseFloat(e.target.value) })
                  }
                  data-testid="input-max-withdrawal"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSettings} data-testid="button-save-limits">
                  <Save className="w-4 h-4 mr-2" />
                  Save Limit Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Plan Management</CardTitle>
                <CardDescription>Create and manage investment plans</CardDescription>
              </div>
              <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-plan">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                        data-testid="input-plan-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-description">Description</Label>
                      <Textarea
                        id="plan-description"
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                        data-testid="input-plan-description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan-price">Price (PKR)</Label>
                        <Input
                          id="plan-price"
                          type="number"
                          value={newPlan.price}
                          onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                          data-testid="input-plan-price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan-coins">Coin Requirement</Label>
                        <Input
                          id="plan-coins"
                          type="number"
                          value={newPlan.coinRequirement}
                          onChange={(e) => setNewPlan({ ...newPlan, coinRequirement: parseFloat(e.target.value) })}
                          data-testid="input-plan-coin-req"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan-duration">Duration (Days)</Label>
                        <Input
                          id="plan-duration"
                          type="number"
                          value={newPlan.duration}
                          onChange={(e) => setNewPlan({ ...newPlan, duration: parseFloat(e.target.value) })}
                          data-testid="input-plan-duration"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan-profit">Profit Rate (%)</Label>
                        <Input
                          id="plan-profit"
                          type="number"
                          value={newPlan.profitRate}
                          onChange={(e) => setNewPlan({ ...newPlan, profitRate: parseFloat(e.target.value) })}
                          data-testid="input-plan-profit-rate"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreatePlan} data-testid="button-submit-plan">
                      Create Plan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="font-medium">₨{plan.price}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Coins</p>
                              <p className="font-medium">{plan.coinRequirement}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Duration</p>
                              <p className="font-medium">{plan.duration} days</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Profit</p>
                              <p className="font-medium">{plan.profitRate}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setEditingPlan(plan)}
                                data-testid={`button-edit-plan-${plan.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Plan</DialogTitle>
                              </DialogHeader>
                              {editingPlan && editingPlan.id === plan.id && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Plan Name</Label>
                                    <Input
                                      value={editingPlan.name}
                                      onChange={(e) =>
                                        setEditingPlan({ ...editingPlan, name: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      value={editingPlan.description}
                                      onChange={(e) =>
                                        setEditingPlan({ ...editingPlan, description: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Price (PKR)</Label>
                                      <Input
                                        type="number"
                                        value={editingPlan.price}
                                        onChange={(e) =>
                                          setEditingPlan({
                                            ...editingPlan,
                                            price: parseFloat(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Coin Requirement</Label>
                                      <Input
                                        type="number"
                                        value={editingPlan.coinRequirement}
                                        onChange={(e) =>
                                          setEditingPlan({
                                            ...editingPlan,
                                            coinRequirement: parseFloat(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Duration (Days)</Label>
                                      <Input
                                        type="number"
                                        value={editingPlan.duration}
                                        onChange={(e) =>
                                          setEditingPlan({
                                            ...editingPlan,
                                            duration: parseFloat(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Profit Rate (%)</Label>
                                      <Input
                                        type="number"
                                        value={editingPlan.profitRate}
                                        onChange={(e) =>
                                          setEditingPlan({
                                            ...editingPlan,
                                            profitRate: parseFloat(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={editingPlan.isActive}
                                      onCheckedChange={(checked) =>
                                        setEditingPlan({ ...editingPlan, isActive: checked })
                                      }
                                    />
                                    <Label>Active</Label>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button onClick={handleUpdatePlan}>Update Plan</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => plan.id && handleDeletePlan(plan.id)}
                            data-testid={`button-delete-plan-${plan.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spin" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spin Wheel Configuration</CardTitle>
              <CardDescription>Configure coin values for the spin wheel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {settings.spinWheelValues.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Label className="w-24">Segment {index + 1}</Label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => handleSpinValueChange(index, e.target.value)}
                      data-testid={`input-spin-value-${index}`}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeSpinValue(index)}
                      disabled={settings.spinWheelValues.length <= 4}
                      data-testid={`button-remove-spin-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={addSpinValue} variant="outline" data-testid="button-add-spin-value">
                <Plus className="w-4 h-4 mr-2" />
                Add Segment
              </Button>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveSettings} data-testid="button-save-spin">
                  <Save className="w-4 h-4 mr-2" />
                  Save Spin Wheel Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Background Themes</CardTitle>
              <CardDescription>Upload custom background images for each page (max 5MB per image)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Admin Pages</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { key: PAGE_KEYS.ADMIN_OVERVIEW, label: 'Admin Overview' },
                    { key: PAGE_KEYS.ADMIN_REQUESTS, label: 'Admin Requests' },
                    { key: PAGE_KEYS.ADMIN_USERS, label: 'Admin Users' },
                    { key: PAGE_KEYS.ADMIN_SETTINGS, label: 'Admin Settings' },
                  ].map(({ key, label }) => {
                    const currentTheme = themes.find(t => t.pageKey === key);
                    return (
                      <Card key={key}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold">{label}</Label>
                              {currentTheme && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={async () => {
                                    await removeTheme(key);
                                    toast({
                                      title: 'Background Removed',
                                      description: `Background for ${label} has been removed.`,
                                    });
                                  }}
                                  data-testid={`button-remove-theme-${key}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            {currentTheme?.imageData ? (
                              <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                                <img
                                  src={currentTheme.imageData}
                                  alt={`${label} background`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                            
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const imageData = await convertImageToBase64(file);
                                    await setTheme(key, imageData);
                                    toast({
                                      title: 'Background Updated',
                                      description: `Background for ${label} has been set.`,
                                    });
                                  } catch (error: any) {
                                    toast({
                                      title: 'Error',
                                      description: error.message || 'Failed to upload image',
                                      variant: 'destructive',
                                    });
                                  }
                                }
                                e.target.value = '';
                              }}
                              data-testid={`input-theme-${key}`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">User Pages</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { key: PAGE_KEYS.USER_OVERVIEW, label: 'User Overview' },
                    { key: PAGE_KEYS.USER_PLANS, label: 'User Plans' },
                    { key: PAGE_KEYS.USER_DEPOSIT, label: 'User Deposit' },
                    { key: PAGE_KEYS.USER_BUY_COINS, label: 'User Buy Coins' },
                    { key: PAGE_KEYS.USER_WITHDRAW, label: 'User Withdraw' },
                    { key: PAGE_KEYS.USER_DAILY_REWARD, label: 'User Daily Reward' },
                    { key: PAGE_KEYS.USER_SPIN_WHEEL, label: 'User Spin Wheel' },
                    { key: PAGE_KEYS.USER_REFERRALS, label: 'User Referrals' },
                  ].map(({ key, label }) => {
                    const currentTheme = themes.find(t => t.pageKey === key);
                    return (
                      <Card key={key}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold">{label}</Label>
                              {currentTheme && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={async () => {
                                    await removeTheme(key);
                                    toast({
                                      title: 'Background Removed',
                                      description: `Background for ${label} has been removed.`,
                                    });
                                  }}
                                  data-testid={`button-remove-theme-${key}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            {currentTheme?.imageData ? (
                              <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                                <img
                                  src={currentTheme.imageData}
                                  alt={`${label} background`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                            
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const imageData = await convertImageToBase64(file);
                                    await setTheme(key, imageData);
                                    toast({
                                      title: 'Background Updated',
                                      description: `Background for ${label} has been set.`,
                                    });
                                  } catch (error: any) {
                                    toast({
                                      title: 'Error',
                                      description: error.message || 'Failed to upload image',
                                      variant: 'destructive',
                                    });
                                  }
                                }
                                e.target.value = '';
                              }}
                              data-testid={`input-theme-${key}`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Export or import all system data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Export Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a complete backup of all users, deposits, withdrawals, plans, and settings as a JSON file.
                  </p>
                  <Button onClick={onExportData} data-testid="button-export-data">
                    <Download className="w-4 h-4 mr-2" />
                    Export Backup
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Import Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restore a previous backup. This will replace all current data.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="destructive"
                    data-testid="button-import-data"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
