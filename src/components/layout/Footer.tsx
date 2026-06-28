import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  // সেটিংস থেকে ডাটা নেওয়া হচ্ছে, যদি ডাটা না থাকে তবে ডিফল্ট ভ্যালু দেখাবে
  const siteName = settings?.siteName || 'Retouch Pro';
  const footerText = settings?.footerText || 'Professional image and short video editing services from Bangladesh, proudly serving international clients with UK-standard quality, speed, and reliability.';
  const address = settings?.contact?.address || '123 Business Avenue,\nLondon, UK SW1A 1AA';
  const phone = settings?.contact?.phone || '+44 20 1234 5678';
  const email = settings?.contact?.email || 'hello@retouchprostudio.com';
  const copyrightText = settings?.copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`;

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & About */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              {settings?.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={siteName} 
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-soft group-hover:shadow-primary/50 transition-all">
                    <Wand2 size={18} />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                    {siteName}
                  </span>
                </>
              )}
            </Link>
            
            <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
              {footerText}
            </p>
            
            {/* Dynamic Social Links */}
            <div className="flex items-center gap-4 flex-wrap">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Twitter size={16} />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Linkedin size={16} />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li><Link to="/about" className="text-slate-500 hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-slate-500 hover:text-primary-600 transition-colors">All Services</Link></li>
              <li><Link to="/portfolio" className="text-slate-500 hover:text-primary-600 transition-colors">Portfolio</Link></li>
              <li><Link to="/pricing" className="text-slate-500 hover:text-primary-600 transition-colors">Pricing & Packages</Link></li>
              <li><Link to="/blog" className="text-slate-500 hover:text-primary-600 transition-colors">Blog & News</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-primary-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-6">Popular Services</h3>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li><Link to="/services/clipping-path" className="text-slate-500 hover:text-primary-600 transition-colors">Clipping Path</Link></li>
              <li><Link to="/services/photo-retouching" className="text-slate-500 hover:text-primary-600 transition-colors">Photo Retouching</Link></li>
              <li><Link to="/services/ecommerce-editing" className="text-slate-500 hover:text-primary-600 transition-colors">E-Commerce Editing</Link></li>
              <li><Link to="/short-video-editing" className="text-slate-500 hover:text-primary-600 transition-colors">Short Video Editing</Link></li>
              <li><Link to="/quote" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Get a Free Quote →</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info (Dynamic) */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3 text-slate-500">
                <MapPin size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Phone size={18} className="text-primary-500 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-primary-600 transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Mail size={18} className="text-primary-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary-600 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Pages */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            {copyrightText}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/legal/privacy-policy" className="text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link to="/legal/terms-and-conditions" className="text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link to="/legal/refund-policy" className="text-slate-400 hover:text-slate-600 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;