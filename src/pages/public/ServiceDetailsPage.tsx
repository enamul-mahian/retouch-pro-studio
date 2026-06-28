import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft, Tag, Clock, CheckCircle } from 'lucide-react';
import { getServiceBySlug } from '../../services/serviceService';
import type { Service } from '../../types/service.types';

const ServiceDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await getServiceBySlug(slug);
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Service not found</h2>
        <Link to="/services" className="text-primary-600 mt-4 block">Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{service.seoTitle} | Retouch Pro Studio</title>
        <meta name="description" content={service.seoDescription} />
      </Helmet>

      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <Link to="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Services
          </Link>

          {/* Service Header */}
          <div className="mb-10">
            <span className="text-primary-600 font-bold text-xs uppercase tracking-widest">{service.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-6">{service.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full font-bold text-sm">
                <Tag size={18} className="text-primary-600" /> Starts at ${service.startingPrice}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-80 md:h-[400px] object-cover rounded-3xl shadow-premium mb-12"
          />

          {/* Description Content */}
          <div className="prose prose-lg max-w-none text-slate-600">
            <div dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Interested in this service?</h3>
            <p className="text-slate-400 mb-8">Get a custom quote tailored to your project requirements.</p>
            <Link 
              to="/quote" 
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold transition-all"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailsPage;