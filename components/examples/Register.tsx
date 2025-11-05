import Register from '../Register';

export default function RegisterExample() {
  return (
    <Register
      onRegister={async (data) => {
        console.log('Register:', data);
        return true;
      }}
      onSwitchToLogin={() => console.log('Switch to login')}
    />
  );
}
