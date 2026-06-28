import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom Hook: useAuth
 * এটি ব্যবহার করে ওয়েবসাইটের যেকোনো জায়গা থেকে ইউজারের লগিন স্ট্যাটাস জানা যাবে।
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // যদি কেউ AuthProvider-এর বাইরে থেকে এটি কল করার চেষ্টা করে, তবে এরর দেখাবে
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};