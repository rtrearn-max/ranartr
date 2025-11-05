import DepositForm from '../DepositForm';

export default function DepositFormExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <DepositForm
        onSubmit={(data) => console.log('Deposit submitted:', data)}
        depositAccounts={{
          easypaisa: { name: 'Muhammad Rizwan Tariq', number: '03325382626' },
          sadapay: { name: 'Muhammad Rizwan Tariq', number: '03325382626' },
        }}
      />
    </div>
  );
}
