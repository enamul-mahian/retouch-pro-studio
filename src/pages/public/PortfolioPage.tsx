import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllPortfolioItems } from '../../services/portfolioService';
import type { PortfolioItem } from '../../types/portfolio.types';
import BeforeAfterSlider from '../../components/portfolio/BeforeAfterSlider';
import { Loader2, Image as ImageIcon } from 'lucide-react';

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
        <title>Portfolio | Retouch Pro Studio - Professional Photo Editing Showcase</title>
        <meta name="description" content="Explore our professional photo editing and retouching portfolio. See before and after comparisons of our high-quality work." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Our Masterpieces
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Witness the transformation. Use the slider to compare our raw editing and the final polished results across various categories.
            </p>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="container mx-auto px-4 pb-24 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading our works...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-white dark:bg-slate-900 p-3 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-primary-300 transition-all duration-300"
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    <BeforeAfterSlider 
                      beforeImage={item.beforeImageUrl} 
                      afterImage={item.afterImageUrl} 
                    />
                  </div>
                  
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.category && (
                        <span className="text-sm font-medium text-primary-500 uppercase tracking-widest">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No portfolio items found</h3>
              <p className="text-slate-500">We are currently updating our showcase. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;