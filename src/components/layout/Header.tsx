import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Wand2, User, LogIn, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../contexts/SettingsContext';

const Header = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // মেনু লিংকের তালিকা (প্রাইসিং অপশন দুটি আলাদা করা হয়েছে)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Photo Pricing', path: '/photo-editing-pricing' },
    { name: 'Video Pricing', path: '/video-editing-pricing' },
    { name: 'Blog', path: '/blog' },
  ];

  const siteName = settings?.siteName || 'Retouch Pro';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header h-16 md:h-20 transition-all duration-300">
      <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl">
        
        {/* Left Side: Dynamic Logo & Brand Name */}
        <Link to="/" className="flex items-center gap-2 group">
          {settings?.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={siteName} 
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          ) : (
            <>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-soft group-hover:shadow-primary/50 transition-all">
                <Wand2 size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                {siteName}
              </span>
            </>
          )}
        </Link>

        {/* Middle: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 text-xs xl:text-sm font-bold transition-all rounded-lg hover:bg-slate-50 hover:text-primary-600 ${
                  isActive ? 'text-primary-600 bg-primary-50/50' : 'text-slate-600'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/quote"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg shadow-primary-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Free Quote
          </Link>

          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-full border border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50 transition-all text-sm font-bold text-slate-700 shadow-sm"
            >
              <User size={18} className="text-primary-600" />
              <span className="hidden md:block">Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-full border border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50 transition-all text-sm font-bold text-slate-700 shadow-sm"
            >
              <LogIn size={18} className="text-primary-600" />
              <span className="hidden md:block">Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 w-full py-3 bg-primary-600 text-white text-center rounded-xl font-bold"
            >
              Get Free Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;