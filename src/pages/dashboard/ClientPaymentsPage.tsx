import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Loader2, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getClientPayments } from '../../services/paymentService';
import type { PaymentRecord } from '../../types/payment.types';
import ScrollReveal from '../../components/shared/ScrollReveal';

const ClientPaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await getClientPayments(user.uid);
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user?.uid]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    }
  };

  return (
    <>
      <Helmet><title>My Payments | Retouch Pro Studio</title></Helmet>

      <div className="space-y-8 animate-in fade-in duration-500 font-sans">
        <ScrollReveal direction="up" delay={0}>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Payment History</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View your previous transactions and payment status.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>
            ) : payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">{payment.transactionId || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-800 dark:text-white">${payment.amount} <span className="font-normal opacity-70">{payment.currency}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{payment.method}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(payment.status)}`}>
                            {payment.status === 'paid' ? <CheckCircle2 size={12} /> : payment.status === 'pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                            {payment.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <DollarSign size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                <p>No payment history found.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </>
  );
};

export default ClientPaymentsPage;