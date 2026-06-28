import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  getPackagesByCategory 
} from '../../services/packageService';
import type { PricingPackage } from '../../types/package.types';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Tag, 
  Layers,
  Video,
  Loader2
} from 'lucide-react';

const PricingPage = () => {
  const [activeCategory, setActiveCategory] = useState<'image-editing' | 'video-editing'>('image-editing');
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch packages based on active category
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getPackagesByCategory(activeCategory);
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [activeCategory]);

  // Static FAQs data (can be moved to a service later if needed)
  const faqs = [
    {
      q: "How do I pay for my orders?",
      a: "We accept payments through standard credit/debit cards (via Stripe), PayPal, and manual bank transfers or Wise. You can easily complete payments directly from your Client Dashboard."
    },
    {
      q: "Do you offer discounts for bulk orders?",
      a: "Absolutely! For high-volume projects (over 500 images per month or bulk video editing), we offer customized discounts of up to 30%. Please request a custom quote to discuss your project."
    },
    {
      q: "What is your typical turnaround time?",
      a: "Our standard delivery time is 12-24 hours for image editing and 24-48 hours for short video editing. Express delivery options (under 12 hours) are available for urgent projects."
    },
    {
      q: "What if I am not satisfied with the quality?",
      a: "We offer a 100% quality guarantee. If you are not satisfied with the results, we will revise the files for free until you are fully satisfied. We also offer a free trial for new clients to test our quality before committing."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing Packages | Affordable Image & Video Editing - Retouch Pro Studio</title>
        <meta name="description" content="Transparent and affordable pricing for clipping path, photo retouching, and short video editing services. Pay per image or choose custom bulk packages." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
        
        {/* Header Hero Section */}
        <section className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Tag size={16} />
              Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
              Simple, Honest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Pay-As-You-Go</span> Pricing
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              No subscription traps. Pay only for the files you need edited. High-quality output with maximum security.
            </p>
          </div>
        </section>

        {/* Category Selector Tabs */}
        <div className="container mx-auto px-4 max-w-md -mt-8 relative z-20 mb-16">
          <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveCategory('image-editing')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeCategory === 'image-editing' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers size={18} />
              Image Editing
            </button>
            <button
              onClick={() => setActiveCategory('video-editing')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeCategory === 'video-editing' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Video size={18} />
              Video Editing
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <section className="container mx-auto px-4 max-w-7xl min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching packages...</p>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                    pkg.isPopular 
                      ? 'border-primary-500 shadow-2xl relative lg:-translate-y-4 ring-4 ring-primary-500/5' 
                      : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-xl text-slate-800 dark:text-white">{pkg.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[32px] leading-relaxed">
                        {pkg.description}
                      </p>
                      <div className="flex items-baseline mt-5 gap-1">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${pkg.price}</span>
                        <span className="text-sm font-semibold text-slate-400">/ {pkg.unit}</span>
                      </div>
                    </div>
                    <hr className="border-slate-100 dark:border-slate-800" />
                    <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link 
                    to="/quote"
                    className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all mt-10 ${
                      pkg.isPopular 
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Order This Package
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No packages available</h3>
              <p className="text-slate-500">We are currently updating our pricing. Please check back later.</p>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 max-w-4xl mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-3 text-sm">Everything you need to know about our billing and pricing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 hover:text-primary-600 transition-colors"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  <HelpCircle size={20} className="text-primary-500 shrink-0 ml-4" />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bulk Custom Quote Card */}
        <section className="container mx-auto px-4 max-w-4xl mt-20">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Have bulk projects or custom needs?</h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                We offer up to 30% discounts for agencies and photographers with high-volume monthly editing needs.
              </p>
              <Link 
                to="/quote" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Get Custom Bulk Quote
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default PricingPage;