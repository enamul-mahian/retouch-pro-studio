import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * AdminProtectedRoute: শুধুমাত্র অ্যাডমিন ইউজারদের পেজ দেখার অনুমতি দেয়।
 * এটি অন্য কোনো ইউজার বা গেস্টকে অ্যাডমিন প্যানেলে ঢুকতে বাধা দেয়।
 */
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ১. যতক্ষণ ফায়ারবেস চেক করছে ইউজার কে, ততক্ষণ একটি প্রফেশনাল লোডার দেখাবে
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="text-primary-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // ২. যদি ইউজার লগিন না থাকে অথবা ইউজারের রোল 'admin' না হয়
  if (!user || user.role !== 'admin') {
    // তাকে হোমপেজে পাঠিয়ে দেওয়া হচ্ছে
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ৩. সব শর্ত পূরণ হলে নির্দিষ্ট অ্যাডমিন পেজটি দেখাবে
  return <>{children}</>;
};

export default AdminProtectedRoute;