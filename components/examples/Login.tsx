import Login from '../Login';

export default function LoginExample() {
  return (
    <Login
      onLogin={async (email, password) => {
        console.log('Login:', email, password);
        return true;
      }}
      onSwitchToRegister={() => console.log('Switch to register')}
    />
  );
}
