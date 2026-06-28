import { Helmet } from 'react-helmet-async';
import { CheckCircle2, ShieldCheck, Clock, Zap } from 'lucide-react';
import QuoteRequestForm from '../../components/forms/QuoteRequestForm';

const QuotePage = () => {
  return (
    <>
      <Helmet>
        <title>Get a Free Quote | Retouch Pro Studio</title>
        <meta name="description" content="Request a free quote for your image and video editing projects. Get premium quality results with 12-24 hours turnaround." />
      </Helmet>

      <div className="bg-surface min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 animate-slide-up">
              Request a <span className="text-primary-600">Free Quote</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Tell us about your project and get a custom quote within 30-60 minutes. 
              We offer a free trial for new international clients.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side: Trust & Info (Visible on Desktop) */}
            <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Trust Cards */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  Why Work With Us?
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Fast Turnaround</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Most projects are delivered within 12 to 24 hours.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Privacy Guaranteed</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Your files are 100% secure with our encrypted system.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Free Trial</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Get up to 2 images edited for free to test our quality.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What Happens Next Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-premium">
                <h3 className="font-bold mb-4">What's Next?</h3>
                <div className="space-y-4">
                  {[
                    'We review your requirements',
                    'Send you a customized quote',
                    'Start working after your approval',
                    'Deliver high-quality results'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 size={16} className="text-primary-400" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: The Actual Form */}
            <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
                {/* Form Header for Mobile */}
                <div className="bg-primary-600 p-6 text-center text-white lg:hidden">
                  <h2 className="text-xl font-bold">Project Details</h2>
                  <p className="text-primary-100 text-xs">Fill out the form below</p>
                </div>
                
                <div className="p-6 md:p-10">
                  <QuoteRequestForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default QuotePage;