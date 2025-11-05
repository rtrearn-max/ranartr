import StatCard from '../StatCard';
import { Wallet, Coins, TrendingUp, DollarSign } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="PKR Balance"
        value="₨ 15,750"
        icon={Wallet}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatCard
        title="Coin Balance"
        value="1,250"
        icon={Coins}
      />
      <StatCard
        title="Total Profit"
        value="₨ 8,540"
        icon={TrendingUp}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Total Invested"
        value="₨ 25,000"
        icon={DollarSign}
      />
    </div>
  );
}
