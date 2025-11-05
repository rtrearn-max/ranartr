import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, DollarSign } from 'lucide-react';

interface DepositFormProps {
  onSubmit?: (data: {
    amount: number;
    method: string;
    transactionId: string;
    screenshot: File | null;
  }) => void;
  depositAccounts?: {
    easypaisa: { name: string; number: string };
    sadapay: { name: string; number: string };
  };
}

export default function DepositForm({ onSubmit, depositAccounts }: DepositFormProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      amount: parseFloat(amount),
      method,
      transactionId,
      screenshot,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Deposit Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              data-testid="input-deposit-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger id="method" data-testid="select-payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">Easypaisa</SelectItem>
                <SelectItem value="sadapay">SadaPay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method && depositAccounts && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Send payment to:</p>
              <p className="text-sm">
                {method === 'easypaisa' ? depositAccounts.easypaisa.name : depositAccounts.sadapay.name}
              </p>
              <p className="text-sm font-mono">
                {method === 'easypaisa' ? depositAccounts.easypaisa.number : depositAccounts.sadapay.number}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              data-testid="input-transaction-id"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                required
                data-testid="input-screenshot"
              />
              <Upload className="w-4 h-4 text-muted-foreground" />
            </div>
            {screenshot && (
              <p className="text-sm text-muted-foreground">{screenshot.name}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" data-testid="button-submit-deposit">
            Submit Deposit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
