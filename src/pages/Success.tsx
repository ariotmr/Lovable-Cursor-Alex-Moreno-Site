import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Calendar, Package, CreditCard, User, ArrowRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
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
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 selection:bg-orange-500/30">
      <SEO
        title="Purchase Confirmed — Alex Moreno"
        description="Your transformation plan purchase has been confirmed. Welcome to your journey."
        noindex={true}
      />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(249,115,22,0.15)] text-orange-500"
            >
              <Check className="w-10 h-10 stroke-[3]" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 font-outfit text-white">
              Purchase Confirmed.
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Thank you for trusting the process. Your transformation journey officially begins today.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl mb-8">
            {/* Receipt Header */}
            <div className="p-8 border-b border-white/5 border-dashed relative">
              {/* Notches */}
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#0b1120] rounded-full" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#0b1120] rounded-full" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Package className="w-4 h-4" /> Order ID</span>
                  <span className="font-mono text-white tracking-wider">{session?.id.slice(-12).toUpperCase() || "#PENDING"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                  <span className="text-white font-semibold">{session ? formatDate(session.created) : formatDate(Date.now()/1000)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4" /> Customer</span>
                  <span className="text-white font-semibold">{session?.metadata.firstName} {session?.metadata.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    Verified <Check className="w-3 h-3 text-emerald-500" />
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">Active Program</div>
                <h3 className="text-xl font-bold font-outfit text-white mb-2">
                  {session?.line_items[0]?.description || session?.metadata.planType || "12-Week Transformation Plan"}
                </h3>
                <p className="text-sm text-slate-400">Includes full access to custom nutrition, training protocols, and 1-on-1 strategy calls.</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-white">
                    {session ? formatCurrency(session.amount_total, session.currency) : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax / VAT</span>
                  <span className="text-white">$0.00</span>
                </div>
                <Separator className="bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-outfit font-bold text-lg text-white">Total Paid</span>
                  <span className="font-outfit font-extrabold text-3xl text-orange-500">
                    {session ? formatCurrency(session.amount_total, session.currency) : "$0.00"}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Action Group */}
          <div className="flex flex-col gap-4">
            <Button size="lg" className="h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-lg font-bold font-outfit group transition-all" asChild>
              <Link to="/user">
                Go to My Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" className="h-14 text-slate-400 hover:text-white transition-colors gap-2">
              <Download className="w-4 h-4" /> Download PDF Receipt
            </Button>
          </div>

          <div className="mt-12 text-center text-xs text-slate-500 uppercase tracking-widest space-y-2">
            <p>A copy of this receipt has been sent to {session?.customer_details.email || "your email"}</p>
            <p>Securely processed via Stripe Legal & Financials</p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Success;
