import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { getLegalPage, type LegalPage } from '../../services/legalPageService';

const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>(); // ইউআরএল থেকে পেজ আইডি (slug) ধরবে
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await getLegalPage(slug);
      setPage(data);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{page.title} | Retouch Pro Studio</title>
        <meta name="description" content={page.seoDescription} />
      </Helmet>

      <div className="bg-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">{page.title}</h1>
          <div 
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </>
  );
};

export default LegalPage;