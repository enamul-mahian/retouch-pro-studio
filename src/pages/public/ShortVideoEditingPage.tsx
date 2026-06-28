import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Smartphone, 
  Video, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Volume2,
  Film
} from 'lucide-react';

const ShortVideoEditingPage = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // স্যাম্পল শর্ট ভিডিও ডাটা (TikTok/Reels স্টাইল - ৯:১৬ অ্যাসপেক্ট রেশিও)
  const demoVideos = [
    {
      id: 1,
      title: 'E-Commerce Product Promo',
      category: 'Product Ad',
      duration: '15s',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-man-working-on-his-laptop-42171-large.mp4'
    },
    {
      id: 2,
      title: 'Fashion Reel Edit',
      category: 'Lifestyle',
      duration: '20s',
      thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-vertical-portrait-of-a-woman-in-the-city-43632-large.mp4'
    },
    {
      id: 3,
      title: 'Dynamic Tech Review',
      category: 'YouTube Shorts',
      duration: '30s',
      thumbnail: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-smartphone-on-a-desk-42168-large.mp4'
    }
  ];

  // ভিডিও এডিটিং প্যাকেজসমূহ
  const packages = [
    {
      name: 'Starter Byte',
      price: '29',
      features: [
        'Up to 15 Seconds Video',
        'Basic Cuts & Transitions',
        'Color Correction',
        'Royalty-Free Background Music',
        '1 Revision',
        '24-48 Hours Delivery'
      ],
      popular: false
    },
    {
      name: 'Viral Reel / TikTok',
      price: '49',
      features: [
        'Up to 30 Seconds Video',
        'Dynamic Text Captions/Subtitles',
        'Trending Sound Design',
        'Advance Transitions & Effects',
        'Unlimited Revisions',
        '24 Hours Express Delivery'
      ],
      popular: true
    },
    {
      name: 'Brand Video Ad',
      price: '89',
      features: [
        'Up to 30 Seconds Premium Ad',
        'Professional Color Grading',
        'Kinetic Typography',
        'Sound Effects & SFX',
        'Custom Branding/Logo Intro',
        'Unlimited Revisions'
      ],
      popular: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Short Video Editing Services | TikTok, Reels & Ads - Retouch Pro Studio</title>
        <meta name="description" content="Premium 15-30s short video editing services from Bangladesh. Perfect for TikTok, Instagram Reels, YouTube Shorts, and viral video ads with fast delivery." />
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        
        {/* Hero Section */}
        <section className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10 text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-accent-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={16} />
              Reels, TikTok & Shorts Specialist
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
              Make Your Brand Go Viral with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Short-Form Video</span> Editing
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Capture your audience’s attention in the first 3 seconds. We edit highly engaging 15-30s videos designed for maximum retention and conversions.
            </p>
            <Link 
              to="/quote" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold transition-all shadow-premium"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Core Value/Features Section */}
        <section className="container mx-auto px-4 max-w-7xl py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Why Choose Our Short Video Editing?</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">
              We don't just cut videos; we design them for social media algorithms and high audience watch-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Mobile-First 9:16 Format</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Optimized for vertical viewing, perfect for mobile platforms like Instagram, TikTok, Shorts, and Snapchat.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mb-6">
                <Volume2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Viral Subtitles & Sound</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Captivating kinetic typography/subtitles and trending sound effects to keep users hooked without sound.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Film size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Color Grading & FX</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Cinema-grade color correction, smooth zoom-ins, and pattern cuts that drastically increase watch retention.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Videos / Portfolio Section */}
        <section className="bg-white py-20 border-y border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-800">Our Short Video Portfolio</h2>
              <p className="text-slate-500 mt-4 text-sm">Click on any video to preview our editing style.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {demoVideos.map((video) => (
                <div 
                  key={video.id} 
                  onClick={() => setActiveVideoUrl(video.videoUrl)}
                  className="group bg-slate-50 rounded-3xl overflow-hidden shadow-soft cursor-pointer relative aspect-[9/16] max-w-[280px] mx-auto border border-slate-200"
                >
                  <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{video.category}</span>
                    <h3 className="text-white font-bold text-lg mt-1">{video.title}</h3>
                    <p className="text-slate-300 text-xs flex items-center gap-1.5 mt-2">
                      <Clock size={12} /> {video.duration} Delivery
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={24} className="ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparent Pricing Table */}
        <section className="container mx-auto px-4 max-w-7xl py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Simple & Transparent Pricing</h2>
            <p className="text-slate-500 mt-4 text-sm">No hidden fees. Pay per video or subscribe for bulk packages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {packages.map((pkg) => (
              <div 
                key={pkg.name} 
                className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all ${
                  pkg.popular 
                    ? 'border-primary-500 shadow-premium relative md:-translate-y-4' 
                    : 'border-slate-100 shadow-soft hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{pkg.name}</h3>
                    <div className="flex items-baseline mt-4 gap-1">
                      <span className="text-4xl font-extrabold text-slate-900">${pkg.price}</span>
                      <span className="text-sm font-semibold text-slate-400">/ per video</span>
                    </div>
                  </div>
                  <hr className="border-slate-100" />
                  <ul className="space-y-4 text-sm text-slate-600 font-medium">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-primary-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link 
                  to="/quote"
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all mt-8 ${
                    pkg.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Order This Package
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Video Player Modal (Vertical Player) */}
        {activeVideoUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setActiveVideoUrl(null)}>
            <div className="relative max-w-[340px] w-full bg-slate-950 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
              <video 
                src={activeVideoUrl} 
                autoPlay 
                controls 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ShortVideoEditingPage;

// helper component icon
const XCircle = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);