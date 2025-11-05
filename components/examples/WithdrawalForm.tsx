import WithdrawalForm from '../WithdrawalForm';

export default function WithdrawalFormExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <WithdrawalForm
        onSubmit={(data) => console.log('Withdrawal submitted:', data)}
        minWithdrawal={500}
        maxWithdrawal={50000}
        currentBalance={15750}
      />
    </div>
  );
}
