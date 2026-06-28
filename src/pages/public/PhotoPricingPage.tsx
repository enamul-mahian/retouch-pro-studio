import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getPackagesByCategory } from '../../services/packageService';
import type { PricingPackage } from '../../types/package.types';
import { CheckCircle2, ArrowRight, Tag, Loader2, Image as ImageIcon } from 'lucide-react';

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
        <title>Photo Editing Pricing | Retouch Pro Studio</title>
        <meta name="description" content="Professional photo editing and retouching services at affordable prices." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-6">
            Professional <span className="text-primary-600">Photo Editing</span> Pricing
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Choose the perfect plan for your e-commerce products or photography projects.
          </p>
        </div>

        <section className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary-600 animate-spin" /></div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-xl transition-all">
                  {pkg.isPopular && (
                    <span className="bg-primary-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full w-fit mb-4">Most Popular</span>
                  )}
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{pkg.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">{pkg.description}</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${pkg.price}</span>
                    <span className="text-sm text-slate-400 ml-1">/ {pkg.unit}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 size={18} className="text-primary-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/quote" className="w-full py-4 bg-slate-900 dark:bg-primary-600 text-white rounded-xl font-bold text-center hover:opacity-90 transition-all">
                    Order This Package
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No packages found</h3>
              <p className="text-slate-500">Please add packages from the Admin Panel.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default PhotoPricingPage;