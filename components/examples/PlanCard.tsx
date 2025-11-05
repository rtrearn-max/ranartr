import PlanCard from '../PlanCard';

export default function PlanCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlanCard
        name="Starter Plan"
        description="Perfect for beginners looking to start their earning journey"
        price={1000}
        coinRequirement={50}
        duration={30}
        profitRate={10}
        isActive={true}
        onPurchase={() => console.log('Purchase Starter Plan')}
      />
      <PlanCard
        name="Growth Plan"
        description="Accelerate your earnings with better returns"
        price={5000}
        coinRequirement={200}
        duration={45}
        profitRate={15}
        isActive={true}
        isBestValue={true}
        onPurchase={() => console.log('Purchase Growth Plan')}
      />
      <PlanCard
        name="Premium Plan"
        description="Maximum profits for serious investors"
        price={10000}
        coinRequirement={500}
        duration={60}
        profitRate={20}
        isActive={true}
        onPurchase={() => console.log('Purchase Premium Plan')}
      />
    </div>
  );
}
