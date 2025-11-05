import AdminRequestTable from '../AdminRequestTable';

export default function AdminRequestTableExample() {
  const mockRequests = [
    {
      id: 1,
      userId: 101,
      userName: 'Ahmed Khan',
      type: 'deposit' as const,
      amount: 5000,
      method: 'Easypaisa',
      details: 'Transaction ID: EP123456789',
      date: new Date('2024-01-15T10:30:00'),
      status: 'pending' as const,
    },
    {
      id: 2,
      userId: 102,
      userName: 'Sarah Ali',
      type: 'withdrawal' as const,
      amount: 3000,
      method: 'SadaPay',
      details: 'Account: 03001234567',
      date: new Date('2024-01-15T11:45:00'),
      status: 'pending' as const,
    },
    {
      id: 3,
      userId: 103,
      userName: 'Hassan Ahmed',
      type: 'deposit' as const,
      amount: 10000,
      method: 'Easypaisa',
      details: 'Transaction ID: EP987654321',
      date: new Date('2024-01-15T14:20:00'),
      status: 'pending' as const,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminRequestTable
        requests={mockRequests}
        onApprove={(id) => console.log('Approve request:', id)}
        onReject={(id) => console.log('Reject request:', id)}
        onView={(id) => console.log('View request:', id)}
      />
    </div>
  );
}
