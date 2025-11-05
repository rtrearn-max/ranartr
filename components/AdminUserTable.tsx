import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import type { UserData } from '@/lib/hooks/useAdminUsers';

interface AdminUserTableProps {
  users: UserData[];
  onUpdateBalance?: (userId: number, pkrDelta: number, coinDelta: number) => void;
  onDeleteUser?: (userId: number) => void;
}

export default function AdminUserTable({ users, onUpdateBalance, onDeleteUser }: AdminUserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [pkrDelta, setPkrDelta] = useState(0);
  const [coinDelta, setCoinDelta] = useState(0);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
          <span>User Management</span>
          <div className="relative max-w-xs flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-users"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-md space-y-3"
                  data-testid={`user-row-${user.id}`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="font-semibold text-lg">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {user.joinDate.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">ID: {user.id}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">PKR Balance</p>
                      <p className="font-mono font-bold">₨{user.pkrBalance.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Coins</p>
                      <p className="font-mono font-bold">{user.coinBalance.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Total Deposit</p>
                      <p className="font-mono font-bold">₨{user.totalDeposit.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Referrals</p>
                      <p className="font-mono font-bold">{user.referrals}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setEditingUser(user);
                            setPkrDelta(0);
                            setCoinDelta(0);
                          }}
                          data-testid={`button-edit-user-${user.id}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Balance
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update User Balance</DialogTitle>
                        </DialogHeader>
                        {editingUser && editingUser.id === user.id && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Current PKR Balance: ₨{user.pkrBalance.toLocaleString()}</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Change amount (+ or -)"
                                  value={pkrDelta}
                                  onChange={(e) => setPkrDelta(parseFloat(e.target.value) || 0)}
                                  data-testid="input-pkr-delta"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                New balance: ₨{(user.pkrBalance + pkrDelta).toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label>Current Coin Balance: {user.coinBalance.toLocaleString()}</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Change amount (+ or -)"
                                  value={coinDelta}
                                  onChange={(e) => setCoinDelta(parseFloat(e.target.value) || 0)}
                                  data-testid="input-coin-delta"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                New balance: {(user.coinBalance + coinDelta).toLocaleString()} coins
                              </p>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              if (editingUser) {
                                onUpdateBalance?.(editingUser.id, pkrDelta, coinDelta);
                                setEditingUser(null);
                              }
                            }}
                            data-testid="button-submit-balance-update"
                          >
                            Update Balance
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteUser?.(user.id)}
                      data-testid={`button-delete-user-${user.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
