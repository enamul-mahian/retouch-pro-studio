import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  Loader2, 
  Building, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

type PaymentMethod = 'stripe' | 'paypal' | 'wise';

const CheckoutPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');

  // PayPal SDK Loading State
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Manual Payment State (Wise / Bank)
  const [transactionId, setTransactionId] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // Stripe Card Data (Simulated)
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  // Fetch Order Data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const orderSnap = await getDoc(doc(db, 'orders', orderId));
        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
        } else {
          toast.error('Order not found!');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  // --- PayPal Integration ---
  useEffect(() => {
    if (selectedMethod === 'paypal' && order) {
      const existingScript = document.getElementById('paypal-sdk-script');
      if (existingScript) {
        setPaypalLoaded(true);
        return;
      }

      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
      const script = document.createElement('script');
      script.id = 'paypal-sdk-script';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => toast.error("Failed to load PayPal.");
      document.body.appendChild(script);
    }
  }, [selectedMethod, order]);

  useEffect(() => {
    if (paypalLoaded && selectedMethod === 'paypal' && order) {
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
        (window as any).paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: order.amount.toString() },
                description: `Retouch Pro Order #${order.id}`
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            setSubmitting(true);
            try {
              const details = await actions.order.capture();
              await addDoc(collection(db, 'payments'), {
                clientId: user?.uid,
                orderId: order.id,
                amount: order.amount,
                currency: 'USD',
                method: 'paypal',
                status: 'paid',
                transactionId: details.id,
                createdAt: serverTimestamp()
              });
              await updateDoc(doc(db, 'orders', order.id), { paymentStatus: 'paid' });
              toast.success("Payment Successful!");
              navigate('/dashboard/payments');
            } catch (err) {
              toast.error("Payment Capture Failed.");
            } finally {
              setSubmitting(false);
            }
          }
        }).render('#paypal-button-container');
      }
    }
  }, [paypalLoaded, selectedMethod, order, navigate, user?.uid]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !order || !user?.uid) return;

    setSubmitting(true);
    try {
      if (selectedMethod === 'stripe') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await addDoc(collection(db, 'payments'), {
          clientId: user.uid,
          orderId,
          amount: order.amount,
          method: 'card',
          status: 'paid',
          transactionId: 'sim_' + Math.random().toString(36).substr(2, 9),
          createdAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'orders', orderId), { paymentStatus: 'paid' });
        toast.success('Card payment processed successfully!');
        navigate('/dashboard/payments');
      } else if (selectedMethod === 'wise') {
        if (!transactionId) {
          toast.error('Please provide Transaction ID');
          setSubmitting(false);
          return;
        }
        await addDoc(collection(db, 'payments'), {
          clientId: user.uid,
          orderId,
          amount: order.amount,
          method: 'wise',
          status: 'pending',
          transactionId,
          paymentNote,
          createdAt: serverTimestamp()
        });
        toast.success('Payment details submitted for manual review.');
        navigate('/dashboard/payments');
      }
    } catch (error) {
      toast.error('Payment failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 size={40} className="text-primary-600 animate-spin" /></div>;

  return (
    <>
      <Helmet><title>Checkout | Secure Payment</title></Helmet>

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in font-sans">
        <Link to="/dashboard/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-bold text-sm">
          <ArrowLeft size={18} /> BACK TO ORDERS
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Methods & Forms */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-10">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8">Secure Checkout</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-10">
                <button
                  onClick={() => setSelectedMethod('stripe')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'stripe' ? 'border-primary-500 bg-primary-50/20 text-primary-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="text-[10px] font-black uppercase">Card</span>
                </button>
                
                <button
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'paypal' ? 'border-primary-500 bg-primary-50/20 text-primary-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <DollarSign size={24} />
                  <span className="text-[10px] font-black uppercase">PayPal</span>
                </button>

                <button
                  onClick={() => setSelectedMethod('wise')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'wise' ? 'border-primary-500 bg-primary-50/20 text-primary-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <Building size={24} />
                  <span className="text-[10px] font-black uppercase">Wise</span>
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {selectedMethod === 'stripe' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <input type="text" placeholder="Cardholder Name" required className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500" />
                    <input type="text" placeholder="Card Number" required className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-white outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" required className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-white outline-none" />
                      <input type="password" placeholder="CVC" required className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-white outline-none" />
                    </div>
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center animate-in fade-in">
                    <p className="text-sm text-slate-400 mb-6">Complete your purchase using PayPal or Cards</p>
                    <div id="paypal-button-container" className="min-h-[150px] flex items-center justify-center">
                       {!paypalLoaded && <Loader2 className="animate-spin text-primary-600" />}
                    </div>
                  </div>
                )}

                {selectedMethod === 'wise' && (
                  <div className="space-y-6 animate-in fade-in bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm space-y-3 font-mono text-xs">
                      <p className="text-slate-400 uppercase tracking-widest font-black">Wise Transfer Details</p>
                      <p className="text-slate-800 dark:text-white">Email: <span className="font-bold">pay@retouchprostudio.com</span></p>
                      <p className="text-slate-800 dark:text-white">Reference: <span className="font-bold">Order_{order.id.slice(-6)}</span></p>
                    </div>
                    <input type="text" placeholder="Transaction ID / Ref Number" required value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border-none rounded-xl text-white outline-none" />
                  </div>
                )}

                {selectedMethod !== 'paypal' && (
                  <button type="submit" disabled={submitting} className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" /> : `PAY $${order.amount}`}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-sm h-fit">
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Order Summary</h3>
            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Service</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{order.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Project</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm truncate max-w-[150px]">{order.title}</span>
              </div>
            </div>
            <div className="bg-primary-600 p-6 rounded-2xl text-white flex justify-between items-center">
              <span className="font-bold text-xs uppercase opacity-80">Total Due</span>
              <span className="text-3xl font-black">${order.amount}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;