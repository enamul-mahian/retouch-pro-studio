import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  Loader2, 
  Building, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

type PaymentMethod = 'stripe' | 'paypal' | 'wise' | 'bank_transfer';

const CheckoutPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');

  // ম্যানুয়াল পেমেন্ট ফর্ম স্টেট (Wise / Bank)
  const [transactionId, setTransactionId] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // কার্ড পেমেন্ট ফর্ম স্টেট (Stripe)
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  // ডাটাবেস থেকে অর্ডারের বিস্তারিত নিয়ে আসা
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const orderSnap = await getDoc(doc(db, 'orders', orderId));
        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
        } else {
          toast.error('অর্ডারটি খুঁজে পাওয়া যায়নি!');
        }
      } catch (error) {
        console.error('Error fetching order for checkout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !order || !user?.uid) return;

    setSubmitting(true);
    try {
      toast.loading('পেমেন্ট প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...', { id: 'payment-toast' });

      // ১. যদি কার্ড পেমেন্ট হয় (Stripe Simulation)
      if (selectedMethod === 'stripe') {
        // ২ সেকেন্ডের কৃত্রিম ডিলে (Real checkout feel দেওয়ার জন্য)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // ফায়ারস্টোরে পেমেন্ট রেকর্ড সেভ করা
        await addDoc(collection(db, 'payments'), {
          clientId: user.uid,
          orderId: orderId,
          amount: order.amount,
          currency: order.currency || 'USD',
          method: selectedMethod,
          status: 'paid', // সরাসরি পেইড
          transactionId: 'ch_' + Math.random().toString(36).substr(2, 9),
          paymentNote: 'Automated gateway payment simulation',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // অর্ডারের পেমেন্ট স্ট্যাটাস আপডেট করা
        await updateDoc(doc(db, 'orders', orderId), {
          paymentStatus: 'paid',
          updatedAt: serverTimestamp()
        });

        toast.success('পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!', { id: 'payment-toast' });
        navigate('/dashboard/payments');
      } 
      
      // ২. যদি ওয়াইজ বা ব্যাংক ট্রান্সফার হয় (Manual Simulation)
      else {
        if (!transactionId) {
          toast.error('দয়া করে ট্রানজ্যাকশন আইডি অথবা রেফারেন্স নম্বর দিন।', { id: 'payment-toast' });
          setSubmitting(false);
          return;
        }

        await addDoc(collection(db, 'payments'), {
          clientId: user.uid,
          orderId: orderId,
          amount: order.amount,
          currency: order.currency || 'USD',
          method: selectedMethod,
          status: 'pending', // অ্যাডমিন রিভিউ করার আগ পর্যন্ত পেন্ডিং থাকবে
          transactionId: transactionId,
          paymentNote: paymentNote,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // অর্ডারের স্ট্যাটাস 'unpaid' বা আংশিক রাখা
        await updateDoc(doc(db, 'orders', orderId), {
          paymentStatus: 'unpaid',
          updatedAt: serverTimestamp()
        });

        toast.success('পেমেন্টের তথ্য জমা হয়েছে! অ্যাডমিন রিভিউ করার পর এটি পেইড দেখাবে।', { id: 'payment-toast' });
        navigate('/dashboard/payments');
      }

    } catch (error) {
      console.error('Payment Processing Error:', error);
      toast.error('পেমেন্ট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।', { id: 'payment-toast' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl max-w-md mx-auto my-20">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800">Invalid Order</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">No order found for this payment request.</p>
        <Link to="/dashboard/orders" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Checkout | Retouch Pro Studio</title></Helmet>

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in font-sans">
        {/* Back Link */}
        <Link to="/dashboard/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft size={18} /> Back to My Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Payment Gateways Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Select Payment Method</h2>
              
              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('stripe')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'stripe' ? 'border-primary-500 bg-primary-50/20 text-primary-600' : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="text-xs font-bold">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wise')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'wise' ? 'border-primary-500 bg-primary-50/20 text-primary-600' : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building size={24} />
                  <span className="text-xs font-bold">Wise / Bank Transfer</span>
                </button>
              </div>

              {/* Dynamic Gateway Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                
                {/* Stripe Checkout Form */}
                {selectedMethod === 'stripe' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Cardholder Name</label>
                      <input 
                        type="text" name="name" required value={cardData.name} onChange={handleCardChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Card Number</label>
                      <input 
                        type="text" name="number" required value={cardData.number} onChange={handleCardChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        placeholder="4111 2222 3333 4444"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Expiry Date</label>
                        <input 
                          type="text" name="expiry" required value={cardData.expiry} onChange={handleCardChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">CVC</label>
                        <input 
                          type="password" name="cvc" required value={cardData.cvc} onChange={handleCardChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Wise / Bank Transfer Instructions */}
                {selectedMethod === 'wise' && (
                  <div className="space-y-5 animate-fade-in bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <HelpCircle size={18} className="text-primary-500" /> Manual Payment Instructions
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Please transfer the exact amount using **Wise** or standard UK **Bank Transfer**. Use your Order ID as the reference.
                    </p>
                    <div className="space-y-3 bg-white p-4 rounded-xl text-xs border border-slate-100 font-mono">
                      <div>
                        <span className="text-slate-400">Wise Email:</span> <br/>
                        <span className="text-slate-800 font-bold">pay@retouchprostudio.co.uk</span>
                      </div>
                      <hr className="border-slate-50" />
                      <div>
                        <span className="text-slate-400">UK Bank Account:</span> <br/>
                        <span className="text-slate-800 font-bold">Retouch Pro Studio Ltd.<br/>Sort Code: 12-34-56<br/>Account No: 98765432</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Transaction ID / Reference *</label>
                        <input 
                          type="text" required value={transactionId} onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="e.g. TR-98765432"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Additional Note</label>
                        <input 
                          type="text" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="Sent from Wise personal account..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-premium hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing Secure Payment...
                    </>
                  ) : (
                    <>
                      Pay ${order.amount || '0'} Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-soft p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-800">{order.serviceType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Order Title:</span>
                <span className="font-medium text-slate-800 max-w-[200px] truncate">{order.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono text-xs text-slate-600">{order.id}</span>
              </div>
            </div>
            <hr className="border-slate-50" />
            <div className="flex justify-between items-center bg-primary-50/50 p-4 rounded-2xl">
              <span className="text-sm font-semibold text-slate-600">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">${order.amount} {order.currency || 'USD'}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CheckoutPage;