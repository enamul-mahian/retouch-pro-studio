import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import type { Service } from '../../types/service.types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2">
      
      {/* Service Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={service.imageUrl} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-primary-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            {service.category}
          </span>
        </div>

        {/* Pricing Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-full shadow-lg">
            <Tag size={12} />
            <span className="text-[11px] font-bold uppercase">Starts at ${service.startingPrice}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors">
          {service.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {service.shortDescription}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <Link 
            to={`/services/${service.slug}`}
            className="text-sm font-bold text-slate-700 hover:text-primary-600 flex items-center gap-2 transition-colors"
          >
            Learn More
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/quote" 
            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-primary-600 hover:text-white rounded-xl transition-all shadow-sm"
            title="Get Quote"
          >
            <ArrowRight size={18} className="-rotate-45" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;