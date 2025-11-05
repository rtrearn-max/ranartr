import { useEffect } from 'react';
import { db } from '../db';

export function useProfitCalculation() {
  const calculateProfits = async () => {
    const activePlans = await db.userPlans
      .filter(up => new Date() < up.expiryDate)
      .toArray();

    for (const userPlan of activePlans) {
      const plan = await db.plans.get(userPlan.planId);
      if (!plan) continue;

      const daysPassed = Math.floor(
        (new Date().getTime() - userPlan.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const dailyProfit = userPlan.totalProfit / plan.duration;
      const expectedProfit = Math.min(dailyProfit * daysPassed, userPlan.totalProfit);
      const unclaimedProfit = expectedProfit - userPlan.profitClaimed;

      if (unclaimedProfit > 0.01) {
        const user = await db.users.get(userPlan.userId);
        if (user && user.id) {
          await db.users.update(user.id, {
            pkrBalance: user.pkrBalance + unclaimedProfit,
          });

          await db.userPlans.update(userPlan.id!, {
            profitClaimed: expectedProfit,
          });

          await db.transactions.add({
            userId: user.id,
            type: 'plan_profit',
            amount: unclaimedProfit,
            description: `Profit from ${plan.name}`,
            createdAt: new Date(),
          });
        }
      }
    }
  };

  useEffect(() => {
    calculateProfits();
    
    const interval = setInterval(calculateProfits, 1000 * 60 * 60);
    
    return () => clearInterval(interval);
  }, []);

  return { calculateProfits };
}
