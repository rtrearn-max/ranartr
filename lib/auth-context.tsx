import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, type User } from './db';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    referralCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REF';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      db.users.get(parseInt(userId)).then(user => {
        if (user) setCurrentUser(user);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = await db.users.where('email').equals(email).first();
    
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id!.toString());
      return true;
    }
    
    return false;
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    referralCode?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const existingUser = await db.users.where('email').equals(data.email).first();
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    let referrer: User | undefined;
    if (data.referralCode) {
      referrer = await db.users.where('referralCode').equals(data.referralCode).first();
      if (!referrer) {
        return { success: false, error: 'Invalid referral code' };
      }
    }

    let referralCode = generateReferralCode();
    let codeExists = await db.users.where('referralCode').equals(referralCode).first();
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await db.users.where('referralCode').equals(referralCode).first();
    }

    const newUser: User = {
      email: data.email,
      password: data.password,
      name: data.name,
      isAdmin: false,
      referralCode,
      referredBy: referrer?.referralCode,
      pkrBalance: 0,
      coinBalance: 0,
      createdAt: new Date(),
    };

    const userId = await db.users.add(newUser);
    const user = await db.users.get(userId);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id!.toString());
      return { success: true };
    }
    
    return { success: false, error: 'Registration failed' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      isAdmin: currentUser?.isAdmin || false,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
