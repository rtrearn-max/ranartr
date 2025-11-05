import DailyReward from '../DailyReward';

export default function DailyRewardExample() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <DailyReward
        rewardAmount={100}
        enabled={true}
        onClaim={() => console.log('Claimed daily reward')}
      />
    </div>
  );
}
