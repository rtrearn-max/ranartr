import ActivePlans from '../ActivePlans';

export default function ActivePlansExample() {
  const mockPlans = [
    {
      id: 1,
      name: 'Starter Plan',
      investment: 1000,
      profitRate: 10,
      totalProfit: 100,
      profitEarned: 45,
      daysRemaining: 17,
      totalDays: 30,
    },
    {
      id: 2,
      name: 'Growth Plan',
      investment: 5000,
      profitRate: 15,
      totalProfit: 750,
      profitEarned: 250,
      daysRemaining: 30,
      totalDays: 45,
    },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ActivePlans plans={mockPlans} />
    </div>
  );
}
