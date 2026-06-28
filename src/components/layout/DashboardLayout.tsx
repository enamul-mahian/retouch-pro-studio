import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  FileText, 
  ShoppingBag, 
  Folder, 
  CreditCard, 
  User, 
  LogOut,
  Briefcase, // টাস্ক আইকন
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
    { path: '/dashboard/quotes', label: 'My Quotes', icon: FileText },
    { path: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
    { path: '/dashboard/tasks', label: 'My Tasks', icon: Briefcase }, // নতুন টিম টাস্ক মেনু
    { path: '/dashboard/files', label: 'My Files', icon: Folder },
    { path: '/dashboard/payments', label: 'Payments', icon: CreditCard },
    { path: '/dashboard/profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black shadow-lg">R</div>
             <div>
                <h2 className="font-bold text-slate-800 dark:text-white leading-tight">{user?.name?.split(' ')[0] || 'Client'}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Account</p>
             </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                  isActive 
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-none' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                {item.label}
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b p-4 flex items-center justify-between sticky top-0 z-40">
         <div className="font-bold text-slate-800 dark:text-white">Dashboard</div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-slate-900 pt-20 px-6 animate-in slide-in-from-top-10">
           <nav className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-red-500">
                <LogOut size={20} /> Logout
              </button>
           </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;