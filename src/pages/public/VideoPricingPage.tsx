import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getPackagesByCategory } from '../../services/packageService';
import type { PricingPackage } from '../../types/package.types';
import { 
  CheckCircle2, 
  Video, 
  Loader2, 
  PlayCircle,
  Zap,
  Clock,
  ArrowRight 
} from 'lucide-react';

const VideoPricingPage = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getPackagesByCategory('video-editing');
        setPackages(data);
      } catch (error) {
        console.error("Error fetching video packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <>
      <Helmet>
        <title>Video Editing Pricing | Professional Video Services - Retouch Pro Studio</title>
        <meta name="description" content="Affordable and professional video editing pricing for reels, TikToks, and commercials. Choose your perfect plan." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-32 pb-24 font-sans">
        {/* Header Hero */}
        <div className="container mx-auto px-4 max-w-7xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
            <PlayCircle size={16} />
            Cinema Grade Edits
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-white mb-6">
            High-Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-primary-600">Video Editing</span> Plans
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            From social media reels to high-end commercials, choose a plan that brings your story to life.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <section className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching video plans...</p>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 transition-all duration-300 flex flex-col ${
                    pkg.isPopular 
                    ? 'border-purple-500 shadow-2xl shadow-purple-200 dark:shadow-none relative lg:-translate-y-4' 
                    : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-primary-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      Recommended
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{pkg.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px]">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">${pkg.price}</span>
                    <span className="text-slate-400 font-bold ml-2">/ {pkg.unit}</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <CheckCircle2 size={20} className="text-purple-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to="/quote" 
                    className={`w-full py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 group ${
                      pkg.isPopular 
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Get Started Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Video className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Video Plans Available</h3>
              <p className="text-slate-500 mb-8">We are tailoring our video packages. Check back soon!</p>
              <Link to="/contact" className="text-purple-600 font-bold hover:underline">Inquire Custom Project</Link>
            </div>
          )}
        </section>

        {/* Delivery Timeline Info */}
        <div className="container mx-auto px-4 max-w-4xl mt-24">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Zap className="text-yellow-400" size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold">Fast Turnaround</h4>
                <p className="text-slate-400 text-sm">Most videos delivered within 24-48 hours.</p>
              </div>
            </div>
            <div className="h-px w-full md:h-12 md:w-px bg-slate-700"></div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Clock className="text-primary-400" size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold">24/7 Support</h4>
                <p className="text-slate-400 text-sm">Real-time updates via client dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPricingPage;