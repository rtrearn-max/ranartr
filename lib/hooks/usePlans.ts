import { useState, useEffect } from 'react';
import { db, type Plan, type UserPlan } from '../db';
import { useAuth } from '../auth-context';

export function usePlans() {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPlans = async () => {
    const allPlans = await db.plans.toArray();
    setPlans(allPlans);

    if (currentUser?.id) {
      const userActivePlans = await db.userPlans
        .where('userId')
        .equals(currentUser.id)
        .toArray();
      setUserPlans(userActivePlans);
    }

    setIsLoading(false);
  };

  const purchasePlan = async (planId: number) => {
    if (!currentUser?.id) return;

    const plan = await db.plans.get(planId);
    const user = await db.users.get(currentUser.id);

    if (!plan || !user) {
      throw new Error('Plan or user not found');
    }

    if (!plan.isActive) {
      throw new Error('Plan is not active');
    }

    if (user.pkrBalance < plan.price) {
      throw new Error('Insufficient PKR balance');
    }

    if (user.coinBalance < plan.coinRequirement) {
      throw new Error('Insufficient coins');
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    const totalProfit = (plan.price * plan.profitRate) / 100;

    await db.userPlans.add({
      userId: currentUser.id,
      planId: plan.id!,
      purchaseDate: new Date(),
      expiryDate,
      totalProfit,
      profitClaimed: 0,
    });

    await db.users.update(currentUser.id, {
      pkrBalance: user.pkrBalance - plan.price,
      coinBalance: user.coinBalance - plan.coinRequirement,
    });

    await db.transactions.add({
      userId: currentUser.id,
      type: 'plan_purchase',
      amount: plan.price,
      description: `Purchased ${plan.name}`,
      createdAt: new Date(),
    });

    await refreshPlans();
  };

  const createPlan = async (planData: Omit<Plan, 'id'>) => {
    await db.plans.add(planData);
    await refreshPlans();
  };

  const updatePlan = async (planId: number, updates: Partial<Plan>) => {
    await db.plans.update(planId, updates);
    await refreshPlans();
  };

  const deletePlan = async (planId: number) => {
    await db.plans.delete(planId);
    await refreshPlans();
  };

  useEffect(() => {
    refreshPlans();
  }, [currentUser?.id]);

  return {
    plans,
    userPlans,
    isLoading,
    purchasePlan,
    createPlan,
    updatePlan,
    deletePlan,
    refreshPlans,
  };
}
