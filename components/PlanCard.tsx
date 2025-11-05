import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Coins, CheckCircle2 } from 'lucide-react';

interface PlanCardProps {
  name: string;
  description: string;
  price: number;
  coinRequirement: number;
  duration: number;
  profitRate: number;
  isActive: boolean;
  isBestValue?: boolean;
  onPurchase?: () => void;
}

export default function PlanCard({
  name,
  description,
  price,
  coinRequirement,
  duration,
  profitRate,
  isActive,
  isBestValue,
  onPurchase,
}: PlanCardProps) {
  const totalProfit = (price * profitRate) / 100;

  return (
    <Card className={`relative ${!isActive && 'opacity-50'} ${isBestValue ? 'border-warning/50' : ''}`}>
      {isBestValue && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-warning text-warning-foreground shadow-sm px-3 py-1">Best Value</Badge>
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-heading mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <div className="text-4xl font-bold font-mono text-primary mb-1">₨ {price.toLocaleString()}</div>
          <p className="text-xs font-medium text-muted-foreground">Investment Amount</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg mt-0.5">
              <Coins className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{coinRequirement} Coins Required</p>
              <p className="text-xs text-muted-foreground mt-0.5">Unlock this plan</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg mt-0.5">
              <Clock className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{duration} Days Duration</p>
              <p className="text-xs text-muted-foreground mt-0.5">Investment period</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-success/10 rounded-lg mt-0.5">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-success">{profitRate}% Profit Rate</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total profit: ₨ {totalProfit.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-success/10 rounded-lg mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Daily Distribution</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automatic profit deposits</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full"
          size="lg"
          disabled={!isActive}
          onClick={onPurchase}
          data-testid={`button-purchase-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {isActive ? 'Purchase Plan' : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}
