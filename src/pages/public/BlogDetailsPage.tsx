import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft, Calendar, Clock, User, BookOpen } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, type DocumentData } from 'firebase/firestore';
import type { BlogPost } from '../../types/blog.types';

const BlogDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // স্লাগ (Slug) দিয়ে স্পেসিফিক ব্লগ পোস্টটি খুঁজে বের করা
        const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          const data = docData.data() as DocumentData;
          setBlog({
            id: docData.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
          } as BlogPost);
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">The blog post you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.seoTitle || blog.title} | Retouch Pro Studio Blog</title>
        <meta name="description" content={blog.seoDescription || blog.excerpt} />
        <meta name="keywords" content={blog.seoKeywords} />
      </Helmet>

      <div className="bg-surface min-h-screen py-12 md:py-20 font-sans">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8">
            <ArrowLeft size={18} /> Back to Blog
          </Link>

          {/* Article Header */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {blog.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-y border-slate-100 py-4 font-medium">
              <span className="flex items-center gap-2">
                <User size={16} className="text-primary-500" />
                By Retouch Pro Team
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-primary-500" />
                {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-primary-500" />
                5 min read
              </span>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="my-8 md:my-10 h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-premium border border-slate-100">
            <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Body (Rich Text) */}
          <article 
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed md:text-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />

          {/* Share/Footer Banner */}
          <div className="mt-16 bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Did you find this guide helpful?</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              We publish expert photography, retouching, and video marketing tips every week. Stay tuned for more!
            </p>
            <div className="pt-2">
              <Link to="/quote" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-soft">
                Get a Free Sample Edit
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BlogDetailsPage;