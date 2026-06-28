import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getPackagesByCategory } from '../../services/packageService';
import type { PricingPackage } from '../../types/package.types';
import type { Service } from '../../types/service.types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  CheckCircle2, 
  Loader2, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowRight,
  Layers
} from 'lucide-react';
import ScrollReveal from '../../components/shared/ScrollReveal';

const PhotoPricingPage = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        // ১. ক্যাটাগরি অনুযায়ী প্রাইসিং প্যাকেজ নিয়ে আসা
        const packageData = await getPackagesByCategory('image-editing');
        setPackages(packageData);

        // ২. ডাটাবেস থেকে সব সার্ভিস এনে ইন-মেমোরি ফিল্টারের মাধ্যমে 'Image Editing' এর সার্ভিসগুলো আলাদা করা
        const servicesSnap = await getDocs(collection(db, 'services'));
        const allServices = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
        
        const photoServices = allServices.filter(
          s => s.status === 'active' && s.category === 'Image Editing'
        );
        setServices(photoServices);

      } catch (error) {
        console.error("Error loading photo page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Photo Editing Services & Pricing | Retouch Pro Studio</title>
        <meta name="description" content="Professional photo editing and high-end retouching services at affordable prices. See our active photo editing services and packages." />
      </Helmet>

      {/* মেইন ডার্ক থিম কন্টেইনার */}
      <div className="bg-[#070b19] text-white min-h-screen pt-32 pb-24 font-sans relative overflow-hidden">
        
        {/* ডার্ক নিয়ন গ্লোয়িং অরবিস ব্যাকগ্রাউন্ড */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Header Section */}
        <div className="container mx-auto px-4 max-w-7xl text-center mb-20 relative z-10">
          <ScrollReveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} className="animate-pulse" />
              Photo Post-Production Hub
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={150}>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Photo Editing</span> Studio
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our range of professional image retouching, background removal, and color grading services below.
            </p>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 relative z-10">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Syncing database assets...</p>
          </div>
        ) : (
          <div className="space-y-24 relative z-10">
            
            {/* --- SECTION 1: DYNAMIC SERVICE CARDS --- */}
            {services.length > 0 && (
              <section className="container mx-auto px-4 max-w-7xl">
                <ScrollReveal direction="up" delay={100}>
                  <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Photo Services</h2>
                    <p className="text-slate-500 text-sm">Select any service to read full description and details.</p>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {services.map((service, index) => (
                    <ScrollReveal key={service.id} direction="up" delay={index * 150}>
                      {/* গ্লাস-মরফিজম (Glassmorphism) ডার্ক কার্ড ডিজাইন */}
                      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-4 border border-white/5 shadow-xl hover:shadow-2xl hover:shadow-primary-500/5 hover:border-primary-500/30 hover:-translate-y-2 transition-all duration-300 group">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-slate-800">
                          {service.imageUrl ? (
                            <img 
                              src={service.imageUrl} 
                              alt={service.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={48} />
                            </div>
                          )}
                          
                          {service.startingPrice && (
                            <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold text-primary-400 shadow-lg">
                              From ${service.startingPrice}
                            </div>
                          )}
                        </div>
                        
                        <div className="px-4 pb-2">
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-600 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                            {service.shortDescription}
                          </p>
                          <Link 
                            to={`/services/${service.slug}`} 
                            className="inline-flex items-center gap-2 text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors"
                          >
                            Explore Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* --- SECTION 2: DYNAMIC PRICING PLANS --- */}
            <section className="container mx-auto px-4 max-w-7xl">
              <ScrollReveal direction="up" delay={100}>
                <div className="text-center mb-16 border-t border-white/5 pt-16">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Layers size={14} /> Price Packages
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Simple & Transparent Pricing</h2>
                  <p className="text-slate-400 max-w-xl mx-auto">No hidden costs. Choose a suitable package according to your workload and project limit.</p>
                </div>
              </ScrollReveal>

              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-stretch">
                  {packages.map((pkg, index) => (
                    <ScrollReveal key={pkg.id} direction="up" delay={index * 150}>
                      <div 
                        className={`bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] pt-12 pb-8 px-8 border transition-all duration-300 flex flex-col justify-between h-full relative ${
                          pkg.isPopular 
                          ? 'border-primary-500 shadow-2xl shadow-primary-500/10 lg:-translate-y-4 ring-4 ring-primary-500/5' 
                          : 'border-white/5 hover:border-primary-500/30 shadow-xl hover:shadow-2xl hover:shadow-primary-500/5 hover:-translate-y-2'
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/30 whitespace-nowrap z-10">
                            Most Popular
                          </div>
                        )}

                        <div>
                          <div className="mb-6">
                            <h3 className="text-2xl font-black text-white mb-3">{pkg.name}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed min-h-[48px]">
                              {pkg.description}
                            </p>
                          </div>

                          <div className="flex items-baseline mb-8 pb-8 border-b border-white/5">
                            <span className="text-5xl font-black text-white tracking-tight">${pkg.price}</span>
                            <span className="text-slate-400 font-bold ml-2 text-sm">/ {pkg.unit}</span>
                          </div>

                          <ul className="space-y-4 mb-8">
                            {pkg.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-3.5 text-sm text-slate-300 font-medium">
                                <CheckCircle2 size={18} className="text-primary-400 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

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
                  <p className="text-slate-500 max-w-sm mx-auto">Please add photo editing packages from the Admin Panel.</p>
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </>
  );
};

export default PhotoPricingPage;