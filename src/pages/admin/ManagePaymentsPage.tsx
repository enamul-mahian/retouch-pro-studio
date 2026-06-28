import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Loader2 } from 'lucide-react';
import { getAllPayments } from '../../services/adminPaymentService';
import type { PaymentRecord } from '../../types/payment.types';

const ManagePaymentsPage = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPayments().then(data => { setPayments(data); setLoading(false); });
  }, []);

  return (
    <>
      <Helmet><title>Manage Payments | Admin</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Payments</h1>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          {loading ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div> : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Client ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm">{p.clientId}</td>
                    <td className="px-6 py-4 text-sm font-bold">{p.amount} {p.currency}</td>
                    <td className="px-6 py-4 text-sm uppercase font-bold">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
export default ManagePaymentsPage;