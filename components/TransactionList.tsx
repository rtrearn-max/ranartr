import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'coin_purchase' | 'plan_purchase' | 'daily_reward' | 'spin_wheel' | 'referral_commission' | 'plan_profit';
  amount: number;
  description: string;
  date: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

interface TransactionListProps {
  transactions: Transaction[];
}

const typeLabels: Record<string, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  coin_purchase: 'Coin Purchase',
  plan_purchase: 'Plan Purchase',
  daily_reward: 'Daily Reward',
  spin_wheel: 'Spin Wheel',
  referral_commission: 'Referral',
  plan_profit: 'Plan Profit',
};

const statusColors: Record<string, string> = {
  pending: 'bg-warning text-warning-foreground',
  approved: 'bg-success text-success-foreground',
  rejected: 'bg-destructive text-destructive-foreground',
};

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 rounded-md hover-elevate border"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className={`p-2 rounded-md ${
                    transaction.type === 'withdrawal' || transaction.type === 'plan_purchase' || transaction.type === 'coin_purchase'
                      ? 'bg-destructive/10'
                      : 'bg-success/10'
                  }`}>
                    {transaction.type === 'withdrawal' || transaction.type === 'plan_purchase' || transaction.type === 'coin_purchase' ? (
                      <ArrowUpRight className="w-4 h-4 text-destructive" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-success" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{typeLabels[transaction.type]}</p>
                    <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {transaction.date.toLocaleDateString()} {transaction.date.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-mono font-bold ${
                      transaction.type === 'withdrawal' || transaction.type === 'plan_purchase' || transaction.type === 'coin_purchase'
                        ? 'text-destructive'
                        : 'text-success'
                    }`}>
                      {transaction.type === 'withdrawal' || transaction.type === 'plan_purchase' || transaction.type === 'coin_purchase' ? '-' : '+'}
                      ₨{transaction.amount.toLocaleString()}
                    </p>
                    {transaction.status && (
                      <Badge className={`mt-1 ${statusColors[transaction.status]}`}>
                        {transaction.status}
                      </Badge>
                    )}
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
