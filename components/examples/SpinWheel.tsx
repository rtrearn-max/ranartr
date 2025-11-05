import SpinWheel from '../SpinWheel';

export default function SpinWheelExample() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <SpinWheel
        values={[50, 100, 150, 200, 250, 300, 500, 1000]}
        enabled={true}
        spinsRemaining={3}
        onSpin={(amount) => console.log('Won:', amount)}
      />
    </div>
  );
}
