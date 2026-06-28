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
import ScrollReveal from '../../components/shared/ScrollReveal'; // অ্যানিমেশন কম্পোনেন্ট

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
        <title>Video Editing Pricing | Premium Post-Production - Retouch Pro Studio</title>
        <meta name="description" content="Affordable and professional video editing pricing for reels, TikToks, and commercials. Choose your perfect plan." />
      </Helmet>

      {/* মেইন কন্টেইনারে ডার্ক থিম সেট করা হলো */}
      <div className="bg-[#070b19] text-white min-h-screen pt-32 pb-24 font-sans relative overflow-hidden">
        
        {/* ডার্ক নিয়ন গ্লোয়িং অরবিস (Glowing Orbs) ব্যাকগ্রাউন্ড */}
        <div className="absolute top-[-10%] right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Header Hero */}
        <div className="container mx-auto px-4 max-w-7xl text-center mb-20 relative z-10">
          <ScrollReveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
              <PlayCircle size={14} className="animate-pulse" />
              Cinema Grade Edits
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={150}>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              High-Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary-400">Video Editing</span> Plans
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              From social media reels to high-end commercials, choose a plan that brings your story to life.
            </p>
          </ScrollReveal>
        </div>

        {/* Pricing Cards Grid */}
        <section className="container mx-auto px-4 max-w-7xl relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching video plans...</p>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-stretch">
              {packages.map((pkg, index) => (
                <ScrollReveal key={pkg.id} direction="up" delay={index * 150}>
                  {/* গ্লাস-মরফিজম (Glassmorphism) ডার্ক কার্ড ডিজাইন */}
                  <div 
                    className={`bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border transition-all duration-300 flex flex-col justify-between h-full relative ${
                      pkg.isPopular 
                      ? 'border-purple-500 shadow-2xl shadow-purple-500/10 lg:-translate-y-4 ring-4 ring-purple-500/5' 
                      : 'border-white/5 hover:border-purple-500/30 shadow-xl hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-2'
                    }`}
                  >
                    {/* Floating Custom Badge */}
                    {pkg.isPopular && (
                      <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-primary-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/30">
                        Recommended
                      </div>
                    )}

                    <div>
                      {/* Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-white mb-3">{pkg.name}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed min-h-[48px]">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Price Block */}
                      <div className="flex items-baseline mb-8 pb-8 border-b border-white/5">
                        <span className="text-5xl font-black text-white tracking-tight">${pkg.price}</span>
                        <span className="text-slate-400 font-bold ml-2 text-sm">/ {pkg.unit}</span>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3.5 text-sm text-slate-300 font-medium">
                            <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Call To Action Button */}
                    <Link 
                      to="/quote" 
                      className={`w-full py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 group mt-8 ${
                        pkg.isPopular 
                        ? 'bg-gradient-to-r from-purple-600 to-primary-600 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02]' 
                        : 'bg-white/10 border border-white/10 text-white hover:bg-white hover:text-slate-950 hover:scale-[1.02]'
                      }`}
                    >
                      Get Started Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 max-w-4xl mx-auto shadow-sm">
              <Video className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300">No Video Plans Available</h3>
              <p className="text-slate-500 mb-8">We are tailoring our video packages. Check back soon!</p>
              <Link to="/contact" className="text-purple-400 font-bold hover:underline">Inquire Custom Project</Link>
            </div>
          )}
        </section>

        {/* Delivery Timeline Info */}
        <ScrollReveal direction="up" delay={150}>
          <div className="container mx-auto px-4 max-w-4xl mt-24 relative z-10">
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <Zap className="text-yellow-400" size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Fast Turnaround</h4>
                  <p className="text-slate-400 text-sm">Most videos delivered within 24-48 hours.</p>
                </div>
              </div>
              <div className="hidden md:block h-12 w-px bg-slate-800"></div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <Clock className="text-primary-400" size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">24/7 Support</h4>
                  <p className="text-slate-400 text-sm">Real-time updates via client dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
};

export default VideoPricingPage;