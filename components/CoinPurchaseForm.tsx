import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Coins } from 'lucide-react';

interface CoinPurchaseFormProps {
  coinRate: number;
  onSubmit?: (data: {
    pkrAmount: number;
    method: string;
    transactionId: string;
    screenshot: File | null;
  }) => void;
  depositAccounts?: {
    easypaisa: { name: string; number: string };
    sadapay: { name: string; number: string };
  };
}

export default function CoinPurchaseForm({ coinRate, onSubmit, depositAccounts }: CoinPurchaseFormProps) {
  const [pkrAmount, setPkrAmount] = useState('');
  const [method, setMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const coinAmount = pkrAmount ? Math.floor(parseFloat(pkrAmount) / coinRate) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!method) {
      alert('Please select a payment method');
      return;
    }
    
    const amount = parseFloat(pkrAmount);
    if (amount < coinRate) {
      alert(`Minimum purchase amount is ₨${coinRate} (1 coin)`);
      return;
    }
    
    onSubmit?.({
      pkrAmount: amount,
      method,
      transactionId,
      screenshot,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          Buy Coins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Current Exchange Rate</p>
            <p className="text-2xl font-bold text-primary">
              ₨{coinRate} = 1 Coin
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pkr-amount">Amount (PKR)</Label>
            <Input
              id="pkr-amount"
              type="number"
              placeholder="Enter amount in PKR"
              value={pkrAmount}
              onChange={(e) => setPkrAmount(e.target.value)}
              min={coinRate}
              required
              data-testid="input-coin-purchase-amount"
            />
            {pkrAmount && (
              <p className="text-sm text-muted-foreground">
                You will receive: <span className="font-bold text-primary">{coinAmount} coins</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger id="payment-method" data-testid="select-coin-payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">Easypaisa</SelectItem>
                <SelectItem value="sadapay">SadaPay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method && depositAccounts && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Send payment to:</p>
              {method === 'easypaisa' && (
                <div>
                  <p className="text-sm"><span className="font-semibold">Name:</span> {depositAccounts.easypaisa.name}</p>
                  <p className="text-sm"><span className="font-semibold">Number:</span> {depositAccounts.easypaisa.number}</p>
                </div>
              )}
              {method === 'sadapay' && (
                <div>
                  <p className="text-sm"><span className="font-semibold">Name:</span> {depositAccounts.sadapay.name}</p>
                  <p className="text-sm"><span className="font-semibold">Number:</span> {depositAccounts.sadapay.number}</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="transaction-id">Transaction ID</Label>
            <Input
              id="transaction-id"
              type="text"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              data-testid="input-coin-transaction-id"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
                data-testid="input-coin-screenshot"
              />
              {screenshot && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Upload className="w-4 h-4" />
                  Uploaded
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" data-testid="button-submit-coin-purchase">
            Submit Purchase Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
