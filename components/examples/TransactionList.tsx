import TransactionList from '../TransactionList';

export default function TransactionListExample() {
  const mockTransactions = [
    {
      id: 1,
      type: 'deposit' as const,
      amount: 5000,
      description: 'Deposit via Easypaisa',
      date: new Date('2024-01-15'),
      status: 'approved' as const,
    },
    {
      id: 2,
      type: 'daily_reward' as const,
      amount: 100,
      description: 'Daily reward claimed',
      date: new Date('2024-01-14'),
    },
    {
      id: 3,
      type: 'plan_purchase' as const,
      amount: 1000,
      description: 'Purchased Starter Plan',
      date: new Date('2024-01-13'),
    },
    {
      id: 4,
      type: 'spin_wheel' as const,
      amount: 250,
      description: 'Won from Spin Wheel',
      date: new Date('2024-01-12'),
    },
    {
      id: 5,
      type: 'withdrawal' as const,
      amount: 2000,
      description: 'Withdrawal to SadaPay',
      date: new Date('2024-01-11'),
      status: 'pending' as const,
    },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <TransactionList transactions={mockTransactions} />
    </div>
  );
}
