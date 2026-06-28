import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, loginUser, registerUser, logoutUser, type RegisterData } from '../services/authService';
import type { UserData } from '../types/user.types';

// Auth Context-এর ভেতরে কী কী ডাটা এবং ফাংশন থাকবে তার টাইপ
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Context তৈরি করা হলো
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider কম্পোনেন্ট যা আমাদের পুরো অ্যাপকে মুড়িয়ে রাখবে
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // যখনই ইউজার লগিন বা লগআউট করবে, তখন এই effect টি ফায়ারবেস থেকে ডাটা আপডেট করে নিবে
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // ইউজার লগিন থাকলে ডাটাবেস থেকে তার সম্পূর্ণ প্রোফাইল নিয়ে আসবে
          const userProfile = await getUserProfile(firebaseUser.uid);
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile in context:', error);
          setUser(null);
        }
      } else {
        // লগআউট থাকলে ইউজার null হয়ে যাবে
        setUser(null);
      }
      setLoading(false); // ডাটা আনা শেষ, তাই লোডিং ফলস
    });

    return () => unsubscribe();
  }, []);

  // লগিন ফাংশন
  const login = async (email: string, password: string) => {
    const userData = await loginUser(email, password);
    setUser(userData);
  };

  // রেজিস্ট্রেশন ফাংশন
  const register = async (data: RegisterData) => {
    const userData = await registerUser(data);
    setUser(userData);
  };

  // লগআউট ফাংশন
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {/* যতক্ষণ চেক চলছে ইউজার লগিন কিনা, ততক্ষণ চাইলে এখানে একটি লোডার দেখানো যায় */}
      {!loading && children}
    </AuthContext.Provider>
  );
};