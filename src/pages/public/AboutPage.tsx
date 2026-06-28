import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Target, 
  ShieldCheck, 
  Zap, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud, 
  Wand2, 
  Download
} from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { value: '5M+', label: 'Images Edited' },
    { value: '99%', label: 'Client Satisfaction' },
    { value: '12h', label: 'Average Turnaround' },
    { value: '50+', label: 'Countries Served' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We follow UK-standard quality control processes to ensure every pixel is perfect before delivery.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Time is money. Our optimized workflow ensures 12-24 hours delivery for standard projects without compromising quality.'
    },
    {
      icon: ShieldCheck,
      title: 'Maximum Security',
      description: 'Your files are safe with us. We use encrypted servers and sign NDAs to protect your intellectual property.'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Get 24/7 priority support from our dedicated project managers who understand your specific needs.'
    }
  ];

  const processSteps = [
    {
      icon: UploadCloud,
      title: '1. Upload Files',
      description: 'Securely upload your raw files through our client portal with your specific instructions.'
    },
    {
      icon: Wand2,
      title: '2. We Edit',
      description: 'Our expert retouching team works their magic following your exact guidelines.'
    },
    {
      icon: CheckCircle2,
      title: '3. Quality Check',
      description: 'A dedicated QA manager reviews the edited files to ensure zero defects.'
    },
    {
      icon: Download,
      title: '4. Download',
      description: 'Get notified and download your polished, ready-to-use images instantly.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Retouch Pro Studio</title>
        <meta name="description" content="Learn about Retouch Pro Studio, our mission, our premium photo editing process, and why thousands of clients trust us worldwide." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Target size={16} />
              Our Mission
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
              Redefining Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Excellence</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We are a team of passionate digital artists and retouching experts from Bangladesh, helping global brands, photographers, and agencies scale their visual content.
            </p>
          </div>
        </section>

        {/* Stats Section (Overlapping Hero) */}
        <section className="container mx-auto px-4 max-w-5xl -mt-10 relative z-20 mb-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100 dark:divide-slate-800 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-purple-600">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4 max-w-7xl mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
                Built on Trust, Driven by <span className="text-primary-600">Quality</span>.
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <p>
                  Started with a simple vision to provide affordable yet high-end photo editing services, Retouch Pro Studio has grown into a trusted partner for e-commerce brands and professional photographers worldwide.
                </p>
                <p>
                  We don't just edit photos; we enhance your brand's identity. By taking the tedious post-production work off your shoulders, we give you the freedom to focus on what you do best—creating and growing your business.
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {['No hidden costs or setup fees', 'Strict NDA and privacy policies', 'Dedicated team for bulk projects'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Premium Image Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Editor working" 
                  className="rounded-3xl object-cover w-full h-64 md:h-80 shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Team meeting" 
                  className="rounded-3xl object-cover w-full h-64 md:h-80 shadow-lg mt-8"
                />
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white dark:bg-slate-900 py-24 border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Why Brands Choose Us</h2>
              <p className="text-slate-500 dark:text-slate-400">Our core values reflect everything we do. We strive to provide an unparalleled experience for our clients.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-slate-100 dark:border-slate-800 group">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{val.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{val.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How We Work (Process) */}
        <section className="container mx-auto px-4 max-w-7xl py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Our Simple Workflow</h2>
            <p className="text-slate-500 dark:text-slate-400">A streamlined process designed to save you time and deliver outstanding results.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 dark:from-slate-800 dark:via-primary-900 dark:to-slate-800 -z-10 -translate-y-8"></div>
            
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="text-center relative">
                  <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 rounded-full flex items-center justify-center text-primary-600 shadow-xl mb-6 relative z-10">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-4">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 max-w-5xl mt-10">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Ready to transform your images?</h2>
              <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of happy clients who have scaled their business with our professional editing services.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/quote" 
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Get Your Free Quote
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/portfolio" 
                  className="w-full sm:w-auto px-8 py-4 bg-primary-700/50 hover:bg-primary-700 text-white border border-primary-500/50 rounded-full font-bold transition-all flex items-center justify-center backdrop-blur-md"
                >
                  View Our Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default AboutPage;