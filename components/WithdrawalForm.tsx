import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Banknote } from 'lucide-react';

interface WithdrawalFormProps {
  onSubmit?: (data: {
    amount: number;
    method: string;
    accountDetails: string;
  }) => void;
  minWithdrawal?: number;
  maxWithdrawal?: number;
  currentBalance?: number;
}

export default function WithdrawalForm({
  onSubmit,
  minWithdrawal = 500,
  maxWithdrawal = 50000,
  currentBalance = 0,
}: WithdrawalFormProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [accountDetails, setAccountDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (amountNum < minWithdrawal) {
      alert(`Minimum withdrawal amount is ₨${minWithdrawal}`);
      return;
    }
    
    if (amountNum > maxWithdrawal) {
      alert(`Maximum withdrawal amount is ₨${maxWithdrawal}`);
      return;
    }
    
    if (amountNum > currentBalance) {
      alert('Insufficient balance');
      return;
    }

    onSubmit?.({
      amount: amountNum,
      method,
      accountDetails,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="w-5 h-5 text-primary" />
          Withdraw Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold font-mono">₨ {currentBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Min: ₨{minWithdrawal} | Max: ₨{maxWithdrawal}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-amount">Amount (PKR)</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              data-testid="input-withdrawal-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger id="withdrawal-method" data-testid="select-withdrawal-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">Easypaisa</SelectItem>
                <SelectItem value="sadapay">SadaPay</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-details">Account Details</Label>
            <Textarea
              id="account-details"
              placeholder="Enter your account number, name, and any other required details"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              rows={4}
              required
              data-testid="input-account-details"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" data-testid="button-submit-withdrawal">
            Submit Withdrawal Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
