import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';

// ইম্পোর্ট পাথ ঠিক করে দেওয়া হলো (আপনার প্রজেক্টের স্ট্রাকচার অনুযায়ী)
import { getActiveServices } from '../../services/serviceService';
import ServiceCard from '../../components/services/ServiceCard';
import type { Service } from '../../types/service.types';
const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getActiveServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Services | Premium Image & Video Editing - Retouch Pro Studio</title>
        <meta name="description" content="Explore our professional clipping path, photo retouching, and video editing services. High-quality results with fast turnaround times for international clients." />
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        {/* Hero Section */}
        <section className="bg-slate-900 pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10 text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={16} />
              Professional Editing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Crafting Visual Excellence <br className="hidden md:block" /> for Your Brand
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              From pixel-perfect clipping paths to cinematic short videos, we provide industry-leading editing services tailored for your success.
            </p>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100">
              <Loader2 size={40} className="text-primary-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading our premium services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100 text-center px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Check back soon!</h2>
              <p className="text-slate-500 max-w-md">We are currently updating our service catalog to bring you the best editing solutions.</p>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        {!loading && services.length > 0 && (
          <section className="container mx-auto px-4 max-w-4xl mt-24 animate-fade-in">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-premium relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your media?</h2>
                <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                  Send us your files today and get a custom quote within 60 minutes. Experience world-class editing.
                </p>
                <Link 
                  to="/quote" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Get Your Free Quote
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ServicesPage;