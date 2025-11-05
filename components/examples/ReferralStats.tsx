import ReferralStats from '../ReferralStats';

export default function ReferralStatsExample() {
  const mockReferrals = [
    { name: 'Ahmed Khan', date: new Date('2024-01-15'), earned: 2500 },
    { name: 'Sarah Ali', date: new Date('2024-01-12'), earned: 1500 },
    { name: 'Hassan Ahmed', date: new Date('2024-01-10'), earned: 3000 },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ReferralStats
        referralCode="REF2024ABC"
        totalReferrals={15}
        totalEarned={25500}
        recentReferrals={mockReferrals}
      />
    </div>
  );
}
