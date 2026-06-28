import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutGrid, 
  MessageSquare, 
  ShoppingBag, 
  ClipboardList,
  Box, 
  Image, 
  Tag, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  Shield,
  Briefcase
} from 'lucide-react';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { path: '/admin/quotes', label: 'Quote Requests', icon: MessageSquare },
    { path: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag },
    { path: '/admin/tasks', label: 'Task Board', icon: ClipboardList }, // নতুন মেনু যোগ করা হলো
    { path: '/admin/services', label: 'Services', icon: Box },
    { path: '/admin/portfolio', label: 'Portfolio', icon: Image },
    { path: '/admin/pricing', label: 'Pricing Packages', icon: Tag },
    { path: '/admin/clients', label: 'Clients', icon: Users },
    { path: '/admin/teammates', label: 'Teammates', icon: Briefcase },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { path: '/admin/legal', label: 'Legal Pages', icon: Shield },
    { path: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col fixed inset-y-0 z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Admin Panel</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Retouch Pro Studio</p>
        </div>

        <nav className="flex-1 px-4 pb-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;