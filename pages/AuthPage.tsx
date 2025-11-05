import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import Login from '@/components/Login';
import Register from '@/components/Register';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { login, register, currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (currentUser) {
      if (isAdmin) {
        setLocation('/admin');
      } else {
        setLocation('/user');
      }
    }
  }, [currentUser, isAdmin, setLocation]);

  const handleLogin = async (email: string, password: string) => {
    return await login(email, password);
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    name: string;
    referralCode?: string;
  }) => {
    const result = await register(data);
    return result.success;
  };

  return (
    <>
      {isLogin ? (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onRegister={handleRegister} onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
}
