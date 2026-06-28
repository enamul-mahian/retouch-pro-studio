import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  FolderOpen, 
  CreditCard, 
  UserCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Quotes', path: '/dashboard/quotes', icon: FileText },
    { name: 'My Orders', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'My Files', path: '/dashboard/files', icon: FolderOpen },
    { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: UserCircle },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('সফলভাবে লগআউট হয়েছে!');
      navigate('/login');
    } catch (error) {
      toast.error('লগআউট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* User Quick Profile Section */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-primary-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">
              {user?.role} Account
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={20} 
                      className={isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} 
                    />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button Section */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all group"
        >
          <LogOut size={20} className="text-rose-400 group-hover:text-rose-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;