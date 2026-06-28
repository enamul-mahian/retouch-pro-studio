import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllPortfolioItems } from '../../services/portfolioService';
import type { PortfolioItem } from '../../types/portfolio.types';
import BeforeAfterSlider from '../../components/portfolio/BeforeAfterSlider';
import { Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import ScrollReveal from '../../components/shared/ScrollReveal'; // অ্যানিমেশন কম্পোনেন্ট

const PortfolioPage = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getAllPortfolioItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio | Premium Photo Editing Showcase - Retouch Pro Studio</title>
        <meta name="description" content="Explore our professional photo editing and retouching portfolio. See before and after comparisons of our high-quality work." />
      </Helmet>

      {/* মেইন কন্টেইনারে ডার্ক থিম সেট করা হলো */}
      <div className="min-h-screen bg-[#070b19] text-white pb-24 font-sans relative overflow-hidden">
        
        {/* ডার্ক নিয়ন গ্লোয়িং অরбиস (Glowing Orbs) ব্যাকগ্রাউন্ড */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <ScrollReveal direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-black uppercase tracking-widest mb-6">
                <Sparkles size={14} className="animate-pulse" />
                Before & After Comparison
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={150}>
              <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                Our Masterpieces
              </h1>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={300}>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Witness the transformation. Use the slider to compare our raw editing and the final polished results across various categories.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="container mx-auto px-4 pb-24 max-w-7xl relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading our works...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
              {items.map((item, index) => (
                <ScrollReveal key={item.id} direction="up" delay={index * 150}>
                  {/* গ্লাস-মরফিজম (Glassmorphism) ডার্ক কার্ড ডিজাইন */}
                  <div className="group bg-slate-900/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 shadow-xl hover:shadow-2xl hover:shadow-primary-500/5 hover:-translate-y-2 transition-all duration-300">
                    
                    {/* Slider Wrapper with rounded corners and card layout */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-inner">
                      <BeforeAfterSlider 
                        beforeImage={item.beforeImageUrl} 
                        afterImage={item.afterImageUrl} 
                      />
                    </div>
                    
                    {/* Metadata and Description */}
                    <div className="p-6 flex items-center justify-between gap-4">
                      <div>
                        {item.category && (
                          <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] block mb-2">
                            {item.category}
                          </span>
                        )}
                        <h3 className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-slate-400 group-hover:text-primary-400 group-hover:bg-primary-950/30 transition-all shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 max-w-4xl mx-auto shadow-sm">
              <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300">No portfolio items found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-1">We are currently updating our showcase. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;