import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Loader2, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { getAllServices } from '../../services/serviceService';
import type { Service } from '../../types/service.types';
import ScrollReveal from '../../components/shared/ScrollReveal';

const HomePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        const activeServices = data.filter(s => s.status === 'active').slice(0, 3);
        setServices(activeServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Retouch Pro Studio | Professional Image & Video Editing Services</title>
        <meta name="description" content="Top-tier photo retouching, clipping path, and short video editing services from Bangladesh. Serving UK and international clients with premium quality and fast delivery." />
      </Helmet>

      {/* Global Dark Background Wrapper */}
      <div className="bg-[#070b19] text-white min-h-screen relative overflow-hidden font-sans">
        
        {/* Abstract Background Decorations (Premium Neon Orbs) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden z-10">
          <div className="container mx-auto px-4 relative max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mt-10 md:mt-20">
              
              {/* Trust Badge */}
              <ScrollReveal direction="up" delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-bold uppercase tracking-widest mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Trusted by Global Brands</span>
                </div>
              </ScrollReveal>
              
              {/* Main Headline */}
              <ScrollReveal direction="up" delay={150}>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                  World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Image & Video</span> Editing Services
                </h1>
              </ScrollReveal>
              
              {/* Subheadline */}
              <ScrollReveal direction="up" delay={300}>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Elevate your brand with premium photo retouching, clipping path, and short video editing. Fast turnaround, unbeatable quality, and UK-standard professionalism.
                </p>
              </ScrollReveal>
              
              {/* CTA Buttons */}
              <ScrollReveal direction="up" delay={450}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    to="/quote" 
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-1"
                  >
                    Get Your Free Quote
                    <ArrowRight size={20} />
                  </Link>
                  <Link 
                    to="/portfolio" 
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white hover:text-slate-950 transition-all hover:-translate-y-1"
                  >
                    View Portfolio
                  </Link>
                </div>
              </ScrollReveal>
              
              {/* Feature Highlights */}
              <ScrollReveal direction="up" delay={600}>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-400 font-bold">
                  <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary-500" /> 100% Quality Guarantee</div>
                  <div className="flex items-center gap-2"><Zap size={18} className="text-purple-500" /> 12-24h Fast Delivery</div>
                  <div className="flex items-center gap-2"><Shield size={18} className="text-emerald-500" /> Secure Data Privacy</div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* Dynamic Services Section */}
        <section className="py-24 border-t border-white/5 relative z-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <ScrollReveal direction="up" delay={200}>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-bold uppercase tracking-widest mb-4">
                  <Sparkles size={14} className="animate-pulse" />
                  Premium Services
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Our Premium Services</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  We provide a comprehensive suite of editing services for e-commerce, photographers, and agencies.
                </p>
              </div>
            </ScrollReveal>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Loading our services...</p>
              </div>
            ) : services.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                          
                          {/* Price Badge */}
                          {service.startingPrice && (
                            <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold text-primary-400 shadow-lg">
                              From ${service.startingPrice}
                            </div>
                          )}
                        </div>
                        
                        <div className="px-4 pb-2">
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
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
                
                <div className="text-center">
                  <Link 
                    to="/services" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-950 rounded-full font-bold transition-all"
                  >
                    View All Services
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 max-w-4xl mx-auto shadow-sm">
                <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">No services available</h3>
                <p className="text-slate-500">We are currently updating our service list. Please check back soon.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;