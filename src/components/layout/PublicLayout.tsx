import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* ওয়েবসাইটের ফিক্সড টপ হেডার */}
      <Header />

      {/* 
        মূল কন্টেন্ট এরিয়া: 
        pt-16/20 দেওয়া হয়েছে যাতে ফিক্সড হেডারের নিচে কন্টেন্ট ঢুকে না যায়।
        pb-16/24 দেওয়া হয়েছে যাতে মোবাইলের বটম নেভের নিচে কন্টেন্ট না ঢাকা পড়ে।
      */}
      <main className="flex-grow pt-16 md:pt-20 pb-20 md:pb-0 safe-area-pb flex flex-col">
        <Outlet />
      </main>

      {/* ডেস্কটপ ও ট্যাবলেটের জন্য ফুটার */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>

      {/* শুধুমাত্র মোবাইল ডিভাইসের জন্য ফিক্সড বটম নেভিগেশন */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default PublicLayout;