import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { getAllBlogs } from '../../services/blogService';
import type { BlogPost } from '../../types/blog.types';

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const allBlogs = await getAllBlogs();
        // শুধুমাত্র পাবলিশ করা ব্লগগুলো ফিল্টার করে নেওয়া হলো (ইনডেক্স এরর এড়াতে ফ্রন্টএন্ড ফিল্টারিং)
        const published = allBlogs.filter(blog => blog.status === 'published');
        setBlogs(published);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // প্রথম পোস্টটিকে Featured Post হিসেবে আলাদা করার লজিক
  const featuredPost = blogs.length > 0 ? blogs[0] : null;
  const remainingPosts = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <>
      <Helmet>
        <title>Blog & Industry Insights | Retouch Pro Studio</title>
        <meta name="description" content="Read the latest photography tips, e-commerce image optimization guides, and video editing insights from the experts at Retouch Pro Studio." />
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        
        {/* Blog Hero Section */}
        <section className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10 text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen size={16} />
              Insights & Guides
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
              Retouch Pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Studio Blog</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              Expert advice, tutorials, and trends in professional photo editing, e-commerce presentation, and short-form video marketing.
            </p>
          </div>
        </section>

        {/* Blog Main Section */}
        <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100">
              <Loader2 size={40} className="text-primary-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading insights...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-12">
              
              {/* Featured Post (Big Card) */}
              {featuredPost && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-8 animate-slide-up">
                  <div className="lg:col-span-7 h-64 md:h-96 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                    <img src={featuredPost.coverImageUrl} alt={featuredPost.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" />
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <span className="px-3 py-1.5 bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Featured Post
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug hover:text-primary-600 transition-colors">
                      <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(featuredPost.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        5 min read
                      </span>
                    </div>
                    <div className="pt-4">
                      <Link 
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white font-bold text-sm rounded-xl transition-all shadow-soft"
                      >
                        Read Article
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining Posts Grid */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((blog) => (
                    <div key={blog.id} className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden flex flex-col h-full">
                      <div className="h-48 overflow-hidden relative border-b border-slate-50">
                        <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex flex-col flex-1 space-y-3">
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                          <span>• 3 min read</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                          <Link to={`/blog/${blog.slug}`} className="text-xs font-bold text-slate-700 group-hover:text-primary-600 flex items-center gap-1.5 transition-colors">
                            Read More
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100 text-center px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <BookOpen size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">No articles found yet</h2>
              <p className="text-slate-500 max-w-md">Our team is currently preparing high-quality guides and tutorials. Please check back soon!</p>
            </div>
          )}
        </section>

      </div>
    </>
  );
};

export default BlogPage;