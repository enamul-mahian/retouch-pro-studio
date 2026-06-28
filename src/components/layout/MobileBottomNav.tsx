import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Image, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MobileBottomNav = () => {
  const { user } = useAuth();

  // ইউজার লগিন আছে কিনা তার ওপর ভিত্তি করে প্রোফাইলের লিংক ডাইনামিক করা হলো
  const profileLink = user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login';

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: LayoutGrid },
    { name: 'Portfolio', path: '/portfolio', icon: Image },
    { name: 'Profile', path: profileLink, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 safe-area-pb shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-primary-50 text-primary-600' : 'bg-transparent'}`}>
                    <Icon
                      size={20}
                      className={`transition-transform duration-300 ${
                        isActive ? 'scale-110 stroke-[2.5px]' : 'scale-100 stroke-2'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] transition-all duration-300 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;