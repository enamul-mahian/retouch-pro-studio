import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getPackagesByCategory } from '../../services/packageService';
import type { PricingPackage } from '../../types/package.types';
import { CheckCircle2, Loader2, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../components/shared/ScrollReveal';

const PhotoPricingPage = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getPackagesByCategory('image-editing');
        setPackages(data);
      } catch (error) {
        console.error("Error fetching photo packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <>
      <Helmet>
        <title>Photo Editing Pricing | Premium Post-Production - Retouch Pro Studio</title>
        <meta name="description" content="Professional photo editing and high-end retouching services at affordable prices. See our clear pay-as-you-go packages." />
      </Helmet>

      <div className="bg-[#070b19] text-white min-h-screen pt-32 pb-24 font-sans relative overflow-hidden">
        
        {/* Background Neon Orbs */}
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Header Section */}
        <div className="container mx-auto px-4 max-w-7xl text-center mb-20 relative z-10">
          <ScrollReveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} className="animate-pulse" />
              Pay-As-You-Go Plans
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={150}>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Photo Editing</span> Pricing
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Transparent pricing with zero hidden fees. Choose a plan that fits your studio requirements and scale your content seamlessly.
            </p>
          </ScrollReveal>
        </div>

        {/* Pricing Cards Grid */}
        <section className="container mx-auto px-4 max-w-7xl relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Loading premium plans...</p>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-stretch">
              {packages.map((pkg, index) => (
                <ScrollReveal key={pkg.id} direction="up" delay={index * 150}>
                  {/* ওপরে বেশি প্যাডিং (pt-12) দিয়ে কন্টেন্টকে নিচে নামিয়ে নেওয়া হয়েছে */}
                  <div 
                    className={`bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] pt-12 pb-8 px-8 border transition-all duration-300 flex flex-col justify-between h-full relative ${
                      pkg.isPopular 
                      ? 'border-primary-500 shadow-2xl shadow-primary-500/10 lg:-translate-y-4 ring-4 ring-primary-500/5' 
                      : 'border-white/5 hover:border-primary-500/30 shadow-xl hover:shadow-2xl hover:shadow-primary-500/5 hover:-translate-y-2'
                    }`}
                  >
                    {/* Floating Custom Badge exactly on the top border */}
                    {pkg.isPopular && (
                      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/30 whitespace-nowrap z-10">
                        Most Popular
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
                            <CheckCircle2 size={18} className="text-primary-400 shrink-0 mt-0.5" />
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
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/20 hover:scale-[1.02]' 
                        : 'bg-white/10 border border-white/10 text-white hover:bg-white hover:text-slate-950 hover:scale-[1.02]'
                      }`}
                    >
                      Order This Package
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 max-w-4xl mx-auto shadow-sm">
              <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Packages Available</h3>
              <p className="text-slate-500 max-w-sm mx-auto">We are currently setting up our photo editing plans. Please check back later or contact us directly.</p>
              <Link to="/contact" className="text-primary-400 font-bold hover:underline inline-block mt-4">Inquire Custom Project</Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default PhotoPricingPage;