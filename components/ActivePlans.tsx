import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Calendar } from 'lucide-react';

interface ActivePlan {
  id: number;
  name: string;
  investment: number;
  profitRate: number;
  totalProfit: number;
  profitEarned: number;
  daysRemaining: number;
  totalDays: number;
}

interface ActivePlansProps {
  plans: ActivePlan[];
}

export default function ActivePlans({ plans }: ActivePlansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Active Investment Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plans.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active plans</p>
          ) : (
            plans.map((plan) => {
              const progress = ((plan.totalDays - plan.daysRemaining) / plan.totalDays) * 100;
              const profitProgress = (plan.profitEarned / plan.totalProfit) * 100;

              return (
                <div
                  key={plan.id}
                  className="p-4 border rounded-md space-y-3"
                  data-testid={`active-plan-${plan.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Investment: ₨{plan.investment.toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      {plan.profitRate}% Profit
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Days Remaining</p>
                        <p className="font-mono font-bold">{plan.daysRemaining}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <div>
                        <p className="text-xs text-muted-foreground">Profit Earned</p>
                        <p className="font-mono font-bold text-success">
                          ₨{plan.profitEarned.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Total Profit Target</span>
                      <span className="font-mono font-bold">₨{plan.totalProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
