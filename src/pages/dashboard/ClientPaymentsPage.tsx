import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Loader2, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getClientPayments } from '../../services/paymentService';
import type { PaymentRecord } from '../../types/payment.types';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'pending': return <Clock className="text-amber-500" size={18} />;
      default: return <AlertCircle className="text-rose-500" size={18} />;
    }
  };

  return (
    <>
      <Helmet><title>My Payments | Retouch Pro Studio</title></Helmet>

      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
          <p className="text-slate-500 text-sm mt-1">View your previous transactions and payment status.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">{payment.transactionId || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{payment.amount} {payment.currency}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{payment.method}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <DollarSign size={40} className="mx-auto mb-4 text-slate-300" />
              <p>No payment history found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientPaymentsPage;