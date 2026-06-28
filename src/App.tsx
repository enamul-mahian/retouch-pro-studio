import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Imports
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import QuotePage from './pages/public/QuotePage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailsPage from './pages/public/ServiceDetailsPage';
import LegalPage from './pages/public/LegalPage';
import PortfolioPage from './pages/public/PortfolioPage';
import ShortVideoEditingPage from './pages/public/ShortVideoEditingPage';
import PhotoPricingPage from './pages/public/PhotoPricingPage';
import VideoPricingPage from './pages/public/VideoPricingPage';
import BlogPage from './pages/public/BlogPage';
import BlogDetailsPage from './pages/public/BlogDetailsPage';

// Client Dashboard Pages
import ClientDashboardPage from './pages/dashboard/ClientDashboardPage';
import MyQuotesPage from './pages/dashboard/MyQuotesPage';
import ClientProfilePage from './pages/dashboard/ClientProfilePage';
import ClientPaymentsPage from './pages/dashboard/ClientPaymentsPage';
import MyOrdersPage from './pages/dashboard/MyOrdersPage';
import CheckoutPage from './pages/dashboard/CheckoutPage';
import MyFilesPage from './pages/dashboard/MyFilesPage';
import TeammateDashboardPage from './pages/dashboard/TeammateDashboardPage'; // নতুন ইম্পোর্ট

// Admin Dashboard Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageQuotesPage from './pages/admin/ManageQuotesPage';
import ManageServicesPage from './pages/admin/ManageServicesPage';
import ManagePortfolioPage from './pages/admin/ManagePortfolioPage';
import ManageLegalPagesPage from './pages/admin/ManageLegalPagesPage';
import ManageBlogPage from './pages/admin/ManageBlogPage';
import ManagePaymentsPage from './pages/admin/ManagePaymentsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ManagePackagesPage from './pages/admin/ManagePackagesPage';
import ManageClientsPage from './pages/admin/ManageClientsPage';
import ManageSettingsPage from './pages/admin/ManageSettingsPage';
import ManageTeammatesPage from './pages/admin/ManageTeammatesPage';
import ManageTasksPage from './pages/admin/ManageTasksPage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-surface text-slate-800">
      <Toaster position="top-right" />

      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/short-video-editing" element={<ShortVideoEditingPage />} />
          <Route path="/photo-editing-pricing" element={<PhotoPricingPage />} />
          <Route path="/video-editing-pricing" element={<VideoPricingPage />} />
          <Route path="/pricing" element={<Navigate to="/photo-editing-pricing" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailsPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
        </Route>

        {/* --- Auth Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Client/Teammate Dashboard Routes --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<ClientDashboardPage />} />
          <Route path="quotes" element={<MyQuotesPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="profile" element={<ClientProfilePage />} />
          <Route path="payments" element={<ClientPaymentsPage />} />
          <Route path="checkout/:orderId" element={<CheckoutPage />} />
          <Route path="files" element={<MyFilesPage />} />
          
          {/* এখানে Teammate Dashboard রাউট যুক্ত করা হলো */}
          <Route path="tasks" element={<TeammateDashboardPage />} />
        </Route>

        {/* --- Protected Admin Dashboard Routes --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="quotes" element={<ManageQuotesPage />} />
          <Route path="orders" element={<ManageOrdersPage />} />
          <Route path="tasks" element={<ManageTasksPage />} />
          <Route path="services" element={<ManageServicesPage />} />
          <Route path="portfolio" element={<ManagePortfolioPage />} />
          <Route path="legal" element={<ManageLegalPagesPage />} />
          <Route path="blog" element={<ManageBlogPage />} />
          <Route path="payments" element={<ManagePaymentsPage />} />
          <Route path="pricing" element={<ManagePackagesPage />} />
          <Route path="clients" element={<ManageClientsPage />} />
          <Route path="teammates" element={<ManageTeammatesPage />} />
          <Route path="settings" element={<ManageSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;