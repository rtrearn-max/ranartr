import AdminUserTable from '../AdminUserTable';

export default function AdminUserTableExample() {
  const mockUsers = [
    {
      id: 101,
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      pkrBalance: 15750,
      coinBalance: 1250,
      totalDeposit: 25000,
      totalWithdrawal: 10000,
      referrals: 5,
      joinDate: new Date('2024-01-01'),
    },
    {
      id: 102,
      name: 'Sarah Ali',
      email: 'sarah@example.com',
      pkrBalance: 8500,
      coinBalance: 650,
      totalDeposit: 15000,
      totalWithdrawal: 5000,
      referrals: 3,
      joinDate: new Date('2024-01-05'),
    },
    {
      id: 103,
      name: 'Hassan Ahmed',
      email: 'hassan@example.com',
      pkrBalance: 32000,
      coinBalance: 2100,
      totalDeposit: 50000,
      totalWithdrawal: 15000,
      referrals: 12,
      joinDate: new Date('2023-12-15'),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminUserTable
        users={mockUsers}
        onView={(id) => console.log('View user:', id)}
        onEdit={(id) => console.log('Edit user:', id)}
        onDelete={(id) => console.log('Delete user:', id)}
      />
    </div>
  );
}
