import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";

interface SessionData {
  id: string;
  customer_details: {
    name: string;
    email: string;
  };
  amount_total: number;
  currency: string;
  metadata: {
    firstName: string;
    lastName: string;
    planType: string;
    organization?: string;
  };
  created: number;
  line_items: Array<{
    description: string;
    amount_total: number;
    quantity: number;
  }>;
}

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/get-session?session_id=${sessionId}`);
        if (!response.ok) throw new Error("Failed to fetch session details");
        const data = await response.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("We couldn't retrieve your order details, but your payment was successful.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-[#f8fafc] font-sans flex items-center justify-center py-8">
      <SEO
        title="Purchase Confirmed | Elite Transformation Plan"
        description="Your transformation plan purchase has been confirmed."
        noindex={true}
      />
      <div className="w-[90%] max-w-[600px] animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        
        {/* Success Icon */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center border border-orange-500/20 text-orange-500">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>

        <h1 className="font-outfit text-4xl md:text-[2.5rem] font-extrabold text-center mb-2 uppercase tracking-tight">
          Purchase Confirmed.
        </h1>
        <p className="text-center text-[#94a3b8] mb-12 text-lg">
          Thank you for trusting the process. Here are your order details.
        </p>

        {/* Receipt Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] mb-8">
          <div className="p-8 border-b border-white/10 border-dashed relative">
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#0b1120] rounded-full" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#0b1120] rounded-full" />
            
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-[#94a3b8]">Order Number</span>
              <span className="font-semibold text-right">#{session?.id.slice(-10).toUpperCase() || "PENDING"}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-[#94a3b8]">Date</span>
              <span className="font-semibold text-right">{session ? formatDate(session.created) : formatDate(Date.now()/1000)}</span>
            </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-[#94a3b8] flex items-center gap-2">Customer</span>
                  <span className="text-white font-semibold">
                    {session?.customer_details?.name || (session?.metadata.firstName ? `${session.metadata.firstName} ${session.metadata.lastName}` : "Valued Client")}
                  </span>
                </div>
            <div className="flex justify-between mb-4 text-sm">
                <span className="text-[#94a3b8]">Payment Method</span>
                <span className="font-semibold text-right flex items-center gap-1">
                  Card Verified <Check className="w-3 h-3 text-emerald-500" />
                </span>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-white/5 p-6 rounded-2xl mb-6 border border-white/10">
              <div className="text-xs uppercase tracking-widest text-[#94a3b8] mb-1">Active Subscription</div>
              <div className="font-outfit font-bold text-xl text-orange-500 mb-1">
                {session?.line_items[0]?.description || session?.metadata.planType || "12-Week Elite Transformation"}
              </div>
              <p className="text-xs text-[#94a3b8]">Includes full access to custom nutrition & strategy calls.</p>
            </div>

            <div className="flex justify-between mb-4 text-sm">
              <span className="text-[#94a3b8]">Subtotal</span>
              <span className="font-semibold text-right">{session ? formatCurrency(session.amount_total, session.currency) : "$0.00"}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-[#94a3b8]">Tax / VAT</span>
              <span className="font-semibold text-right">$0.00</span>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
              <span className="font-outfit font-bold text-xl">Total Paid</span>
              <span className="font-outfit font-extrabold text-3xl text-orange-500">{session ? formatCurrency(session.amount_total, session.currency) : "$0.00"}</span>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            to="/user" 
            className="block w-full p-5 rounded-2xl text-center font-bold font-outfit text-white bg-orange-500 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:brightness-110 transition-all"
          >
            Go to Participant Dashboard
          </Link>
          <button 
            type="button"
            className="block w-full p-5 rounded-2xl text-center font-bold font-outfit text-[#94a3b8] bg-transparent border border-white/10 hover:border-[#94a3b8] hover:text-white transition-all"
          >
            Download PDF Receipt
          </button>
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-8 leading-relaxed">
          A copy of this receipt has been sent to {session?.customer_details.email || "your email"}.<br/>
          Secure payment processed via Stripe.
        </p>

        <style>
          {`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Success;
